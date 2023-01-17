import React, { useEffect, useState } from 'react';
import { SvgFont } from '../../package/src/text/SvgFont';

function renderRect(props = {}) {
  const { width = 10, height = 10, x = 0, y = 0, fill } = props;
  return `<rect x="${x}" y="${y}" width="${width}" height="${height}" style="fill:${
    fill ?? 'rgb(200,88,88)'
  }" />`;
}

function renderFinder(char, width) {
  // Only required to set TextDimension statics.
  const allChars =
    '+ !&quot;%23$%&amp;\'()*+,-./0123456789:;&lt;=&gt;?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^_`abcdefghijklmnopqrstuvwxyz{|}~';

  const newChar =
    char === '"'
      ? '&quot;'
      : char === '#'
      ? '%23'
      : char === '&'
      ? '&amp;'
      : char === '<'
      ? '&lt;'
      : char === '>'
      ? '&gt;'
      : char;

  return `
	${renderRect({ x: 6.3, y: 0, height: 16, width })}
	<text x="0" y="12.7" font-family="Svg" font-weight="400" font-size="14px" letter-spacing="0">_${newChar}_</text>
	`;
}

/**
 * Find the width of a char.
 */
export function WidthFinder() {
  const [width, setWidth] = useState(10);
  const [image, setImage] = useState('');

  const [output, setOutput] = useState('');

  // Only required to set TextDimension statics.
  const [currentChar, setCurrentChar] = useState(32);

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
        // eslint-disable-next-line no-case-declarations
        const newOutput =
          output +
          '// ' +
          String.fromCharCode(currentChar) +
          '\n' +
          Math.round(width * 1000) +
          ', \n';
        console.log(newOutput);
        setOutput(newOutput);
        setCurrentChar(currentChar + 1);
        break;
    }
  };

  useEffect(() => {
    setImage(
      `<svg xmlns="http://www.w3.org/2000/svg" version="1.2" ><defs>${SvgFont}</defs>${renderFinder(
        String.fromCharCode(currentChar),
        width
      )}</svg>`
    );
  }, [width, currentChar]);

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
