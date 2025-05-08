class Bishop {
    constructor(scene, x, y) {
        this.scene = scene;
        this.sprite = scene.physics.add.sprite(x, y, 'bishop');
        this.sprite.setScale(0.25);
        this.sprite.setOrigin(0.5);
        this.sprite.owner = this;

        this.scorePoints = 150;
        this.hit = false;
        this.isDead = false;

        this.stepSize = 10;
        this.stepInterval = 200;
        this.lastStepTime = 0;

        this.diagonalRight = Math.random() < 0.5;
        this.directionSwitchInterval = 2000; // every 2 seconds
        this.lastDirectionSwitch = 0;

        this.lastShotTime = 0;
        this.shootInterval = 2500;
    }

    update(time) {
        if (this.isDead || !this.sprite.active) return;

        // Switch diagonal direction every few seconds
        if (time > this.lastDirectionSwitch + this.directionSwitchInterval) {
            this.diagonalRight = !this.diagonalRight;
            this.lastDirectionSwitch = time;
        }

        // Move diagonally every stepInterval
        if (time > this.lastStepTime + this.stepInterval) {
            this.sprite.y += this.stepSize;
            this.sprite.x += this.diagonalRight ? this.stepSize : -this.stepSize;
            this.lastStepTime = time;

            // Wrap around screen edges horizontally
            if (this.sprite.x <= 0) {
                this.sprite.x = 0;
                this.diagonalRight = true;
            } else if (this.sprite.x >= this.scene.game.config.width) {
                this.sprite.x = this.scene.game.config.width;
                this.diagonalRight = false;
            }

            // Reset to top if off bottom
            if (this.sprite.y > this.scene.game.config.height) {
                this.sprite.y = -50;
                this.sprite.x = Math.random() * this.scene.game.config.width;
                this.diagonalRight = Math.random() < 0.5;
            }
        }

        // Shoot pellets
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
