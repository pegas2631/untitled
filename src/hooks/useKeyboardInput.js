import {useState, useEffect} from 'react';

export const useKeyboardInput = () => {
	const [input, setInput] = useState({
		left: false,
		right: false,
		jump: false,
	});

	useEffect(() => {
		const handleKeyDown = (e) => {
			// ОТЛАДКА: выводим в консоль нажатую клавишу

			if (e.key === 'ArrowLeft') setInput(prev => ({...prev, left: true}));
			if (e.key === 'ArrowRight') setInput(prev => ({...prev, right: true}));
			if (e.key === ' ') setInput(prev => ({...prev, jump: true}));
		};

		const handleKeyUp = (e) => {
			if (e.key === 'ArrowLeft') setInput(prev => ({...prev, left: false}));
			if (e.key === 'ArrowRight') setInput(prev => ({...prev, right: false}));
			if (e.key === ' ') setInput(prev => ({...prev, jump: false}));
		};


		window.addEventListener('keydown', handleKeyDown);
		window.addEventListener('keyup', handleKeyUp);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
			window.removeEventListener('keyup', handleKeyUp);
		};
	}, []); // Пустой массив зависимостей гарантирует, что эффект выполнится только один раз

	return input;
};