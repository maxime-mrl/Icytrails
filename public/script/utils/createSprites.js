export default function(spritesSrcs) { // import sprites and create array of object with all usefull things
    const sprites = {};
    spritesSrcs.forEach(sprite => {
        const imageR = document.createElement("img");
        imageR.src = `/asset/texture/hero/${sprite}.png`;
        imageR.onload = () => sprites[sprite].frameNb = imageR.width/sprites[sprite].frameSize; // when image loaded set number of frames (we now frames size - 256px - so we devide width by frame size for the number)
        const imageL = document.createElement("img");
        imageL.src = `/asset/texture/hero/${sprite}_l.png`;
        sprites[sprite] = {
            rSprite: imageR,
            lSprite: imageL,
            sprite: imageL,
            frameSize: 256,
            frameNb: 10, // random number waiting for image to load and be edited
            name: sprite,
        }
    });
    return sprites;
}
