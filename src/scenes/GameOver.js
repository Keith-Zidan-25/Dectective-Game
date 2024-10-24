import SCENES from '../config/gameConstants.js';
class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: SCENES.GAME_OVER });
    }

    create() {
        const { score } = this.game.gameData;

        // Add background
        this.add.rectangle(0, 0, 800, 600, 0x000000, 0.8).setOrigin(0);

        // Add game over text
        this.add.text(400, 200, 'Case Closed!', {
            fontSize: '64px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        // Add score
        this.add.text(400, 300, `Final Score: ${score}`, {
            fontSize: '32px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        // Add buttons
        new Button(
            this,
            400,
            400,
            'Play Again',
            () => this.scene.start(SCENES.MAIN_MENU)
        );

        new Button(
            this,
            400,
            470,
            'Main Menu',
            () => this.scene.start(SCENES.MAIN_MENU)
        );
    }
}
export default GameOverScene;