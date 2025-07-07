import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Находим корневой элемент в public/index.html
const root = ReactDOM.createRoot(document.getElementById('root'));

// Рендерим наше приложение внутри этого элемента
root.render(
	<React.StrictMode>
		<App/>
	</React.StrictMode>
);