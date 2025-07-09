import {PLAYER_DIMENSIONS} from './collision';

export const GAME_PHYSICS = {
	speed: 5,
	gravity: 0.5,
	jumpForce: -12,
};

/**
 * Обновляет состояние игрока, применяя ввод, физику и надежное обнаружение столкновений.
 * @param {object} player - Текущее состояние игрока.
 * @param {object} input - Состояние ввода от клавиатуры.
 * @param {array} platforms - Массив всех платформ на уровне.
 * @returns {object} - Новое, обновленное состояние игрока.
 */
export const updatePlayerState = (player, input, platforms) => {
	const newPlayerState = {...player};

	// 1. Горизонтальное движение
	if (input.left) {
		newPlayerState.x -= GAME_PHYSICS.speed;
	}
	if (input.right) {
		newPlayerState.x += GAME_PHYSICS.speed;
	}

	if (input.jump && newPlayerState.isGrounded) {
		newPlayerState.yVelocity = GAME_PHYSICS.jumpForce;
	}

	const oldBottom = newPlayerState.y + PLAYER_DIMENSIONS.height;

	newPlayerState.yVelocity += GAME_PHYSICS.gravity;
	newPlayerState.y += newPlayerState.yVelocity;

	const newBottom = newPlayerState.y + PLAYER_DIMENSIONS.height;

	let collidedPlatform = null;

	for (const platform of platforms) {
		const isHorizontallyAligned =
			newPlayerState.x + PLAYER_DIMENSIONS.width > platform.x &&
			newPlayerState.x < platform.x + platform.width;

		const crossedPlatformTop = (oldBottom <= platform.y) && (newBottom >= platform.y);

		if (isHorizontallyAligned && crossedPlatformTop) {
			collidedPlatform = platform;
			break;
		}
	}

	if (collidedPlatform) {
		newPlayerState.y = collidedPlatform.y - PLAYER_DIMENSIONS.height;
		newPlayerState.yVelocity = 0;
		newPlayerState.isGrounded = true;
	} else {
		newPlayerState.isGrounded = false;
	}

	return newPlayerState;};
