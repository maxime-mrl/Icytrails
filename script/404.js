import Renderer from "./classes/Renderer.js";
import Hero from "./classes/Hero.js";
new FontFace("atma", "../asset/fonts/Atma-Bold.ttf"); // import font

fetch('/script/404.json') // get 404 "level"
    .then(resp => resp.json())
    .then(data => new World(data));

class World {
    constructor(level) {
        this.canvas = document.getElementById("game-canvas");
        this.ctx = this.canvas.getContext("2d");
        this.level = level;
        this.texts = level.text;
        console.log(this.texts)
        this.translate = { x: 0, y: 0 };
        this.memSpeed = 0;
        this.moving = true;

        // level read and initialization
        this.max = Math.max.apply(0, this.level.fg.map(elem => elem.x)); // level x border

        this.renderer = new Renderer(this);
        this.player = new Hero(this, {x:4,y:2});
        this.player.vel.mdir = 1;
        this.player.vel.jump = 15;
        this.player.vel.g = 60;
        // listener for movements
    }

    update = (delay) => {
        // update speed
        if (this.moving) this.player.vel.xAbs = 4;
        this.memSpeed = this.player.vel.xAbs;
        // draw blocks
        this.level.bg.forEach( ({ x,y,t:type }) => this.renderer.drawBlock(this.renderer.blockTextures.get(type), {x,y}) );
        this.level.fg.forEach( ({ x,y,t:type }) => this.renderer.drawBlock(this.renderer.blockTextures.get(type), {x,y}) );
        // update player
        this.player.update(delay);
        
        // simulate movement

        if (this.player.vel.xAbs < this.memSpeed / 2 && !this.player.jumping) this.player.jump(); // auto jump
        if (Math.random() > 0.998 && !this.player.jumping && this.moving) {
            this.player.jump();
            this.moving = false;
        }
        if (Math.random() > 0.99) {
            this.moving = true;
        } else if (Math.random() < 0.005) {
            this.moving = false;
        }
        if (Math.random() * Math.random() > 0.998) this.player.vel.mdir = 1;
        else if (Math.random() < 0.0015) this.player.vel.mdir = -1;
        // movement limit
        if (this.player.pos.x < 2) this.player.vel.mdir = 1;
        else if (this.player.pos.x > 20) this.player.vel.mdir = -1;
        // text
        this.drawText();
    }

    drawText = () => {
        this.ctx.font = `${this.renderer.blockSize}px atma`;
        this.ctx.fillStyle = "#F3EFF5";
        this.ctx.shadowColor="#022e3c";
        this.ctx.shadowBlur = this.renderer.blockSize*0.03;
        this.ctx.shadowOffsetX = this.renderer.blockSize*0.06;
        this.ctx.shadowOffsetY = this.renderer.blockSize*0.06;
        this.texts.forEach(({ content:txt, x, y}) => {
            let { x:rx, y:ry } = this.renderer.calculateCoords({ x, y });

            const txtSize = this.ctx.measureText(txt);
            rx = rx - txtSize.width/2;
            this.ctx.fillText(txt, rx, ry);
        })

    }

    // key input events
    keyDown = ({key}) => {
        if (this.player.dead) return;
        switch (key) {
            case " ": case "ArrowUp": case "z": case "w": // jump
                if (this.player.jumping || this.player.jumpMem) {
                    this.player.jumpMem = true;
                    break;
                };
                this.player.jump()
                break;
            case "d": case "ArrowRight": // right
                this.player.vel.dir = 1;
                this.player.vel.mdir = 1;
                break;
            case "a": case "q": case "ArrowLeft": // left
                this.player.vel.dir = -1;
                this.player.vel.mdir = -1;
                break;
        }
    }
    keyUp = ({key}) => {
        if (this.player.dead) return;
        switch (key) {
            case " ": case "ArrowUp": case "z": case "w": // cancel jump
                this.player.jumpMem = false;
                break;
            case "d": case "ArrowRight": // stop right
                if (this.player.vel.dir == 1) this.player.vel.dir = 0;
                break;
            case "a": case "q": case "ArrowLeft": // stop left
                if (this.player.vel.dir == -1) this.player.vel.dir = 0;
                break;
        }
    }
}
