import Renderer from "./classes/Renderer.js";
import Hero from "./classes/Hero.js";
fetch('/script/level3.json')
    .then(resp => resp.json())
    .then(data => new World(data));


class World {
    constructor(level) {
        this.canvas = document.getElementById("game-canvas");
        this.ctx = this.canvas.getContext("2d");
        this.level = level;
        this.key = "";
        this.renderer = new Renderer(this);
        this.player = new Hero(this, {
            x: 0,
            y: 3
        });
        document.addEventListener("keydown", this.keyDown)
        document.addEventListener("keyup", this.keyUp)
    }

    update = (delay) => {
        this.level.forEach(({x,y,t:type}) => {
            const {x:rx, y:ry} = this.renderer.calculateCoords({x,y});
            switch (type) {
                case "block":
                    this.ctx.fillRect(rx, ry, this.renderer.blockSize, this.renderer.blockSize)
                    break;
                case "a":
                    this.ctx.fillRect(rx, ry, this.renderer.blockSize, this.renderer.blockSize)
                    break;
            }

        });
        this.player.update(delay);
    }

    keyDown = ({key}) => {
        switch (key) {
            case " ": case "ArrowUp": case "z": case "w":
                if (this.player.jumping) break;
                this.player.jumping = true;
                this.player.vel.y = this.player.vel.jump + (this.player.vel.xAbs) * 0.08;
                break;
            case "d": case "ArrowRight":
                this.player.vel.dir = 1;
                this.player.vel.mdir = 1;
                break;
            case "a": case "q": case "ArrowLeft":
                this.player.vel.dir = -1;
                this.player.vel.mdir = -1;
                break;
            default: console.log(key)
        }
    }
    keyUp = ({key}) => {
        switch (key) {
            case "d": case "ArrowRight":
                if (this.player.vel.dir == 1) this.player.vel.dir = 0;
                break;
            case "a": case "q": case "ArrowLeft":
                if (this.player.vel.dir == -1) this.player.vel.dir = 0;
                break;
            default: console.log(key)
        }
    }
}

