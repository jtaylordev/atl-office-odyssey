import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class Game extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameText: Phaser.GameObjects.Text;
    player;
    cursors;
    interact;
    label;

    constructor ()
    {
        super('Game');
    }
    preload() {
        
    }
    create() 
    {
        this.camera = this.cameras.main.setSize(1024, 768);
        this.label = this.add.text(0, 0, '(x, y)', { fontFamily: '"Monospace"'});

        const map = this.make.tilemap({ key: 'dungeon' });
        const tileset = map.addTilesetImage('indoor_tileset', 'tiles');

        map.createLayer('Ground', tileset);
        const wallsLayer = map.createLayer('Walls', tileset);
        wallsLayer?.setCollisionByProperty({ collides: true })
        const debugGraphics = this.add.graphics().setAlpha(0.7);
        wallsLayer?.renderDebug(debugGraphics, {
            tileColor: null,
            collidingTileColor: new Phaser.Display.Color(243, 234, 48, 255),
            faceColor: new Phaser.Display.Color(40, 39, 37, 255)
        })

        this.cursors = this.input.keyboard?.createCursorKeys();
        this.interact = this.input.keyboard?.addKey('SPACE')
        this.player = this.physics.add.sprite(50, 60, 'man')
        this.physics.add.collider(this.player, wallsLayer);

        this.cameras.main.startFollow(this.player);

        EventBus.emit('current-scene-ready', this)
    }
    update()
    {
        this.label.setText('(' + this.player.x + ', ' + this.player.y + ')');
        this.player.setVelocity(0);
        
        if (this.cursors.left.isDown)
        {
            this.player.setVelocityX(-100)
        } 
        else if (this.cursors.right.isDown)
        {
            this.player.setVelocityX(100)
        }

        if (this.cursors.down.isDown)
        {
            this.player.setVelocityY(100)
        } 
        else if (this.cursors.up.isDown)
        {
            this.player.setVelocityY(-100)
        }

        if (this.player.x == 168 && this.player.y == 40)
        {
            if (this.interact.isDown)
            {
                window.open('https://google.com', '_blank')
            }
        }
        
    }
    changeScene ()
    {
        this.scene.start('GameOver');
    }
}
