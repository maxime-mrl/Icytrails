import Renderer from "./classes/Renderer.js";
const level = [];

class World {
    constructor(level) {
        this.canvas = document.getElementById("game-canvas");
        this.ctx = this.canvas.getContext("2d");
        this.level = level;
        this.renderer = new Renderer(this);
    }

    update = (delay) => {
        this.level.forEach((row, y) => {
            row.forEach((type, x) => {
                const {x:rx, y:ry} = this.renderer.calculateCoords({x,y});
                switch (type) {
                    case "block":
                        this.ctx.fillRect(rx, ry, this.renderer.blockSize, this.renderer.blockSize)
                        break;
                    case "a":
                        this.ctx.fillRect(rx, ry, this.renderer.blockSize, this.renderer.blockSize)
                        break;
                }
            })
        });

        for (let y = 0; y < 50; y++) {
            const {x:rx, y:ry} = this.renderer.calculateCoords({x: 0,y});
            this.ctx.fillRect(0, ry, this.canvas.width, 1)
        }
        for (let x = 0; x < 50; x++) {
            const {x:rx, y:ry} = this.renderer.calculateCoords({x,y:0});
            this.ctx.fillRect(rx, 0, 1, this.canvas.height)
        }
    }
}

const world = new World(level)
