import SCENES from '../config/gameConstants.js';

class MarketplaceScene extends Phaser.Scene {
    constructor() {
        super({ key: SCENES.MARKETPLACE_GAME});
        this.score = 0;
        this.inventory = [];
    }

    preload() {
        this.load.image('marketplace-bg', 'assets/images/backgrounds/pottery_shop_bg.png')
        this.load.image('dialogBox', 'assets/images/ui/dialogBox.png');

        this.load.image('soup', 'assets/images/items/soup.png');
        this.load.image('matka', 'assets/images/items/matka.png');
        this.load.image('bot', 'assets/images/items/bot.png');
        this.load.image('wheel', 'assets/images/items/wheel.png');
    }

    create() {
        this.cameras.main.fadeIn(1000);

        this.add.image(0, 0, 'marketplace-bg').setOrigin(0);

        this.soup = this.add.image(100, 300, 'soup').setInteractive();
        this.matka = this.add.image(600, 400, 'matka').setInteractive();
        this.bot = this.add.image(780, 100, 'bot').setInteractive();
        this.wheel = this.add.image(80, 500, 'wheel').setInteractive();

        this.wheel.setScale(0.5);
        this.bot.setOrigin(0.8);

        // Handle clicks on each item
        this.soup.on('pointerdown', () => this.collectItem('soup', this.soup));
        this.matka.on('pointerdown', () => this.collectItem('matka', this.matka));
        this.bot.on('pointerdown', () => this.collectItem('bot', this.bot));
        this.wheel.on('pointerdown', () => this.collectItem('wheel', this.wheel));

        this.createUI();
    }

    createUI() {
        this.scoreText = this.add.text(16, 16, 'Score: ' + this.score, {
            fontSize: '24px',
            fill: '#fff'
        });
    }

    collectItem(itemName, itemObject) {
    // Tween to scale up the item
        this.tweens.add({
            targets: itemObject,
            scale: { from: 1, to: 1.5 }, // Increase size by 1.5x
            duration: 200, // Duration of the scaling effect
            yoyo: true, // Return to original size
            onComplete: () => {
                // After scaling, start fading out the item
                this.tweens.add({
                    targets: itemObject,
                    alpha: 0, // Fade out to invisible
                    duration: 300,
                    onComplete: () => {
                        this.inventory.push(itemName);
                        itemObject.destroy();
                        this.updateScore();
                    }
                });
            }
        });
    }

    updateScore() {
        this.score += 100;
        this.scoreText = 'Score: ' + this.score;

        if (this.score === 400) {
            this.endScene();
        }
    }

    endScene() {
        this.cameras.main.fadeOut(1000); 
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start(SCENES.HARRAPA_START);  // Transition to next scene
        });
    }
}

export default MarketplaceScene;