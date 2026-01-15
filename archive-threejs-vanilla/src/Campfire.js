import * as THREE from 'three';

export class Campfire {
    constructor(scene) {
        this.scene = scene;
        this.group = new THREE.Group();
        this.flames = null;
        this.light = null;
        this.time = 0;
    }

    create() {
        // Logs (bûches disposées en cercle)
        this.createLogs();

        // Stones around fire
        this.createStones();

        // Fire particles
        this.createFlames();

        // Fire light
        this.createLight();

        this.scene.add(this.group);
    }

    createLogs() {
        const logGeometry = new THREE.CylinderGeometry(0.15, 0.18, 2, 8);
        const logMaterial = new THREE.MeshStandardMaterial({
            color: 0x4a3020,
            roughness: 0.9,
            metalness: 0.1
        });

        // 4 logs arranged in a cross pattern
        const positions = [
            { x: 0, z: 0.5, rotation: 0 },
            { x: 0, z: -0.5, rotation: 0 },
            { x: 0.5, z: 0, rotation: Math.PI / 2 },
            { x: -0.5, z: 0, rotation: Math.PI / 2 }
        ];

        positions.forEach(pos => {
            const log = new THREE.Mesh(logGeometry, logMaterial);
            log.position.set(pos.x, 0.1, pos.z);
            log.rotation.z = Math.PI / 2;
            log.rotation.y = pos.rotation;
            log.castShadow = true;
            log.receiveShadow = true;
            this.group.add(log);
        });
    }

    createStones() {
        const stoneGeometry = new THREE.DodecahedronGeometry(0.3, 0);
        const stoneMaterial = new THREE.MeshStandardMaterial({
            color: 0x4a4a4a,
            roughness: 0.95,
            metalness: 0.05
        });

        // Stones in a circle
        const numStones = 12;
        const radius = 1.2;

        for (let i = 0; i < numStones; i++) {
            const angle = (i / numStones) * Math.PI * 2;
            const stone = new THREE.Mesh(stoneGeometry, stoneMaterial.clone());

            stone.position.set(
                Math.cos(angle) * radius,
                0.1,
                Math.sin(angle) * radius
            );

            // Random rotation for variety
            stone.rotation.x = Math.random() * Math.PI;
            stone.rotation.y = Math.random() * Math.PI;
            stone.rotation.z = Math.random() * Math.PI;

            // Random scale
            const scale = 0.7 + Math.random() * 0.6;
            stone.scale.set(scale, scale * 0.7, scale);

            stone.castShadow = true;
            stone.receiveShadow = true;
            this.group.add(stone);
        }
    }

    createFlames() {
        const particleCount = 100;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);
        const velocities = new Float32Array(particleCount);

        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;

            // Spawn position (base of fire)
            const radius = Math.random() * 0.5;
            const angle = Math.random() * Math.PI * 2;

            positions[i3] = Math.cos(angle) * radius;
            positions[i3 + 1] = Math.random() * 0.5; // Start low
            positions[i3 + 2] = Math.sin(angle) * radius;

            // Fire gradient colors (red -> orange -> yellow)
            const t = Math.random();
            if (t < 0.3) {
                // Red
                colors[i3] = 1.0;
                colors[i3 + 1] = 0.2;
                colors[i3 + 2] = 0.0;
            } else if (t < 0.7) {
                // Orange
                colors[i3] = 1.0;
                colors[i3 + 1] = 0.6;
                colors[i3 + 2] = 0.0;
            } else {
                // Yellow
                colors[i3] = 1.0;
                colors[i3 + 1] = 1.0;
                colors[i3 + 2] = 0.3;
            }

            sizes[i] = Math.random() * 0.5 + 0.3;
            velocities[i] = Math.random() * 0.5 + 1.0; // Upward speed
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const material = new THREE.PointsMaterial({
            size: 0.4,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            sizeAttenuation: true
        });

        this.flames = new THREE.Points(geometry, material);
        this.flames.userData.velocities = velocities; // Store for animation
        this.group.add(this.flames);
    }

    createLight() {
        // Point light at fire center (flickering)
        this.light = new THREE.PointLight(0xff6b35, 3, 20);
        this.light.position.set(0, 1, 0);
        this.light.castShadow = true;
        this.light.shadow.mapSize.width = 512;
        this.light.shadow.mapSize.height = 512;
        this.group.add(this.light);
    }

    update() {
        this.time += 0.016; // ~60fps

        // Animate flame particles
        if (this.flames) {
            const positions = this.flames.geometry.attributes.position.array;
            const velocities = this.flames.userData.velocities;

            for (let i = 0; i < positions.length / 3; i++) {
                const i3 = i * 3;

                // Move particle upward
                positions[i3 + 1] += velocities[i] * 0.02;

                // Sway effect (sin wave)
                const sway = Math.sin(this.time * 2 + i) * 0.01;
                positions[i3] += sway;
                positions[i3 + 2] += Math.cos(this.time * 2 + i) * 0.01;

                // Reset particle when it goes too high
                if (positions[i3 + 1] > 3) {
                    const radius = Math.random() * 0.5;
                    const angle = Math.random() * Math.PI * 2;
                    positions[i3] = Math.cos(angle) * radius;
                    positions[i3 + 1] = 0;
                    positions[i3 + 2] = Math.sin(angle) * radius;
                }
            }

            this.flames.geometry.attributes.position.needsUpdate = true;
        }

        // Flicker light
        if (this.light) {
            const flicker = Math.sin(this.time * 10) * 0.1 + Math.random() * 0.2;
            this.light.intensity = 3 + flicker;

            // Slight position wobble
            this.light.position.y = 1 + Math.sin(this.time * 5) * 0.1;
        }
    }
}
