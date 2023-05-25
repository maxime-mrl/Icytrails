import Renderer from "./classes/Renderer.js";
const blockSelector = document.querySelector(".blocks-select");
const blockCategories = {
    solid: blockSelector.querySelector(".solid .blocks"),
    top: blockSelector.querySelector(".top-solid .blocks"),
    bg: blockSelector.querySelector(".background .blocks"),
    kill: blockSelector.querySelector(".kill .blocks"),
    others: blockSelector.querySelector(".specials .blocks"),
}

class World {
    constructor() {
        this.canvas = document.getElementById("game-canvas");
        this.ctx = this.canvas.getContext("2d");
        this.level = {
            spawn: {x: 0, y: 0},
            end: {x: 1, y: 0},
            blocks: []
        };
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
        this.renderer.blockTextures.forEach((texture, code) => {
            code = parseInt(code);
            if (code < 20) {
                blockCategories.solid.appendChild(texture);
            } else if (code < 30) {
                blockCategories.top.appendChild(texture);
            } else if (code < 70) {
                blockCategories.bg.appendChild(texture)
            } else if (code < 80) {
                blockCategories.kill.appendChild(texture)
            } else if (code != 98) { // star for the end is renderer differently on editors (code 81)
                blockCategories.others.appendChild(texture)
            }
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
        // specials
        if (
            this.selectedBlock == "95" &&
            this.pos.x != this.level.end.x &&
            this.pos.y != this.level.end.y
        ) this.level.spawn = { x: this.pos.x, y:this.pos.y };
        
        if (this.selectedBlock == "96" &&
        this.pos.x != this.level.spawn.x &&
        this.pos.y != this.level.spawn.y
        ) this.level.end = { x: this.pos.x, y:this.pos.y };

        if (parseInt(this.selectedBlock) >= 95) {
            const toErase = this.level.blocks.findIndex(block => block.x == this.pos.x && block.y == this.pos.y);
            if (toErase != -1) this.level.blocks.splice(toErase, 1);
            return;
        };
        // normal
        const toAdd = {
            x: this.pos.x,
            y: this.pos.y,
            t: this.selectedBlock
        };
        if ((toAdd.x == this.level.spawn.x && toAdd.y == this.level.spawn.y) || (toAdd.x == this.level.end.x && toAdd.y == this.level.end.y)) return; // check that's not on spawn nor end point
        const potentialDouble = this.level.blocks.findIndex(block => block.x == toAdd.x && block.y == toAdd.y);
        if (potentialDouble != -1) {
            if (potentialDouble.t == toAdd.t) return;
            this.level.blocks.splice(potentialDouble, 1);
        }
        this.level.blocks.push(toAdd);
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
        this.level.blocks.forEach(({x,y,t:type}) => { // blocks
            if (type == "80") return;
            const texture = this.renderer.blockTextures.get(type)
            this.renderer.drawBlock(texture, {x,y})
        });
        // spawn and end draw
        this.renderer.drawBlock(this.renderer.blockTextures.get("95"), this.level.spawn);
        this.renderer.drawBlock(this.renderer.blockTextures.get("96"), this.level.end);
        // mouse position highlight
        this.ctx.globalAlpha = 0.4;
        this.renderer.drawBlock(this.renderer.blockTextures.get(this.selectedBlock), this.pos);
    }
}

const world = new World();
