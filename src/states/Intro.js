/* globals __DEV__ */
import Phaser from 'phaser'

export default class extends Phaser.State {
    init () {}
    preload () {}

    create () {
        let t = this.add.text(this.world.centerX, this.world.centerY, 'Avenging Patricia Dare');
        t.anchor.setTo(0.5);
        t = this.game.add.text(
            this.world.centerX, this.world.centerY + 20,
            'Press SPACE to start',
            { fontSize: 12 });
        t.anchor.setTo(0.5);

        this.restartKey = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
        this.restartKey.onDown.add(() => {
            this.state.start('Game');
        });
    }

    render () {
    }

    update() {
    }
}
