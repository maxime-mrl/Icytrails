export default class Hero {
    constructor (world, pos) {
        this.ctx = world.ctx;
        this.world = world;
        this.renderer = world.renderer;
        this.pos = pos;
        this.vel = {
            xAbs: 0, // horizontal velocity
            xMax: 20, // max velocity
            dir: 0, // direction of this velocity (calculation)
            mdir: 0, // memory velocity for movement
            y: 0, // vertical velocity
            jump: 1000, // acceleration when jump
            increment: { // acceleration/deceleration of horizontal velocity
                acc: 3,
                slow: 5,
            },
            g: 500 // gravity
        }
        this.jumping = false;
    }

    update = (delay) => {
        if (this.vel.dir != 0) {
            this.vel.xAbs += (this.vel.increment.acc * delay / 1000) * (this.vel.xMax - this.vel.xAbs);
        } else {
            this.vel.xAbs -= (this.vel.increment.slow * delay / 1000) * this.vel.xAbs;
        }
        console.log(this.vel.xAbs)
        this.pos.x += this.vel.xAbs * delay/1000 * this.vel.mdir;
        this.draw()
    }

    draw = () => {
        const {x:rx, y:ry} = this.renderer.calculateCoords(this.pos);
        this.ctx.fillStyle = "blue";
        this.ctx.fillRect(rx, ry, this.renderer.blockSize, this.renderer.blockSize)
    }
}