// src/game/draw.js

import {PLAYER_DIMENSIONS} from './collision';

const PLAYER_COLOR = '#e53935';
const PLATFORM_COLOR = '#6d4c41';
const PLATFORM_HEIGHT = 20;

/**
 * Рисует игрока на холсте.
 * @param {CanvasRenderingContext2D} ctx - 2D-контекст холста.
 * @param {object} player - Состояние игрока { x, y }.
 */
function drawPlayer(ctx, player, camera = {x: 0, y: 0}) {
    ctx.fillStyle = PLAYER_COLOR;
    ctx.fillRect(
        player.x - camera.x,
        player.y - camera.y,
        PLAYER_DIMENSIONS.width,
        PLAYER_DIMENSIONS.height
    );
}

/**
 * Рисует одну платформу на холсте.
 * @param {CanvasRenderingContext2D} ctx - 2D-контекст холста.
 * @param {object} platform - Данные платформы { x, y, width }.
 */
function drawPlatform(ctx, platform, camera = {x: 0, y: 0}) {
    ctx.fillStyle = PLATFORM_COLOR;
    ctx.fillRect(
        platform.x - camera.x,
        platform.y - camera.y,
        platform.width,
        PLATFORM_HEIGHT
    );
}

/**
 * Главная функция отрисовки, которая очищает холст и рисует все объекты.
 * @param {CanvasRenderingContext2D} ctx - 2D-контекст холста.
 * @param {object} playerState - Полное состояние игрока.
 * @param {array} platforms - Массив всех платформ.
 */
export function draw(ctx, playerState, platforms, camera = {x: 0, y: 0}) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    for (const platform of platforms) {
        drawPlatform(ctx, platform, camera);
    }

    drawPlayer(ctx, playerState, camera);
}
