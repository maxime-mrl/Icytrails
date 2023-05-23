import Renderer from "./classes/Renderer.js";
const blockSelector = document.querySelector(".blocks-select")

class World {
    constructor() {
        this.canvas = document.getElementById("game-canvas");
        this.ctx = this.canvas.getContext("2d");
        this.level = [];
        this.selectedBlock = "00"
        this.renderer = new Renderer(this, "windowed");
        this.addBlocksToSelector();
        this.mouse = { x: 0, y: 0 }; // mouse position over canvas
        this.pos = { x: 0, y: 0 }; // real pos
        this.translate = { x: 0, y: 0 }; // translate amount
        this.clicked = false;
        // listening stuffs
        this.canvas.addEventListener("mousemove", this.mouseEvent);
        this.canvas.addEventListener("mousedown", (e) => { this.mouseEvent(e); this.clicked = true });
        this.canvas.addEventListener("mouseup", (e) => { this.mouseEvent(e); this.clicked = false });
        document.addEventListener("keydown", this.keyPressed);
    }

    addBlocksToSelector = () => {
        this.renderer.blockTextures.forEach(texture => {
            blockSelector.appendChild(texture.image)
        })
    }

    mouseEvent = ({clientX, clientY}) => { // mouse movement get canvas relative coordinates
        let rect = this.canvas.getBoundingClientRect();
        // for tiled width of the canvas dosen't correspond to real width
        let widthRatio = this.canvas.width / rect.width;
        let heightRatio = this.canvas.height / rect.height;
        this.mouse.x = Math.round(( (clientX - rect.left -(this.renderer.blockSize / 2)) / this.renderer.blockSize ) * widthRatio); // get coordinate in block unit w/ mous at center
        this.mouse.y = Math.round(( (rect.bottom - clientY  - this.renderer.blockSize / 2) / this.renderer.blockSize ) * heightRatio); // y from the bottom
        this.mouse.x = Math.max(0, this.mouse.x);
        this.mouse.y = Math.max(0, this.mouse.y);

        // add blocks
        if (!this.clicked) return;
        const toAdd = {
            x: this.pos.x,
            y: this.pos.y,
            t: this.selectedBlock
        };
        const potentialDouble = this.level.findIndex(block => block.x == toAdd.x && block.y == toAdd.y);
        if (potentialDouble != -1) {
            if (potentialDouble.t == toAdd.t) return;
            this.level.splice(potentialDouble, 1);
        }
        this.level.push(toAdd);
        console.log(this.level);
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
        this.pos.x = Math.abs(this.mouse.x - this.translate.x);
        this.pos.y = Math.abs(this.mouse.y + this.translate.y);
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
            const texture = this.renderer.blockTextures.find(texture => texture.type == type)
            this.renderer.drawBlock(texture.image, {x,y})
        });
        // mouse position highlight
        const {x:rx, y:ry} = this.renderer.calculateCoords({x: this.pos.x ,y: this.pos.y});
        this.ctx.fillStyle = "#ff000050";
        this.ctx.fillRect(rx, ry, this.renderer.blockSize, this.renderer.blockSize);
    }
}

const world = new World();
