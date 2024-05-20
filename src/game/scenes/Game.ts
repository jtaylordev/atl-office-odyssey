import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class Game extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameText: Phaser.GameObjects.Text;

    constructor ()
    {
        super('Game');
    }
    preload() {
        this.load.image('tiles', '../assets/tileset.png')
        this.load.tilemapTiledJSON('map', '../assets/map.json')
    }
    create() {
        // Create the tilemap
        const map = this.make.tilemap({ key: 'map' });
        // Add tileset image to the map
        const tileset = map.addTilesetImage('tileset', 'tiles');
        // Create a layer using the tileset
        const layer = map.createLayer('Tile Layer 1', tileset, 0, 0);

    }

    changeScene ()
    {
        this.scene.start('GameOver');
    }
}
