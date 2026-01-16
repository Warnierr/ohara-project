import { Engine, Scene, Vector3, HemisphericLight, MeshBuilder, SceneLoader, StandardMaterial, Color3, ArcRotateCamera, Texture, Mesh, Animation } from "@babylonjs/core";
import "@babylonjs/loaders";
import { WaterMaterial } from "@babylonjs/materials";
import { InputController } from "./components/InputController";

export class GameApp {
    private engine: Engine;
    private scene: Scene;

    constructor(canvas: HTMLCanvasElement) {
        this.engine = new Engine(canvas, true);
        this.scene = this.createScene();

        this.run();
    }

    private createScene(): Scene {
        const scene = new Scene(this.engine);
        scene.useRightHandedSystem = true;

        // Camera
        const camera = new ArcRotateCamera("camera1", -Math.PI / 2, Math.PI / 2.5, 8, new Vector3(0, 0, 0), scene);
        camera.attachControl(this.engine.getRenderingCanvas(), true);
        camera.wheelPrecision = 50;
        camera.lowerRadiusLimit = 2;
        camera.upperRadiusLimit = 100;
        camera.minZ = 0.1;
        camera.maxZ = 2000;

        // ☀️ BRIGHT SUN LIGHTING
        const light = new HemisphericLight("light1", new Vector3(0, 1, 0), scene);
        light.intensity = 1.4;
        light.diffuse = new Color3(1.0, 0.98, 0.92);
        light.groundColor = new Color3(0.5, 0.7, 0.5);

        const sun = new HemisphericLight("sun", new Vector3(1, 3, 2), scene);
        sun.intensity = 0.6;
        sun.diffuse = new Color3(1.0, 0.95, 0.85);

        // 1. GHIBLI SKY
        const skybox = MeshBuilder.CreateBox("skyBox", { size: 1000.0 }, scene);
        const skyMat = new StandardMaterial("skyMat", scene);
        skyMat.backFaceCulling = false;
        skyMat.disableLighting = true;
        skyMat.emissiveColor = new Color3(0.5, 0.75, 1.0);
        skybox.material = skyMat;
        skybox.infiniteDistance = true;

        // ☀️ SUN
        const sunSphere = MeshBuilder.CreateSphere("sunSphere", { diameter: 15 }, scene);
        sunSphere.position = new Vector3(50, 60, 30);
        const sunMat = new StandardMaterial("sunMat", scene);
        sunMat.emissiveColor = new Color3(1.0, 0.95, 0.7);
        sunMat.disableLighting = true;
        sunSphere.material = sunMat;
        sunSphere.parent = skybox;

        // ☁️ CLOUDS
        this.createClouds(scene, skybox);

        // 2. OCEAN
        const waterMesh = MeshBuilder.CreateGround("waterMesh", { width: 600, height: 600, subdivisions: 32 }, scene);
        const water = new WaterMaterial("water", scene);
        water.bumpTexture = new Texture("https://playground.babylonjs.com/textures/waterbump.png", scene);
        water.windForce = -8;
        water.waveHeight = 0.3;
        water.bumpHeight = 0.1;
        water.waveLength = 0.15;
        water.colorBlendFactor = 0.8;
        water.waterColor = new Color3(0.05, 0.3, 0.5);
        water.waterColor2 = new Color3(0.1, 0.5, 0.7);
        water.addToRenderList(skybox);

        waterMesh.material = water;
        waterMesh.position.y = 0;

        // 3. ISLAND BASE (NO GAP!)
        const islandBase = MeshBuilder.CreateCylinder("islandBase", {
            height: 16.5,
            diameterTop: 60,
            diameterBottom: 40,
            tessellation: 32
        }, scene);
        islandBase.position.y = -8.25; // Adjusted so top reaches Y=1.5

        const baseMat = new StandardMaterial("baseMat", scene);
        baseMat.diffuseColor = new Color3(0.35, 0.3, 0.25);
        baseMat.specularColor = new Color3(0, 0, 0);
        islandBase.material = baseMat;
        water.addToRenderList(islandBase);

        // 4. ISLAND SURFACE (RAISED ABOVE WAVES!)
        const ground = MeshBuilder.CreateDisc("ground", { radius: 30, tessellation: 64 }, scene);
        ground.rotation.x = Math.PI / 2;
        ground.position.y = 1.5; // RAISED to emerge from water + waves

        const groundMat = new StandardMaterial("groundMat", scene);
        const grassTex = new Texture("/assets/textures/grass.png", scene);
        grassTex.uScale = 10;
        grassTex.vScale = 10;
        groundMat.diffuseTexture = grassTex;
        groundMat.specularColor = new Color3(0, 0, 0);
        groundMat.backFaceCulling = false;
        ground.material = groundMat;
        ground.receiveShadows = true;
        water.addToRenderList(ground);

        // Load Robin
        SceneLoader.ImportMeshAsync("", "/assets/models/", "robin.glb", scene).then((result) => {
            const robin = result.meshes[0];
            robin.name = "robin_mesh";
            robin.position = new Vector3(8, 1.8, 5); // Adjusted
            robin.scaling = new Vector3(0.6, 0.6, 0.6);
            robin.rotationQuaternion = null;
            robin.rotation.y = Math.PI;

            if (result.animationGroups && result.animationGroups.length > 0) {
                robin.metadata = {
                    animations: result.animationGroups,
                    currentAnim: null
                };

                const walkAnim = result.animationGroups.find(ag =>
                    ag.name.toLowerCase().includes('walk') ||
                    ag.name.toLowerCase().includes('run')
                );
                const idleAnim = result.animationGroups.find(ag =>
                    ag.name.toLowerCase().includes('idle') ||
                    ag.name.toLowerCase().includes('stand')
                );

                if (walkAnim) robin.metadata.walkAnim = walkAnim;
                if (idleAnim) robin.metadata.idleAnim = idleAnim;

                if (idleAnim) {
                    idleAnim.play(true);
                    robin.metadata.currentAnim = idleAnim;
                } else if (result.animationGroups[0]) {
                    result.animationGroups[0].play(true);
                    robin.metadata.currentAnim = result.animationGroups[0];
                }
            }

            camera.setTarget(robin);
            water.addToRenderList(robin);
        }).catch(err => console.error("Robin load error:", err));

        // Load Tree
        SceneLoader.ImportMeshAsync("", "/assets/models/", "tree.glb", scene).then((result) => {
            const tree = result.meshes[0];
            tree.position = new Vector3(0, 6.5, 0); // Adjusted
            tree.scaling = new Vector3(10, 10, 10);
            water.addToRenderList(tree);

            this.createBirds(scene, water);
        });

        this.createBoatPlaceholder(scene, water);

        // 🧑‍🏫 NPCs
        this.createNPC(scene, water, "saul.glb", "Saul", new Vector3(-8, 1.8, -5),
            "Bienvenue à Ohara, le sanctuaire du savoir. N'hésite pas à étudier !");

        this.createNPC(scene, water, "professeur_clover.glb", "Professeur Clover", new Vector3(10, 1.8, -8),
            "Bonjour Robin ! Les livres de la bibliothèque t'attendent.");

        return scene;
    }

