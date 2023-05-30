const blocks = [
    ["block-01", 0, "A solid rock"],
    ["block-02", 2, "Another solid rock"],
    ["block-03", 3, "Are you really gonna hover every solid block?"],
    ["block-04", 4, "Yes, this is still a solid rock"],
    ["block-05", 5, "And this one too"],
    ["block-06", 6, "Don't you have anything to do?"],
    ["surface-01", 7, "I think you have the idea no?"],
    ["surface-02", 8, "Collision are from everywhere"],
    ["surface-03", 9, "Pfiu, the last one"],
    ["slab-01", 20, "This is a slab, it has collision only from top"],
    ["slab-02", 21, "A player can pass right through from bottom but not top"],
    ["slab-03", 22, "Isn't it interesting? Only top collisions!"],
    ["slab-04", 23, "This one has a pillar below but acts the same!"],
    ["bg-01", 30, "This is a background block"],
    ["bg-02", 31, "Background blocks are only used for decoration"],
    ["bg-03", 32, "There are no collision"],
    ["bg-04", 33, "Pro tip: you can stack multiple background blocks!"],
    ["bg-05", 34, "An angle background? Wonder what could you use it for"],
    ["bg-06", 35, "Pro tip: you can stack multiple background blocks!"],
    ["bg-07", 36, "Seems like that would go perfectly with a slab pillar..."],
    ["bg-08", 37, "And this one? maybe the bottom of a pillar"],
    ["bg-09", 38, "Get creative! background blocks make no collision"],
    ["bg-10", 39, "Draw me a sheep"],
    ["decor-01", 40, "Hmmm shiny!"],
    ["decor-02", 41, "Pro tip: you can stack multiple background blocks!"],
    ["decor-03", 42, "Reminder: background blocks don't have any collision"],
    ["decor-04", 43, "got lost? seem's like a direction"],
    ["decor-14", 53, "You can go up?"],
    ["decor-05", 44, "A pot? Yes why not"],
    ["decor-06", 45, "When the pot falls it breaks"],
    ["decor-07", 46, "Another pot woaw"],
    ["decor-08", 47, "Pro tip: you can stack multiple background blocks!"],
    ["decor-09", 48, "The rock"],
    ["decor-10", 49, "Reminder: background blocks don't have any collision"],
    ["decor-11", 50, "Another type of arrow? you can't get lost!"],
    ["decor-12", 51, "Pro tip: you can stack multiple background blocks!"],
    ["decor-13", 52, "When it snows a bit too much"],
    ["spikes-01", 70, "DIIIIIEE"],
    ["spikes-02", 71, "SUFFEEERRRR"],
    ["coin-01", 80, "A shiny golden coin gives a sweat point"],
    ["checkpoint", 81, '"This game is too easy it has checkpoints!" they said'],
    ["point-start", 95, "Set the spawn point where you want"],
    ["point-finish", 96, "Set the success point where you want"],
    ["eraser", 97, "Made a mistake? No problem this can even erase you"],
    ["end", 98, "You shouldn't see this... sus"]
];
// block types
// 00 - 19 solid
// 20 - 29 solid from top
// 30 - 69 background / decoration (no interaction)
// 70 - 79 kill on colision (spikes)
// 80 - 94 other and overflowed category (kind of potential more future proofing)
// 95 - 99 not rendered (will enter in other category for editor)


export default class Renderer {
    constructor(world, mode = "fullscreen") {
        this.verticalRenderDistance = 10;
        this.world = world;
        this.canvas = world.canvas;
        this.ctx = world.ctx;
        this.screenMode = mode; // fullscreen or windowed mode
        // create block texture
        this.blockTextures = new Map();
        blocks.forEach(block => {
            const image = document.createElement("img");
            image.src = `/asset/texture/blocks/${block[0]}.png`;
            image.tooltip = block[2]
            image.onclick = () => this.world.selectedBlock = block[1]; // add event listener for level editors (when images are used as html)
            this.blockTextures.set(block[1], image);
        });
        this.bg = document.createElement("img");
        this.bg.src = "/asset/texture/bg/trees.png";
        this.bg.ratio = 1;
        this.bg.onload = () => this.bg.ratio = this.bg.width/this.bg.height;
        // resize handling
        this.resize();
        window.addEventListener("resize", this.resize);
        window.addEventListener("orientationchange", this.resize);
        // first render
        this.updater = requestAnimationFrame(() => this.render(Date.now()));
    }

    render = (lastFrame) => {
        // delay calculation and next frame
        const delay = Math.min((Date.now() - lastFrame), 20); // don't allow under 50 fps physics (because slower risk glitchy collision)
        lastFrame = Date.now();
        this.updater = requestAnimationFrame(() => this.render(lastFrame));
        // reset canvas
        this.ctx.restore();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.save();
        // update things
        this.drawBackground();
        this.world.update(delay);
    }

    resize = () => { // handle everithing for size - resize canvas, set block size etc called at start and on resize
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        if (this.width < this.height) return; // need to alert user portrait isn't supported or do something to support it
        if (this.screenMode == "fullscreen") {
            this.canvas.width = this.width;
            this.canvas.height = this.height;
            this.canvas.className = "fullscreen";
        } else if (this.screenMode == "windowed") {
            this.canvas.width = 1280;
            this.canvas.height = 720;
            this.canvas.className = "windowed";
        }
        this.blockSize =this.canvas.height / this.verticalRenderDistance;
    }

    calculateCoords = (pos) => { // from coordinate in blocks return the position in pixel for the canvas
        return {
            x: pos.x*this.blockSize,
            y: this.canvas.height - (pos.y + 1) * this.blockSize // y start from bottom
        }
    }

    drawBlock = (img, pos) => { // draw images without sprite
        const {x, y} = this.calculateCoords(pos) ;
        this.world.ctx.drawImage(img, x, y, this.blockSize*1.01, this.blockSize*1.01);
    }

    drawSprite = ({sprite, frameSize}, displayedFrame, pos) => { // draw sprites images
        const {x, y} = this.calculateCoords(pos);
        const cropStart = frameSize * displayedFrame;
        this.world.ctx.drawImage(sprite, cropStart, 0, frameSize, frameSize, x, y, this.blockSize, this.blockSize);
        // draw image full: imgSRC, imgcropStart x-y, imgcropWidth x-y, posX, posY, SizeX, sizeY  
    }

    drawBackground = () => {
        const bgWidth = this.blockSize*5.5 * this.bg.ratio;
        const bgHeight = this.blockSize*5.5;
        const y = this.canvas.height + this.world.translate.y * this.blockSize - bgHeight;
        for (let i = 0; i < 99; i++) {
            const x = i*bgWidth + this.world.translate.x * this.blockSize / 5;
            this.world.ctx.drawImage(this.bg, x, y, bgWidth, bgHeight);
        }

    }
}
