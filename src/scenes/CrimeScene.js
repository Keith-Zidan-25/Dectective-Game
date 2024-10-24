import SCENES from '../config/gameConstants.js';

var cursors;
var pauseFlag = false;

class CrimeScene extends Phaser.Scene {
    constructor() {
        super({ key: SCENES.CRIME_SCENE });
        this.evidence = [];
        cursors = null;
    }

    preload() {
        this.load.spritesheet('character', 'assets/images/characters/detective.png', {
            frameWidth: 128, // Width of each frame
            frameHeight: 128 // Height of each frame
        });

        this.load.image('dialogBox', 'assets/images/ui/dialogBox.png');
    }

    create() {
        this.cameras.main.setBounds(0, 0, this.worldWidth, this.worldHeight);
        this.cameras.main.setViewport(0, 0, 1000, 600);

        // Add background
        this.add.image(0, 0, 'crime-scene-bg').setOrigin(0);

        const floor = this.physics.add.staticGroup();
        const platformWidth = this.textures.get('museum-floor-platform').getSourceImage().width;

        // Calculate how many platforms are needed to cover the scene width
        const sceneWidth = this.scale.width;
        const numPlatforms = Math.ceil(sceneWidth / platformWidth);
    
        // Create and position each platform
        for (let i = 0; i <= numPlatforms; i++) {
            floor.create(i * platformWidth, 501, 'museum-floor-platform').setScale(1).refreshBody();
        }

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('character', { start: 0, end: 9 }),
            frameRate: 15,
            repeat: -1
        });

        this.anims.create({
            key: 'detective_idle',
            frames: this.anims.generateFrameNumbers('character', { start: 10, end: 22 }),
            frameRate: 15,
            repeat: -1
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('character', { start: 23, end: 32}),
            frameRate: 15,
            repeat: -1
        });
    
        // Create the character sprite
        this.player = this.physics.add.sprite(100, 200, 'character'); // Make sure sprite key matches
    
        // Ensure the sprite has proper scaling and physics properties
        this.player.setScale(3);
        this.player.setCollideWorldBounds(true); // Ensure character doesn't go off-screen
    
        // Enable arrow key inputs
        cursors = this.input.keyboard.createCursorKeys();

        this.physics.add.collider(this.player, floor);

        this.cameras.main.fadeIn(1000);
    
        // Initialize UI
        this.createUI();
        setTimeout(() => {
            this.createDialogBox();
            this.textFlag = true;
        }, 1000);

        this.sceneTransitionTrigger = false;
    }

    update() {
        if (this.textFlag) {
            pauseFlag = true;
        } else {
            pauseFlag = false;
        }
        
        if (this.player.x >= 600 && !this.sceneTransitionTrigger) {
            this.sceneTransitionTrigger = true;

            this.cameras.main.fadeOut(1000); 
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start(SCENES.MUSEUM_SCENE);  // Transition to next scene
            });
        } 
        // Check for left/right movement
        if (cursors.left.isDown && !pauseFlag) {
            this.player.setVelocityX(-160);
            this.player.anims.play('left', true);
        } else if (cursors.right.isDown && !pauseFlag) {
            this.player.setVelocityX(160);
            this.player.anims.play('right', true);
        } else {
            // If no key is pressed, stop the animation
            this.player.setVelocityX(0);
            this.player.anims.play('detective_idle', true);
        }
    }

    createUI() {
        // Score display
        this.scoreText = this.add.text(16, 16, 'Score: 0', {
            fontSize: '24px',
            fill: '#fff'
        });
    }

    createDialogBox() {
        this.add.image(120, 460, 'dialogBox').setOrigin(0);

        const dialogText = this.add.text(130, 470, '', { font: "15px", fill: "#000", wordWrap: { width: 460, useAdvancedWrap: true } });
        const dialogContent = "I am here at the Museum, I wonder why the Director called me here?. Maybe it's something Important!";

        this.typeText(dialogText, dialogContent, 25);

        setTimeout(() => {
            this.textFlag = false;
        }, 4000);
    }

    typeText(textObject, content, speed) {
        textObject.setText('');  // Start with an empty string
        let i = 0;
    
        // Timer to add one character at a time
        this.time.addEvent({
            callback: () => {
                textObject.setText(content.substr(0, i));  // Update the displayed text
                i++;
            },
            repeat: content.length - 1,  // Repeat for each character
            delay: speed  // Delay between each character (ms)
        });
    }
}

export default CrimeScene;