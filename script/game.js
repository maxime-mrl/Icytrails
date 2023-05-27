import Renderer from "./classes/Renderer.js";
import Hero from "./classes/Hero.js";
import confetti from "./ext/confetti.min.js"

fetch('/script/level-b.json') // get the level (temp - should be something at least a bit different for backend)
    .then(resp => resp.json())
    .then(data => new World(data));

class World {
    constructor(level) {
        this.canvas = document.getElementById("game-canvas");
        this.ctx = this.canvas.getContext("2d");
        this.level = level;
        this.translate = { x: 0, y: 0 };
        this.handleDeath = false;
        this.respawnTimeout = 2000; // how long we wait before respawn
        this.score = 0;

        this.level.fg.push({ x: level.end.x, y: level.end.y, t: 98 });
        this.max = Math.max.apply(this.level.spawn.x, this.level.fg.map(elem => elem.x), this.level.end.x); // level x border

        this.renderer = new Renderer(this);
        this.player = new Hero(this, this.level.spawn);

        // listener for movements
        document.addEventListener("keydown", this.keyDown);
        document.addEventListener("keyup", this.keyUp);
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
        }, this.respawnTimeout);
    }
    
    succes = () => { // when player finish level
        confetti({
            particleCount: 250,
            startVelocity: 30,
            spread: 360,
            ticks: 60,
            origin: {
              x: 0.2,
              y: 0
            }
          })
          confetti({
              particleCount: 250,
              startVelocity: 30,
              spread: 360,
              ticks: 60,
              origin: {
                x: 0.8,
                y: 0
              }
            })
        setTimeout(() => cancelAnimationFrame(this.renderer.updater), 100); // wait a bit to stop updating so the start disapear ecc.
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
