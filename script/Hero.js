export default class Hero {
    constructor (world, pos) {
        this.ctx = world.ctx;
        this.world = world;
        this.renderer = world.renderer;
        this.blockSize = world.renderer
        this.pos = pos;
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
        this.updatePos(delay);
        this.vCollision();

        console.log(this.vel.y)
        this.pos.x += this.vel.xAbs * delay/1000 * this.vel.mdir;
        this.draw()
    }

    updatePos = (delay) => {
        // horizontal
        if (this.vel.dir != 0) {
            this.vel.xAbs += (this.vel.increment.acc * delay / 1000) * (this.vel.xMax - this.vel.xAbs);
        } else {
            this.vel.xAbs -= (this.vel.increment.slow * delay / 1000) * this.vel.xAbs;
        }
        // vertical
        if (this.jumping) {
            this.vel.y -= this.vel.g*delay/1000;
            this.pos.y += this.vel.y*delay/1000;
        }
    }

    vCollision = () => {
        if (this.pos.y <= 0) {
            this.jumping = false;
            this.pos.y = 0
            this.vel.y = 0
        }
    }

    draw = () => {
        const {x:rx, y:ry} = this.renderer.calculateCoords(this.pos);
        this.ctx.fillStyle = "blue";
        this.ctx.fillRect(rx, ry, this.renderer.blockSize, this.renderer.blockSize)
    }
}