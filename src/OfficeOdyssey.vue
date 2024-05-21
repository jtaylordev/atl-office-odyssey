<script setup>
import Phaser from 'phaser';
import GridEngine from './GridEngine';

export class OfficeOdyssey extends Phaser.Scene {
    constructor() {
        super('OfficeOdyssey');
    }

    preload() {
        this.load.image('tiles', '../public/assets/cloud_tileset.png');
        this.load.tilemapTiledJSON('map', '../public/assets/cloud_city.json');
        this.load.spritesheet('player', '../public/assets/characters.png')
    }
}