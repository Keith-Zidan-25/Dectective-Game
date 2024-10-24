class Button extends Phaser.GameObjects.Container {
    constructor(scene, x, y, text, callback) {
        super(scene, x, y);

        this.scene = scene;
        this.callback = callback;

        // Create button background
        this.background = scene.add.rectangle(0, 0, 200, 50, 0x444444);
        this.backgroundHover = scene.add.rectangle(0, 0, 200, 50, 0x666666);
        this.backgroundHover.setVisible(false);

        // Create button text
        this.text = scene.add.text(0, 0, text, {
            fontSize: '24px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        // Add all elements to container
        this.add([this.background, this.backgroundHover, this.text]);

        // Add to scene and enable interactions
        scene.add.existing(this);
        this.setSize(200, 50);
        this.setInteractive({ useHandCursor: true })
            .on('pointerover', this.onPointerOver)
            .on('pointerout', this.onPointerOut)
            .on('pointerdown', this.onPointerDown)
            .on('pointerup', this.onPointerUp);
    }

    onPointerOver() {
        this.backgroundHover.setVisible(true);
        this.text.setStyle({ fill: '#ffffff' });
    }

    onPointerOut() {
        this.backgroundHover.setVisible(false);
        this.text.setStyle({ fill: '#ffffff' });
    }

    onPointerDown() {
        this.y += 2;
    }

    onPointerUp() {
        this.y -= 2;
        this.callback();
    }
}

export default Button;