import SCENES from '../config/gameConstants.js';  // Ensure you have the correct import for SCENES

class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: SCENES.BOOT });
    }

    preload() {
        // Load minimal assets needed for loading screen
        this.load.image('logo', 'assets/images/ui/logo.png');
    }

    create() {
        // Add any initialization logic here
        this.initializeGameData();
        
        // Transition to loader scene
        this.scene.start(SCENES.PRELOADER);
    }

    initializeGameData() {
        // Initialize game state
        this.game.gameData = {
            score: 0,
            collectedEvidence: [],
            currentLevel: 1
        };
    }
}

// Export BootScene as the default export
export default BootScene;
