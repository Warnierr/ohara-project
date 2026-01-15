import { Scene, ActionManager, ExecuteCodeAction } from "@babylonjs/core";

export class InputController {
    public inputMap: any;
    private scene: Scene;

    constructor(scene: Scene) {
        this.scene = scene;
        this.inputMap = {};

        // Initialize action manager
        this.scene.actionManager = new ActionManager(this.scene);

        // Key Down
        this.scene.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnKeyDownTrigger, (evt) => {
            if (evt.sourceEvent.key) {
                this.inputMap[evt.sourceEvent.key.toLowerCase()] = true;
            }
        }));

        // Key Up
        this.scene.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnKeyUpTrigger, (evt) => {
            if (evt.sourceEvent.key) {
                this.inputMap[evt.sourceEvent.key.toLowerCase()] = false;
            }
        }));
    }
}
