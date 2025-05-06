class VictoryOverlay extends Phaser.Scene {
    constructor() {
        super({ key: "VictoryOverlay" });
    }

    init(data) {
        console.log("Received Data in VictoryOverlay:", data);
        this.currentLevel = data.currentLevel;
        this.nextLevel = data.nextLevel;

        console.log("Current Level:", this.currentLevel);
        console.log("Next Level:", this.nextLevel);
    }

    preload() {
        this.load.setPath("./assets/");
        this.load.bitmapFont("rocketSquare", "KennyRocketSquare_0.png", "KennyRocketSquare.fnt");
    }

    create() {
        this.add.rectangle(400, 300, 800, 600, 0x000000, 0.5);
        this.add.bitmapText(260, 200, "rocketSquare", "VICTORY", 48);
        this.add.bitmapText(150, 300, "rocketSquare", "Press Q to Replay or E to Continue", 24);

        this.qKey = this.input.keyboard.addKey('Q');
        this.eKey = this.input.keyboard.addKey('E');
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.qKey)) {
            // Restart current level
            console.log("Restarting Level:", this.currentLevel);
            this.scene.stop(this.currentLevel);
            this.scene.start(this.currentLevel);
        }

        if (Phaser.Input.Keyboard.JustDown(this.eKey)) {
            // Transition to the next level
            console.log("Transitioning to Next Level:", this.nextLevel);

            this.scene.stop(this.currentLevel);  // Ensure current level is stopped
            this.scene.stop("VictoryOverlay");   // Ensure VictoryOverlay is stopped

            this.scene.start(this.nextLevel);    // Transition to the next level
        }
    }
}
