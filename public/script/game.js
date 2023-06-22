import Renderer from "./classes/Renderer.js";
import Hero from "./classes/Hero.js";
import confetti from "./ext/confetti.min.js"

// fetch('/script/level-hard.json') // get the level (temp - should be something at least a bit different for backend)
//     .then(resp => resp.json())
//     .then(data => new World(data));

class World {
    constructor(level) {
        this.canvas = document.getElementById("game-canvas");
        this.ctx = this.canvas.getContext("2d");
        this.level = level;
        this.translate = { x: 0, y: 0 };
        this.handleDeath = false;
        this.respawnTimeout = 2000; // how long we wait before respawn
        this.deathGradientPos = 1;
        this.gradientOpacity = 0;

        // level read and initialization
        this.level.fg.push({ x: level.end.x, y: level.end.y, t: 98 });
        this.max = Math.max.apply(this.level.spawn.x, this.level.fg.map(elem => elem.x), this.level.end.x); // level x border

        // initialize score
        this.score = 0;
        this.maxScore = 0; this.level.fg.forEach(block => { if (block.t == 80) this.maxScore++ })

        this.renderer = new Renderer(this);
        this.player = new Hero(this, this.level.spawn);

        // listener for movements
        document.addEventListener("keydown", this.keyDown);
        document.addEventListener("keyup", this.keyUp);
    }

    update = (delay) => {
        this.ctx.translate(this.translate.x * this.renderer.blockSize, this.translate.y * this.renderer.blockSize); // translate the canvas

        // draw blocks
        this.level.bg.forEach(({ x,y,t:type }) => {
            const texture = this.renderer.blockTextures.get(type);
            this.renderer.drawBlock(texture, {x,y});
        });
        this.level.fg.forEach(({ x,y,t:type }) => {
            const texture = this.renderer.blockTextures.get(type);
            this.renderer.drawBlock(texture, {x,y});
        });

        // update player
        this.player.update(delay);
        this.ctx.restore();
        this.drawScore();
        if (this.player.dead) this.deathGradient(delay)
    }

    drawScore = () => {
        this.ctx.save();

        this.ctx.font = "bold 30px atma";
        this.ctx.fon
        this.ctx.fillStyle = "black";
        this.ctx.shadowColor="white";
        const txt = `${this.score} / ${this.maxScore}`;

        const txtSize = this.ctx.measureText(txt);
        const x = this.canvas.width - 10 - txtSize.width;
        const y = 35;

        this.ctx.drawImage(this.renderer.blockTextures.get(80), x-40, 9, 35, 35);

        this.ctx.shadowBlur = 1;
        this.ctx.shadowOffsetX = 2;
        this.ctx.shadowOffsetY = 2;
        this.ctx.fillText(txt, x, y);
        this.ctx.restore();
    }

    respawn = () => { // Handle respawn capabilities after death animation finished
        if (this.handleDeath) return;
        this.handleDeath = true;
        setTimeout(() => this.player = { // player disapear
            update: () => {},
            dead: true
        }, this.respawnTimeout/2);

        setTimeout(() => { // spawn back
            this.translate = { x: 0, y: 0 };
            this.player = new Hero(this, this.level.spawn);
            this.handleDeath = false;
            this.gradientOpacity = 0;
        }, this.respawnTimeout);
    }

    deathGradient = (delay) => {
        this.gradientOpacity += delay * 0.001

		const w = this.canvas.width;
		const h = this.canvas.height;
		const outerRadius = w * 0.5;
		const innerRadius = outerRadius / 2;
		const gradient = this.ctx.createRadialGradient(w / 2, h / 2, innerRadius, w / 2, h / 2, outerRadius);
        
        // Add colors stops
        gradient.addColorStop(0, "rgba(0,0,0,0)");
        gradient.addColorStop(1, "rgba(0,0,0,"+ this.gradientOpacity + ")");

        // fill
		this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, w, h);
    }
    
    succes = () => { // when player finish level
        confetti({
            particleCount: 250,
            startVelocity: 30,
            spread: 360,
            ticks: 80,
            origin: {
              x: 0.2,
              y: 0
            }
          })
          confetti({
              particleCount: 250,
              startVelocity: 30,
              spread: 360,
              ticks: 80,
              origin: {
                x: 0.8,
                y: 0
              }
            })
        setTimeout(() => cancelAnimationFrame(this.renderer.updater), 100); // wait a bit to stop updating so the start disapear ecc.
        setTimeout(() => window.location.pathname = window.location.pathname.replace("play", "details"), 1500); // redirect users
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

function decompressLevel(compressedLevel) { // decompress the levels to be used as json
    let intermediate = compressedLevel.split(/[a-z]/i)
    intermediate.forEach((elem, i) => intermediate[i] = elem.split(";"));
    let decompressedLevel = {
        spawn: {x: parseInt(intermediate[0][0].split(',')[0]), y: parseInt(intermediate[0][0].split(',')[1])},
        end: {x: parseInt(intermediate[0][1].split(',')[0]), y: parseInt(intermediate[0][1].split(',')[1])},
        bg: [],
        fg: []
    }
    intermediate[1].forEach(bg => {
        bg = bg.split(',');
        if (!bg[0] || !bg[1] || !bg[2]) return;
        decompressedLevel.bg.push({
            x: parseInt(bg[0]),
            y: parseInt(bg[1]),
            t: parseInt(bg[2])
        })
    })
    intermediate[2].forEach(fg => {
        fg = fg.split(',');
        if (!fg[0] || !fg[1] || !fg[2]) return;
        decompressedLevel.fg.push({
            x: parseInt(fg[0]),
            y: parseInt(fg[1]),
            t: parseInt(fg[2])
        })
    })
    return decompressedLevel;
}

if (compressedLevel) {
    new World(decompressLevel(compressedLevel));
}