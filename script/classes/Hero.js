import collisionDetection from "../utils/collisionDetection.js";
import createSprites from "../utils/createSprites.js"
import Camera from "./Camera.js";
const sprites = [
    "idle",
    "death",
    "walk",
    "blink",
    "jump",
];

export default class Hero {
    constructor (world, pos) {
        this.ctx = world.ctx;
        this.world = world;
        this.renderer = world.renderer;

        // positions
        this.pos = { x: pos.x, y: pos.y };
        this.hitBox = {
            pos: { x: this.pos.x, y: this.pos.y },
            width: 0.7, height: 0.8,
        };

        this.vel = {
            xAbs: 0, // horizontal velocity
            xMax: 20, // max velocity
            dir: 0, // direction of this velocity (calculation)
            mdir: 0, // memory velocity for movement
            y: 0, // vertical velocity
            jump: 20, // acceleration when jump
            increment: { // acceleration/deceleration of horizontal velocity
                acc: 3,
                slow: 8,
            },
            g: 100 // gravity
        };
        this.jumping = false;
        this.jumpMem = false;
        this.dead = false;

        //camera
        this.camera = new Camera(this);

        // sprites
        this.sprites = createSprites(sprites);
        this.frameTime = 75; // duration of frames in ms
        this.currentFrame = 0; // frames number
        this.elapsed = 0; // ms elapsed since curent frame
        this.currentSprite = this.sprites.idle; // start by idling
    }

    update = (delay) => {
        if (!this.dead) { // only if alive
            if (this.jumpMem && !this.jumping) this.jump(); // jump feels way better by keeping input while jumping (except if key is released)
            this.updateHorizontalPos(delay);
            this.camera.update(delay);
            this.checkHorizontalColision();
            this.updateVerticalPos(delay);
            this.checkVerticalColision();
            this.checkColisionEvents();
        } // alive or dead
        // draw
        this.updateSpriteFrames(delay);
        this.renderer.drawSprite(this.currentSprite, this.currentFrame, this.pos);
        // this.updateHitBox();
        // this.drawDebug();
    }

    updateSpriteFrames(delay) { // update hero sprite
        // select sprite
        if (this.vel.xAbs > 5 && /walk|idle|blink/.test(this.currentSprite.name)) this.currentSprite = this.sprites.walk; // when idling if move walk
        else if (/walk|idle/.test(this.currentSprite.name)) this.currentSprite = this.sprites.idle; // when idling no movement = idle
        else if ((this.currentSprite.name == "blink" && this.currentFrame == this.currentSprite.frameNb - 1) || (!this.jumping && this.currentSprite.name == "jump")) { // when blink cycle end or when jumping end return to idle
            this.elapsed = 0;
            this.currentFrame = 0;
            this.currentSprite = this.sprites.idle;
        }
        else if (this.currentSprite.name == "death" && this.currentFrame == this.currentSprite.frameNb - 1) return this.world.respawn(); // respawn when death anim finished
        if (this.currentSprite.name == "idle" && Math.random() > 0.98 && this.currentFrame == 0) { // blink if idle at random time
            this.currentFrame = 0;
            this.elapsed = 0;
            this.currentSprite = this.sprites.blink;
        }
       if (this.jumping && this.vel.y < -1 && !this.dead) this.currentSprite = this.sprites.jump; // jumping => jump sprite

        // updates sprite frames
        this.elapsed += delay;
        if (this.elapsed > this.frameTime) {
            if (this.currentFrame < this.currentSprite.frameNb - 1) this.currentFrame++;
            else this.currentFrame = 0;
            this.elapsed = 0;
        }
    }
    
    updateHitBox = () => { // update Hitbox position
        this.hitBox.pos.x = this.pos.x + (1 - this.hitBox.width) / 2;
        this.hitBox.pos.y = this.pos.y - (1 - this.hitBox.height) / 2; // minus bcz Y is calculated from bottom
    }

