import Renderer from "./classes/Renderer.js";
import Hero from "./classes/Hero.js";
const texts = [
    "Where am I?",
    "Fck, I'm lost",
    "What is 404?",
    "Any way out?",
    "Someone here?",
    "Arggh...",
    "Still here?",
    "Idk, go home",
    "something's wrong",
    "42 is the answer",
    "Or is it?",
];
const modals = document.querySelectorAll(".game-modal");

fetch('/asset/json/404.json') // get 404 "level"
    .then(resp => resp.json())
    .then(data => new World(data));

class World {
    constructor(level) {
        this.canvas = document.getElementById("game-canvas");
        this.ctx = this.canvas.getContext("2d");
        this.level = level;
        this.texts = level.text;
        this.translate = { x: 0, y: 0 };
        this.memSpeed = 0;
        this.moving = true;
        this.currentText = 0;
        this.chatting = true;
        setTimeout(() => this.chatting = false, 2500);

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
        // text
        this.drawText();
        // update player
        this.player.update(delay);
        // chat
        if (this.chatting) this.playerTalk();
        if (!this.chatting && Math.random() > 0.9993) {
            this.chatting = true;
            this.currentText++
            if (this.currentText >= texts.length) this.currentText = 0;
            setTimeout(() => this.chatting = false, 2000 + Math.random() * 1000);
        }
        // simulate movement
        this.updateMovement()
    }

    playerTalk = () => {
        const text = texts[this.currentText];
        this.ctx.font = `500 16px atma`;
        const txtSize = this.ctx.measureText(text).width;
        const coords = this.renderer.calculateCoords({
            x:this.player.pos.x + this.player.hitBox.width + 0.2,
            y:this.player.pos.y + this.player.hitBox.height - 1
        });
        // draw bubles
        this.ctx.fillStyle = "#022e3c99";
        this.drawEllipse(coords.x, coords.y, 6);
        this.drawEllipse(coords.x + + 15, coords.y - 15, 10);
        this.drawEllipse(coords.x + 50, coords.y - txtSize * 0.6, txtSize * 0.7);
        // draw text
        this.ctx.fillStyle = "#F3EFF5ee";
        this.ctx.fillText(text, coords.x + 50 - txtSize * 0.5, coords.y - txtSize*0.55);
    }
    
    updateMovement = () => {
        if (this.player.vel.xAbs < this.memSpeed / 2 && !this.player.jumping) this.player.jump(); // auto jump
        // random jump and stop
        if (Math.random() > 0.998 && !this.player.jumping && this.moving) {
            this.player.jump();
            this.moving = false;
        }
        // ranndom stop and start moving
        if (Math.random() > 0.99) this.moving = true;
        else if (Math.random() < 0.005) this.moving = false;
        // random dirrection change
        if (Math.random() * Math.random() > 0.998) this.player.vel.mdir = 1;
        else if (Math.random() < 0.0015) this.player.vel.mdir = -1;
        // movement limit
        if (this.player.pos.x < 2) this.player.vel.mdir = 1;
        else if (this.player.pos.x > 20) this.player.vel.mdir = -1;
    }

    drawText = () => {
        this.ctx.font = `500 ${this.renderer.blockSize}px atma`;
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
        
        this.ctx.restore()
    }
    
    drawEllipse = (x, y, size) => {
        this.ctx.beginPath();
        this.ctx.ellipse(x , y, size, Math.min(size * 0.45, 40), 0, 0, 2*Math.PI);
        this.ctx.fill();
        this.ctx.closePath();
    }

    handleResize = (ratio) => {
        if (ratio < 1.2) {
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
