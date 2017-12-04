import BadGuy from '../sprites/BadGuy'


export default class extends BadGuy {
    constructor ({ game, x, y, player, red, redRelative }) {
        super({
            game, x, y, player,
            actualSprite: game.make.sprite(0, 0, 'violet'),
            health: 100,
            walkSpeed: 20,
        });
        this._red = red;
        this._keepRedRelative = redRelative;
    }

    update () {
        super.update();
        if (!this.alive) return;

        let playerRel = this._player.position.x - this.position.x;
        let redRel = this._red.x - this.x;
        //if (playerRel > 0 && playerRel < 20) {
        if (this.hitUntil > this.game.time.now)
            return

        this.facePlayer();
        let shouldYield = false;
        this._player.enemies.forEach((other) => {
            if (other !== this &&
                other.alive &&
                (Math.abs(other.x - this._player.x) < Math.abs(playerRel)) &&
                (Math.abs(other.x - this.x) < 20))
                shouldYield = true;
        });

        if (this.game.physics.arcade.overlap(this.attackHitbox, this._player)) {
            this.stop();
            if (this.primingPush && this.primingPush < this.game.time.now) {
                this._player.receivePush(Math.sign(playerRel) * 300);
                this._player.damage(5);
                this.primingPush = null;
            } else if (!this.primingPush) {
                this.primingPush = this.game.time.now + 500;
            }
        } else if (shouldYield) {
            // yield if bad guys get clustered
            this.primingPush = null;
            this.stop();
        } else {
            this.primingPush = null;
            this.walk();
        }

        //console.log(this, this._player.enemies)
    }

    faceLeft() {
        super.faceLeft();
        this.attackHitbox.body.setSize(20, 10, -20, -10);
    }

    faceRight() {
        super.faceRight();
        this.attackHitbox.body.setSize(20, 10, 0, -10);
    }

}