    // 🧑‍🏫 NPC SYSTEM
    private createNPC(scene: Scene, water: WaterMaterial, modelFile: string, name: string, position: Vector3, dialogueText: string): void {
        console.log(`🔄 Chargement NPC ${name} depuis ${modelFile}...`);

        SceneLoader.ImportMeshAsync("", "/assets/models/", modelFile, scene).then((result) => {
            const npc = result.meshes[0];
            npc.name = "npc_" + name.toLowerCase().replace(" ", "_");
            npc.position = position;
            npc.scaling = new Vector3(0.6, 0.6, 0.6);
            npc.rotationQuaternion = null;
            npc.rotation.y = Math.PI;

            npc.metadata = {
                npcName: name,
                dialogue: dialogueText,
                interactionRadius: 3.0,
                isInteractable: true
            };

            // Floating indicator
            const indicator = MeshBuilder.CreatePlane("indicator_" + name, { width: 0.8, height: 0.8 }, scene);
            indicator.position.y = 2.5;
            indicator.parent = npc;
            indicator.billboardMode = Mesh.BILLBOARDMODE_ALL;
            indicator.isVisible = false;

            const indicatorMat = new StandardMaterial("indicatorMat_" + name, scene);
            indicatorMat.diffuseColor = new Color3(1, 1, 1);
            indicatorMat.emissiveColor = new Color3(1, 1, 0.3);
            indicatorMat.alpha = 0.9;
            indicatorMat.backFaceCulling = false;
            indicator.material = indicatorMat;

            water.addToRenderList(npc);
            water.addToRenderList(indicator);

            console.log(`✅ NPC ${name} chargé avec succès`);
        }).catch(err => {
            console.error(`❌ Erreur chargement ${modelFile}:`, err);
            console.log(`📦 Création placeholder pour ${name}...`);

            // FALLBACK: Create placeholder cube if GLB fails
            const placeholder = MeshBuilder.CreateBox("npc_" + name.toLowerCase().replace(" ", "_"), {
                width: 1, height: 2, depth: 1
            }, scene);
            placeholder.position = position;

            const placeholderMat = new StandardMaterial("npcPlaceholder_" + name, scene);
            placeholderMat.diffuseColor = name.includes("Saul") ? new Color3(0.2, 0.5, 0.8) : new Color3(0.8, 0.2, 0.5);
            placeholderMat.emissiveColor = new Color3(0.1, 0.1, 0.1);
            placeholder.material = placeholderMat;

            placeholder.metadata = {
                npcName: name,
                dialogue: dialogueText,
                interactionRadius: 3.0,
                isInteractable: true
            };

            // Floating text label
            const label = MeshBuilder.CreatePlane("label_" + name, { width: 2, height: 0.5 }, scene);
            label.position.y = 2.5;
            label.parent = placeholder;
            label.billboardMode = Mesh.BILLBOARDMODE_ALL;

            const labelMat = new StandardMaterial("labelMat_" + name, scene);
            labelMat.diffuseColor = new Color3(1, 1, 1);
            labelMat.emissiveColor = new Color3(1, 1, 0);
            label.material = labelMat;

            // Indicator
            const indicator = MeshBuilder.CreatePlane("indicator_" + name, { width: 0.8, height: 0.8 }, scene);
            indicator.position.y = 3.2;
            indicator.parent = placeholder;
            indicator.billboardMode = Mesh.BILLBOARDMODE_ALL;
            indicator.isVisible = false;

            const indicatorMat = new StandardMaterial("indicatorMat_" + name, scene);
            indicatorMat.emissiveColor = new Color3(1, 1, 0.3);
            indicatorMat.alpha = 0.9;
            indicator.material = indicatorMat;

            water.addToRenderList(placeholder);
            water.addToRenderList(label);
            water.addToRenderList(indicator);

            console.log(`✅ Placeholder ${name} créé`);
        });
    }

