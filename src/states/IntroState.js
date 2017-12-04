/* globals __DEV__ */
import Phaser from 'phaser'

export default class extends Phaser.State {
    init () {}
    preload () {}

    create () {
        let t = this.add.text(10, 10, 'Avenging Patricia Dare');
        t = this.game.add.text(
            10, 50,
            'Press SPACE to start\n' +
            'Press P to adjust pixel scale\n' +
            'Controls:\n' +
            '  Arrow keys to move. SPACE to jump. SHIFT to attack.',
            { fontSize: 12 });

        this.restartKey = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
        this.restartKey.onDown.add(() => {
            this.state.start('Game');
        });

        this.scaleToggleKey = game.input.keyboard.addKey(Phaser.KeyCode.P);
        let pixelScale = 2;
        this.scaleToggleKey.onDown.add(() => {
            if (pixelScale < 4)
                pixelScale ++;
            else
                pixelScale = 2;
            this.game.scale.setUserScale(pixelScale, pixelScale);
        });

    }

    render () {
    }

    update() {
    }
}
