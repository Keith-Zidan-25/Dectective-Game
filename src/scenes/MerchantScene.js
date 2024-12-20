import SCENES from "../config/gameConstants.js";

var cursors;
var pauseFlag = false;
var isTyping = false; // Tracks if typing animation is active

class MerchantScene extends Phaser.Scene {
    constructor() {
        super({ key: SCENES.MERCHANT_SCENE });
    }

    preload() {
        this.load.spritesheet('character', 'assets/images/characters/detective.png', {
            frameWidth: 128,
            frameHeight: 128
        });
        this.load.spritesheet('merchant', 'assets/images/characters/merchant.png', {
            frameWidth: 32,
            frameHeight: 32
        });

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

        this.anims.create({
            key: 'merchant_idle',
            frames: this.anims.generateFrameNumbers('merchant', { start: 0, end: 5 }),
            frameRate: 15,
            repeat: -1
        });

        this.player = this.physics.add.sprite(200, 190, 'character');
        this.merchant = this.physics.add.sprite(700, 190, 'merchant');

        this.player.setScale(3);
        this.merchant.setScale(4);

        this.player.setCollideWorldBounds(true);
        this.merchant.setCollideWorldBounds(true);

        cursors = this.input.keyboard.createCursorKeys();

        this.physics.add.collider(this.player, floor);
        this.physics.add.collider(this.merchant, floor);

        // Event listener for skipping typing
        this.input.on('pointerdown', () => {
            if (pauseFlag) {
                this.skipTypingAnimation();
            }
        });

        this.cameras.main.fadeIn(1000);
    }

    update() {
        this.merchant.anims.play('merchant_idle', true);

        if (this.player.x > 600 && !this.sceneTrigger) {
            this.sceneTrigger = true;
            this.createDialogBox();
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

    createDialogBox() {
        pauseFlag = true;
        this.add.image(120, 560, 'dialogBox').setOrigin(0);

        this.dialogText = this.add.text(140, 570, "", {
            fontFamily: 'Arial',
            fontSize: '15px',
            color: '#000',
            wordWrap: { width: 700, useAdvancedWrap: true }
        });

        this.dialogSequence = [
            { speaker: "Merchant", content: "Ah, a stranger from a distant land... or should I say, a distant time? You have the look of someone out of place." },
            { speaker: "Detective", content: "You’re sharp. I know I’m in Harappa, but I’m chasing someone—a thief who’s taken something precious from my time." },
            { speaker: "Merchant", content: "Time, you say? Interesting... Harappa has seen many travelers, but none quite like you. What brings you to our ancient streets, chasing shadows?" },
            { speaker: "Detective", content: "I don’t have time for riddles. There’s a criminal loose, and I need to stop them before they vanish again. Can you help me?" },
            { speaker: "Merchant", content: "Perhaps. But here in Harappa, nothing is given freely. You help me, and I’ll help you." },
            { speaker: "Detective", content: "What do you need?" },
            { speaker: "Merchant", content: "There are four artifacts, ancient relics of our civilization: a golden matka, a ceremonial bowl, a stone wheel, and an old bot. Find them for me, and I will tell you all I know about your thief." },
            { speaker: "Detective", content: "Artifacts? How do they tie into this?" },
            { speaker: "Merchant", content: "More than you might realize. Help me retrieve them, and the answers you seek will be yours." },
            { speaker: "Detective", content: "Alright, I’ll find your artifacts. But when I do, you’d better start talking." },
            { speaker: "Merchant", content: "Trust me, stranger. Once you’ve completed your task, you’ll see that our paths were meant to cross." }
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

    endScene() {
        this.cameras.main.fadeOut(1000); 
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start(SCENES.MARKETPLACE_GAME);
        });
    }
}

export default MerchantScene;
