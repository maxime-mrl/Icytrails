export function collisionDetection(player, obj) {
    if (
        player.pos.y + 1 >= obj.y &&
        player.pos.y + (1 - player.height) <= obj.y + 1 &&
        player.pos.x <= obj.x + 1 &&
        player.pos.x + player.width >= obj.x
    ) return true;
}

export function platformCollisionDetection(player, obj) {
    if (
        player.pos.y + player.height >= obj.pos.y &&
        player.pos.y + player.height <= obj.pos.y + obj.height &&
        player.pos.x <= obj.pos.x + obj.width &&
        player.pos.x + player.width >= obj.pos.x
    ) return true;
}