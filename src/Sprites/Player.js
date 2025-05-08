class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, leftKey, rightKey, spaceKey, speed, bulletGroup, bulletSpeed) {
        super(scene, x, y, texture);

        this.scene = scene;
        this.left = leftKey;
        this.right = rightKey;
        this.space = spaceKey;
        this.speed = speed;
        this.bulletGroup = bulletGroup;
        this.bulletSpeed = bulletSpeed;
        this.maxBullets = 10;

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setCollideWorldBounds(true);
        this.setScale(0.25);
    }

    update() {
        if (this.left.isDown) {
            this.setVelocityX(-this.speed);
        } else if (this.right.isDown) {
            this.setVelocityX(this.speed);
        } else {
            this.setVelocityX(0);
        }

        if (Phaser.Input.Keyboard.JustDown(this.space)) {
            if (this.bulletGroup.getChildren().length < this.maxBullets) {
                let bullet = this.scene.physics.add.sprite(
                    this.x,
                    this.y - (this.displayHeight / 2),
                    "bullet"
                );
                bullet.setVelocityY(-this.bulletSpeed);
                this.bulletGroup.add(bullet);
            }
        }
    }
    
}
