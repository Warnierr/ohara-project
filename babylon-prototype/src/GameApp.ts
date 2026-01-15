import { Engine, Scene, Vector3, HemisphericLight, MeshBuilder, SceneLoader, StandardMaterial, Color3, ArcRotateCamera, CubeTexture, Texture } from "@babylonjs/core";
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

        // Camera - ArcRotate to easily look around the character
        const camera = new ArcRotateCamera("camera1", -Math.PI / 2, Math.PI / 2.5, 20, new Vector3(0, 0, 0), scene);
        camera.attachControl(this.engine.getRenderingCanvas(), true);
        camera.wheelPrecision = 50;

        // Light
        const light = new HemisphericLight("light1", new Vector3(0, 1, 0), scene);
        light.intensity = 0.8;

        // 1. SKYBOX (Essential for water reflection)
        const skybox = MeshBuilder.CreateBox("skyBox", { size: 1000.0 }, scene);
        const skyboxMaterial = new StandardMaterial("skyBox", scene);
        skyboxMaterial.backFaceCulling = false;
        // Using Babylon Playground textures for prototype
        skyboxMaterial.reflectionTexture = new CubeTexture("https://playground.babylonjs.com/textures/skybox", scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new Color3(0, 0, 0);
        skyboxMaterial.specularColor = new Color3(0, 0, 0);
        skybox.material = skyboxMaterial;

        // 2. OCEAN (Water Material)
        const waterMesh = MeshBuilder.CreateGround("waterMesh", { width: 512, height: 512, subdivisions: 32 }, scene);
        const water = new WaterMaterial("water", scene, new Vector3(0, -1, 0));
        water.bumpTexture = new Texture("https://playground.babylonjs.com/textures/waterbump.png", scene);
        water.windForce = -5;
        water.waveHeight = 0.2;
        water.bumpHeight = 0.1;
        water.waveLength = 0.1;
        water.colorBlendFactor = 0; // Pure reflection
        water.addToRenderList(skybox); // Reflect sky

        waterMesh.material = water;
        waterMesh.position.y = -0.5; // Water slightly below island

        // 3. ISLAND (The Ground)
        // Creating a Disc instead of a square for a better "Island" feel
        const ground = MeshBuilder.CreateDisc("ground", { radius: 30, tessellation: 64 }, scene);
        ground.rotation.x = Math.PI / 2; // Flat
        const groundMat = new StandardMaterial("groundMat", scene);
        groundMat.diffuseColor = new Color3(0.3, 0.7, 0.3);
        ground.material = groundMat;
        ground.receiveShadows = true;

        // Add ground to water reflection
        water.addToRenderList(ground);

        // Load Robin
        SceneLoader.ImportMeshAsync("", "/assets/models/", "robin.glb", scene).then((result) => {
            const robin = result.meshes[0];
            robin.name = "robin_mesh";
            robin.position.y = 0.2; // RAISED slightly
            robin.scaling = new Vector3(0.6, 0.6, 0.6);
            robin.rotationQuaternion = null;
            robin.rotation.y = Math.PI;

            camera.setTarget(robin);
            water.addToRenderList(robin); // Reflect Robin
        }).catch(err => console.error("Robin load error:", err));

        // Load Tree (Import code from Best Practices: use asynchronous, scalable import)
        SceneLoader.ImportMeshAsync("", "/assets/models/", "tree.glb", scene).then((result) => {
            const tree = result.meshes[0];
            // RAISED MORE (Y=5) as requested
            tree.position = new Vector3(0, 5, 0);
            tree.scaling = new Vector3(10, 10, 10);
            water.addToRenderList(tree); // Reflect Tree
        });

        return scene;
    }

    private run(): void {
        const input = new InputController(this.scene);

        this.engine.runRenderLoop(() => {
            this.scene.render();
        });

        // Player movement logic
        this.scene.registerBeforeRender(() => {
            const robin = this.scene.getMeshByName("robin_mesh");
            if (robin) {
                const speed = 0.15;
                const vMove = new Vector3(0, 0, 0);
                let isMoving = false;

                if (input.inputMap["w"] || input.inputMap["z"]) {
                    vMove.z = speed;
                    robin.rotation.y = Math.PI;
                    isMoving = true;
                }
                if (input.inputMap["s"]) {
                    vMove.z = -speed;
                    robin.rotation.y = 0;
                    isMoving = true;
                }
                if (input.inputMap["a"] || input.inputMap["q"]) {
                    vMove.x = -speed;
                    robin.rotation.y = Math.PI / 2;
                    isMoving = true;
                }
                if (input.inputMap["d"]) {
                    vMove.x = speed;
                    robin.rotation.y = -Math.PI / 2;
                    isMoving = true;
                }

                if (isMoving) {
                    robin.position.addInPlace(vMove);
                }
            }
        });

        window.addEventListener("resize", () => {
            this.engine.resize();
        });
    }
}
