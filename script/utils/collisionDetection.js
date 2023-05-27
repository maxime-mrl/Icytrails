export default function(player, obj) { // detect normal colision from any sides
    if (
        player.pos.y + 1 >= obj.y &&
        player.pos.y + (1 - player.height) <= obj.y + 1 &&
        player.pos.x <= obj.x + 1 &&
        player.pos.x + player.width >= obj.x
    ) return true;
}