    private run(): void {
        const input = new InputController(this.scene);

        let velocityY = 0;
        const gravity = -0.015;
        const jumpForce = 0.4;
        let isGrounded = true;

        const ISLAND_RADIUS = 29;
        const GROUND_LEVEL = 2.5; // For terrain with relief

        this.engine.runRenderLoop(() => {
            this.scene.render();
        });

        this.scene.registerBeforeRender(() => {
            const robin = this.scene.getMeshByName("robin_mesh");
            const camera = this.scene.getCameraByName("camera1") as ArcRotateCamera;

            if (robin && camera) {
                const speed = 0.15;
                let isMoving = false;

                const fwd = camera.getDirection(Vector3.Forward());
                fwd.y = 0;
                fwd.normalize();

                const right = camera.getDirection(Vector3.Right());
                right.y = 0;
                right.normalize();

                const vMove = Vector3.Zero();

                if (input.inputMap["z"] || input.inputMap["w"]) {
                    vMove.subtractInPlace(fwd);
                    isMoving = true;
                }
                if (input.inputMap["s"]) {
                    vMove.addInPlace(fwd);
                    isMoving = true;
                }
                if (input.inputMap["q"] || input.inputMap["a"]) {
                    vMove.subtractInPlace(right);
                    isMoving = true;
                }
                if (input.inputMap["d"]) {
                    vMove.addInPlace(right);
                    isMoving = true;
                }

                if (input.inputMap[" "] && isGrounded) {
                    velocityY = jumpForce;
                    isGrounded = false;
                }

                if (isMoving) {
                    vMove.normalize().scaleInPlace(speed);
                    robin.position.addInPlace(vMove);

                    if (vMove.lengthSquared() > 0.001) {
                        robin.rotation.y = Math.atan2(vMove.x, vMove.z);
                    }

                    if (robin.metadata?.walkAnim && robin.metadata.currentAnim !== robin.metadata.walkAnim) {
                        robin.metadata.walkAnim.play(true);
                        robin.metadata.currentAnim = robin.metadata.walkAnim;
                    }
                } else {
                    if (robin.metadata?.idleAnim && robin.metadata.currentAnim !== robin.metadata.idleAnim) {
                        robin.metadata.idleAnim.play(true);
                        robin.metadata.currentAnim = robin.metadata.idleAnim;
                    }
                }

                // WATER COLLISION
                const distFromCenter = Math.sqrt(robin.position.x * robin.position.x + robin.position.z * robin.position.z);
                if (distFromCenter > ISLAND_RADIUS) {
                    const angle = Math.atan2(robin.position.z, robin.position.x);
                    robin.position.x = ISLAND_RADIUS * Math.cos(angle);
                    robin.position.z = ISLAND_RADIUS * Math.sin(angle);
                }

                // Gravity
                if (!isGrounded) {
                    robin.position.y += velocityY;
                    velocityY += gravity;

                    if (robin.position.y <= GROUND_LEVEL) {
                        robin.position.y = GROUND_LEVEL;
                        velocityY = 0;
                        isGrounded = true;
                    }
                } else if (robin.position.y > GROUND_LEVEL + 0.05) {
                    isGrounded = false;
                }

                // NPC INTERACTION
                this.checkNPCInteraction(robin, input);
            }
        });

        this.scatterModernNature();

        window.addEventListener("resize", () => {
            this.engine.resize();
        });
    }

