import SCENES from "../config/gameConstants.js";

var cursors;
var pauseFlag = false;

class MuseumScene extends Phaser.Scene {
    constructor() {
        super({ key: SCENES.MUSEUM_SCENE });
        this.dialogDisplayed = false;
        this.dialogIndex = 0;
        this.typingComplete = false;
    }

    preload() {
        this.load.spritesheet('director_new', 'assets/images/characters/museum_director.png', {
            frameWidth: 128,
            frameHeight: 128
        });
        this.load.spritesheet('character', 'assets/images/characters/detective.png', {
            frameWidth: 128, 
            frameHeight: 128 
        });

        this.load.image('dialogBox', 'assets/images/ui/dialogBox.png');
    }

    create() {
        this.add.image(0, 0, 'crime-scene-bg').setOrigin(0);

        const floor = this.physics.add.staticGroup();
        const platformWidth = this.textures.get('museum-floor-platform').getSourceImage().width;
        const sceneWidth = this.scale.width;
        const numPlatforms = Math.ceil(sceneWidth / platformWidth);
    
        for (let i = 0; i <= numPlatforms; i++) {
            floor.create(i * platformWidth, 501, 'museum-floor-platform').setScale(1).refreshBody();
        }

        this.anims.create({
            key: 'director_idle',
            frames: this.anims.generateFrameNumbers('director_new', { start: 0, end: 13 }),
            frameRate: 10,
            repeat: -1
        });

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
            frames: this.anims.generateFrameNumbers('character', { start: 23, end: 32 }),
            frameRate: 15,
            repeat: -1
        });
    
        this.player = this.physics.add.sprite(100, 200, 'character');
        this.director = this.physics.add.sprite(800, 200, 'director_new');
    
        this.player.setScale(3);
        this.director.setScale(3);

        this.player.setCollideWorldBounds(true);
        this.director.setCollideWorldBounds(true);
    
        cursors = this.input.keyboard.createCursorKeys();

        this.physics.add.collider(this.player, floor);
        this.physics.add.collider(this.director, floor);

        this.cameras.main.fadeIn(1000);
    
        this.createUI();

        // Click event to skip typing animation
        this.input.on('pointerdown', () => {
            if (pauseFlag) {
                this.skipTypingAnimation();
            }
        });
    }

    update() {
        this.director.anims.play('director_idle', true);

        // Trigger dialog when player is near the director
        if (Math.abs(this.director.x - this.player.x) <= 150 && !this.dialogDisplayed) {
            this.dialogDisplayed = true;
            this.createDialogBox();
            pauseFlag = true;
        }

        if (cursors.left.isDown && !pauseFlag) {
            this.player.setVelocityX(-160);
            this.player.anims.play('left', true);
        } else if (cursors.right.isDown && !pauseFlag) {
            this.player.setVelocityX(160);
            this.player.anims.play('right', true);
        } else {
            this.player.setVelocityX(0);
            this.player.anims.play('detective_idle', true);
        }
    }

    createUI() {
        this.scoreText = this.add.text(16, 16, 'Score: 0', {
            fontSize: '24px',
            fill: '#fff'
        });
    }

    createDialogBox() {
        this.add.image(120, 460, 'dialogBox').setOrigin(0);

        this.dialogText = this.add.text(140, 470, "", {
            fontFamily: 'Arial',
            fontSize: '15px',
            color: '#000',
            wordWrap: { width: 700, useAdvancedWrap: true }
        });

        this.dialogSequence = [
            { speaker: "Detective", content: "It's worse than we thought. I've been tracking this organization for months now. They're not just after relics—they're after time itself." },
            { speaker: "Museum Manager", content: "Time? What do you mean, detective?" },
            { speaker: "Detective", content: "These aren't random thefts. They’ve been targeting museums all over the world, stealing artifacts from key historical periods. They use them to open time portals—jumping back to the past to steal even more valuable relics from those eras. What’s valuable in the past becomes priceless in the present." },
            { speaker: "Museum Manager", content: "That’s impossible! You're telling me they can... time travel?!" },
            { speaker: "Detective", content: "Exactly. And they’re getting bolder. We need to stop them before they rewrite history for their own gain." }
        ];

        this.showDialogSequence(this.dialogSequence, 0);
    }

    showDialogSequence(sequence, index) {
        if (index < sequence.length) {
            this.dialogIndex = index;
            this.typingComplete = false;
            const currentDialog = sequence[index];
            const dialogContent = `${currentDialog.speaker}: ${currentDialog.content}`;

            this.typeText(this.dialogText, dialogContent, 50);
        } else {
            pauseFlag = false;
            this.endScene();
        }
    }

    skipTypingAnimation() {
        if (!this.typingComplete) {
            this.typingComplete = true;
            this.time.removeAllEvents();
            this.dialogText.setText(this.dialogSequence[this.dialogIndex].speaker + ": " + this.dialogSequence[this.dialogIndex].content);
        } else {
            if (this.dialogIndex < this.dialogSequence.length - 1) {
                this.showDialogSequence(this.dialogSequence, this.dialogIndex + 1);
            } else {
                pauseFlag = false;
                this.endScene();
            }
        }
    }

    typeText(textObject, content, speed) {
        textObject.setText('');
        let i = 0;

        this.time.addEvent({
            callback: () => {
                textObject.setText(content.substr(0, i));
                i++;
                if (i === content.length) {
                    this.typingComplete = true;
                }
            },
            repeat: content.length - 1,
            delay: speed
        });
    }

    endScene() {
        this.cameras.main.fadeOut(1000); 
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start(SCENES.MUSEUM_THEFT);
        });
    }
}

export default MuseumScene;
