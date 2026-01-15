import * as THREE from 'three';

export class Controls {
    constructor(player, camera) {
        this.player = player;
        this.camera = camera;
        this.keys = {
            forward: false,
            backward: false,
            left: false,
            right: false
        };
        this.moveSpeed = 5;

        this.setupEventListeners();
    }

    setupEventListeners() {
        window.addEventListener('keydown', (e) => this.onKeyDown(e));
        window.addEventListener('keyup', (e) => this.onKeyUp(e));
    }

    onKeyDown(event) {
        switch (event.code) {
            case 'KeyW':
            case 'KeyZ': // AZERTY
            case 'ArrowUp':
                this.keys.forward = true;
                break;
            case 'KeyS':
            case 'ArrowDown':
                this.keys.backward = true;
                break;
            case 'KeyA':
            case 'KeyQ': // AZERTY
            case 'ArrowLeft':
                this.keys.left = true;
                break;
            case 'KeyD':
            case 'ArrowRight':
                this.keys.right = true;
                break;
        }
    }

    onKeyUp(event) {
        switch (event.code) {
            case 'KeyW':
            case 'KeyZ':
            case 'ArrowUp':
                this.keys.forward = false;
                break;
            case 'KeyS':
            case 'ArrowDown':
                this.keys.backward = false;
                break;
            case 'KeyA':
            case 'KeyQ':
            case 'ArrowLeft':
                this.keys.left = false;
                break;
            case 'KeyD':
            case 'ArrowRight':
                this.keys.right = false;
                break;
        }
    }

    update(delta) {
        const velocity = new THREE.Vector3();

        // Get camera direction (ignore Y component for ground movement)
        const cameraDirection = new THREE.Vector3();
        this.camera.getWorldDirection(cameraDirection);
        cameraDirection.y = 0;
        cameraDirection.normalize();

        // Right vector
        const cameraRight = new THREE.Vector3();
        cameraRight.crossVectors(cameraDirection, new THREE.Vector3(0, 1, 0));

        // Calculate movement based on camera orientation
        if (this.keys.forward) {
            velocity.add(cameraDirection);
        }
        if (this.keys.backward) {
            velocity.sub(cameraDirection);
        }
        if (this.keys.left) {
            velocity.sub(cameraRight);
        }
        if (this.keys.right) {
            velocity.add(cameraRight);
        }

        // Normalize to prevent faster diagonal movement
        if (velocity.length() > 0) {
            velocity.normalize();
            velocity.multiplyScalar(this.moveSpeed * delta);

            // Update player position
            this.player.mesh.position.add(velocity);
            this.player.targetPosition.copy(this.player.mesh.position);
            this.player.velocity.copy(velocity);

            // Rotate player to face movement direction
            const angle = Math.atan2(velocity.x, velocity.z);
            this.player.mesh.rotation.y = angle;
        } else {
            this.player.velocity.set(0, 0, 0);
        }

        // Keep player on ground
        this.player.mesh.position.y = 0;
    }
}
