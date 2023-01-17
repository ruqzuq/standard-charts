import React from 'react';
import * as ReactDOM from 'react-dom/client';
import { App } from './App';
import './index.css';

//avoid dragging images
window.ondragstart = function () {
	return false;
};

ReactDOM.createRoot(document.getElementById('body')).render(<App />);
