export default class Renderer {
    constructor(world) {
        this.world = world;
        this.canvas = world.canvas;
        this.ctx = world.ctx;
        this.verticalRenderDistance = 10;
        this.resize();
        window.addEventListener("resize", this.resize);
        window.addEventListener("orientationchange", this.resize);
        requestAnimationFrame(() => this.render(Date.now()));
    }

    resize = () => { // handle everithing for size - resize canvas, set block size etc called at start and on resize
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        if (this.width < this.height) return; // need to alert user portrait isn't supported or do something to support it

        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.blockSize = Math.floor(this.height / this.verticalRenderDistance);
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

    calculateCoords = (pos) => {
        return {
            x: pos.x*this.blockSize,
            y: this.canvas.height - (pos.y + 1) * this.blockSize
        }
    }
}