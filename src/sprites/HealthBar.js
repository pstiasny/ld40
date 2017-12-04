import Phaser from 'phaser'

export default class extends Phaser.Sprite {
  constructor ({ game, x, y }) {
    super(game, x, y);
    this.anchor.setTo(0.5, 0.5);

    this._width = 20;

    this.bg = this.game.make.sprite(0, 0, 'bar')
    this.bg.frame = 1;
    this.bg.scale.x = this._width;
    this.addChild(this.bg);

    this.red = this.game.make.sprite(0, 0, 'bar')
    this.red.frame = 0;
    this.red.scale.x = 10;
    this.addChild(this.red);
  }

  updateBar(r) {
    this.red.scale.x = this._width * r;
  }
}
