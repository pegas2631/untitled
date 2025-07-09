// src/game/draw.js

import {PLAYER_DIMENSIONS} from './collision';
import {drawEnemies} from './enemies';
import playerSpritePath from '../assets/sprites/player.svg';
import coinSpritePath from '../assets/sprites/coin.svg';

const playerImage = new Image();
playerImage.src = playerSpritePath;

const coinImage = new Image();
coinImage.src = coinSpritePath;

const PLAYER_COLOR = '#e53935';
const PLATFORM_COLOR = '#6d4c41';
const PLATFORM_HEIGHT = 20;
const COIN_COLOR = '#fdd835';
const COIN_RADIUS = 10;
const HEALTH_RADIUS = 20;
const HEALTH_BG_COLOR = 'rgba(0,0,0,0.3)';
const HEALTH_COLOR = '#e53935';
const TEXT_COLOR = '#000';
const FONT_SIZE = 20;

/**
 * Рисует игрока на холсте.
 * @param {CanvasRenderingContext2D} ctx - 2D-контекст холста.
 * @param {object} player - Состояние игрока { x, y }.
 * @param camera
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
 * @param camera
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
    const x = coin.x - camera.x - COIN_RADIUS;
    const y = coin.y - camera.y - COIN_RADIUS;

    if (coinImage.complete) {
        ctx.drawImage(coinImage, x, y, COIN_RADIUS * 2, COIN_RADIUS * 2);
    } else {
        ctx.fillStyle = COIN_COLOR;
        ctx.beginPath();
        ctx.arc(coin.x - camera.x, coin.y - camera.y, COIN_RADIUS, 0, Math.PI * 2);
        ctx.fill();
    }
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

function drawCoinCount(ctx, count) {
    ctx.font = `${FONT_SIZE}px sans-serif`;
    const text = `${count}`;
    const textWidth = ctx.measureText(text).width;

    const coinX = ctx.canvas.width - COIN_RADIUS - textWidth - 20;
    const coinY = COIN_RADIUS + 10;

    drawCoin(ctx, { x: coinX, y: coinY });

    ctx.fillStyle = TEXT_COLOR;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, coinX + COIN_RADIUS + 5, coinY);
}

/**
 * Главная функция отрисовки, которая очищает холст и рисует все объекты.
 * @param {CanvasRenderingContext2D} ctx - 2D-контекст холста.
 * @param {object} playerState - Полное состояние игрока.
 * @param {array} platforms - Массив всех платформ.
 * @param coins
 * @param enemies
 * @param camera
 * @param coinCount
 */
export function draw(
    ctx,
    playerState,
    platforms,
    coins = [],
    enemies = [],
    camera = {x: 0, y: 0},
    coinCount = 0
) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    for (const platform of platforms) {
        drawPlatform(ctx, platform, camera);
    }

    for (const coin of coins) {
        drawCoin(ctx, coin, camera);
    }

    drawEnemies(ctx, enemies, camera);

    drawPlayer(ctx, playerState, camera);

    if (playerState && typeof playerState.health === 'number' && typeof playerState.maxHealth === 'number') {
        drawHealth(ctx, playerState.health, playerState.maxHealth);
    }

    drawCoinCount(ctx, coinCount);
}
