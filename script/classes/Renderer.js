const blocks = [
    ["smooth.png", "00"],
    ["snow.png", "02"],
    ["cobble.png", "03"],
];

const heroSprites = [
    "idle",
    "death",
    "walk"
];

export default class Renderer {
    constructor(world, mode = "fullscreen") {
        this.verticalRenderDistance = 10;
        this.world = world;
        this.canvas = world.canvas;
        this.ctx = world.ctx;
        this.screenMode = mode; // fullscreen or windowed mode
        // create block texture
        this.blockTextures = [];
        blocks.forEach(block => {
            const image = document.createElement("img");
            image.src = `/asset/texture/blocks/${block[0]}`;
            image.onclick = () => this.world.selectedBlock = block[1]; // add event listener for level editors (when images are used as html)
            this.blockTextures.push({
                image,
                type: block[1]
            });
        });
        // create hero sprites textures
        this.heroSprites = {};
        heroSprites.forEach(sprite => {
            const image = document.createElement("img");
            image.src = `/asset/texture/hero/${sprite}.png`;
            image.onload = () => this.heroSprites[sprite].frameNb = image.width/this.heroSprites[sprite].frameSize; // when image loaded set number of frames (we now frames size - 256px - so we devide width by frame size for the number)
            this.heroSprites[sprite] = {
                sprite: image,
                frameSize: 256,
                frameNb: 10, // random number waiting for image to load and be edited
                name: sprite,
            }
        });
        // resize handling
        this.resize();
        window.addEventListener("resize", this.resize);
        window.addEventListener("orientationchange", this.resize);
        // first render
        requestAnimationFrame(() => this.render(Date.now()));
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
        requestAnimationFrame(() => this.render(lastFrame));
    }

    resize = () => { // handle everithing for size - resize canvas, set block size etc called at start and on resize
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        if (this.width < this.height) return; // need to alert user portrait isn't supported or do something to support it
        if (this.screenMode == "fullscreen") {
            this.canvas.width = this.width;
            this.canvas.height = this.height;
            this.canvas.className = "fullscreen";
            this.blockSize = Math.ceil(this.canvas.height / this.verticalRenderDistance);
        } else if (this.screenMode == "windowed") {
            this.canvas.width = 1280;
            this.canvas.height = 720;
            this.canvas.className = "windowed";
            this.blockSize = Math.round(this.canvas.height / this.verticalRenderDistance);
        }

    }


    calculateCoords = (pos) => { // from coordinate in blocks return the position in pixel for the canvas
        return {
            x: pos.x*this.blockSize,
            y: this.canvas.height - (pos.y + 1) * this.blockSize // y start from bottom
        }
    }

    drawBlock = (img, pos) => { // draw images without sprite
        const {x, y} = this.calculateCoords(pos) ;
        this.world.ctx.drawImage(img, x, y, this.blockSize, this.blockSize);
    }

    drawSprite = ({sprite, frameSize}, displayedFrame, pos) => { // draw sprites images
        const {x, y} = this.calculateCoords(pos);
        const cropStart = frameSize * displayedFrame;
        this.world.ctx.drawImage(sprite, cropStart, 0, frameSize, frameSize, x, y, this.blockSize, this.blockSize);
        // draw image full: imgSRC, imgcropStart x-y, imgcropWidth x-y, posX, posY, SizeX, sizeY  
    }
}