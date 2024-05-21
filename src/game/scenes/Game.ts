import { Collision } from "matter";
import { EventBus } from "../EventBus";
import { Scene } from "phaser";

export class Game extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameText: Phaser.GameObjects.Text;

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

        // officeTilemap.createLayer('floor', tileset);
        // const wallsLayer = officeTilemap.createLayer('walls', tileset);
        // wallsLayer?.setCollisionByProperty({ collides: true });

        for (let i = 0; i < officeTilemap.layers.length; i++) {
          const layer = officeTilemap.createLayer(i, tileset, 0, 0);
          layer.setScale(1); // Adjust scale if needed
        }
        const playerSprite = this.add.sprite(0, 0, "player");
        playerSprite.setScale(1.5);
        this.cameras.main.startFollow(playerSprite, true);
        this.cameras.main.setFollowOffset(
          -playerSprite.width,
          -playerSprite.height,
        );
        
        const gridEngineConfig = {
          characters: [
            {
              id: "player",
              sprite: playerSprite,
              walkingAnimationMapping: 6,
              startPosition: { x: 20, y: 40 },
            },
          ],
        };
        
        this.gridEngine.create(officeTilemap, gridEngineConfig);
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
