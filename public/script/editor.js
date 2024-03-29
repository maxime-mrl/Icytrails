import Renderer from "./classes/Renderer.js";
import decompressLevel from "./utils/decompressLevel.js";

const blockSelector = document.querySelector(".blocks-select");
const blockCategories = {
    solid: blockSelector.querySelector(".solid .blocks"),
    top: blockSelector.querySelector(".top-solid .blocks"),
    bg: blockSelector.querySelector(".background .blocks"),
    kill: blockSelector.querySelector(".kill .blocks"),
    others: blockSelector.querySelector(".specials .blocks"),
}

const title = document.getElementById("input-title");
const formSubmit = document.getElementById("form-sumbit");
const titleSumbit = document.getElementById("title-box");
const levelSumbit = document.getElementById("level-box");
const modals = document.querySelectorAll(".game-modal");

let level = {
    spawn: {x: 0, y: 0},
    end: {x: 1, y: 0},
    bg: [], fg: [],
};

const btns = {
    save: document.getElementById("save-btn"),
    try:document.getElementById("try-btn")
}

btns.save.onclick = btnClick;
btns.try.onclick = btnClick;

class World {
    constructor(level) {
        this.canvas = document.getElementById("game-canvas");
        this.ctx = this.canvas.getContext("2d");
        this.level = level;
        this.selectedBlock = 0;
        this.mouse = { x: 0, y: 0 }; // mouse position over canvas
        this.pos = { x: 0, y: 0 }; // real pos
        this.translate = { x: 0, y: 0 }; // translate amount
        this.clicked = false;
        this.moveMode = false;
        this.isRightClick = false;

        this.renderer = new Renderer(this, "windowed");
        window.addEventListener("blocksLoaded", this.addBlocksToSelector);
        
        // listening stuffs
        this.canvas.addEventListener("mousemove", this.mouseEvent);
        this.canvas.addEventListener("mousedown", (e) => { this.clicked = true; this.mouseEvent(e);});
        this.canvas.addEventListener("mouseleave", (e) => { this.clicked = false; this.mouseEvent(e); })
        this.canvas.addEventListener("mouseup", (e) => { this.clicked = false; this.mouseEvent(e); });
        window.addEventListener(`contextmenu`, (e) => { return e.preventDefault() }); // prevent default for right click
        document.addEventListener("keydown", this.keyPressed);
        document.addEventListener("keyup", this.keyReleased);
    }

    addBlocksToSelector = () => { // add blocks (given from renderer) to block selector
        this.renderer.blockTextures.forEach((texture, code) => {
            // select to what category
            if (code < 20) blockCategories.solid.appendChild(texture);
            else if (code < 30) blockCategories.top.appendChild(texture);
            else if (code < 70) blockCategories.bg.appendChild(texture);
            else if (code < 80) blockCategories.kill.appendChild(texture);
            else if (code != 98) blockCategories.others.appendChild(texture);  // star for the end is renderer differently on editors (code 96) so don't display it
            // add tooltips
            tippy(texture, {
                content: texture.alt,
                delay: 200
            })
        })
    }