    // 💬 NPC Interaction
    private checkNPCInteraction(robin: any, input: InputController): void {
        let nearestNPC: any = null;
        let nearestDistance = Infinity;

        this.scene.meshes.forEach(mesh => {
            if (mesh.name.startsWith("npc_") && mesh.metadata?.isInteractable) {
                const distance = Vector3.Distance(robin.position, mesh.position);
                if (distance < mesh.metadata.interactionRadius && distance < nearestDistance) {
                    nearestNPC = mesh;
                    nearestDistance = distance;
                }
            }
        });

        // Hide all indicators
        this.scene.meshes.forEach(mesh => {
            if (mesh.name.startsWith("indicator_")) {
                mesh.isVisible = false;
            }
        });

        if (nearestNPC) {
            const indicator = this.scene.getMeshByName("indicator_" + nearestNPC.metadata.npcName);
            if (indicator) {
                indicator.isVisible = true;
            }

            // Press E to talk
            if (input.inputMap["e"]) {
                this.showDialogue(nearestNPC.metadata.npcName, nearestNPC.metadata.dialogue);
                input.inputMap["e"] = false;
            }
        }
    }

    // 💬 Dialogue UI
    private showDialogue(npcName: string, text: string): void {
        const existingUI = document.getElementById("dialogue-ui");
        if (existingUI) existingUI.remove();

        const dialogueUI = document.createElement("div");
        dialogueUI.id = "dialogue-ui";
        dialogueUI.style.cssText = `
            position: fixed; bottom: 50px; left: 50%; transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.85); color: white; padding: 20px 30px;
            border-radius: 10px; border: 2px solid #FFD700; max-width: 600px;
            font-family: Arial, sans-serif; z-index: 1000;
            box-shadow: 0 4px 20px rgba(0,0,0,0.5);
        `;

        dialogueUI.innerHTML = `
            <div style="font-size: 18px; font-weight: bold; color: #FFD700; margin-bottom: 10px;">
                ${npcName}
            </div>
            <div style="font-size: 16px; line-height: 1.5;">${text}</div>
            <div style="text-align: right; margin-top: 15px; font-size: 14px; color: #AAA;">
                [E] ou [Echap] pour fermer
            </div>
        `;

        document.body.appendChild(dialogueUI);

        const closeHandler = (e: KeyboardEvent) => {
            if (e.key === "e" || e.key === "E" || e.key === "Escape") {
                dialogueUI.remove();
                window.removeEventListener("keydown", closeHandler);
            }
        };
        window.addEventListener("keydown", closeHandler);

        setTimeout(() => {
            if (document.getElementById("dialogue-ui")) {
                dialogueUI.remove();
                window.removeEventListener("keydown", closeHandler);
            }
        }, 10000);
    }

