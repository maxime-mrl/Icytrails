export function collisionDetection(player, obj) {
    if (
        player.y + 1 >= obj.y &&
        player.y <= obj.y + 1 &&
        player.x <= obj.x + 1 &&
        player.x + 1 >= obj.x
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