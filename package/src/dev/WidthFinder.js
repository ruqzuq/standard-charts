import React, { useEffect, useState } from 'react';
import { SvgFont } from '../text/svgFont';

function renderRect(props = {}) {
	const { width = 10, height = 10, x = 0, y = 0 } = props;
	return `<rect x="${x}" y="${y}" width="${width}" height="${height}" style="fill:rgb(200,88,88)" />`;
}

function renderFinder(char, width) {
	return `
	${renderRect({ x: 7.22, y: 0, height: 18, width })}
	<text x="0" y="14.67" font-family="Svg" font-weight="400" font-size="14x" letter-spacing="0">_${char}_</text>
	`;
}

/**
 * Find the width of a char.
 */
export function WidthFinder() {
	const [width, setWidth] = useState(10);

	const [image, setImage] = useState('');

	const char = 'A';

	/**
	 * Click/focus div before key.
	 *
	 * Decrease width: a/s
	 * Increase width: d/f
	 */
	const handleKey = (event) => {
		switch (event.keyCode) {
		case 65:
			setWidth((width) => width - 0.1);
			break;
		case 83:
			setWidth((width) => width - 0.01);
			break;
		case 68:
			setWidth((width) => width + 0.01);
			break;
		case 70:
			setWidth((width) => width + 0.1);
			break;
		case 32:
			console.log('// ' + char + '\n' + width + ', \n');
			break;
		}
	};

	useEffect(() => {
		setImage(
			`<svg xmlns="http://www.w3.org/2000/svg" version="1.2" ><defs>${SvgFont}</defs>${renderFinder(
				char,
				width
			)}</svg>`
		);
	}, [width]);

	return (
		<div onKeyDown={handleKey} tabIndex="0" style={{ position: 'absolute' }}>
			<img
				src={`data:image/svg+xml;utf8,${image}`}
				style={{
					position: 'absolute',
					backgroundColor: 'lightgrey',
					top: '500px',
					left: '500px',
					height: '50px',
					width: '50px',
					transform: 'scale(20)',
				}}
			/>
		</div>
	);
}
