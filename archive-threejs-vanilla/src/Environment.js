import * as THREE from 'three';

export class Environment {
    constructor(scene) {
        this.scene = scene;
    }

    create() {
        this.createGround();
        this.createFlowers();
        // Note: Les arbres sont conservés pour l'environnement
        this.createTrees();
    }

    createGround() {
        // Belle pelouse verte
        const groundGeometry = new THREE.CircleGeometry(50, 64);
        const groundMaterial = new THREE.MeshStandardMaterial({
            color: 0x5cb85c, // Vert pelouse
            roughness: 0.85,
            metalness: 0.0
        });

        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);

        // Zone centrale autour de l'arbre (herbe plus claire)
        const centerGeometry = new THREE.CircleGeometry(8, 32);
        const centerMaterial = new THREE.MeshStandardMaterial({
            color: 0x7ec87e, // Vert plus clair
            roughness: 0.9
        });

        const center = new THREE.Mesh(centerGeometry, centerMaterial);
        center.rotation.x = -Math.PI / 2;
        center.position.y = 0.01; // Légèrement au-dessus
        center.receiveShadow = true;
        this.scene.add(center);
    }

    createTrees() {
        const treePositions = [
            // Front trees (sparse)
            { x: -12, z: 8 },
            { x: 12, z: 10 },

            // Side trees
            { x: -15, z: -5 },
            { x: -18, z: 5 },
            { x: 15, z: -8 },
            { x: 20, z: 2 },

            // Back trees (dense forest feeling)
            { x: -10, z: -15 },
            { x: -5, z: -18 },
            { x: 0, z: -20 },
            { x: 5, z: -18 },
            { x: 10, z: -15 },
            { x: -15, z: -12 },
            { x: 15, z: -12 },
        ];

        treePositions.forEach(pos => {
            const tree = this.createTree();
            tree.position.set(pos.x, 0, pos.z);

            // Random rotation
            tree.rotation.y = Math.random() * Math.PI * 2;

            // Random scale variation
            const scale = 0.8 + Math.random() * 0.6;
            tree.scale.set(scale, scale, scale);

            this.scene.add(tree);
        });
    }

    createTree() {
        const tree = new THREE.Group();

        // Trunk
        const trunkGeometry = new THREE.CylinderGeometry(0.3, 0.4, 4, 8);
        const trunkMaterial = new THREE.MeshStandardMaterial({
            color: 0x3d2817,
            roughness: 0.9
        });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.y = 2;
        trunk.castShadow = true;
        trunk.receiveShadow = true;
        tree.add(trunk);

        // Foliage (couleurs jour)
        const foliageMaterial = new THREE.MeshStandardMaterial({
            color: 0x3a8a3a, // Vert plus clair pour le jour
            roughness: 0.8
        });

        // Bottom layer
        const foliage1 = new THREE.Mesh(
            new THREE.ConeGeometry(2.5, 3, 8),
            foliageMaterial
        );
        foliage1.position.y = 4.5;
        foliage1.castShadow = true;
        tree.add(foliage1);

        // Middle layer
        const foliage2 = new THREE.Mesh(
            new THREE.ConeGeometry(2, 2.5, 8),
            foliageMaterial
        );
        foliage2.position.y = 6.5;
        foliage2.castShadow = true;
        tree.add(foliage2);

        // Top layer
        const foliage3 = new THREE.Mesh(
            new THREE.ConeGeometry(1.5, 2, 8),
            foliageMaterial
        );
        foliage3.position.y = 8.2;
        foliage3.castShadow = true;
        tree.add(foliage3);

        return tree;
    }

    createFlowers() {
        // Instancing de fleurs autour de l'arbre (optimisé)
        const flowerGeometry = new THREE.ConeGeometry(0.12, 0.35, 6);
        const flowerColors = [
            0xff69b4, // Rose
            0xffd700, // Jaune doré  
            0xff6347, // Rouge-orange
            0xda70d6, // Orchidée
            0xffffff  // Blanc
        ];

        flowerColors.forEach((color, colorIndex) => {
            const flowerMaterial = new THREE.MeshStandardMaterial({
                color: color,
                roughness: 0.6,
                metalness: 0.1
            });

            const instancedFlowers = new THREE.InstancedMesh(
                flowerGeometry,
                flowerMaterial,
                30 // 30 fleurs par couleur
            );

            const dummy = new THREE.Object3D();
            for (let i = 0; i < 30; i++) {
                // Positions aléatoires autour de l'arbre
                const angle = Math.random() * Math.PI * 2;
                const radius = 5 + Math.random() * 15; // Entre 5 et 20m

                dummy.position.set(
                    Math.cos(angle) * radius,
                    0.18, // Au-dessus du sol
                    Math.sin(angle) * radius
                );

                // Variation de taille et rotation
                const scale = 0.8 + Math.random() * 0.4;
                dummy.scale.set(scale, scale, scale);
                dummy.rotation.y = Math.random() * Math.PI * 2;

                dummy.updateMatrix();
                instancedFlowers.setMatrixAt(i, dummy.matrix);
            }

            instancedFlowers.castShadow = true;
            this.scene.add(instancedFlowers);
        });

        // Tiges vertes (une seule geometry instanciée)
        const stemGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.3, 4);
        const stemMaterial = new THREE.MeshStandardMaterial({
            color: 0x2d5a2d,
            roughness: 0.9
        });

        const instancedStems = new THREE.InstancedMesh(
            stemGeometry,
            stemMaterial,
            150 // Total stems (30 * 5 colors)
        );

        const stemDummy = new THREE.Object3D();
        let stemIndex = 0;

        for (let colorIdx = 0; colorIdx < 5; colorIdx++) {
            for (let i = 0; i < 30; i++) {
                const angle = Math.random() * Math.PI * 2;
                const radius = 5 + Math.random() * 15;

                stemDummy.position.set(
                    Math.cos(angle) * radius,
                    0.0,
                    Math.sin(angle) * radius
                );

                stemDummy.updateMatrix();
                instancedStems.setMatrixAt(stemIndex++, stemDummy.matrix);
            }
        }

        this.scene.add(instancedStems);
    }
}
