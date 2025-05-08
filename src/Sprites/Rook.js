class Rook {
    constructor(scene, x, y) {
        this.scene = scene;
        this.movingRight = Math.random() < 0.5;

        this.sprite = scene.physics.add.sprite(
            this.movingRight ? -50 : scene.game.config.width + 50,
            y,
            "rook"
        ).setScale(0.25);

        this.stepSize = 10;
        this.stepInterval = 200; // ms between "blip" moves
        this.lastStepTime = 0;

        this.lastShotTime = 0;                  
        this.shootInterval = 2000;
    }

    update(time) {
        if (!this.sprite || !this.sprite.active) return;

        // Blip movement
        if (time > this.lastStepTime + this.stepInterval) {
            this.sprite.x += this.movingRight ? this.stepSize : -this.stepSize;
            this.lastStepTime = time;
        }

        // Reset position if off screen
        if (this.sprite.x > this.scene.game.config.width + 50 || this.sprite.x < -50) {
            this.reset();
        }

        // Shoot bullet
        if (time > this.lastShotTime + this.shootInterval) {
            this.shoot();
            this.lastShotTime = time;
        }
    }

    shoot() {
        const bullet = this.scene.physics.add.sprite(
            this.sprite.x,
            this.sprite.y + 20,
            "bullet"
        );
        bullet.setVelocityY(150);
        this.scene.rookBullets.push(bullet);
    }

    reset() {
        this.sprite.y = Math.random() * 100;
        this.movingRight = Math.random() < 0.5;
        this.sprite.x = this.movingRight ? -50 : this.scene.game.config.width + 50;
    }

    destroy() {
        if (this.sprite) {
            this.sprite.destroy();
        }
    }
}
