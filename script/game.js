import Renderer from "./classes/Renderer.js";
import Hero from "./classes/Hero.js";
fetch('/script/level-4-b.json') // get the level
    .then(resp => resp.json())
    .then(data => new World(data));

class World {
    constructor(level) {
        this.canvas = document.getElementById("game-canvas");
        this.ctx = this.canvas.getContext("2d");
        this.level = level;
        this.level.fg.push({ x: level.end.x, y: level.end.y, t: 98 })
        this.translate = { x: 0, y: 0 };
        this.max = {
            x: Math.max.apply(Math, this.level.fg.map(elem => elem.x), this.level.end.x),
            y: Math.max.apply(Math, this.level.fg.map(elem => elem.y), this.level.end.x)
        };
        this.score = 0;
        this.renderer = new Renderer(this);
        this.player = new Hero(this, this.level.spawn); // in the future spawn point will be set in editor
        // listener for movements
        document.addEventListener("keydown", this.keyDown);
        document.addEventListener("keyup", this.keyUp);
    }

    respawn = () => {
        setTimeout(() => {
            this.player = {
                update: () => {},
                dead: true
            }
        }, 1000,);
        setTimeout(() => {
            this.translate = { x: 0, y: 0 };
            this.player = new Hero(this, this.level.spawn)
        }, 2000);
    }

    update = (delay) => {
        this.ctx.translate(this.translate.x * this.renderer.blockSize, this.translate.y * this.renderer.blockSize); // translate the canvas
        // draw blocks
        this.level.bg.forEach(({ x,y,t:type }) => {
            type = parseInt(type);
            const texture = this.renderer.blockTextures.get(type);
            this.renderer.drawBlock(texture, {x,y});
        });
        this.level.fg.forEach(({ x,y,t:type }) => {
            type = parseInt(type);
            const texture = this.renderer.blockTextures.get(type);
            this.renderer.drawBlock(texture, {x,y});
        });
        // update player
        this.player.update(delay);
    }

    keyDown = ({key}) => {
        if (this.player.dead) return;
        switch (key) {
            case " ": case "ArrowUp": case "z": case "w":
                if (this.player.jumping || this.player.jumpMem) {
                    this.player.jumpMem = true;
                    break;
                };
                this.player.jump()
                break;
            case "d": case "ArrowRight":
                this.player.vel.dir = 1;
                this.player.vel.mdir = 1;
                break;
            case "a": case "q": case "ArrowLeft":
                this.player.vel.dir = -1;
                this.player.vel.mdir = -1;
                break;
        }
    }
    keyUp = ({key}) => {
        if (this.player.dead) return;
        switch (key) {
            case " ": case "ArrowUp": case "z": case "w":
                this.player.jumpMem = false;
                break;
            case "d": case "ArrowRight":
                if (this.player.vel.dir == 1) this.player.vel.dir = 0;
                break;
            case "a": case "q": case "ArrowLeft":
                if (this.player.vel.dir == -1) this.player.vel.dir = 0;
                break;
        }
    }
}

