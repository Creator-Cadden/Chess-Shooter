class IntroKnight extends Phaser.Scene {
    constructor() {
        super("IntroKnight");
        this.my = { sprite: {}, text: {} };
        this.my.sprite.bullet = [];
        this.maxBullets = 10;
        this.myScore = 0;
        this.maxHealth = 3;
        this.currentHealth = this.maxHealth;
    }

    preload() {
        this.load.setPath("./assets/");
        this.load.image("king", "p_king.png");
        this.load.image("bullet", "bullet.png");
        this.load.image("knight", "e_knight.png");
        this.load.bitmapFont("rocketSquare", "KennyRocketSquare_0.png", "KennyRocketSquare.fnt");
        this.load.audio("impact", "impact.mp3");
    }

    create() {
        let my = this.my;

        my.sprite.king = this.physics.add.sprite(this.game.config.width / 2, this.game.config.height - 40, "king").setScale(0.25);
        my.sprite.king.setCollideWorldBounds(true);

        // Create knights
        this.knights = [];
        for (let i = 0; i < 3; i++) {
            let knight = new Knight(this, Math.random() * this.game.config.width, Math.random() * 100);
            this.knights.push(knight);
        }

        this.left = this.input.keyboard.addKey("A");
        this.right = this.input.keyboard.addKey("D");
        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.playerSpeed = 5;
        this.bulletSpeed = 5;

        // UI Elements
        this.uiBackground = this.add.rectangle(0, 0, this.game.config.width, 50, 0x333333, 0.8).setOrigin(0, 0).setDepth(0);
        my.text.score = this.add.bitmapText(600, 10, "rocketSquare", "Score " + this.myScore, 30).setDepth(1);

        // Health display
        this.healthIcons = [];
        for (let i = 0; i < this.maxHealth; i++) {
            let icon = this.add.image(10 + i * 30, 13, "king").setScale(0.2).setOrigin(0, 0).setDepth(1);
            this.healthIcons.push(icon);
        }
    }

    update(time) {
        let my = this.my;

        // Player movement
        if (this.left.isDown) {
            my.sprite.king.x -= this.playerSpeed;
        }
        if (this.right.isDown) {
            my.sprite.king.x += this.playerSpeed;
        }

        // Fire bullets
        if (Phaser.Input.Keyboard.JustDown(this.space)) {
            if (my.sprite.bullet.length < this.maxBullets) {
                let bullet = this.physics.add.sprite(
                    my.sprite.king.x,
                    my.sprite.king.y - (my.sprite.king.displayHeight / 2),
                    "bullet"
                );
                my.sprite.bullet.push(bullet);
            }
        }

        // Move bullets
        for (let bullet of my.sprite.bullet) {
            bullet.y -= this.bulletSpeed;
        }

        // Remove offscreen bullets
        my.sprite.bullet = my.sprite.bullet.filter((bullet) => bullet.y > -(bullet.displayHeight / 2));

        // Update knights and handle collision
        for (let knight of this.knights) {
            knight.update(time);

            // Bullet → Knight
            for (let bullet of my.sprite.bullet) {
                if (this.collides(knight, bullet)) {
                    bullet.y = -100;
                    knight.hitKnight();

                    this.myScore += knight.scorePoints;
                    this.updateScore();
                    this.sound.play("impact", { volume: 0.5 });
                    break;
                }
            }

            // Knight → King (player)
            if (!knight.isDead && this.collides(knight, my.sprite.king)) {
                this.damagePlayer();
                knight.hitKnight();
            }
        }

        // If all knights are dead, go to next scene
        if (this.knights.every(k => k.isDead)) {
            console.log("Transitioning to VictoryOverlay from IntroKnight");

            this.scene.start("VictoryOverlay", {
                currentLevel: "IntroKnight",  // Pass current level
                nextLevel: "IntroQueen"      // Pass the next level correctly
            });
        }
    }

    collides(a, b) {
        return (
            Math.abs(a.x - b.x) <= (a.displayWidth / 2 + b.displayWidth / 2) &&
            Math.abs(a.y - b.y) <= (a.displayHeight / 2 + b.displayHeight / 2)
        );
    }

    updateScore() {
        this.my.text.score.setText("Score " + this.myScore);
    }

    damagePlayer() {
        if (this.currentHealth > 0) {
            this.currentHealth--;

            // Hide the icon
            this.healthIcons[this.currentHealth].setVisible(false);

            // Game over
            if (this.currentHealth === 0) {
                this.scene.start("DefeatOverlay");
            }
        }
    }
}
