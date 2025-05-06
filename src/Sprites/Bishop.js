class Bishop {
    constructor(scene, x, y) {
        this.scene = scene;
        this.sprite = scene.physics.add.sprite(x, y, 'bishop');
        this.sprite.setScale(0.25);
        this.sprite.setOrigin(0.5);

        this.sprite.owner = this; // Link for access in callbacks

        this.scorePoints = 150;
        this.hit = false;
        this.isDead = false;

        this.stepSize = 10;
        this.stepInterval = 200;
        this.lastStepTime = 0;
        this.movingRight = true;

        this.lastShotTime = 0;
        this.shootInterval = 2500;
    }

    update(time) {
        if (this.isDead || !this.sprite.active) return;

        if (time > this.lastStepTime + this.stepInterval) {
            this.sprite.y += this.stepSize;
            this.sprite.x += this.movingRight ? this.stepSize : -this.stepSize;
            this.lastStepTime = time;

            if (this.sprite.x <= 0 || this.sprite.x >= this.scene.game.config.width) {
                this.movingRight = !this.movingRight;
            }

            if (this.sprite.y > this.scene.game.config.height) {
                this.sprite.y = -50;
                this.sprite.x = Math.random() * this.scene.game.config.width;
                this.movingRight = Math.random() < 0.5;
            }
        }

        if (time > this.lastShotTime + this.shootInterval) {
            this.shoot();
            this.lastShotTime = time;
        }
    }

    shoot() {
        const yOffset = this.sprite.y + 20;
        const x = this.sprite.x;

        const pelletStraight = this.scene.physics.add.sprite(x, yOffset, 'pellets');
        pelletStraight.setVelocity(0, 180);

        const pelletLeft = this.scene.physics.add.sprite(x, yOffset, 'pellets');
        pelletLeft.setVelocity(-50, 180);

        const pelletRight = this.scene.physics.add.sprite(x, yOffset, 'pellets');
        pelletRight.setVelocity(50, 180);

        this.scene.bishopPellets.push(pelletStraight, pelletLeft, pelletRight);
    }

    destroy() {
        this.isDead = true;
        this.sprite.destroy();
    }
}
