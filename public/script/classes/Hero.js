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
        this.collisionsCheck = [];

        // positions
        this.pos = { x: pos.x, y: pos.y };
        this.hitBox = {
            pos: { x: this.pos.x, y: this.pos.y },
            width: 0.5, height: 0.7,
        };
        this.showHitbox = false;

        this.vel = {
            xAbs: 0, // horizontal velocity
            xMax: 20, // max velocity
            dir: 0, // direction of this velocity (calculation)
            mdir: 0, // memory velocity for movement
            y: 0, // vertical velocity
            jump: 19.4, // acceleration when jump
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
        this.sprites = createSprites();
        this.frameTime = 75; // duration of frames in ms
        this.currentFrame = 0; // frames number
        this.elapsed = 0; // ms elapsed since curent frame
        this.currentSprite = this.sprites.idle; // start by idling
    }

    update = (delay) => {
        if (!this.dead) { // only if alive
            if (this.jumpMem && !this.jumping) this.jump(); // jump feels way better by keeping input while jumping (except if key is released)
            this.updateCollisionCheck()
            this.updateHorizontalPos(delay);
            this.camera.update(delay);
            this.checkHorizontalColision();
            this.updateVerticalPos(delay);
            this.checkVerticalColision(delay);
            this.updateSprites();
            this.checkColisionEvents();
        }
        // draw
        this.updateSpriteFrames(delay);
        this.renderer.drawSprite(this.currentSprite, this.currentFrame, this.pos);
        if (this.showHitbox) this.renderer.drawHitbox(this.hitBox);
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

    updateCollisionCheck = () => { // select only nearby blocks to calculates every specials collision only for them going forwards
        this.collisionsCheck = [];
        this.world.level.fg.forEach((block) => {
            if (
                this.hitBox.pos.y + 5 >= block.y &&
                this.hitBox.pos.y + (1 - this.hitBox.height) <= block.y + 5 &&
                this.hitBox.pos.x <= block.x + 5 &&
                this.hitBox.pos.x + this.hitBox.width + 5 >= block.x
            ) {
                this.collisionsCheck.push(block);
            };
        })
    }

    checkHorizontalColision = () => {
        this.updateHitBox(); // check w/ hitbox so make sure it's up to date
        this.collisionsCheck.forEach(({x, y, t}) => {
            if (t >= 20) return; // no horizontal colision for slabs
            if (!collisionDetection(this.hitBox, {x, y})) return;
            this.vel.xAbs = 0;
            if (x - 0.1 > this.hitBox.pos.x) return this.pos.x = x - 1.003 + (1 - this.hitBox.width) / 2;
            if (x + 0.1 <  this.hitBox.pos.x) return this.pos.x = x + 1.003 - (1 - this.hitBox.width) / 2;
        })

        // check limits
        if (this.hitBox.pos.x < 0) this.pos.x = 0 - (1 - this.hitBox.width) / 2;
        if (this.hitBox.pos.x + this.hitBox.width > this.world.max + 1) this.pos.x = this.world.max + (1 - this.hitBox.width) / 2;
    }
    
    checkVerticalColision = (delay) => {
        this.jumping = true;
        this.updateHitBox(); // check w/ hitbox so make sure it's up to date
        this.collisionsCheck.forEach(({x, y, t}) => {
        if (!collisionDetection(this.hitBox, {x, y})) return;
            if (t < 20) { // blocks
                if (this.vel.y > 0) { // top collision
                    this.vel.y = 0;
                    this.pos.y = y - 1.003 + (1 - this.hitBox.height) / 2;
                    return;
                }
                if (this.vel.y < 0) {
                    this.jumping = false;
                    this.vel.y = 0;
                    this.pos.y = y + 1.003 - (1 - this.hitBox.height) / 2;
                    return;
                }
            } else if (t < 30 && this.vel.y < 0 && y + 0.65 + this.vel.y*delay/800 < this.pos.y) { // slab -- only colides from top part
                this.jumping = false;
                this.vel.y = 0;
                this.pos.y = y + 1.003 - (1 - this.hitBox.height) / 2;
                return;
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
        this.collisionsCheck.forEach(({x:blockX, y:blockY, t:type}) => {
            if (!collisionDetection(this.hitBox, {x: blockX, y: blockY})) return;
            if (type >= 70 && type < 80 && blockY + 0.2 > this.pos.y) { // death
                this.dead = true;
                this.currentFrame = 0;
                this.elapsed = 0;
                this.currentSprite = this.sprites.death;
                return;
            } else if (type == 80) { // score increase
                this.world.score++;
                // remove from array
                const index = this.world.level.fg.findIndex(elem => (elem.x == blockX && elem.y == blockY && elem.t == type))
                this.world.level.fg.splice(index, 1);
                return;
            } else if (type == 81) { // checkpoint
                this.world.level.spawn = { x: blockX, y: blockY }
                // remove from array
                const index = this.world.level.fg.findIndex(elem => (elem.x == blockX && elem.y == blockY && elem.t == type))
                this.world.level.fg.splice(index, 1);
            } else if (type == 98) { // succes
                this.world.succes()
                // remove from array
                const index = this.world.level.fg.findIndex(elem => (elem.x == blockX && elem.y == blockY && elem.t == type))
                this.world.level.fg.splice(index, 1);
                return;
            }
        })
    }
    

    jump = () => {
        this.jumping = true;
        this.jumpMem = false;
        this.vel.y = this.vel.jump + this.vel.xAbs * 0.08; // jump a bit higher when going quick
        this.currentFrame = 0;
        this.elapsed = 0;
        this.currentSprite = this.sprites.jump;
    }

    updateHorizontalPos = (delay) => {
        if (this.vel.dir != 0) this.vel.xAbs += (this.vel.increment.acc) * (this.vel.xMax - this.vel.xAbs)  * delay / 1000;
        else this.vel.xAbs -= (this.vel.increment.slow * delay / 1000) * this.vel.xAbs;
        this.pos.x += this.vel.xAbs * delay/1000 * this.vel.mdir;
    }

    updateVerticalPos = (delay) => {
        // kind of better but still higher for the non laggy version
        const oldVel = this.vel.y;
        this.vel.y -= this.vel.g*delay/1000;
        this.pos.y += 0.5 * (this.vel.y + oldVel) * delay/1000;
    }
}

function createSprites() { // import sprites and create array of object with all usefull things
    if (memorySprites) return memorySprites; // dosen't recrate sprites if arleady exist
    const sprites = {};
    spritesSrcs.forEach(sprite => {
        const imageR = document.createElement("img");
        imageR.src = `/asset/texture/hero/${sprite}.png`;
        imageR.onload = () => sprites[sprite].frameNb = imageR.width/sprites[sprite].frameSize; // when image loaded set number of frames (we now frames size - 256px - so we devide width by frame size for the number)
        const imageL = document.createElement("img");
        imageL.src = `/asset/texture/hero/${sprite}_l.png`;
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