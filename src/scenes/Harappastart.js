import SCENES from "../config/gameConstants.js";

var cursors;
var pauseFlag = false;
var isTyping = false; // Tracks if typing animation is active

class HarappaStart extends Phaser.Scene {
    constructor() {
        super({ key: SCENES.HARRAPA_START });
        this.sceneTrigger = false;
    }
    
    preload() {
        this.load.image('background-harrapa', 'assets/images/backgrounds/Harrapa-Start.png');
        this.load.image('harappa-base-platform', 'assets/images/backgrounds/harappa_platfrom.png');
        this.load.image('dialogBox', 'assets/images/ui/dialogBox.png');
    }
    
    create() {
        this.add.image(0, 0, 'background-harrapa').setOrigin(0);

        const floor = this.physics.add.staticGroup();
        const platformWidth = this.textures.get('harappa-base-platform').getSourceImage().width;
        const sceneWidth = this.scale.width;
        const numPlatforms = Math.ceil(sceneWidth / platformWidth);
    
        for (let i = 0; i <= numPlatforms; i++) {
            floor.create(i * platformWidth, 601, 'harappa-base-platform').setScale(1).refreshBody();
        }

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
            key: 'right',
            frames: this.anims.generateFrameNumbers('character', { start: 23, end: 32 }),
            frameRate: 15,
            repeat: -1
        });

        this.player = this.physics.add.sprite(200, 190, 'character');
        this.player.setScale(3);
        this.player.setCollideWorldBounds(true);

        cursors = this.input.keyboard.createCursorKeys();
        this.physics.add.collider(this.player, floor);
        this.cameras.main.fadeIn(1000);

        this.createDialogBox();
        this.input.on('pointerdown', () => this.handleDialogClick()); // Listener for click to skip typing or proceed
    }
    
    update() {
        if (this.player.x > 600 && !this.sceneTrigger) {
            this.sceneTrigger = true;
            this.endScene();
        }
        if (!pauseFlag) {
            if (cursors.left.isDown) {
                this.player.setVelocityX(-160);
                this.player.anims.play('left', true);
            } else if (cursors.right.isDown) {
                this.player.setVelocityX(160);
                this.player.anims.play('right', true);
            } else {
                this.player.setVelocityX(0);
                this.player.anims.play('detective_idle', true);
            }
        } else {
            this.player.setVelocityX(0);
            this.player.anims.play('detective_idle', true);
        }
    }
    
    createDialogBox() {
        this.add.image(120, 560, 'dialogBox').setOrigin(0);

        const dialogText = this.add.text(140, 570, "", {
            fontFamily: 'Arial',
            fontSize: '15px',
            color: '#000',
            wordWrap: { width: 700, useAdvancedWrap: true }
        });
        
        this.dialogSequence = [
            { speaker: "Detective", content: "Where... where am I? This can’t be real. The structures, the streets... it’s like I’ve stepped into a history book." },
            { speaker: "Detective", content: "This isn’t just some artifact theft. These thieves—somehow—they've cracked the secret of time travel. And now, I’m stuck in ancient Harappa." },
            { speaker: "Detective", content: "The city is impressive—clean streets, organized blocks. No wonder historians were so fascinated by this place. But why would the thieves target this era?" },
            { speaker: "Detective", content: "I’ve got to find out what they’re after. Something about this civilization is key... something they plan to use to alter history." },
            { speaker: "Detective", content: "If I can’t stop them here, who knows what they'll change? History as we know it could vanish." },
            { speaker: "Detective", content: "I need to figure out their next move—and fast—before I get stuck here, and before they wreak havoc on the future." }
        ];

        this.currentDialogIndex = 0;
        this.dialogText = dialogText;

        this.showDialogSequence(this.dialogText, this.dialogSequence, this.currentDialogIndex);
    }

    showDialogSequence(textObject, sequence, index) {
        if (index < sequence.length) {
            pauseFlag = true;
            const currentDialog = sequence[index];
            const dialogContent = `${currentDialog.speaker}: ${currentDialog.content}`;

            this.typeText(textObject, dialogContent, 50);
        } else {
            pauseFlag = false; // Resume the game after the dialog ends
        }
    }

    typeText(textObject, content, speed) {
        textObject.setText('');
        let i = 0;
        isTyping = true;

        this.currentTypingEvent = this.time.addEvent({
            callback: () => {
                textObject.setText(content.substr(0, i));
                i++;
            },
            repeat: content.length - 1,
            delay: speed,
            callbackScope: this,
            onComplete: () => isTyping = false  // Typing completed
        });
    }

    handleDialogClick() {
        if (isTyping) {
            this.skipTypingAnimation(); // Skip typing animation if it’s still running
        } else {
            this.currentDialogIndex++; // Move to the next dialog line
            this.showDialogSequence(this.dialogText, this.dialogSequence, this.currentDialogIndex);
        }
    }

    skipTypingAnimation() {
        if (isTyping && this.currentTypingEvent) {
            this.currentTypingEvent.remove(false); // Stop the typing animation
            this.dialogText.setText(this.dialogSequence[this.currentDialogIndex].speaker + ": " + this.dialogSequence[this.currentDialogIndex].content); // Display full text
            isTyping = false;
        }
    }

    endScene() {
        this.cameras.main.fadeOut(1000);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start(SCENES.MERCHANT_SCENE);
        });
    }
}

export default HarappaStart;
