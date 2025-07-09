import { PLAYER_DIMENSIONS } from './collision';

export const ENEMY_DIMENSIONS = {
    width: 40,
    height: 40,
};

export function drawEnemy(ctx, enemy, camera = {x: 0, y: 0}) {
    ctx.fillStyle = '#000';
    ctx.fillRect(
        enemy.x - camera.x,
        enemy.y - camera.y,
        ENEMY_DIMENSIONS.width,
        ENEMY_DIMENSIONS.height
    );
}

export function drawEnemies(ctx, enemies = [], camera = {x: 0, y: 0}) {
    for (const enemy of enemies) {
        drawEnemy(ctx, enemy, camera);
    }
}

export function checkEnemyCollision(player, enemies = []) {
    for (const enemy of enemies) {
        const collision =
            player.x < enemy.x + ENEMY_DIMENSIONS.width &&
            player.x + PLAYER_DIMENSIONS.width > enemy.x &&
            player.y < enemy.y + ENEMY_DIMENSIONS.height &&
            player.y + PLAYER_DIMENSIONS.height > enemy.y;
        if (collision) {
            return enemy;
        }
    }
    return null;
}
