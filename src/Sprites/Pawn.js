class Pawn extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'pawn');
        this.scene = scene;

        this.setScale(0.25);
        this.setOrigin(0.5, 0.5);

        scene.add.existing(this);
        scene.physics.world.enable(this);

        this.scorePoints = 25;
        this.hit = false;
        this.isDead = false;

        // Step-style movement
        this.stepSize = 10;
        this.stepInterval = 200;  // ms
        this.lastStepTime = 0;
    }

    update(time) {
        if (this.isDead) return;

        if (time > this.lastStepTime + this.stepInterval) {
            this.y += this.stepSize;
            this.lastStepTime = time;

            // Reset to top if alive and passes bottom
            if (this.y > this.scene.game.config.height) {
                this.y = -50;
                this.x = Math.random() * this.scene.game.config.width;
            }
        }
    }

    hitPawn() {
        if (this.isDead) return;

        this.hit = true;
        this.isDead = true;

        this.scene.tweens.add({
            targets: this,
            alpha: { from: 1, to: 0 },
            ease: 'Linear',
            duration: 100,
            repeat: 3,
            yoyo: true,
            onComplete: () => {
                this.visible = false;
                this.x = -100;
            }
        });
    }
}
