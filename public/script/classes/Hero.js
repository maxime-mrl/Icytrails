import collisionDetection from "../utils/collisionDetection.js";
import Camera from "./Camera.js";

const spritesSrcs = [
    "idle",
    "death",
    "walk",
    "blink",
    "jump",
];

let memorySprites = false; // keep sprites in memory so when death new hero dosen't reload sprites (which is cool for optimization)

export default class Hero {
    constructor (world, pos) {
        this.ctx = world.ctx;
        this.world = world;
        this.renderer = world.renderer;

        // positions
        this.pos = { x: pos.x, y: pos.y };
        this.hitBox = {
            pos: { x: this.pos.x, y: this.pos.y },
            width: 0.6, height: 0.8,
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
        this.sprites = this.createSprites();
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
            this.updateSprites();
            this.checkColisionEvents();
        }
        // draw
        this.updateSpriteFrames(delay);
        this.renderer.drawSprite(this.currentSprite, this.currentFrame, this.pos);
    }

    updateSprites() { // select sprite order of priority first if is more important than second etc
        if (this.jumping && this.currentSprite.name == "jump") this.currentSprite = this.sprites.jump; // jumping => jump sprite
        else if (this.vel.xAbs > 5) this.currentSprite = this.sprites.walk; // moving => walk sprite
        else if (this.currentSprite.name != "blink") { // idling => idle sprite and radom blink
            this.currentSprite = this.sprites.idle
            if (Math.random() > 0.98 && this.currentFrame == 0) { // blink at random time at first frame
                this.elapsed = 0;
                this.currentSprite = this.sprites.blink;
            }
        }
    }

    updateSpriteFrames(delay) {
        this.elapsed += delay;
        if (this.elapsed > this.frameTime) { // next frame
            this.elapsed = 0;
            if (this.currentFrame < this.currentSprite.frameNb - 1) this.currentFrame++; // normal add a frame
            else { // last frame reached => rreturn to 0 and reset special sprites animation
                if (this.currentSprite.name == "blink") this.currentSprite = this.sprites.idle; // when blink cycle end return to idle
                else if (this.currentSprite.name == "death") return this.world.respawn(); // respawn when death anim finished
                this.currentFrame = 0;
            }
        }
        // update side of the sprite
        if (this.vel.mdir < 0) this.currentSprite.sprite = this.currentSprite.lSprite;
        else this.currentSprite.sprite = this.currentSprite.rSprite;
    }
    
    updateHitBox = () => { // update Hitbox position
        this.hitBox.pos.x = this.pos.x + (1 - this.hitBox.width) / 2;
        this.hitBox.pos.y = this.pos.y - (1 - this.hitBox.height) / 2; // minus because Y is calculated from bottom
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

    createSprites = () => {
        if (memorySprites) return memorySprites; // dosen't recrate sprites if arleady exist
        const sprites = {};
        spritesSrcs.forEach(sprite => {
            // create image
            const imageR = document.createElement("img"); // right side image
            imageR.src = `/asset/texture/hero/${sprite}.png`;
            const imageL = document.createElement("img"); // left side image
            imageL.src = `/asset/texture/hero/${sprite}_l.png`;
            // set set number of frames on load
            imageR.onload = () => sprites[sprite].frameNb = imageR.width/sprites[sprite].frameSize; // (we know frames size = 256px so we devide width by frame size for the number)
            sprites[sprite] = {
                rSprite: imageR,
                lSprite: imageL,
                sprite: imageL,
                frameSize: 256,
                frameNb: 10, // random number waiting for image to load and be edited
                name: sprite,
            }
        });
        memorySprites = sprites; // register for memory
        return sprites;
    }
}