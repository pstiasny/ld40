import Phaser from 'phaser'
import HealthBar from '../sprites/HealthBar'

export default class extends Phaser.Sprite {
    constructor ({ game, x, y, player, actualSprite, health, walkSpeed }) {
        super(game, x, y);

        this._walkSpeed = walkSpeed;

        this.actualSprite = actualSprite;
        this.addChild(this.actualSprite);

        this.anchor.setTo(0.5, 1);
        this.actualSprite.anchor.setTo(0.5, 1);
        game.physics.enable(this, Phaser.Physics.ARCADE);
        this.actualSprite.body.moves = false;
        this.body.bounce.y = 0;
        this.body.collideWorldBounds = true;
        this.actualSprite.animations.add('walk', [0, 1, 2], 5, true);
        this.actualSprite.animations.add('death', [3, 4, 5], 5, false);

        this.attackHitbox = this.game.make.sprite(0, 0);
        this.addChild(this.attackHitbox);
        game.physics.enable(this.attackHitbox, Phaser.Physics.ARCADE);
        this.attackHitbox.body.moves = false;

        this.walk();
        this._player = player;
        this.facePlayer();

        this.health = health;
        this.maxHealth = health;
        this.healthBar = new HealthBar({
            game, x: -10, y: -42, trackHealth: this
        })
        this.addChild(this.healthBar);
    }

    update() {
        if (!this.alive) {
            this.body.velocity.setTo(0,0);
            return;
        }

        this.healthBar.updateBar(this.health / this.maxHealth);
    }

    kill() {
        this.alive = false;
        this.body.enable = false;
        //this.exists = false;
        //this.visible = false;
        this.actualSprite.animations.play('death');
        this.healthBar.kill();

        if (this.events)
        {
            this.events.onKilled$dispatch(this);
        }

        return this;
    }

    faceLeft() {
        this.facing = -1;
        this.actualSprite.scale.x = 1;
    }

    faceRight() {
        this.facing = 1;
        this.actualSprite.scale.x = -1;
    }

    facePlayer() {
        let playerRel = this._player.position.x - this.position.x;
        if (playerRel > 0)
            this.faceRight();
        else
            this.faceLeft();
    }

    walk() {
        this.actualSprite.animations.play('walk');
        this.body.velocity.x = this.facing * this._walkSpeed;
    }

    walkBack() {
        this.actualSprite.animations.play('walk');
        this.body.velocity.x = -1 * this.facing * this._walkSpeed;
    }

    stop() {
        this.actualSprite.animations.stop();
        this.frame = 0;
        this.body.velocity.x = 0
    }

    receivePush(v) {
        this.body.velocity.x = v;
        this.hitUntil = this.game.time.now + 100;
    }
}
