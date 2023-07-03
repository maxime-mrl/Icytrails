export default class Renderer {
    constructor(world, mode = "fullscreen") {
        const event = new Event("blocksLoaded")
        this.verticalRenderDistance = 10;
        this.world = world;
        this.canvas = world.canvas;
        this.ctx = world.ctx;
        this.screenMode = mode; // fullscreen or windowed mode
        // resize handling
        this.resize();
        window.addEventListener("resize", this.resize);
        window.addEventListener("orientationchange", this.resize);
        // background
        this.bg = document.createElement("img");
        this.bg.src = "/asset/texture/bg/trees.png";
        this.bg.ratio = 1;
        this.bg.onload = () => this.bg.ratio = this.bg.width/this.bg.height;
        this.blockTextures = new Map();
        // blocks loading and everything that needs block
        fetch("/asset/json/blocks.json")
            .then(resp => resp.json())
            .then(({blocks}) => {
                blocks.forEach(block => {
                    const image = document.createElement("img");
                    image.src = `/asset/texture/blocks/${block[0]}.png`;
                    image.alt = block[2];
                    image.onclick = () => this.world.selectedBlock = block[1]; // add event listener for level editors (when images are used as html)
                    this.blockTextures.set(block[1], image);
                });
                window.dispatchEvent(event);
                // first render
                this.updater = requestAnimationFrame(() => this.render(Date.now()));
            });
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
        this.world.handleResize(this.width / this.height);
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
            this.world.ctx.drawImage(this.bg, x, y, bgWidth * 1.01, bgHeight * 1.01);
        }

    }
}
