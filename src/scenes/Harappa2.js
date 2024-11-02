import SCENES from "../config/gameConstants.js";

var cursors;
var pauseFlag = false;

class Harappa2 extends Phaser.Scene{
    constructor() {
        super({ key: SCENES.HARAPPA2_SCENE });
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
            { speaker: "Merchant", content: "Ah, you've returned! And with the items I requested, no less. I must admit, I'm impressed. Not many could have navigated through these lands so quickly." },
            { speaker: "Detective", content: "It wasn't easy, but I got them. Now, as we agreed... you help me, and I get out of here." },
            { speaker: "Merchant", content: "Of course, of course. A deal is a deal. You seek knowledge, do you not? Answers to questions that have plagued you since your arrival here?" },
            { speaker: "Detective", content: "Exactly. I need to know what those thieves want with this era and how they plan to manipulate history." },
            { speaker: "Merchant", content: "The relics you've gathered hold great power—ancient secrets of our people. Those who possess them can unlock the very fabric of time itself. The thieves you speak of... they want to control time." },
            { speaker: "Detective", content: "Control time? I feared as much. But how do I stop them?" },
            { speaker: "Merchant", content: "Patience, detective. There's one more thing you need. A final piece of the puzzle—an ancient stone. It resides in a temple beyond the city. Without it, their plans cannot succeed." },
            { speaker: "Detective", content: "Let me guess—you need me to retrieve it." },
            { speaker: "Merchant", content: "Indeed. Bring me the stone, and I will give you the knowledge and tools you need to confront your enemies. But beware—the temple is guarded by traps and secrets of our ancestors. Proceed with caution." },
            { speaker: "Detective", content: "Traps, huh? Sounds like my kind of place. I'll get that stone, and then this ends." },
            { speaker: "Merchant", content: "I wish you fortune, detective. Time is of the essence... in more ways than one." }
        ]        

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
}

export default Harappa2;