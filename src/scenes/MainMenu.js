import SCENES from '../config/gameConstants.js';
import Button from "../objects/UI/Button.js";

class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: SCENES.MAIN_MENU });
    }

    create() {
        if (!this.sound.get('music')) {
            this.sound.add('music'); // Add to cache
            this.sound.play('music', { loop: true, volume: 0.5 }); // Play it
        }
        // Add background
        this.add.image(0, 0, 'menu-bg').setOrigin(0);

        // Add title
        const title = this.add.text(500, 100, 'Detective Game', {
            fontFamily:'san-serif',
            fontSize: '64px',
            fill: 'black',
            backgroundColor:'gold',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Add menu buttons
        this.createMenuButtons();

        // Add background music
        
    }

    createMenuButtons() {
        const buttonData = [
            { text: 'New Game', callback: () => this.startNewGame() },
            { text: 'Continue', callback: () => this.continueGame() },
            { text: 'Options', callback: () => this.openOptions() }
        ];

        buttonData.forEach((button, index) => {
            new Button(
                this,
                500,
                300 + (index * 70),
                button.text,
                button.callback
            );
        });
    }

    startNewGame() {
        // Reset game state
        this.game.gameData = {
            score: 0,
            collectedEvidence: [],
            currentLevel: 1
        };
        
        this.scene.stop(SCENES.MAIN_MENU);
        this.scene.start(SCENES.CRIME_SCENE);
    }

    continueGame() {
        // Load saved game if exists
        const savedGame = localStorage.getItem('detectiveGameSave');
        if (savedGame) {
            this.game.gameData = JSON.parse(savedGame);
            this.scene.start(SCENES.CRIME_SCENE);
        } else {
            // Show message if no save exists
            this.add.text(500, 500, 'No saved game found!', {
                fontSize: '24px',
                fill: '#ff0000'
            }).setOrigin(0.5);
        }
    }

    openOptions() {
        // Implement options menu
        console.log('Options menu - To be implemented');
    }
}

export default MainMenuScene;
