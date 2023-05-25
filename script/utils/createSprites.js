export default function(spritesSrcs) {
    const sprites = {};
    spritesSrcs.forEach(sprite => {
        const image = document.createElement("img");
        image.src = `/asset/texture/hero/${sprite}.png`;
        image.onload = () => sprites[sprite].frameNb = image.width/sprites[sprite].frameSize; // when image loaded set number of frames (we now frames size - 256px - so we devide width by frame size for the number)
        sprites[sprite] = {
            sprite: image,
            frameSize: 256,
            frameNb: 10, // random number waiting for image to load and be edited
            name: sprite,
        }
    });
    return sprites;
}