    private createClouds(scene: Scene, skybox: Mesh): void {
        const cloudCount = 8;

        for (let i = 0; i < cloudCount; i++) {
            const cloud = new Mesh("cloud_" + i, scene);

            const sphereCount = 4 + Math.floor(Math.random() * 3);
            for (let j = 0; j < sphereCount; j++) {
                const sphere = MeshBuilder.CreateSphere("cloudPart", {
                    diameter: 8 + Math.random() * 6, segments: 12
                }, scene);

                sphere.position.x = (Math.random() - 0.5) * 15;
                sphere.position.y = (Math.random() - 0.5) * 5;
                sphere.position.z = (Math.random() - 0.5) * 10;

                const cloudMat = new StandardMaterial("cloudMat", scene);
                cloudMat.emissiveColor = new Color3(0.95, 0.95, 1.0);
                cloudMat.diffuseColor = new Color3(1, 1, 1);
                cloudMat.alpha = 0.9;
                cloudMat.disableLighting = true;
                sphere.material = cloudMat;
                sphere.parent = cloud;
            }

            const angle = (Math.PI * 2 * i) / cloudCount;
            cloud.position.x = Math.cos(angle) * (100 + Math.random() * 200);
            cloud.position.y = 40 + Math.random() * 30;
            cloud.position.z = Math.sin(angle) * (100 + Math.random() * 200);

            cloud.metadata = {
                driftSpeed: 0.02 + Math.random() * 0.03,
                driftOffset: Math.random() * 100
            };

            cloud.parent = skybox;
        }

        scene.registerBeforeRender(() => {
            scene.meshes.forEach(mesh => {
                if (mesh.name.startsWith("cloud_") && mesh.metadata) {
                    mesh.position.x += Math.sin(Date.now() * 0.0001 + mesh.metadata.driftOffset) * mesh.metadata.driftSpeed;
                }
            });
        });
    }

    private createBirds(scene: Scene, water: WaterMaterial): void {
        const birdCount = 5;

        for (let i = 0; i < birdCount; i++) {
            const bird = new Mesh("bird_" + i, scene);

            const body = MeshBuilder.CreateSphere("body", {
                diameterX: 0.3, diameterY: 0.2, diameterZ: 0.4, segments: 8
            }, scene);
            body.parent = bird;

            const leftWing = MeshBuilder.CreatePlane("leftWing", { width: 0.5, height: 0.3 }, scene);
            leftWing.rotation.y = Math.PI / 4;
            leftWing.rotation.z = Math.PI / 6;
            leftWing.parent = bird;
            leftWing.position.x = -0.15;

            const rightWing = MeshBuilder.CreatePlane("rightWing", { width: 0.5, height: 0.3 }, scene);
            rightWing.rotation.y = -Math.PI / 4;
            rightWing.rotation.z = -Math.PI / 6;
            rightWing.parent = bird;
            rightWing.position.x = 0.15;

            const tail = MeshBuilder.CreatePlane("tail", { width: 0.15, height: 0.25 }, scene);
            tail.rotation.x = Math.PI / 2;
            tail.parent = bird;
            tail.position.z = -0.2;

            const birdMat = new StandardMaterial("birdMat", scene);
            birdMat.diffuseColor = new Color3(0.3, 0.3, 0.3);
            birdMat.specularColor = new Color3(0, 0, 0);
            birdMat.backFaceCulling = false;
            body.material = birdMat;
            leftWing.material = birdMat;
            rightWing.material = birdMat;
            tail.material = birdMat;

            const radius = 8 + Math.random() * 5;
            const height = 12 + Math.random() * 6;
            const speed = 0.4 + Math.random() * 0.3;
            const angleOffset = (Math.PI * 2 * i) / birdCount;

            bird.metadata = { radius, height, speed, angleOffset, time: 0 };

            water.addToRenderList(body);
            water.addToRenderList(leftWing);
            water.addToRenderList(rightWing);
            water.addToRenderList(tail);

            const flapAnim = new Animation("wingFlap", "rotation.z", 30,
                Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);
            const keys = [
                { frame: 0, value: Math.PI / 6 },
                { frame: 15, value: -Math.PI / 3 },
                { frame: 30, value: Math.PI / 6 }
            ];
            flapAnim.setKeys(keys);
            leftWing.animations = [flapAnim];
            scene.beginAnimation(leftWing, 0, 30, true);

            const rightFlapAnim = flapAnim.clone();
            rightFlapAnim.setKeys(keys.map(k => ({ ...k, value: -k.value })));
            rightWing.animations = [rightFlapAnim];
            scene.beginAnimation(rightWing, 0, 30, true);
        }

        scene.registerBeforeRender(() => {
            scene.meshes.forEach(mesh => {
                if (mesh.name.startsWith("bird_") && mesh.metadata) {
                    mesh.metadata.time += mesh.metadata.speed * 0.01;
                    const angle = mesh.metadata.time + mesh.metadata.angleOffset;

                    mesh.position.x = Math.cos(angle) * mesh.metadata.radius;
                    mesh.position.z = Math.sin(angle) * mesh.metadata.radius;
                    mesh.position.y = mesh.metadata.height + Math.sin(mesh.metadata.time * 2) * 0.8;
                    mesh.rotation.y = angle + Math.PI / 2;
                }
            });
        });
    }

