import { collisionDetection } from "../utils/collisionDetection.js";

export default class Hero {
    constructor (world, pos) {
        this.ctx = world.ctx;
        this.world = world;
        this.renderer = world.renderer;
        this.sprites = world.renderer.heroSprites;
        this.pos = {
            x: pos.x,
            y: pos.y,
            width: 0.7,
            height: 0.8,
        }; // pos.x pos.y
        this.hitBox = {
            pos: {x: this.pos.x, y: this.pos.y},
            width: 0.7,
            height: 0.8,
        }

        this.vel = {
            xAbs: 0, // horizontal velocity
            xMax: 30, // max velocity
            dir: 0, // direction of this velocity (calculation)
            mdir: 0, // memory velocity for movement
            y: 0, // vertical velocity
            jump: 20, // acceleration when jump
            increment: { // acceleration/deceleration of horizontal velocity
                acc: 3,
                slow: 5,
            },
            g: 100 // gravity
        }
        this.jumping = false;

        // sprite
        this.frameTime = 75; // for 20 fps
        this.currentFrame = 0;
        this.elapsed = 0;
        this.currentSprite = this.sprites.idle; // should be temporary we'll see...
    }

    update = (delay) => {
        // horizontal position update
        if (this.vel.dir != 0) this.vel.xAbs += (this.vel.increment.acc * delay / 1000) * (this.vel.xMax - this.vel.xAbs);
        else this.vel.xAbs -= (this.vel.increment.slow * delay / 1000) * this.vel.xAbs;
        this.pos.x += this.vel.xAbs * delay/1000 * this.vel.mdir;
        // horizontal colision check
        this.checkHorizontalColision();
        // vertical position update
        this.vel.y -= this.vel.g*delay/1000;
        this.pos.y += this.vel.y*delay/1000;
        // vertical collision check
        this.checkVerticalColision();
        // draw
        this.updateFrames(delay)
        this.renderer.drawSprite(this.currentSprite, this.currentFrame, this.pos);
        this.updateHitBox();
        this.drawHitbox();
    }

    updateFrames(delay) {
        this.elapsed += delay;
        if (this.elapsed > this.frameTime) {
            if (this.currentFrame < this.currentSprite.frameNb - 1) this.currentFrame++;
            else this.currentFrame = 0;
            this.elapsed = 0;
        }
    }
    drawHitbox() {
        this.ctx.fillStyle = "#ff000050"
        const {x:rx, y:ry} = this.renderer.calculateCoords({
            x: this.hitBox.pos.x,
            y: this.hitBox.pos.y
        });
        this.ctx.fillRect(rx, ry, this.hitBox.width * this.renderer.blockSize, this.hitBox.height * this.renderer.blockSize);
    }
    
    updateHitBox() {
        this.hitBox.pos.x = this.pos.x + (1 - this.hitBox.width) / 2;
        this.hitBox.pos.y = this.pos.y - (1 - this.hitBox.height) / 2;
    }

    checkHorizontalColision() {
        this.updateHitBox();
        this.world.level.forEach(({x:blockX, y:blockY}) => {
            if (!collisionDetection(this.hitBox, {x: blockX, y: blockY})) return;
            this.vel.xAbs = 0;
            if (blockX - 0.1 > this.hitBox.pos.x) {
                this.pos.x = blockX - 1.003 + (1 - this.hitBox.width) / 2;
                return; // stop itteration for perfs
            } if (blockX + 0.1 <  this.hitBox.pos.x) {
                this.pos.x = blockX + 1.003 - (1 - this.hitBox.width) / 2;
                return; // stop itteration for perfs
            }
        })
    }
    
    checkVerticalColision() {
        this.updateHitBox();
        this.world.level.forEach(({x:blockX, y:blockY}) => { // with blocks
            if (!collisionDetection(this.hitBox, {x: blockX, y: blockY})) return;
            this.jumping = false; // if hit ceil jump again possible (need to try whith real levels in future) (so for now it's not a mistake)
            if (this.vel.y > 0) {
                this.pos.y = blockY - 1.01 + (1 - this.hitBox.height) / 2;
                return; // stop itteration for perfs
            } if (this.vel.y < 0) {
                this.vel.y = 0;
                this.pos.y = blockY + 1.003 - (1 - this.hitBox.height) / 2;
                return; // stop itteration for perfs
            }
        })
        if (this.pos.y <= 0) { // with ground collision
            this.jumping = false;
            this.pos.y = 0;
            this.vel.y = 0;
        }
    }
}