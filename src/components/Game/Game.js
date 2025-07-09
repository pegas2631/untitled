// src/components/Game/Game.js

import React, {useEffect, useRef, useState} from 'react';
import {useGameLoop} from '../../hooks/useGameLoop';
import {useKeyboardInput} from '../../hooks/useKeyboardInput';
import {updatePlayerState} from '../../game/physics';
import {draw} from '../../game/draw'; // 1. Импортируем нашу новую функцию отрисовки
import {PLAYER_DIMENSIONS} from '../../game/collision';
import levelData from '../../levels/level1.json';
import './Game.css';

// Удаляем импорты Player и Platform, они больше не нужны

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const WORLD_WIDTH = 2000;
// Высота мира не ограничена снизу, но камера не двигается ниже 0

const Game = () => {
        const canvasRef = useRef(null); // 2. Ref для доступа к элементу <canvas>

        const cameraRef = useRef({x: 0, y: 0});

	const playerRef = useRef({
		x: 100,
		y: 100,
		yVelocity: 0,
		isGrounded: false,
	});

	// `playerPosition` state больше не нужен, так как мы не передаем его в дочерний компонент
        const [platforms, setPlatforms] = useState([]);
	const input = useKeyboardInput();

	useEffect(() => {
		if (levelData && Array.isArray(levelData)) {
			setPlatforms(levelData);
		}
	}, []);

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
                if (playerRef.current.y - cameraRef.current.y > GAME_HEIGHT) {
			playerRef.current.x = 100;
			playerRef.current.y = 100;
			playerRef.current.yVelocity = 0;
			playerRef.current.isGrounded = false;
		}

		// --- Новая логика отрисовки ---
		const canvas = canvasRef.current;
		const context = canvas.getContext('2d');
		if (!context) return;

                // 3. Вызываем нашу функцию отрисовки на каждом кадре
                draw(context, playerRef.current, platforms, cameraRef.current);
        });

	// 4. Рендерим только один <canvas> элемент
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
