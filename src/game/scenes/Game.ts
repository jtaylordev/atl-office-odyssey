import { EventBus } from "../EventBus";
import { Scene } from "phaser";

export class Game extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameText: Phaser.GameObjects.Text;
    conversationBubble: Phaser.GameObjects.Text;

    constructor() {
        super("Game");
    }

    preload() {
      this.load.image("fantasy", "../../assets/fantasy.bmp");
      this.load.tilemapTiledJSON(
        "office-map",
        "../../assets/office-map.json",
      );
      this.load.spritesheet("player", "../../assets/characters.png", {
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

        this.cameras.main.startFollow(playerSprite, true);
        this.cameras.main.setFollowOffset(
            -playerSprite.width,
            -playerSprite.height
        );

        const npcSprite = this.add.sprite(0, 0, "player");
        npcSprite.scale = 1;

        const npcSprite1 = this.add.sprite(0, 0, "player");
        npcSprite1.scale = 1;
        const npcSprite2 = this.add.sprite(0, 0, "player");
        npcSprite2.scale = 1;

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
            ],
        };

        // this.gridEngine.create(cloudCityTilemap, gridEngineConfig);

        // this.gridEngine.moveRandomly("npc0", 0, 1);
        // this.gridEngine.moveRandomly("npc1", 500, 2);

        this.gridEngine.create(officeTilemap, gridEngineConfig);
        this.add.text(10, 10, " dick")
        this.gridEngine.moveRandomly("npc0", 0, 1);
        this.gridEngine.moveRandomly("npc1", 500, 2);
        
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

    changeScene() {
        this.scene.start("GameOver");
    }
}
function getRandomInt(arg0: number, arg1: number): number {
    throw new Error("Function not implemented.");
}
