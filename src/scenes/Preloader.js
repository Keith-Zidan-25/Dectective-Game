import SCENES from '../config/gameConstants.js';

class PreloaderScene extends Phaser.Scene {
    constructor() {
        super({ key: SCENES.PRELOADER });
    }

    preload() {
        // Create loading bar
        this.createLoadingBar();

        // Load all game assets
        this.loadGameAssets();
    }

    createLoadingBar() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(width / 4, height / 2 - 30, width / 2, 50);

        // Outline for the progress bar
        progressBox.lineStyle(2, 0xffffff, 1);
        progressBox.strokeRect(width / 4, height / 2 - 30, width / 2, 50);

        const loadingText = this.add.text(width / 2, height / 2 - 50, 'Loading...', {
            fontSize: '20px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        // Update progress bar
        this.load.on('progress', (value) => {
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(width / 4 + 10, height / 2 - 20, (width / 2 - 20) * value, 30);
        });

        // Clean up when complete
        this.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            this.load.off('progress'); // Clean up listener
            this.load.off('complete'); // Clean up listener
        });
    }

    loadGameAssets() {
        const assets = {
            images: {
                backgrounds: [
                    ['menu-bg', 'assets/images/backgrounds/menu-bg.jpg'],
                    ['crime-scene-bg', 'assets/images/backgrounds/museum.jpg'],
                    ['museum-floor-platform', 'assets/images/backgrounds/museum-floor.png'],
                ],
                items: [
                    ['knife', 'assets/images/items/knife.png'],
                    ['key', 'assets/images/items/key.png'],
                    ['note', 'assets/images/items/note.png'],
                    ['phone', 'assets/images/items/phone.png'],
                ],
                ui: [
                    ['button', 'assets/images/ui/button.png'],
                    ['panel', 'assets/images/ui/panel.png'],
                ],
            },
            audio: {
                sfx: [
                    ['click', 'assets/audio/sfx/click.mp3'],
                    ['collect', 'assets/audio/sfx/collect.mp3'],
                ],
                music: [
                    ['music', 'assets/audio/music/background-music.mp3'],
                ],
            }
        };

        // Load images
        for (const category in assets.images) {
            assets.images[category].forEach(asset => {
                this.load.image(asset[0], asset[1]);
            });
        }

        // Load audio
        for (const category in assets.audio) {
            assets.audio[category].forEach(asset => {
                this.load.audio(asset[0], asset[1]);
            });
        }
    }

    create() {
        this.scene.start(SCENES.MAIN_MENU);
    }
}

export default PreloaderScene;
