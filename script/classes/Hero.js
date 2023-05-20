import { collisionDetection } from "../utils/collisionDetection.js";

export default class Hero {
    constructor (world, pos) {
        this.ctx = world.ctx;
        this.world = world;
        this.renderer = world.renderer;
        this.pos = pos; // pos.x pos.y

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
        this.draw();
    }

    checkHorizontalColision() {
        this.world.level.forEach(({x:blockX, y:blockY}) => {
            if (!collisionDetection(this.pos, {x: blockX, y: blockY})) return;
            this.vel.xAbs = 0;
            if (blockX - 0.1 > this.pos.x) {
                this.pos.x = blockX - 1.003;
                return; // stop itteration for perfs
            } if (blockX + 0.1 < this.pos.x) {
                this.pos.x = blockX + 1.003;
                return; // stop itteration for perfs
            }
        })
    }
    
    checkVerticalColision() {
        this.world.level.forEach(({x:blockX, y:blockY}) => { // with blocks
            if (!collisionDetection(this.pos, {x: blockX, y: blockY})) return;
            this.jumping = false; // if hit ceil jump again possible (need to try whith real levels in future) (so for now it's not a mistake)
            if (this.vel.y > 0) {
                this.pos.y = blockY - 1.01;
                return; // stop itteration for perfs
            } if (this.vel.y < 0) {
                this.vel.y = 0;
                this.pos.y = blockY + 1.003;
                return; // stop itteration for perfs
            }
        })
        if (this.pos.y <= 0) { // with ground collision
            this.jumping = false;
            this.pos.y = 0;
            this.vel.y = 0;
        }
    }

    draw = () => {
        const {x:rx, y:ry} = this.renderer.calculateCoords(this.pos);
        this.ctx.fillStyle = "blue";
        this.ctx.fillRect(rx, ry, this.renderer.blockSize, this.renderer.blockSize);
    }
}