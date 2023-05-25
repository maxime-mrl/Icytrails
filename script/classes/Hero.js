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
            pos: { x: this.pos.x, y: this.pos.y },
            width: 0.7,
            height: 0.8,
        }
        this.camera = {
            pos: { x: this.pos.x, y: this.pos.y },
            width: 10,
            height: 4.5,
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
                slow: 8,
            },
            g: 100 // gravity
        }
        this.jumping = false;
        this.jumpMem = false;

        // sprite
        this.frameTime = 75; // for 20 fps
        this.currentFrame = 0;
        this.elapsed = 0;
        this.currentSprite = this.sprites.idle; // should be temporary we'll see...
    }

    update = (delay) => {
        if (this.jumpMem && !this.jumping) this.jump(); // jump feels way better by keeping input while jumping (except if key is released)
        // horizontal position update
        if (this.vel.dir != 0) this.vel.xAbs += (this.vel.increment.acc * delay / 1000) * (this.vel.xMax - this.vel.xAbs);
        else this.vel.xAbs -= (this.vel.increment.slow * delay / 1000) * this.vel.xAbs;
        this.pos.x += this.vel.xAbs * delay/1000 * this.vel.mdir;
        this.updateCamera(delay);
        // horizontal colision check
        this.checkHorizontalColision();
        // vertical position update
        this.vel.y -= this.vel.g*delay/1000;
        this.pos.y += this.vel.y*delay/1000;
        // vertical collision check
        this.checkVerticalColision();
        // draw
        this.updateSpriteFrames(delay)
        this.renderer.drawSprite(this.currentSprite, this.currentFrame, this.pos);
        this.updateHitBox();
        this.drawDebug();
    }

    updateCamera = (delay) => {
        // update camera pos
        this.camera.pos.x = this.hitBox.pos.x + (1 - this.camera.width) / 2;
        this.camera.pos.y = this.hitBox.pos.y - (1 - this.camera.height) / 2; // minus bcz Y is calculated from bottom

        // box side coordinate
        const left = this.camera.pos.x;
        const right = this.camera.pos.x + this.camera.width;
        const bottom = this.camera.pos.y + (1 - this.camera.height);
        const top = this.camera.pos.y + 1;
        // maximum x world translate
        const maxX = this.world.max.x - (this.world.canvas.width / this.renderer.blockSize) + 1;

        // change translate for horizontal
        if (left + this.world.translate.x <= 0 && this.vel.mdir < 0) this.world.translate.x += this.vel.xAbs * delay/1000; // left
        else if ((right + this.world.translate.x) * this.renderer.blockSize >= this.world.canvas.width && this.vel.mdir > 0) this.world.translate.x -= this.vel.xAbs * delay/1000; // right
        // change translate for vertical
        if (bottom - this.world.translate.y <= 0 && this.vel.y < 0) this.world.translate.y += this.vel.y * delay/1000; // bottom
        else if ((top - this.world.translate.y) * this.renderer.blockSize >= this.world.canvas.height && this.vel.y > 0) this.world.translate.y += this.vel.y * delay/1000; // top
        
        // translate limits
        if (this.world.translate.x > 0) this.world.translate.x = 0; // left
        if (-this.world.translate.x > maxX) this.world.translate.x = -maxX; // right
        if (this.world.translate.y < 0) this.world.translate.y = 0; // bottom
    }

    updateSpriteFrames(delay) { // update hero sprite
        // select sprite
        if (this.vel.xAbs > 5 && /walk|idle/.test(this.currentSprite.name)) this.currentSprite = this.sprites.walk;
        else if (/walk|idle/.test(this.currentSprite.name)) this.currentSprite = this.sprites.idle;
        // updates sprite frames
        this.elapsed += delay;
        if (this.elapsed > this.frameTime) {
            if (this.currentFrame < this.currentSprite.frameNb - 1) this.currentFrame++;
            else this.currentFrame = 0;
            this.elapsed = 0;
        }
    }
    
    updateHitBox() { // update Hitbox position
        this.hitBox.pos.x = this.pos.x + (1 - this.hitBox.width) / 2;
        this.hitBox.pos.y = this.pos.y - (1 - this.hitBox.height) / 2; // minus bcz Y is calculated from bottom
    }

    checkHorizontalColision() {
        this.updateHitBox(); // check w/ hitbox so make sure it's up to date
        this.world.level.fg.forEach(({x:blockX, y:blockY}) => {
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
        // check limits
        if (this.hitBox.pos.x < 0) this.pos.x = 0 - (1 - this.hitBox.width) / 2;
        if (this.hitBox.pos.x + this.hitBox.width > this.world.max.x + 1) this.pos.x = this.world.max.x + (1 - this.hitBox.width) / 2;
    }
    
    checkVerticalColision() {
        this.jumping = true;
        this.updateHitBox(); // check w/ hitbox so make sure it's up to date
        this.world.level.fg.forEach(({x:blockX, y:blockY}) => { // with blocks
            if (!collisionDetection(this.hitBox, {x: blockX, y: blockY})) return;
            if (this.vel.y > 0) {
                this.vel.y = 0;
                this.pos.y = blockY - 1.003 + (1 - this.hitBox.height) / 2;
                return; // stop itteration for perfs
            } if (this.vel.y <= 0) {
                this.jumping = false; // if hit ceil jump again possible (need to try whith real levels in future) (so for now it's not a mistake)
                this.vel.y = 0;
                this.pos.y = blockY + 1.003 - (1 - this.hitBox.height) / 2;
                return; // stop itteration for perfs
            }
        })
        // check ground limits
        if (this.pos.y <= 0) {
            this.jumping = false;
            this.pos.y = 0 - (1 - this.hitBox.height) / 2;
            this.vel.y = 0;
        }
    }
    

    jump = () => {
        this.jumping = true;
        this.jumpMem = false;
        this.vel.y = this.vel.jump + (this.vel.xAbs) * 0.08; // jump a bit higher when going quick
    }

    drawDebug() { // temp
        // camera
        this.ctx.fillStyle = "#00ff0050"
        const {x:crx, y:cry} = this.renderer.calculateCoords({
            x: this.camera.pos.x,
            y: this.camera.pos.y
        });
        this.ctx.fillRect(crx, cry, this.camera.width * this.renderer.blockSize, this.camera.height * this.renderer.blockSize);
        // hitbox
        this.ctx.fillStyle = "#ff000050"
        const {x:hrx, y:hry} = this.renderer.calculateCoords({
            x: this.hitBox.pos.x,
            y: this.hitBox.pos.y
        });
        this.ctx.fillRect(hrx, hry, this.hitBox.width * this.renderer.blockSize, this.hitBox.height * this.renderer.blockSize);
    }
}