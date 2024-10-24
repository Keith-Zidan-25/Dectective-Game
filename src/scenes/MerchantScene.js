import SCENES from "../config/gameConstants.js";

var cursors;
var pauseFlag = false;

class MerchantScene extends Phaser.Scene{
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

        const dialogText = this.add.text(140, 570, "", {
            fontFamily: 'Arial',
            fontSize: '15px',
            color: '#000',
            wordWrap: { width: 700, useAdvancedWrap: true }
        });
        const dialogSequence = [
            { speaker: "Detective", content: "Where... where am I? This can’t be real. The structures, the streets... it’s like I’ve stepped into a history book." },
            { speaker: "Detective", content: "This isn’t just some artifact theft. These thieves—somehow—they've cracked the secret of time travel. And now, I’m stuck in ancient Harappa." },
            { speaker: "Detective", content: "The city is impressive—clean streets, organized blocks. No wonder historians were so fascinated by this place. But why would the thieves target this era?" },
            { speaker: "Detective", content: "I’ve got to find out what they’re after. Something about this civilization is key... something they plan to use to alter history." },
            { speaker: "Detective", content: "If I can’t stop them here, who knows what they'll change? History as we know it could vanish." },
            { speaker: "Detective", content: "I need to figure out their next move—and fast—before I get stuck here, and before they wreak havoc on the future." }
        ];        

        this.showDialogSequence(dialogText, dialogSequence, 0);
    }

    showDialogSequence(textObject, sequence, index) {
        if (index < sequence.length) {
            pauseFlag = true;
            const currentDialog = sequence[index];
            const dialogContent = `${currentDialog.speaker}: ${currentDialog.content}`;

            this.typeText(textObject, dialogContent, 50);

            // Set a delay to show the next dialogue after a short pause
            setTimeout(() => {
                this.showDialogSequence(textObject, sequence, index + 1);
            }, dialogContent.length * 50 + 2000);  // Adjust the delay time based on the text length
        } else {
            pauseFlag = false;
            this.endScene(); // Resume the game after the dialog ends
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

    endScene() {
        this.cameras.main.fadeOut(1000); 
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start(SCENES.MARKETPLACE_GAME);  // Transition to next scene
        });
    }
}

export default MerchantScene;