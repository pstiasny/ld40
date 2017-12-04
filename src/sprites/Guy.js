import Phaser from 'phaser'

export default class extends Phaser.Sprite {
    constructor ({ game, x, y }) {
        super(game, x, y, 'guy');
        this.anchor.setTo(0.5, 1);
        this.animations.add('idle', [0, 1, 2], 10, true);
        this.animations.add('jump', [3], 10, true);
        this.animations.add('walkr', [4, 5, 6, 7, 8, 9, 10, 11], 15, true);
        this.animations.play('idle');

        game.physics.enable(this, Phaser.Physics.ARCADE);
        this.body.bounce.y = 0;
        this.body.collideWorldBounds = true;

        let katana = this.katana = this.game.make.sprite(0, 0, 'katana')
        katana.anchor.setTo(0.25, 1);
        katana.frame = 3;
        katana.animations.add('strike', [0, 1, 2], 10);
        game.physics.enable(katana, Phaser.Physics.ARCADE);
        katana.body.moves = false;
        katana.body.setSize(24, 8, 15, 24);
        this.addChild(katana);

        this.katanaDamage = 10;

        this.pushDir = 1;
        this.stop();

        this.health = 300;
        this.maxHealth = 300;

        this.enemies = [];
        this.striking = false;
        this.katanaAnim = this.katana.animations.getAnimation('strike');
        this.katanaAnim.onComplete.add(() => {
            this.katana.frame = 3;
        });

        let emitter = this.hurtEmitter = this.game.add.emitter(
            this.world.x,
            this.world.y - 24,
            100);
        emitter.makeParticles('splat', [0, 1, 2, 3], 1000, true, true);
        emitter.gravity = 100;
        emitter.setXSpeed(-10, 10);
        emitter.setYSpeed(-150, 10);
        emitter.setRotation(0, 0);
        emitter.bounce.setTo(0, 0);
    }

    damage(x) {
        super.damage(x);
        this.hurtEmitter.emitX = this.world.x
        this.hurtEmitter.emitY = this.world.y - 23;
        this.hurtEmitter.start(true, 750, null, 10);
    }

    update () {
        super.update();
        if (this.striking && this.katana.frame == 1) {
            this.striking = false;
            this.game.physics.arcade.overlap(this.katana, this.enemies,
                (l, r) => this.katanaHit(l, r));
        }
    }

    katanaHit(katana, enemy) {
        //enemy.receivePush(100 * this.pushDir);
        enemy.damage(this.katanaDamage);

        let emitter = this.game.add.emitter(
            //this.world.x + (20 * this.pushDir),
            enemy.world.x,
            this.world.y - 24,
            100);
        emitter.makeParticles('splat', [0, 1, 2, 3], 1000, true, true);
        emitter.gravity = 100;
        emitter.setXSpeed(20 * this.pushDir, 50 * this.pushDir);
        emitter.setYSpeed(-150, 10);
        emitter.setRotation(0, 0);
        emitter.bounce.setTo(0, 0);
        //emitter.minParticleSpeed = 30;
        //emitter.maxParticleSpeed = 60;
        emitter.start(true, 750, null, 10);
        game.time.events.add(2000, () => {emitter.destroy()}, this);
    }

    walkLeft() {
        if (this.hitUntil > this.game.time.now)
            return
        this.body.velocity.x = -50;
        if (this.body.onFloor())
            this.animations.play('walkr');
        this.scale.x = -1;
        this.katana.body.setSize(24, 8, - 20, 24);
        this.pushDir = -1;
    }

    walkRight() {
        if (this.hitUntil > this.game.time.now)
            return
        this.body.velocity.x = 50;
        if (this.body.onFloor())
            this.animations.play('walkr');
        this.scale.x = 1;
        this.katana.body.setSize(24, 8, 15, 24);
        this.pushDir = 1;
    }

    stop() {
        if (this.hitUntil > this.game.time.now)
            return
        this.body.velocity.x = 0;
        if (this.body.onFloor())
            this.animations.play('idle');
    }

    strike() {
        if (this.katanaAnim.isPlaying || this.hitUntil > this.game.time.now)
            return;
        this.striking = true;
        this.katanaAnim.play();
    }

    kill() {
        this.game.state.start('Dead');
    }

    receivePush(v) {
        this.body.velocity.x = v;
        this.hitUntil = this.game.time.now + 100;
    }

    jump() {
        this.body.velocity.y = -150;
        this.animations.play('jump');
    }
}
