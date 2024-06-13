import { EventBus } from "../EventBus";
import { Scene } from "phaser";

export class Game extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameText: Phaser.GameObjects.Text;
    conversationBubble: Phaser.GameObjects.Text;
    interactionMessages: { [key: string]: string };

    constructor() {
        super("Game");
    }

    preload() {
        this.load.image("fantasy", "../../assets/fantasy.bmp");
        this.load.tilemapTiledJSON("office-map", "../../assets/office-map.json");
        this.load.spritesheet("player", "../../assets/characters.png", {
            frameWidth: 52,
            frameHeight: 72,
        });
        this.load.spritesheet("character", "../../assets/characters_2.png", {
            frameWidth: 52,
            frameHeight: 72,
        });
    }

    create() {
        const officeTilemap = this.make.tilemap({ key: "office-map" });
        const tileset = officeTilemap.addTilesetImage("fantasy", "fantasy");

        for (let i = 0; i < officeTilemap.layers.length; i++) {
            const layer = officeTilemap.createLayer(i, tileset, 0, 0);
            layer.setScale(1); // Adjust scale if needed
        }

        const playerSprite = this.add.sprite(0, 0, "player");
        playerSprite.setScale(1);
        this.physics.add.existing(playerSprite);

        this.cameras.main.startFollow(playerSprite, true);
        this.cameras.main.setFollowOffset(
            -playerSprite.width,
            -playerSprite.height
        );

        const npcSprite = this.add.sprite(0, 0, "player");
        npcSprite.scale = 1;
        this.physics.add.existing(npcSprite);

        const npcSprite1 = this.add.sprite(0, 0, "player");
        npcSprite1.scale = 1;
        this.physics.add.existing(npcSprite1);

        const npcSprite2 = this.add.sprite(0, 0, "player");
        npcSprite2.scale = 1;
        this.physics.add.existing(npcSprite2);

        const npcSprite3 = this.add.sprite(0, 0, "player");
        this.physics.add.existing(npcSprite3);

        const npcSprite4 = this.add.sprite(0, 1, "character");
        this.physics.add.existing(npcSprite4);

        this.interactionMessages = {
            npc0: "Hello, I am Brent.",
            npc1: "Good day! I'm NPC 1.",
            npc2: "Hey there! I'm NPC 2.",
            npc3: "Greetings! I'm Alex..",
            npc4: "www.google.com",
        };

        const gridEngineConfig = {
            characters: [
                {
                    id: "player",
                    sprite: playerSprite,
                    walkingAnimationMapping: 6,
                    startPosition: { x: 15, y: 12 },
                },
                {
                    id: "npc0",
                    sprite: npcSprite,
                    walkingAnimationMapping: 0,
                    startPosition: { x: 25, y: 15 },
                    speed: 3,
                },
                {
                    id: "npc1",
                    sprite: npcSprite1,
                    walkingAnimationMapping: 1,
                    startPosition: { x: 2, y: 8 },
                },
                {
                    id: "npc2",
                    sprite: npcSprite2,
                    walkingAnimationMapping: 0,
                    startPosition: { x: 25, y: 20 },
                    speed: 3,
                },
                {
                    id: "npc3",
                    sprite: npcSprite3,
                    walkingAnimationMapping: 0,
                    startPosition: { x: 25, y: 20 },
                    speed: 3,
                },
                {
                    id: "npc4",
                    sprite: npcSprite4,
                    walkingAnimationMapping: 0,
                    startPosition: { x: 25, y: 50 },
                    speed: 3,
                },
            ],
        };

        this.gridEngine.create(officeTilemap, gridEngineConfig);
        this.add.text(10, 10, " Visitor");
        this.gridEngine.moveRandomly("npc0", 0, 1);
        this.gridEngine.moveRandomly("npc1", 500, 2);

        this.physics.add.overlap(playerSprite, npcSprite, (player, npc) => this.handleInteraction(player, npc, 'npc0'), null, this);
        this.physics.add.overlap(playerSprite, npcSprite1, (player, npc) => this.handleInteraction(player, npc, 'npc1'), null, this);
        this.physics.add.overlap(playerSprite, npcSprite2, (player, npc) => this.handleInteraction(player, npc, 'npc2'), null, this);
        this.physics.add.overlap(playerSprite, npcSprite3, (player, npc) => this.handleInteraction(player, npc, 'npc3'), null, this);
        this.physics.add.overlap(playerSprite, npcSprite4, (player, npc) => this.handleInteraction(player, npc, 'npc4'), null, this);

        EventBus.emit("current-scene-ready", this);
    }

    update() {
        const cursors = this.input.keyboard.createCursorKeys();
        if (cursors.left.isDown) {
            this.gridEngine.move("player", "left");
        } else if (cursors.right.isDown) {
            this.gridEngine.move("player", "right");
        } else if (cursors.up.isDown) {
            this.gridEngine.move("player", "up");
        } else if (cursors.down.isDown) {
            this.gridEngine.move("player", "down");
        }
    }

    handleInteraction(player, npc, npcId) {
        const message = this.interactionMessages[npcId];

        // Remove previous text to avoid overlapping text
        if (this.conversationBubble) {
            this.conversationBubble.destroy();
        }

        if (npcId === 'npc4') {
            // Create a speech bubble for npc4
            const bubbleWidth = 200;
            const bubbleHeight = 50;
            const bubblePadding = 10;
            const bubble = this.add.graphics({ x: player.x, y: player.y - bubbleHeight - 20 });

            // Draw a speech bubble shape
            bubble.fillStyle(0xffffff, 1);
            bubble.fillRoundedRect(0, 0, bubbleWidth, bubbleHeight, 16);
            bubble.lineStyle(4, 0x565656, 1);
            bubble.strokeRoundedRect(0, 0, bubbleWidth, bubbleHeight, 16);

            // Add the URL text
            const urlText = this.add.text(bubble.x + bubblePadding, bubble.y + bubblePadding, message, {
                fontSize: '16px',
                fill: '#0000ff',
                wordWrap: { width: bubbleWidth - bubblePadding * 2 },
                resolution: 2 // Higher resolution for sharper text
            }).setInteractive({ useHandCursor: true });

            // Make the text clickable
            urlText.on('pointerdown', () => {
                window.open(message.split(' ').pop(), '_blank');
            });

            // Store the conversation bubble to remove later
            this.conversationBubble = bubble;
        } else {
            // Create sharp text with higher resolution for other NPCs
            this.conversationBubble = this.add.text(player.x, player.y - 20, message, {
                fontSize: '16px',
                fill: '#000',
                resolution: 2 // Higher resolution for sharper text
            });
        }
    }

    changeScene() {
        this.scene.start("GameOver");
    }
}
