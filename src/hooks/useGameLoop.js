import {useEffect, useRef} from 'react';

export const useGameLoop = (callback) => {
	const requestRef = useRef();

	const callbackRef = useRef(callback);

	useEffect(() => {
		callbackRef.current = callback;
	}, [callback]);

	useEffect(() => {
		const animate = (time) => {
			if (callbackRef.current) {
				callbackRef.current(time);
			}
			requestRef.current = requestAnimationFrame(animate);
		};

		requestRef.current = requestAnimationFrame(animate);
		return () => cancelAnimationFrame(requestRef.current);
	}, []);
};