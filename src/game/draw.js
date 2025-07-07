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
function drawPlayer(ctx, player) {
	ctx.fillStyle = PLAYER_COLOR;
	ctx.fillRect(player.x, player.y, PLAYER_DIMENSIONS.width, PLAYER_DIMENSIONS.height);
}

/**
 * Рисует одну платформу на холсте.
 * @param {CanvasRenderingContext2D} ctx - 2D-контекст холста.
 * @param {object} platform - Данные платформы { x, y, width }.
 */
function drawPlatform(ctx, platform)
{
	ctx.fillStyle = PLATFORM_COLOR;
	ctx.fillRect(platform.x, platform.y, platform.width, PLATFORM_HEIGHT);
}

/**
 * Главная функция отрисовки, которая очищает холст и рисует все объекты.
 * @param {CanvasRenderingContext2D} ctx - 2D-контекст холста.
 * @param {object} playerState - Полное состояние игрока.
 * @param {array} platforms - Массив всех платформ.
 */
export function draw(ctx, playerState, platforms)
{
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

	for (const platform of platforms) {
		drawPlatform(ctx, platform);
	}

	drawPlayer(ctx, playerState);
}