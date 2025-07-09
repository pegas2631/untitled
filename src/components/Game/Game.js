// src/components/Game/Game.js

import React, {useEffect, useRef, useState} from 'react';
import {useGameLoop} from '../../hooks/useGameLoop';
import {useKeyboardInput} from '../../hooks/useKeyboardInput';
import {updatePlayerState} from '../../game/physics';
import {draw} from '../../game/draw';
import {PLAYER_DIMENSIONS} from '../../game/collision';
import {checkEnemyCollision} from '../../game/enemies';
import level1 from '../../levels/level1.json';
import coins1 from '../../levels/coins1.json';
import enemies1 from '../../levels/enemies1.json';
import level2 from '../../levels/level2.json';
import coins2 from '../../levels/coins2.json';
import enemies2 from '../../levels/enemies2.json';
import level3 from '../../levels/level3.json';
import coins3 from '../../levels/coins3.json';
import enemies3 from '../../levels/enemies3.json';
import './Game.css';

const LEVELS = [
    { level: level1, coins: coins1, enemies: enemies1 },
    { level: level2, coins: coins2, enemies: enemies2 },
    { level: level3, coins: coins3, enemies: enemies3 },
];

// Удаляем импорты Player и Platform, они больше не нужны

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const WORLD_WIDTH = 2000;
const COIN_RADIUS = 10;
const MAX_HEALTH = 5;
const DAMAGE_COOLDOWN = 1000;
// Высота мира не ограничена снизу, но камера не двигается ниже 0

const Game = () => {
	const canvasRef = useRef(null); // 2. Ref для доступа к элементу <canvas>

	const cameraRef = useRef({x: 0, y: 0});

	const playerRef = useRef({
		x: 100,
		y: 100,
		yVelocity: 0,
		isGrounded: false,
		health: MAX_HEALTH,
		maxHealth: MAX_HEALTH,
		lastHit: 0,
	});

        const [platforms, setPlatforms] = useState([]);
        const [coins, setCoins] = useState([]);
        const [enemies, setEnemies] = useState([]);
        const [coinsCollected, setCoinsCollected] = useState(0);
        const [currentLevel, setCurrentLevel] = useState(0);
        const input = useKeyboardInput();

        const loadLevel = (index) => {
                const data = LEVELS[index % LEVELS.length];
                setPlatforms(data.level);
                setCoins(data.coins);
                setEnemies(data.enemies);
                setCoinsCollected(0);
                playerRef.current = {
                        x: 100,
                        y: 100,
                        yVelocity: 0,
                        isGrounded: false,
                        health: MAX_HEALTH,
                        maxHealth: MAX_HEALTH,
                        lastHit: 0,
                };
                cameraRef.current = { x: 0, y: 0 };
        };

        useEffect(() => {
                loadLevel(currentLevel);
        }, [currentLevel]);

        useEffect(() => {
                if (coins.length === 0 && platforms.length > 0) {
                        alert('\u041F\u043E\u0437\u0434\u0440\u0430\u0432\u043B\u044F\u0435\u043C! \u0423\u0440\u043E\u0432\u0435\u043D\u044C \u043F\u0440\u043E\u0439\u0434\u0435\u043D!');
                        setCurrentLevel(prev => (prev + 1) % LEVELS.length);
                }
        }, [coins, platforms]);

	useGameLoop(() => {
		if (platforms.length === 0) return;

		// --- Логика игры остается прежней ---
		const player = playerRef.current;
		playerRef.current = updatePlayerState(player, input, platforms);

		// Prevent the player from going beyond the right boundary
		if (playerRef.current.x > WORLD_WIDTH - PLAYER_DIMENSIONS.width) {
			playerRef.current.x = WORLD_WIDTH - PLAYER_DIMENSIONS.width;
		}

		// Respawn игрока, если он ушёл слишком далеко влево
		if (playerRef.current.x < -50) {
			playerRef.current.x = 100;
			playerRef.current.y = 100;
			playerRef.current.yVelocity = 0;
			playerRef.current.isGrounded = false;
		}

		// Update camera position to follow the player
		const targetCameraX = playerRef.current.x - GAME_WIDTH / 2 + PLAYER_DIMENSIONS.width / 2;
		const maxCameraX = WORLD_WIDTH - GAME_WIDTH;
		cameraRef.current.x = Math.max(0, Math.min(targetCameraX, maxCameraX));

		const targetCameraY = playerRef.current.y - GAME_HEIGHT / 2 + PLAYER_DIMENSIONS.height / 2;
		// camera moves only upwards (negative y), never below zero
		cameraRef.current.y = Math.min(targetCameraY, 0);

		// Возвращение игрока при падении
		if (playerRef.current.y - cameraRef.current.y > GAME_HEIGHT)
		{
			playerRef.current.x = 100;
			playerRef.current.y = 100;
			playerRef.current.yVelocity = 0;
			playerRef.current.isGrounded = false;
		}

		// Проверяем столкновение с монетами
		if (coins.length > 0) {
			const remaining = [];
			let collected = 0;
			for (const coin of coins)
			{
				const dx = playerRef.current.x + PLAYER_DIMENSIONS.width / 2 - coin.x;
				const dy = playerRef.current.y + PLAYER_DIMENSIONS.height / 2 - coin.y;
				const distance = Math.hypot(dx, dy);
				if (distance < COIN_RADIUS + PLAYER_DIMENSIONS.width / 2)
				{
					collected += 1;
				}
				else
				{
					remaining.push(coin);
				}
			}
			if (collected > 0) {
				setCoins(remaining);
				setCoinsCollected(prev => prev + collected);
			}
		}

		// Проверяем столкновение с врагами
		const now = Date.now();
                const hitEnemy = checkEnemyCollision(playerRef.current, enemies);
                if (hitEnemy && now - playerRef.current.lastHit > DAMAGE_COOLDOWN) {
                        playerRef.current.health = Math.max(0, playerRef.current.health - 1);
                        playerRef.current.lastHit = now;
                }

                if (playerRef.current.health <= 0) {
                        window.location.reload();
                        return;
                }

		// --- Новая логика отрисовки ---
		const canvas = canvasRef.current;
		const context = canvas.getContext('2d');
		if (!context) return;


                draw(
                        context,
                        playerRef.current,
                        platforms,
                        coins,
                        enemies,
                        cameraRef.current,
                        coinsCollected,
                );
	});

	// 4. Рендерим <canvas> и HUD
        return (
                <div className="game-container">
                        <canvas
                                ref={canvasRef}
                                width={GAME_WIDTH}
                                height={GAME_HEIGHT}
                                className="game-canvas"
                        />
                </div>
        );
};

export default Game;
