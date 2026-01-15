import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { OharaTree } from './OharaTree.js';
import { Environment } from './Environment.js';
import { Player } from './Player.js';
import { Controls } from './Controls.js';

export class Scene {
    constructor() {
        this.renderer = null;
        this.scene = null;
        this.camera = null;
        this.controls = null;
        this.oharaTree = null;
        this.environment = null;
        this.players = new Map(); // id -> Player
        this.localPlayer = null;
        this.playerControls = null;
    }

    init() {
        // Renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;

        document.getElementById('app').appendChild(this.renderer.domElement);

        // Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87CEEB); // Bleu ciel
        this.scene.fog = new THREE.Fog(0x87CEEB, 40, 120);

        // Camera
        this.camera = new THREE.PerspectiveCamera(
            60,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 15, 25);
        this.camera.lookAt(0, 0, 0);

        // Camera controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.minDistance = 10;
        this.controls.maxDistance = 50;
        this.controls.maxPolarAngle = Math.PI / 2.2; // Prevent going below ground
        this.controls.target.set(0, 0, 0);

        // Lights
        this.setupLights();

        // Environment (ground, trees, sky)
        this.environment = new Environment(this.scene);
        this.environment.create();

        // Ohara Tree (Arbre du Savoir)
        this.oharaTree = new OharaTree(this.scene);
        this.scene.add(this.oharaTree.getObject());

        // Create local player
        this.createLocalPlayer();
    }

    setupLights() {
        // Ambient light (jour)
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        // Directional light (soleil)
        const sunLight = new THREE.DirectionalLight(0xfff7e6, 1.2);
        sunLight.position.set(50, 100, 50);
        sunLight.castShadow = true;
        sunLight.shadow.camera.left = -40;
        sunLight.shadow.camera.right = 40;
        sunLight.shadow.camera.top = 40;
        sunLight.shadow.camera.bottom = -40;
        sunLight.shadow.mapSize.width = 2048;
        sunLight.shadow.mapSize.height = 2048;
        this.scene.add(sunLight);

        // Hemisphere light (ciel bleu / pelouse verte)
        const hemiLight = new THREE.HemisphereLight(0x87CEEB, 0x5cb85c, 0.7);
        this.scene.add(hemiLight);
    }

    createLocalPlayer() {
        // Random spawn position around Ohara Tree
        const angle = Math.random() * Math.PI * 2;
        const radius = 10 + Math.random() * 5;
        const spawnPos = {
            x: Math.cos(angle) * radius,
            y: 0,
            z: Math.sin(angle) * radius
        };

        this.localPlayer = new Player({
            id: 'local',
            pseudo: 'Moi',
            position: spawnPos,
            color: '#ffffff',
            isLocal: true
        });

        this.scene.add(this.localPlayer.mesh);

        // Player movement controls
        this.playerControls = new Controls(this.localPlayer, this.camera);
    }

    addPlayer(playerData) {
        if (this.players.has(playerData.id)) {
            return; // Already exists
        }

        // Update local player if it's us
        if (playerData.id === 'local' || this.localPlayer.id === 'local') {
            this.localPlayer.id = playerData.id;
            this.localPlayer.pseudo = playerData.pseudo;
            this.localPlayer.setColor(playerData.color);
            this.players.set(playerData.id, this.localPlayer);
            return;
        }

        const player = new Player({
            ...playerData,
            isLocal: false
        });

        this.scene.add(player.mesh);
        this.players.set(playerData.id, player);
    }

    updatePlayerPosition(id, position) {
        const player = this.players.get(id);
        if (player && !player.isLocal) {
            player.setTargetPosition(position);
        }
    }

    removePlayer(id) {
        const player = this.players.get(id);
        if (player && !player.isLocal) {
            this.scene.remove(player.mesh);
            this.players.delete(id);
        }
    }

    getPlayers() {
        return Array.from(this.players.values());
    }

    getLocalPlayer() {
        return this.localPlayer;
    }

    update() {
        const delta = 0.016; // ~60fps

        // Update controls
        this.controls.update();

        // Update player controls
        if (this.playerControls) {
            this.playerControls.update(delta);
        }

        // Update Ohara Tree (animation vent)
        if (this.oharaTree) {
            const time = Date.now() * 0.001;
            this.oharaTree.animate(time);
        }

        // Update all players
        this.players.forEach(player => {
            player.update(delta);
        });

        // Camera follow local player (optional, can be removed)
        if (this.localPlayer) {
            const targetPos = this.localPlayer.mesh.position;
            this.controls.target.lerp(
                new THREE.Vector3(targetPos.x, 0, targetPos.z),
                0.05
            );
        }
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}
