import SCENES from '../config/gameConstants.js';
class InventoryScene extends Phaser.Scene {
    constructor() {
        super({ key: SCENES.INVENTORY });
    }

    create() {
        // Add semi-transparent background
        this.add.rectangle(0, 0, 800, 600, 0x000000, 0.7).setOrigin(0);

        // Add inventory panel
        this.createInventoryPanel();

        // Add collected items
        this.displayCollectedItems();

        // Add back button
        new Button(
            this,
            400,
            500,
            'Back to Game',
            () => this.scene.start(SCENES.CRIME_SCENE)
        );
    }

    createInventoryPanel() {
        const panel = this.add.rectangle(100, 50, 600, 400, 0x333333)
            .setOrigin(0);
        
        this.add.text(400, 70, 'Inventory', {
            fontSize: '32px',
            fill: '#ffffff'
        }).setOrigin(0.5);
    }

    displayCollectedItems() {
        const { collectedEvidence } = this.game.gameData;
        
        if (collectedEvidence.length === 0) {
            this.add.text(400, 250, 'No items collected yet', {
                fontSize: '24px',
                fill: '#ffffff'
            }).setOrigin(0.5);
            return;
        }

        collectedEvidence.forEach((item, index) => {
            const x = 150 + (index % 3) * 200;
            const y = 150 + Math.floor(index / 3) * 150;

            // Add item sprite
            this.add.sprite(x, y, item.key);

            // Add item name
            this.add.text(x, y + 40, item.name, {
                fontSize: '16px',
                fill: '#ffffff'
            }).setOrigin(0.5);
        });
    }
}
export default InventoryScene;