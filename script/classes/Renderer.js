const blocks = [
    ["block-01", 0],
    ["block-02", 2],
    ["block-03", 3],
    ["block-04", 4],
    ["block-05", 5],
    ["block-06", 6],
    ["surface-01", 7],
    ["surface-02", 8],
    ["surface-03", 9],
    ["slab-01", 20],
    ["slab-02", 21],
    ["slab-03", 22],
    ["slab-04", 23],
    ["bg-01", 30],
    ["bg-02", 31],
    ["bg-03", 32],
    ["bg-04", 33],
    ["bg-05", 34],
    ["bg-06", 35],
    ["bg-07", 36],
    ["bg-08", 37],
    ["bg-09", 38],
    ["bg-10", 39],
    ["decor-01", 40],
    ["decor-02", 41],
    ["decor-03", 42],
    ["decor-04", 43],
    ["decor-05", 44],
    ["decor-06", 45],
    ["decor-07", 46],
    ["decor-08", 47],
    ["decor-09", 48],
    ["decor-10", 49],
    ["decor-11", 50],
    ["decor-12", 51],
    ["decor-13", 52],
    ["spikes-01", 70],
    ["spikes-02", 71],
    ["coin-01", 80],
    ["checkpoint", 81],
    ["point-start", 95],
    ["point-finish", 96],
    ["eraser", 97],
    ["end", 98],
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
            image.onclick = () => this.world.selectedBlock = block[1]; // add event listener for level editors (when images are used as html)
            this.blockTextures.set(block[1], image);
        });
        // create hero sprites textures
        // resize handling
        this.resize();
        window.addEventListener("resize", this.resize);
        window.addEventListener("orientationchange", this.resize);
        // first render
        this.updater = requestAnimationFrame(() => this.render(Date.now()));
    }

    render = (lastFrame) => {
        // delay calculation
        const delay = Math.min((Date.now() - lastFrame), 20); // don't allow under 50 fps physics (because slower risk glitchy collision)
        lastFrame = Date.now();
        // reset canvas
        this.ctx.restore();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.save();
        // update things
        this.world.update(delay);
        // next frame
        this.updater = requestAnimationFrame(() => this.render(lastFrame));
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
}