class DefeatOverlay extends Phaser.Scene {
    constructor() {
        super({ key: "DefeatOverlay" });
    }

    init(data) {
        this.currentLevel = data.currentLevel || "IntroPawn";  // default fallback
    }

    preload() {
        this.load.setPath("./assets/");
        this.load.bitmapFont("rocketSquare", "KennyRocketSquare_0.png", "KennyRocketSquare.fnt");
    }

    create() {
        this.add.rectangle(400, 300, 800, 600, 0x000000, 0.5);

        this.add.bitmapText(260, 200, "rocketSquare", "DEFEAT", 48);
        this.add.bitmapText(150, 300, "rocketSquare", "Press Q to Replay or E to Restart from Beginning", 24);

        this.qKey = this.input.keyboard.addKey('Q');
        this.eKey = this.input.keyboard.addKey('E');
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.qKey)) {
            this.scene.stop("DefeatOverlay");
            this.scene.start(this.currentLevel);  // Replay current level
        }

        if (Phaser.Input.Keyboard.JustDown(this.eKey)) {
            let currentIndex = levelScenes.indexOf(this.currentLevel);
            let nextLevel = levelScenes[currentIndex + 1];

            this.scene.stop("DefeatOverlay");
            this.scene.start(levelScenes[0]);
        }
    }
}