    checkHorizontalColision = () => {
        this.updateHitBox(); // check w/ hitbox so make sure it's up to date
        this.world.level.fg.forEach(({x:blockX, y:blockY, t:type}) => {
            if (type >= 20) return; // no horizontal colision for slabs
            if (!collisionDetection(this.hitBox, {x: blockX, y: blockY})) return;
            this.vel.xAbs = 0;
            if (blockX - 0.1 > this.hitBox.pos.x) return this.pos.x = blockX - 1.003 + (1 - this.hitBox.width) / 2;
            if (blockX + 0.1 <  this.hitBox.pos.x) return this.pos.x = blockX + 1.003 - (1 - this.hitBox.width) / 2;
        })

        // check limits
        if (this.hitBox.pos.x < 0) this.pos.x = 0 - (1 - this.hitBox.width) / 2;
        if (this.hitBox.pos.x + this.hitBox.width > this.world.max + 1) this.pos.x = this.world.max + (1 - this.hitBox.width) / 2;
    }
    
    checkVerticalColision = () => {
        const halfPlatTolerance = 0.65 + this.vel.y/100;
        this.jumping = true;
        this.updateHitBox(); // check w/ hitbox so make sure it's up to date
        this.world.level.fg.forEach(({x:blockX, y:blockY, t:type}) => {
            if (type > 30) return; // with blocks and slabs
            if (!collisionDetection(this.hitBox, {x: blockX, y: blockY})) return;

            if (this.vel.y > 0 && type < 20) {
                this.vel.y = 0;
                this.pos.y = blockY - 1.003 + (1 - this.hitBox.height) / 2;
                return; // stop itteration for perfs
            } if (this.vel.y < 0 && (type < 20 || blockY + halfPlatTolerance < this.pos.y)) { // (type < 20 || blockY + 0.6 < this.pos.y) allow to test for plates to only colide from top part
                this.jumping = false;
                this.vel.y = 0;
                this.pos.y = blockY + 1.003 - (1 - this.hitBox.height) / 2;
                return; // stop itteration for perfs
            }
        })
        // check ground
        if (this.pos.y <= 0) {
            this.jumping = false;
            this.pos.y = 0 - (1 - this.hitBox.height) / 2;
            this.vel.y = 0;
        }
    }

    checkColisionEvents = () => {
        this.updateHitBox(); // check w/ hitbox so make sure it's up to date
        this.world.level.fg.forEach(({x:blockX, y:blockY, t:type}, index) => {
            if (!collisionDetection(this.hitBox, {x: blockX, y: blockY})) return;
            if (type >= 70 && type < 80 && blockY + 0.2 > this.pos.y) { // death
                this.dead = true;
                this.currentFrame = 0;
                this.elapsed = 0;
                this.currentSprite = this.sprites.death;
                return;
            } else if (type == 80) { // score increase
                this.world.score++;
                this.world.level.fg.splice(index, 1);
                return;
            } else if (type == 81) { // checkpoint
                this.world.level.fg.splice(index, 1);
                this.world.level.spawn = { x: blockX, y: blockY }
            } else if (type == 98) { // succes
                this.world.level.fg.splice(index, 1);
                this.world.succes()
                return;
            }
        })
    }
    

    jump = () => {
        this.jumping = true;
        this.jumpMem = false;
        this.vel.y = this.vel.jump + (this.vel.xAbs) * 0.08; // jump a bit higher when going quick
        this.currentFrame = 0;
        this.elapsed = 0;
        this.currentSprite = this.sprites.jump;
    }

    updateHorizontalPos = (delay) => {
        if (this.vel.dir != 0) this.vel.xAbs += (this.vel.increment.acc * delay / 1000) * (this.vel.xMax - this.vel.xAbs);
        else this.vel.xAbs -= (this.vel.increment.slow * delay / 1000) * this.vel.xAbs;
        this.pos.x += this.vel.xAbs * delay/1000 * this.vel.mdir;
    }

    updateVerticalPos = (delay) => {
        this.vel.y -= this.vel.g*delay/1000;
        this.pos.y += this.vel.y*delay/1000;
    }

    drawDebug() { // temp
        // camera
        const camera = this.camera.camera;
        this.ctx.fillStyle = "#00ff0050";
        const {x:crx, y:cry} = this.renderer.calculateCoords({
            x: camera.pos.x,
            y: camera.pos.y
        });
        this.ctx.fillRect(crx, cry, camera.width * this.renderer.blockSize, camera.height * this.renderer.blockSize);
        // hitbox
        this.ctx.fillStyle = "#ff000050";
        const {x:hrx, y:hry} = this.renderer.calculateCoords({
            x: this.hitBox.pos.x,
            y: this.hitBox.pos.y
        });
        this.ctx.fillRect(hrx, hry, this.hitBox.width * this.renderer.blockSize, this.hitBox.height * this.renderer.blockSize);
    }
}