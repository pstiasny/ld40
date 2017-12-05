/* globals __DEV__ */
import Phaser from 'phaser'
import Guy from '../sprites/Guy'
import Purple from '../sprites/Purple'
import Red from '../sprites/Red'

export default class extends Phaser.State {
    init () {}
    preload () {}

    create () {
        this.physics.startSystem(Phaser.Physics.ARCADE);
        this.physics.arcade.gravity.y = 250 ;
        this.world.setBounds(0, 0, 480, 218);

        this.sound.stopAll();

        this.musicTracks = [
            this.add.audio('track1'),
            this.add.audio('track2'),
            this.add.audio('track3'),
            this.add.audio('track4'),
        ];
        
        this.selectedMusicTrack = 0;
        this.nowPlaying = null;
        game.sound.setDecodedCallback(this.musicTracks, () => {
            this.switchTrack();
        });

        this.bg = this.add.sprite(0, 0, 'cemetery');
        this.guy = new Guy({game, x: 280, y: 217});
        this.katana = this.guy.katana;
        this.add.existing(this.guy);

        let enemies = this.enemies = [];
        this.guy.enemies = enemies;


        this.cursors = game.input.keyboard.createCursorKeys();
        this.jumpKey = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
        this.attackKey = game.input.keyboard.addKey(Phaser.KeyCode.Z);

        this.restartKey = game.input.keyboard.addKey(Phaser.KeyCode.R);
        this.restartKey.onDown.add(() => {
            this.state.restart();
        });


        this.attackKey.onDown.add(() => {
            this.guy.strike();
        })

        this.healthText = this.game.add.text(10, 240, '100%', {
            fill: '#ffffff',
            fontSize: 12,
        });

        this.wave = 0;
        this.nextWave();

    }

    switchTrack() {
        let t = this.musicTracks[this.selectedMusicTrack];
        if (t !== this.nowPlaying) {
            if (this.nowPlaying) this.nowPlaying.stop()
            t.loopFull();
        }
        t.onLoop.addOnce(() => {
            this.switchTrack();
        });
    }

    render () {
        if (__DEV__) {
            //game.debug.body(this.katana);
            //game.debug.body(this.guy);
            //this.guy.enemies.forEach(e => {
                //game.debug.body(e.attackHitbox);
            //});
        }
    }

    update() {
        const cursors = this.cursors;

        if (this.jumpKey.isDown && this.guy.body.onFloor())
            this.guy.jump();
        else if (cursors.left.isDown)
            this.guy.walkLeft();
        else if (cursors.right.isDown)
            this.guy.walkRight();
        else
            this.guy.stop();

        let allDead = true;
        if (this.enemies.length == 0) allDead = false;
        this.enemies.forEach(e => { if (e.alive) allDead = false; });

        if (allDead)
            this.nextWave();

        this.healthText.text = 'HP: ' + this.guy.health + '/' + this.guy.maxHealth;
    }

    nextWave() {
        this.wave++;
        this.selectedMusicTrack = (this.wave - 1) % this.musicTracks.length;

        let enemies = this.enemies;
        let red = new Red({
            game: this.game,
            x: 90,
            y: 217,
            player: this.guy,
        })
        this.game.add.existing(red)
        enemies.push(red);
        for (let i = 1; i <= this.wave; ++i) {
            let purple = new Purple({
                game: this.game,
                x: 100 + 20 * i,
                y: 217,
                player: this.guy,
                red: red,
                redRelative: 20 * i,
            })
            this.game.add.existing(purple)
            enemies.push(purple);
        }
    }
}
