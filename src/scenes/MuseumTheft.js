import SCENES from "../config/gameConstants.js";

var cursors;
var pauseFlag = false;

class MuseumTheft extends Phaser.Scene {
    constructor() {
        super({ key: SCENES.MUSEUM_THEFT });
        this.endSceneFlag = false;
    }

    preload() {
        this.load.spritesheet('director', 'assets/images/characters/museum_director_right.png', {
            frameWidth: 128,
            frameHeight: 128
        });
        this.load.spritesheet('gangster', 'assets/images/characters/gangster.png', {
            frameWidth: 128,
            frameHeight: 128
        });
        this.load.spritesheet('character', 'assets/images/characters/detective.png', {
            frameWidth: 128, 
            frameHeight: 128 
        });
        this.load.spritesheet('portal', 'assets/images/items/portal.png', {
            frameWidth: 100,
            frameHeight: 300
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
            frames: this.anims.generateFrameNumbers('director', { start: 0, end: 13 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'portal_open',
            frames: this.anims.generateFrameNumbers('portal', { start: 0, end: 3}),
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
            key: 'detective_idle_right',
            frames: this.anims.generateFrameNumbers('character', { start: 10, end: 22 }),
            frameRate: 15,
            repeat: -1
        });

        this.anims.create({
            key: 'gangster_idle',
            frames: this.anims.generateFrameNumbers('gangster', { start: 0, end: 5 }),
            frameRate: 15,
            repeat: -1
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('character', { start: 23, end: 32 }),
            frameRate: 15,
            repeat: -1
        });
    
        this.player = this.physics.add.sprite(188, 190, 'character');
        this.director = this.physics.add.sprite(30, 190, 'director');
        this.gangster = this.physics.add.sprite(750, 200, 'gangster');
        this.portal = this.physics.add.sprite(900, 200, 'portal');
    
        this.player.setScale(3);
        this.director.setScale(3);
        this.portal.setScale(1);
        this.gangster.setScale(3);

        this.player.setCollideWorldBounds(true);
        this.director.setCollideWorldBounds(true);
        this.portal.setCollideWorldBounds(true);
        this.gangster.setCollideWorldBounds(true)
    
        cursors = this.input.keyboard.createCursorKeys();

        this.physics.add.collider(this.player, floor);
        this.physics.add.collider(this.director, floor);
        this.physics.add.collider(this.portal, floor);
        this.physics.add.collider(this.gangster, floor);

        this.cameras.main.fadeIn(1000);
    
        this.createUI();
        this.createDialogBox();
    }

    update() {
        if (this.endSceneFlag) {
            this.cameras.main.fadeOut(1000); 
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start(SCENES.MUSEUM_THEFT);  // Transition to next scene
            });
        }

        this.director.anims.play('director_idle_right', true);
        this.gangster.anims.play('gangster_idle', true);
        this.portal.anims.play('portal_open', true);

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
        // Score display
        this.scoreText = this.add.text(16, 16, 'Score: 0', {
            fontSize: '24px',
            fill: '#fff'
        });
    }

    createDialogBox() {
        this.add.image(120, 460, 'dialogBox').setOrigin(0);

        const dialogText = this.add.text(140, 470, "", {
            fontFamily: 'Arial',
            fontSize: '15px',
            color: '#000',
            wordWrap: { width: 700, useAdvancedWrap: true } // Adjust width for better word wrapping
        });
        const dialogSequence = [
            { speaker: "Detective", content: "It's worse than we thought. I've been tracking this organization for months now. They're not just after relics—they're after time itself." },
            { speaker: "Museum Manager", content: "Time? What do you mean, detective?" },
            { speaker: "Detective", content: "These aren't random thefts. They’ve been targeting museums all over the world, stealing artifacts from key historical periods. They use them to open time portals—jumping back to the past to steal even more valuable relics from those eras. What’s valuable in the past becomes priceless in the present." },
            { speaker: "Museum Manager", content: "That’s impossible! You're telling me they can... time travel?!" },
            { speaker: "Detective", content: "Exactly. And they’re getting bolder. We need to stop them before they rewrite history for their own gain." }
        ];

        this.showDialogSequence(dialogText, dialogSequence, 0);
    }
    showDialogSequence(textObject, sequence, index) {
        if (index < sequence.length) {
            const currentDialog = sequence[index];
            const dialogContent = `${currentDialog.speaker}: ${currentDialog.content}`;

            this.typeText(textObject, dialogContent, 50);

            // Set a delay to show the next dialogue after a short pause
            setTimeout(() => {
                this.showDialogSequence(textObject, sequence, index + 1);
            }, dialogContent.length * 50 + 2000);  // Adjust the delay time based on the text length
        } else {
            this.endSceneFlag = true; // Resume the game after the dialog ends
        }
    }

    typeText(textObject, content, speed) {
        textObject.setText('');
        let i = 0;
    
        this.time.addEvent({
            callback: () => {
                textObject.setText(content.substr(0, i));
                i++;
            },
            repeat: content.length - 1,
            delay: speed
        });
    }
}

export default MuseumTheft;