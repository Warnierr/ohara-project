import * as THREE from 'three';
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';

export class Player {
    constructor({ id, pseudo, position, color, isLocal = false }) {
        this.id = id;
        this.pseudo = pseudo;
        this.color = color;
        this.isLocal = isLocal;
        this.mesh = null;
        this.label = null;
        this.targetPosition = new THREE.Vector3(position.x, position.y, position.z);
        this.velocity = new THREE.Vector3();

        this.createMesh();
        this.createLabel();
    }

    createMesh() {
        this.mesh = new THREE.Group();

        // Body (capsule-like)
        const bodyGeometry = new THREE.CapsuleGeometry(0.4, 1.2, 8, 16);
        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: this.color,
            roughness: 0.7,
            metalness: 0.2
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 1;
        body.castShadow = true;
        this.mesh.add(body);

        // Head
        const headGeometry = new THREE.SphereGeometry(0.35, 16, 16);
        const headMaterial = new THREE.MeshStandardMaterial({
            color: 0xffdbac,
            roughness: 0.8
        });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 2;
        head.castShadow = true;
        this.mesh.add(head);

        // Store body reference for animations
        this.mesh.userData.body = body;
        this.mesh.userData.head = head;

        // Initial position
        this.mesh.position.copy(this.targetPosition);
    }

    createLabel() {
        const div = document.createElement('div');
        div.className = 'player-label';
        div.textContent = this.pseudo;
        div.style.color = this.color;
        div.style.fontSize = '14px';
        div.style.fontWeight = 'bold';
        div.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        div.style.padding = '4px 8px';
        div.style.borderRadius = '4px';
        div.style.textAlign = 'center';
        div.style.pointerEvents = 'none';
        div.style.userSelect = 'none';
        div.style.textShadow = '0 0 5px rgba(0,0,0,0.8)';

        // Note: In a full implementation, you'd use CSS2DRenderer
        // For now, we'll skip the label rendering to keep it simple
        // You can add CSS2DRenderer later for proper 3D labels
    }

    setColor(color) {
        this.color = color;
        const body = this.mesh.userData.body;
        if (body) {
            body.material.color.set(color);
        }
    }

    setTargetPosition(position) {
        this.targetPosition.set(position.x, position.y, position.z);
    }

    get position() {
        return this.mesh.position;
    }

    update(delta) {
        if (!this.isLocal) {
            // Smooth interpolation to target position
            this.mesh.position.lerp(this.targetPosition, 0.2);
        }

        // Simple bob animation when moving
        const isMoving = this.velocity.length() > 0.01;
        if (isMoving && this.mesh.userData.body) {
            const time = Date.now() * 0.01;
            this.mesh.userData.body.position.y = 1 + Math.sin(time) * 0.05;
            this.mesh.userData.head.position.y = 2 + Math.sin(time) * 0.05;
        }
    }
}