    mouseEvent = (e) => { // mouse movement get canvas relative coordinates
        const {clientX, clientY} = e;

        let rect = this.canvas.getBoundingClientRect();
        // get ratio of canvas js width vs real width
        let widthRatio = this.canvas.width / rect.width;
        let heightRatio = this.canvas.height / rect.height;
        
        if (this.moveMode && this.clicked) {
            // calculate drift
            const x = Math.round(( (clientX - rect.left) * widthRatio - (this.renderer.blockSize / 2) ) / this.renderer.blockSize); // get coordinate in block unit w/ mous at center
            const y  = Math.round(( (rect.bottom - clientY) * heightRatio  - this.renderer.blockSize / 2 ) / this.renderer.blockSize); // y from the bottom
            if (this.mouse.x > x) this.translate.x--
            else if (this.mouse.x < x && this.translate.x < 0) this.translate.x++
            if (this.mouse.y > y) this.translate.y++
            else if (this.mouse.y < y && this.translate.y > 0) this.translate.y--
            this.mouse.x = Math.max(0, x);
            this.mouse.y = Math.max(0, y);
            return;
        }
        // calculate coordinate
        this.mouse.x = Math.round(( (clientX - rect.left) * widthRatio - (this.renderer.blockSize / 2) ) / this.renderer.blockSize); // get coordinate in block unit w/ mous at center
        this.mouse.y = Math.round(( (rect.bottom - clientY) * heightRatio  - this.renderer.blockSize / 2 ) / this.renderer.blockSize); // y from the bottom
        // make sur it's > 0 (without that could be -0)
        this.mouse.x = Math.max(0, this.mouse.x);
        this.mouse.y = Math.max(0, this.mouse.y);

        if (!this.clicked) {
            this.isRightClick = false;
            return;
        } // add blocks only on click
        e.preventDefault();
        const isRightClick = e.which ? e.which == 3 : e.button == 2; // get right click
        if (isRightClick) this.isRightClick = true;

        // spawn and finish point
        if (this.selectedBlock == 95 && (this.pos.x != this.level.end.x || this.pos.y != this.level.end.y) && !this.isRightClick) 
            this.level.spawn = { x: this.pos.x, y:this.pos.y };
        if (this.selectedBlock == 96 && (this.pos.x != this.level.spawn.x || this.pos.y != this.level.spawn.y) && !this.isRightClick)
            this.level.end = { x: this.pos.x, y:this.pos.y };
        // eraser (also erase when setting spawn/end point so it can't be inside a block)
        if (this.selectedBlock >= 95 || this.isRightClick) {
            const toEraseBg = this.level.bg.findIndex(block => block.x == this.pos.x && block.y == this.pos.y);
            const toEraseFg = this.level.fg.findIndex(block => block.x == this.pos.x && block.y == this.pos.y);
            if (toEraseBg != -1) this.level.bg.splice(toEraseBg, 1);
            if (toEraseFg != -1) this.level.fg.splice(toEraseFg, 1);
            return;
        };

        // normal blocks
        const toAdd = {
            x: this.pos.x,
            y: this.pos.y,
            t: this.selectedBlock
        };
        
        if (this.selectedBlock >= 30 && this.selectedBlock < 70) { // if bg
            const potentialDouble = this.level.bg.findIndex(block => block.x == toAdd.x && block.y == toAdd.y && block.t == this.selectedBlock);
            if (potentialDouble != -1) return; // make sur the same bg block is not arleady added
            this.level.bg.push(toAdd);
        } else { // else => foreground
            if ((toAdd.x == this.level.spawn.x && toAdd.y == this.level.spawn.y) || (toAdd.x == this.level.end.x && toAdd.y == this.level.end.y)) return; // check that's not on spawn nor end point
            const potentialDouble = this.level.fg.findIndex(block => block.x == toAdd.x && block.y == toAdd.y);
            if (potentialDouble != -1) { // if double finded replace with new one
                if (potentialDouble.t == toAdd.t) return;
                this.level.fg.splice(potentialDouble, 1);
            }
            this.level.fg.push(toAdd);
        }
    }
    
    keyPressed = ({key}) => { // handle canvas translate based on key
        if (document.activeElement == title) return; // dosen't move canvas if writting title
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
            case "Control":
                this.moveMode = true;
                break;
        }
        if (this.translate.x > 0) this.translate.x = 0;
        if (this.translate.y < 0) this.translate.y = 0;
    }

    keyReleased = ({key}) => {
        if (key === "Control") this.moveMode = false;
    }

    update = () => { // udate, draw etc
        // update mouse pos based on translate
        this.pos.x = Math.abs(this.mouse.x - this.translate.x);
        this.pos.y = Math.abs(this.mouse.y + this.translate.y);
        // grid draw
        this.ctx.fillStyle = "#00000050";
        for (let y = 0; y < 50; y++) this.ctx.fillRect(0, this.renderer.calculateCoords({ x:0, y }).y, this.canvas.width, 1); // horizontal line
        for (let x = 0; x < 50; x++) this.ctx.fillRect(this.renderer.calculateCoords({ x, y:0 }).x, 0, 1, this.canvas.height); // vertical vertical line
        // apply translate
        this.ctx.translate(this.translate.x * this.renderer.blockSize, this.translate.y * this.renderer.blockSize);
        // blocks drawing
        this.level.bg.forEach( ({x,y,t:type}) => this.renderer.drawBlock(this.renderer.blockTextures.get(type), {x,y}) ); // bg
        this.level.fg.forEach( ({x,y,t:type}) => this.renderer.drawBlock(this.renderer.blockTextures.get(type), {x,y}) ); // fg
        // spawn and end draw
        this.renderer.drawBlock(this.renderer.blockTextures.get(95), this.level.spawn);
        this.renderer.drawBlock(this.renderer.blockTextures.get(96), this.level.end);
        // mouse position highlight
        this.ctx.globalAlpha = 0.4;
        this.renderer.drawBlock(this.renderer.blockTextures.get(this.selectedBlock), this.pos);
    }
    
    handleResize = (ratio) => {
        if (ratio < 1) {
            modals.forEach(modal => {
                modal.className = "game-modal shown";
            })
        } else {
            modals.forEach(modal => {
                modal.className = "game-modal";
            })
        }
    }
}

function btnClick(e) {
    if (title.value == "") { // if no title
        const notif = document.createElement("article");
        notif.className = "notification error";
        notif.innerHTML = "please add a valid title";
        notif.style = "margin-top: 1em";
        document.body.appendChild(notif)
        title.focus();
        setTimeout(clearNotif ,5000);
        return;
    }
    levelSumbit.value = JSON.stringify(level);
    titleSumbit.value = title.value;
    const action = e.target.id.split("-btn")[0];
    formSubmit.action += "/" + action;
    formSubmit.submit();
}

if (compressedLevel) {
    level = new World(decompressLevel(compressedLevel)).level;
} else {
    level = new World(level).level;
}