    private createBoatPlaceholder(scene: Scene, water: WaterMaterial): void {
        const boat = MeshBuilder.CreateBox("boat", { width: 2, height: 0.5, depth: 4 }, scene);
        boat.position = new Vector3(25, 0.3, 15);
        boat.rotation.y = Math.PI / 4;

        const boatMat = new StandardMaterial("boatMat", scene);
        boatMat.diffuseColor = new Color3(0.5, 0.35, 0.2);
        boatMat.specularColor = new Color3(0.1, 0.1, 0.1);
        boat.material = boatMat;

        const startY = boat.position.y;
        scene.registerBeforeRender(() => {
            boat.position.y = startY + Math.sin(Date.now() * 0.001) * 0.15;
        });

        water.addToRenderList(boat);
    }

    private scatterModernNature(): void {
        const islandRadius = 28;
        const water = this.scene.getMaterialByName("water") as WaterMaterial;

        const rockMaster = this.createModernRock();
        rockMaster.isVisible = false;

        for (let i = 0; i < 10; i++) {
            const rock = rockMaster.createInstance("rock_" + i);
            const angle = Math.random() * Math.PI * 2;
            const r = Math.random() * islandRadius;
            rock.position.x = Math.cos(angle) * r;
            rock.position.z = Math.sin(angle) * r;
            rock.position.y = 1.8; // Adjusted

            rock.rotation.y = Math.random() * Math.PI;
            const scale = 0.8 + Math.random() * 0.8;
            rock.scaling = new Vector3(scale, scale * 0.8, scale);

            if (Vector3.Distance(rock.position, Vector3.Zero()) < 6) {
                rock.setEnabled(false);
            } else if (water) {
                water.addToRenderList(rock);
            }
        }

        for (let i = 0; i < 15; i++) {
            const bush = this.createModernBush();
            const angle = Math.random() * Math.PI * 2;
            const r = Math.random() * islandRadius;
            bush.position.x = Math.cos(angle) * r;
            bush.position.z = Math.sin(angle) * r;
            bush.position.y = 1.5; // Adjusted

            if (Vector3.Distance(bush.position, Vector3.Zero()) < 5) {
                bush.setEnabled(false);
            } else if (water) {
                water.addToRenderList(bush);
            }
        }

        const flowerColors = [
            new Color3(0.95, 0.4, 0.5),
            new Color3(0.95, 0.85, 0.3),
            new Color3(0.7, 0.5, 0.95),
            new Color3(0.4, 0.7, 0.95),
        ];

        for (let i = 0; i < 20; i++) {
            const flower = this.createFlower(flowerColors[Math.floor(Math.random() * flowerColors.length)]);
            const angle = Math.random() * Math.PI * 2;
            const r = Math.random() * islandRadius;
            flower.position.x = Math.cos(angle) * r;
            flower.position.z = Math.sin(angle) * r;
            flower.position.y = 1.5; // Adjusted

            if (Vector3.Distance(flower.position, Vector3.Zero()) < 4) {
                flower.setEnabled(false);
            } else if (water) {
                water.addToRenderList(flower);
            }
        }

        for (let i = 0; i < 12; i++) {
            const grass = this.createGrassPatch();
            const angle = Math.random() * Math.PI * 2;
            const r = Math.random() * islandRadius;
            grass.position.x = Math.cos(angle) * r;
            grass.position.z = Math.sin(angle) * r;
            grass.position.y = 1.5; // Adjusted

            const windOffset = Math.random() * 100;
            grass.metadata = { windOffset };

            this.scene.registerBeforeRender(() => {
                if (grass.metadata) {
                    const time = (Date.now() * 0.001 + grass.metadata.windOffset);
                    grass.rotation.x = Math.sin(time) * 0.12;
                    grass.rotation.z = Math.cos(time * 0.7) * 0.12;
                }
            });

            if (Vector3.Distance(grass.position, Vector3.Zero()) < 5) {
                grass.setEnabled(false);
            } else if (water) {
                water.addToRenderList(grass);
            }
        }
    }

