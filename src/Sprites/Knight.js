class Knight {
    constructor(scene, x, y) {
        this.scene = scene;
        this.sprite = scene.physics.add.sprite(x, y, 'knight').setScale(0.3);
        this.sprite.setOrigin(0.5);
        this.sprite.owner = this;

        this.scorePoints = 200;
        this.isDead = false;

        // Adjust speed for faster movement than a pawn (quicker than pawn, so we make moveInterval shorter)
        this.moveInterval = 400; // Move interval is quicker than a pawn
        this.lastMoveTime = 0;
        this.stepSize = 20; // Move by 20 pixels per step, adjust as needed for visual effect

        // L-shape movement only growing downwards (dy is always positive)
        this.lMoves = [
            { dx: 2, dy: 1 }, { dx: 1, dy: 2 },
            { dx: -1, dy: 2 }, { dx: -2, dy: 1 }
        ];
    }

    update(time) {
        if (!this.sprite || !this.sprite.active) return;

        if (time > this.lastMoveTime + this.moveInterval) {
            this.lastMoveTime = time;

            const move = Phaser.Utils.Array.GetRandom(this.lMoves); // Get random move from the lMoves array

            // Calculate new position based on the move and step size
            const newX = this.sprite.x + move.dx * this.stepSize;
            const newY = this.sprite.y + move.dy * this.stepSize;

            const width = this.scene.game.config.width;
            const height = this.scene.game.config.height;

            // Only move the knight if the new position is within bounds
            if (newX > 0 && newX < width && newY > 0 && newY < height) {
                this.sprite.setPosition(newX, newY);
            }

            // Check if the knight has passed the bottom and reset to the top
            if (this.sprite.y >= height) {
                this.reset();  // Reset position to top if it passes the bottom
            }
        }
    }

    hitKnight() {
        if (this.isDead) return;

        this.isDead = true;

        // Flash effect for 3 repetitions
        this.scene.tweens.add({
            targets: this.sprite,
            alpha: { from: 1, to: 0 },
            ease: 'Linear',
            duration: 100,
            repeat: 3,
            yoyo: true,
            onComplete: () => {
                this.sprite.visible = false;
                this.sprite.x = -100;
                // Optionally destroy sprite and collider here
                this.sprite.destroy();
            }
        });
    }

    reset() {
        // Reset knight to a random position at the top of the screen
        const width = this.scene.game.config.width;
        this.sprite.setPosition(Math.random() * width, -50);  // Move knight slightly above the top to create a "falling" effect
        this.isDead = false;  // Reset to alive state
    }

    get x() { return this.sprite.x; }
    get y() { return this.sprite.y; }
    get displayWidth() { return this.sprite.displayWidth; }
    get displayHeight() { return this.sprite.displayHeight; }
}
