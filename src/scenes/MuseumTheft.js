import SCENES from "../config/gameConstants.js";

class MuseumTheft extends Phaser.Scene {
    constructor() {
        super({ key: SCENES.MUSEUM_THEFT });
        this.endSceneFlag = false;
        this.dialogIndex = 0;
        this.typingComplete = false;
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
            frames: this.anims.generateFrameNumbers('portal', { start: 0, end: 0 }),
            frameRate: 90,
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
    
        this.player = this.physics.add.sprite(400, 190, 'character');
        this.director = this.physics.add.sprite(20, 190, 'director');
        this.gangster = this.physics.add.sprite(750, 200, 'gangster');
        this.portal = this.physics.add.sprite(900, 200, 'portal');
    
        this.player.setScale(3);
        this.director.setScale(3);
        this.portal.setScale(1);
        this.gangster.setScale(3);

        this.player.setCollideWorldBounds(true);
        this.director.setCollideWorldBounds(true);
        this.portal.setCollideWorldBounds(true);
        this.gangster.setCollideWorldBounds(true);

        this.physics.add.collider(this.player, floor);
        this.physics.add.collider(this.director, floor);
        this.physics.add.collider(this.portal, floor);
        this.physics.add.collider(this.gangster, floor);

        this.cameras.main.fadeIn(1000);
    
        this.createUI();
        this.createDialogBox();

        // Click event to skip typing animation
        this.input.on('pointerdown', () => {
            this.skipTypingAnimation();
        });
    }

    update() {
        this.director.anims.play('director_idle_right', true);
        this.gangster.anims.play('gangster_idle', true);
        this.portal.anims.play('portal_open', true);
        this.player.anims.play('detective_idle', true);
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

        this.dialogText = this.add.text(140, 470, "", {
            fontFamily: 'Arial',
            fontSize: '15px',
            color: '#000',
            wordWrap: { width: 700, useAdvancedWrap: true }
        });
        
        this.dialogSequence = [
            { speaker: "Detective", content: "It’s over! You can’t outrun us this time. Put the artifact down." },
            { speaker: "Thief", content: "Oh, detective... you're always two steps behind. This artifact is the key to a new timeline—one where you never existed." },
            { speaker: "Museum Director", content: "You can’t just rewrite history! You don’t know what damage you’ll cause!" },
            { speaker: "Thief", content: "Damage? No, Director. What I’m about to do is evolution—reshaping history in our favor. And there’s nothing you can do to stop me." },
            { speaker: "Detective", content: "You think you can control time? It doesn’t work that way. Change one thing, and the entire world could unravel." },
            { speaker: "Thief", content: "That’s the idea, detective. Out with the old, in with the new. And thanks to this little relic, I’m in charge now." },
            { speaker: "Museum Director", content: "You’re risking everything—for what? Greed? Power? It’ll collapse on you!" },
            { speaker: "Thief", content: "Power is the only thing that matters. And by the time you realize that... I’ll be rewriting the past." },
            { speaker: "Detective", content: "No! Stop—!" },
            { speaker: "Thief", content: "Too late, detective. Enjoy watching history fade away!" },
            { speaker: "Narrator", content: "With a flash of light, the thief vanishes, leaving the detective and the director standing helplessly as the portal to the past closes." },
            { speaker: "Detective", content: "Damn it! We’re too late... they’re already gone." },
            { speaker: "Museum Director", content: "What do we do now?" },
            { speaker: "Detective", content: "We track them down... no matter where—or when—they are." }
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
            this.scene.start(SCENES.HARRAPA_START);  // Transition to next scene
        });
    }
}

export default MuseumTheft;
