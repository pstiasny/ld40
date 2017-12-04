import Phaser from 'phaser'
import { centerGameObjects } from '../utils'

export default class extends Phaser.State {
  init () {}

  preload () {
    this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg')
    this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar')
    centerGameObjects([this.loaderBg, this.loaderBar])

    this.load.setPreloadSprite(this.loaderBar)
    //
    // load your assets
    //
    this.load.spritesheet('katana', 'assets/images/katana.png', 40, 46)
    this.load.spritesheet('guy', 'assets/images/guy.png', 20, 40)
    this.load.spritesheet('violet', 'assets/images/violet.png', 20, 40)
    this.load.spritesheet('red', 'assets/images/red.png', 20, 40)
    this.load.image('cemetery', 'assets/images/cemetery.png')
    this.load.spritesheet('bar', 'assets/images/bar.png', 1, 2, 2)
    this.load.spritesheet('splat', 'assets/images/splat.png', 5, 5)
    this.load.image('rifle', 'assets/images/rifle.png')

    this.load.audio('track1', ['assets/music/t1.mp3']);
    this.load.audio('track2', ['assets/music/t2.mp3']);
    this.load.audio('track3', ['assets/music/t3.mp3']);
    this.load.audio('track4', ['assets/music/t4.mp3']);
  }

  create () {
    this.state.start('Intro')
  }
}
