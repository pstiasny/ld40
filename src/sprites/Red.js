import BadGuy from '../sprites/BadGuy'


export default class extends BadGuy {
    constructor ({ game, x, y, player }) {
        super({
            game, x, y, player,
            actualSprite: game.make.sprite(0, 0, 'red'),
            health: 200,
            walkSpeed: 15,
        });

        this.gun = game.make.sprite(-12, -24, 'rifle');
        this.gun.anchor.setTo(0.5, 0.5);
        this.gun.visible = false;
        this.actualSprite.addChild(this.gun);
        this.lastStateSwitch = game.time.now;
        this.aimGraphics = game.add.graphics(0, 0);
        this.gunDistance = 150;
    }

    update () {
        super.update();
        if (!this.alive) return;

        let playerRel = this._player.position.x - this.position.x;
        let playerDist = Math.abs(playerRel);
        if (this.hitUntil > this.game.time.now)
            return

        this.facePlayer();
        //if (this.game.physics.arcade.overlap(this.attackHitbox, this._player)) {

        //if (this.gun.visible && this.lastStateSwitch + 1000 > game.time.now)
            //return;

        if (playerDist < 40) {
            this.walkBack();
            this.hideGun();
        } else if (playerDist < this.gunDistance) {
            this.stop();
            if (!this.gun.visible) {
                this.gun.visible = true;
                this.lastStateSwitch = game.time.now;
            }
            if (this.lastStateSwitch + 500 < game.time.now) {
                this.aim();
            }
            if (this.lastStateSwitch + 1000 < game.time.now) {
                this.shoot();
            }
        } else {
            this.walk();
            this.hideGun()
        }
    }

    hideGun() {
        this.aimGraphics.clear();
        this.gun.visible = false;
        this._aiming = false;
    }

    aim() {
        if (this._aiming) return;
        this._aiming = true;
        this.aimGraphics.clear();
        this.drawGunLine(0x370305);
    }

    drawGunLine(color) {
        let g = this.aimGraphics;
        g.lineStyle(1, color, 1);
        let y = Math.floor(this.gun.world.y) - 1;
        g.moveTo(this.gun.world.x, y);
        g.lineTo(this.gun.world.x + this.facing * this.gunDistance, y);
    }

    shoot() {
        console.log('bang!');
        if (this.game.physics.arcade.overlap(this.attackHitbox, this._player)) {
            this._player.damage(10);
        }
        this.hideGun();
    }

    kill() {
        this.gun.kill();
        this.aimGraphics.clear();
        super.kill();
    }

    faceLeft() {
        super.faceLeft();
        this.attackHitbox.body.setSize(this.gunDistance, 2, -14-this.gunDistance, -26)
    }

    faceRight() {
        super.faceRight();
        this.attackHitbox.body.setSize(this.gunDistance, 2, 14, -26)
    }
}
