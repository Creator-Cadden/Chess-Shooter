class IntroRook extends Phaser.Scene {
    constructor() {
        super("IntroRook");
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
        this.load.image("rook", "e_rook.png");
        this.load.bitmapFont("rocketSquare", "KennyRocketSquare_0.png", "KennyRocketSquare.fnt");
        this.load.audio("impact", "impact.mp3");
    }

    create() {
        let my = this.my;

        my.sprite.king = this.physics.add.sprite(this.game.config.width / 2, this.game.config.height - 40, "king").setScale(0.25);
        my.sprite.king.setCollideWorldBounds(true);

        this.rooks = [];
        this.rookBullets = [];

        for (let i = 0; i < 3; i++) {
            let rook = new Rook(this, Math.random() * this.game.config.width, Math.random() * 100);
            this.rooks.push(rook);
        }

        this.left = this.input.keyboard.addKey("A");
        this.right = this.input.keyboard.addKey("D");
        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.playerSpeed = 5;
        this.bulletSpeed = 5;

        this.uiBackground = this.add.rectangle(0, 0, this.game.config.width, 50, 0x333333, 0.8).setOrigin(0, 0).setDepth(0);
        my.text.score = this.add.bitmapText(600, 10, "rocketSquare", "Score " + this.myScore, 30).setDepth(1);

        this.healthIcons = [];
        for (let i = 0; i < this.maxHealth; i++) {
            let icon = this.add.image(10 + i * 30, 13, "king").setScale(0.2).setOrigin(0, 0).setDepth(1);
            this.healthIcons.push(icon);
        }
    }

    update(time) {
        let my = this.my;

        if (this.left.isDown) {
            my.sprite.king.x -= this.playerSpeed;
        }
        if (this.right.isDown) {
            my.sprite.king.x += this.playerSpeed;
        }

        if (Phaser.Input.Keyboard.JustDown(this.space)) {
            if (my.sprite.bullet.length < this.maxBullets) {
                let bullet = this.physics.add.sprite(
                    my.sprite.king.x,
                    my.sprite.king.y - (my.sprite.king.displayHeight / 2),
                    "bullet"
                );
                bullet.setVelocityY(-200);
                my.sprite.bullet.push(bullet);
            }
        }

        // Update player bullets
        for (let i = my.sprite.bullet.length - 1; i >= 0; i--) {
            let bullet = my.sprite.bullet[i];
            if (!bullet || !bullet.active) continue;

            if (bullet.y < 0) {
                bullet.destroy();
                my.sprite.bullet.splice(i, 1);
                continue;
            }

            for (let j = this.rooks.length - 1; j >= 0; j--) {
                let rook = this.rooks[j];
                if (!rook || !rook.sprite || !rook.sprite.active) continue;

                if (this.checkCollision(bullet, rook.sprite)) {
                    this.sound.play("impact");
                    bullet.destroy();
                    my.sprite.bullet.splice(i, 1);
                    rook.destroy();
                    this.rooks.splice(j, 1);
                    this.myScore += 100;
                    my.text.score.setText("Score " + this.myScore);
                    break;
                }
            }
        }

        // Rook behavior
        for (let i = this.rooks.length - 1; i >= 0; i--) {
            let rook = this.rooks[i];
            if (!rook || !rook.sprite || !rook.sprite.active) continue;

            rook.update(time);

            if (this.checkCollision(rook.sprite, my.sprite.king)) {
                rook.destroy();
                this.rooks.splice(i, 1);
                this.handlePlayerHit();
            }
        }

        // Rook bullets
        for (let i = this.rookBullets.length - 1; i >= 0; i--) {
            let bullet = this.rookBullets[i];
            if (!bullet || !bullet.active) continue;

            if (bullet.y > this.game.config.height) {
                bullet.destroy();
                this.rookBullets.splice(i, 1);
                continue;
            }

            if (this.checkCollision(bullet, my.sprite.king)) {
                bullet.destroy();
                this.rookBullets.splice(i, 1);
                this.handlePlayerHit();
            }
        }

        // Transition if all rooks are gone
        if (this.rooks.every(p => p.isDead)) {
            console.log("Transitioning to VictoryOverlay from IntroRook");
        
            this.scene.start("VictoryOverlay", {
                currentLevel: "IntroRook",  // Pass current level
                nextLevel: "IntroBishop"    // Pass the next level correctly
            });
        }
    }

    checkCollision(spriteA, spriteB) {
        if (!spriteA || !spriteB || !spriteA.active || !spriteB.active) return false;
        const boundsA = spriteA.getBounds();
        const boundsB = spriteB.getBounds();
        return Phaser.Geom.Intersects.RectangleToRectangle(boundsA, boundsB);
    }

    handlePlayerHit() {
        this.currentHealth -= 1;
        if (this.currentHealth >= 0) {
            this.healthIcons[this.currentHealth].setVisible(false);
        }

        if (this.currentHealth <= 0) {
            this.scene.start("DefeatOverlay");
        }
    }
}
