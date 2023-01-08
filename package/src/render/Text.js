import { TextDimension } from '../text/TextDimension';
import { renderRect } from './Rect';

export function renderText(props = {}) {
  const {
    word = '',
    x = 0,
    y = 0,
    bold = false,
    color = 'rgb(0,0,0)',
    background,
    backgroundOpacity = 0.5,
  } = props;

  return `${
    background
      ? renderRect({
          x: x - 1,
          y: y - TextDimension.actualHeight,
          height: TextDimension.totalHeight,
          width: TextDimension.widthOfWord(word) + 2,
          fill: background,
          opacity: backgroundOpacity,
        })
      : ''
  }
  <text 
  x="${x}" 
  y="${y}" 
  font-family="Svg" 
  font-weight="${bold ? '700' : '400'}" 
  font-size="14x" 
  letter-spacing="0" 
  fill="${color}">
  ${word}
  </text>`;
}