    private createModernRock(): Mesh {
        const rock = MeshBuilder.CreateIcoSphere("rockMaster", {
            radius: 1.0, subdivisions: 2, flat: true
        }, this.scene);

        const positions = rock.getVerticesData("position");
        if (positions) {
            for (let i = 0; i < positions.length; i += 3) {
                const scale = 0.75 + Math.random() * 0.5;
                positions[i] *= scale;
                positions[i + 1] *= scale * 0.6;
                positions[i + 2] *= scale;
            }
            rock.setVerticesData("position", positions);
            rock.createNormals(false);
        }

        const rockMat = new StandardMaterial("rockMat", this.scene);
        rockMat.diffuseColor = new Color3(0.45, 0.45, 0.5);
        rockMat.specularColor = new Color3(0.1, 0.1, 0.1);
        rock.material = rockMat;

        return rock;
    }

    private createModernBush(): Mesh {
        const cluster = new Mesh("bushCluster", this.scene);

        const bushMat = new StandardMaterial("bushMat", this.scene);
        bushMat.diffuseColor = new Color3(0.2, 0.55, 0.25);
        bushMat.specularColor = new Color3(0, 0, 0);

        const sphereCount = 6 + Math.floor(Math.random() * 4);
        for (let i = 0; i < sphereCount; i++) {
            const sphere = MeshBuilder.CreateSphere("bushPart", {
                diameter: 0.45 + Math.random() * 0.35, segments: 12
            }, this.scene);

            sphere.position.x = (Math.random() - 0.5) * 0.7;
            sphere.position.y = 0.25 + Math.random() * 0.35;
            sphere.position.z = (Math.random() - 0.5) * 0.7;
            sphere.material = bushMat;
            sphere.parent = cluster;
        }

        return cluster;
    }

    private createFlower(color: Color3): Mesh {
        const flower = new Mesh("flower", this.scene);

        const stem = MeshBuilder.CreateCylinder("stem", { height: 0.5, diameter: 0.06 }, this.scene);
        stem.position.y = 0.25;
        const stemMat = new StandardMaterial("stemMat", this.scene);
        stemMat.diffuseColor = new Color3(0.25, 0.45, 0.15);
        stem.material = stemMat;
        stem.parent = flower;

        const petals = MeshBuilder.CreateSphere("petals", { diameter: 0.25, segments: 12 }, this.scene);
        petals.position.y = 0.55;
        const petalMat = new StandardMaterial("petalMat", this.scene);
        petalMat.diffuseColor = color;
        petalMat.specularColor = new Color3(0.15, 0.15, 0.15);
        petals.material = petalMat;
        petals.parent = flower;

        return flower;
    }

    private createGrassPatch(): Mesh {
        const patch = new Mesh("grassPatch", this.scene);

        const grassMat = new StandardMaterial("tallGrassMat", this.scene);
        grassMat.diffuseColor = new Color3(0.35, 0.65, 0.25);
        grassMat.specularColor = new Color3(0, 0, 0);
        grassMat.backFaceCulling = false;

        for (let i = 0; i < 4; i++) {
            const blade = MeshBuilder.CreatePlane("grassBlade", { width: 0.35, height: 0.7 }, this.scene);

            blade.rotation.y = (Math.PI / 4) * i;
            blade.position.y = 0.35;
            blade.material = grassMat;
            blade.parent = patch;
        }

        return patch;
    }
}
