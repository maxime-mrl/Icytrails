import Renderer from "./classes/Renderer.js";
const level = [];

class World {
    constructor(level) {
        this.canvas = document.getElementById("game-canvas");
        this.ctx = this.canvas.getContext("2d");
        this.level = level;
        this.renderer = new Renderer(this);
        this.pos = {x:0,y:0}
        this.canvas.addEventListener("mousemove", this.mouseEvent)
        this.canvas.addEventListener("click", this.clickEvent)
    }

    mouseEvent = ({clientX, clientY}) => {
        let rect = this.canvas.getBoundingClientRect();
        this.pos.x = Math.round((clientX - rect.left - this.renderer.blockSize / 2) / this.renderer.blockSize); // get coordinate in block unit w/ mous at center
        this.pos.y = Math.round((rect.bottom - clientY  - this.renderer.blockSize / 2) / this.renderer.blockSize); // y from the bottom
    }

    clickEvent = (e) => {
        level.push({
            x: this.pos.x,
            y: this.pos.y,
            type: "a"
        })
    }

    update = () => {
        this.level.forEach(({x,y,type}) => {
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
        this.ctx.fillStyle = "#00000050"
        for (let y = 0; y < 50; y++) {
            const {x:rx, y:ry} = this.renderer.calculateCoords({x: 0,y});
            this.ctx.fillRect(0, ry, this.canvas.width, 1)
        }
        for (let x = 0; x < 50; x++) {
            const {x:rx, y:ry} = this.renderer.calculateCoords({x,y:0});
            this.ctx.fillRect(rx, 0, 1, this.canvas.height)
        }
        const {x:rx, y:ry} = this.renderer.calculateCoords({x: this.pos.x ,y: this.pos.y});
        this.ctx.fillStyle = "#ff000050"
        this.ctx.fillRect(rx, ry, this.renderer.blockSize, this.renderer.blockSize)
    }
}

const world = new World(level)
