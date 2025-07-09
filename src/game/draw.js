// src/game/draw.js

import {PLAYER_DIMENSIONS} from './collision';
import playerSpritePath from '../assets/sprites/player.svg';

const playerImage = new Image();
playerImage.src = playerSpritePath;

const PLAYER_COLOR = '#e53935';
const PLATFORM_COLOR = '#6d4c41';
const PLATFORM_HEIGHT = 20;
const COIN_COLOR = '#fdd835';
const COIN_RADIUS = 10;
const HEALTH_RADIUS = 20;
const HEALTH_BG_COLOR = 'rgba(0,0,0,0.3)';
const HEALTH_COLOR = '#e53935';

/**
 * Рисует игрока на холсте.
 * @param {CanvasRenderingContext2D} ctx - 2D-контекст холста.
 * @param {object} player - Состояние игрока { x, y }.
 */
function drawPlayer(ctx, player, camera = {x: 0, y: 0}) {
    if (playerImage.complete) {
        ctx.drawImage(
            playerImage,
            player.x - camera.x,
            player.y - camera.y,
            PLAYER_DIMENSIONS.width,
            PLAYER_DIMENSIONS.height
        );
    } else {
        ctx.fillStyle = PLAYER_COLOR;
        ctx.fillRect(
            player.x - camera.x,
            player.y - camera.y,
            PLAYER_DIMENSIONS.width,
            PLAYER_DIMENSIONS.height
        );
    }
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

function drawCoin(ctx, coin, camera = {x: 0, y: 0}) {
    ctx.fillStyle = COIN_COLOR;
    ctx.beginPath();
    ctx.arc(coin.x - camera.x, coin.y - camera.y, COIN_RADIUS, 0, Math.PI * 2);
    ctx.fill();
}

function drawHealth(ctx, health, maxHealth) {
    const ratio = Math.max(0, Math.min(health / maxHealth, 1));
    const x = HEALTH_RADIUS + 10;
    const y = HEALTH_RADIUS + 10;

    ctx.fillStyle = HEALTH_BG_COLOR;
    ctx.beginPath();
    ctx.arc(x, y, HEALTH_RADIUS, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = HEALTH_COLOR;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.arc(
        x,
        y,
        HEALTH_RADIUS,
        -Math.PI / 2,
        -Math.PI / 2 + Math.PI * 2 * ratio
    );
    ctx.lineTo(x, y);
    ctx.fill();
}

/**
 * Главная функция отрисовки, которая очищает холст и рисует все объекты.
 * @param {CanvasRenderingContext2D} ctx - 2D-контекст холста.
 * @param {object} playerState - Полное состояние игрока.
 * @param {array} platforms - Массив всех платформ.
 */
export function draw(ctx, playerState, platforms, coins = [], camera = {x: 0, y: 0}) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    for (const platform of platforms) {
        drawPlatform(ctx, platform, camera);
    }

    for (const coin of coins) {
        drawCoin(ctx, coin, camera);
    }

    drawPlayer(ctx, playerState, camera);

    if (playerState && typeof playerState.health === 'number' && typeof playerState.maxHealth === 'number') {
        drawHealth(ctx, playerState.health, playerState.maxHealth);
    }
}
