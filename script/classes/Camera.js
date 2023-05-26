export default class Camera {
    constructor(hero, pos) {
        this.world = hero.world;
        this.hitBox = hero.hitBox;
        this.renderer = hero.renderer;
        this.vel = hero.vel;
        this.camera = {
            pos: { x: hero.pos.x, y: hero.pos.y },
            width: 10,
            height: 6,
        }

        // make sure camera is visible
        this.update(); // make camera pos acurate
        this.world.translate.x = this.world.canvas.width/this.renderer.blockSize/2 - this.camera.pos.x - this.camera.width/2 - 1; // set viewport to center camera horizontally
        this.world.translate.y = -(this.world.canvas.height/this.renderer.blockSize/2 - this.camera.pos.y) - 1; // set viewport to center camera vertically
        // bottom and right overflow are unnecessary since camera start from there
    }

    update = (delay) => { // update camera positions and check camera colision
        // update camera pos
        this.camera.pos.x = this.hitBox.pos.x + (1 - this.camera.width) / 2;
        this.camera.pos.y = this.hitBox.pos.y - (1 - this.camera.height) / 2; // minus bcz Y is calculated from bottom

        // box side coordinate
        const left = this.camera.pos.x;
        const right = this.camera.pos.x + this.camera.width;
        const bottom = this.camera.pos.y + (1 - this.camera.height);
        const top = this.camera.pos.y + 1;
        // maximum x world translate
        const maxX = this.world.max.x - (this.world.canvas.width / this.renderer.blockSize) + 1;

        // change translate for horizontal
        if (left + this.world.translate.x <= 0 && this.vel.mdir < 0) this.world.translate.x += this.vel.xAbs * delay/1000; // left
        else if ((right + this.world.translate.x) * this.renderer.blockSize >= this.world.canvas.width && this.vel.mdir > 0) this.world.translate.x -= this.vel.xAbs * delay/1000; // right
        // change translate for vertical
        if (bottom - this.world.translate.y <= 0 && this.vel.y < 0) this.world.translate.y += this.vel.y * delay/1000; // bottom
        else if ((top - this.world.translate.y) * this.renderer.blockSize >= this.world.canvas.height && this.vel.y > 0) this.world.translate.y += this.vel.y * delay/1000; // top
        
        // translate limits
        if (this.world.translate.x > 0) this.world.translate.x = 0; // left
        if (-this.world.translate.x > maxX) this.world.translate.x = -maxX; // right
        if (this.world.translate.y < 0) this.world.translate.y = 0; // bottom
        // no top limit since we are pretty naturaly limited by jump
    }
}