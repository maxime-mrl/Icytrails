import Renderer from "./classes/Renderer.js";

class World {
    constructor() {
        this.canvas = document.getElementById("game-canvas");
        this.ctx = this.canvas.getContext("2d");
        this.level = [];
        this.renderer = new Renderer(this);
        this.mouse = { x: 0, y: 0 }; // mouse position over canvas
        this.pos = { x: 0, y: 0 }; // real pos
        this.translate = { x: 0, y: 0 }; // translate amount
        // listening stuffs
        this.canvas.addEventListener("mousemove", this.mouseEvent);
        this.canvas.addEventListener("click", this.clickEvent);
        document.addEventListener("keydown", this.keyPressed);
    }

    mouseEvent = ({clientX, clientY}) => { // mouse movement get canvas relative coordinates
        let rect = this.canvas.getBoundingClientRect();
        this.mouse.x = Math.round((clientX - rect.left - this.renderer.blockSize / 2) / this.renderer.blockSize); // get coordinate in block unit w/ mous at center
        this.mouse.y = Math.round((rect.bottom - clientY  - this.renderer.blockSize / 2) / this.renderer.blockSize); // y from the bottom
    }

    clickEvent = (e) => { // add block on click
        this.level.push({
            x: this.pos.x,
            y: this.pos.y,
            t: "a"
        });
        console.log(this.level)
    }
    
    keyPressed = ({key}) => { // handle canvas translate based on key
        switch (key) {
            case " ": case "ArrowUp": case "z": case "w":
                this.translate.y++;
                break;
            case "ArrowDown": case "s":
                this.translate.y--;
                break;
            case "d": case "ArrowRight":
                this.translate.x--;
                break;
            case "a": case "q": case "ArrowLeft":
                this.translate.x++;
                break;
        }
        if (this.translate.x > 0) this.translate.x = 0;
        if (this.translate.y < 0) this.translate.y = 0;
    }

    update = () => { // udate, draw etc
        // update pos
        this.pos.x = this.mouse.x - this.translate.x;
        this.pos.y = this.mouse.y + this.translate.y;
        // line draw
        this.ctx.fillStyle = "#00000050";
        for (let y = 0; y < 50; y++) { // horizontal
            const {x:rx, y:ry} = this.renderer.calculateCoords({x: 0,y});
            this.ctx.fillRect(0, ry, this.canvas.width, 1);
        }
        for (let x = 0; x < 50; x++) { // vertical
            const {x:rx, y:ry} = this.renderer.calculateCoords({x,y:0});
            this.ctx.fillRect(rx, 0, 1, this.canvas.height);
        }
        // block and highlight drawing
        this.ctx.translate(this.translate.x * this.renderer.blockSize, this.translate.y * this.renderer.blockSize);
        this.ctx.fillStyle = "#000000";
        this.level.forEach(({x,y,t:type}) => { // blocks
            const {x:rx, y:ry} = this.renderer.calculateCoords({x,y});
            switch (type) {
                case "block":
                    this.ctx.fillRect(rx, ry, this.renderer.blockSize, this.renderer.blockSize);
                    break;
                case "a":
                    this.ctx.fillRect(rx, ry, this.renderer.blockSize, this.renderer.blockSize);
                    break;
            }
        });
        // mouse position highlight
        const {x:rx, y:ry} = this.renderer.calculateCoords({x: this.pos.x ,y: this.pos.y});
        this.ctx.fillStyle = "#ff000050";
        this.ctx.fillRect(rx, ry, this.renderer.blockSize, this.renderer.blockSize);
    }
}

const world = new World();
