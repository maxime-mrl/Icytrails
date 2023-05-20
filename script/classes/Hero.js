export default class Hero {
    constructor (world, pos) {
        this.ctx = world.ctx;
        this.world = world;
        this.renderer = world.renderer;
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
        this.collisionBlock();

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
        this.vel.y -= this.vel.g*delay/1000;
        this.pos.y += this.vel.y*delay/1000;
    }

    vCollision = () => {
        if (this.pos.y <= 0) {
            this.jumping = false;
            this.pos.y = 0
            this.vel.y = 0
        }
    }

    collisionBlock = () => {
        this.world.level.forEach(({x:blockX, y:blockY, t:type}) => {
            if (type != "a") return;
            if (
                ( // x collision
                    blockX >= this.pos.x && blockX < this.pos.x + 1 ||
                    blockX < this.pos.x && blockX + 1 > this.pos.x
                ) &&
                (// y collision
                    blockY >= this.pos.y - 1 && blockY < this.pos.y + 0.5
                )
                ) 
            {
                const {x:rx, y:ry} = this.renderer.calculateCoords({x: blockX,y:blockY});
                if (blockY > this.pos.y - 0.9) {
                    this.vel.xAbs = 0
                    if (this.pos.x + 0.5 > blockX) {
                        this.ctx.fillStyle = "red";
                        this.pos.x = blockX + 1.002
                    } else {
                        this.ctx.fillStyle = "purple"
                        this.pos.x = blockX - 1.002
                    }
                } else if (blockX > this.pos.x  - 0.01 && blockX - 1 < this.pos.x - 0.01) {
                    console.log(`x: ${blockX}; player pos: ${this.pos.x}`)
                    console.log("ok")
                    this.jumping = false;
                    this.pos.y = blockY + 1
                    this.vel.y = 0
                    this.ctx.fillStyle = "green";
                }
                this.ctx.fillRect(rx, ry, this.renderer.blockSize, this.renderer.blockSize)
            }
        });
    }

    draw = () => {
        const {x:rx, y:ry} = this.renderer.calculateCoords(this.pos);
        this.ctx.fillStyle = "blue";
        this.ctx.fillRect(rx, ry, this.renderer.blockSize, this.renderer.blockSize)
    }
}