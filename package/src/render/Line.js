export function renderLine(props = {}) {
  const { startPosition, endPosition } = props;

  return `<line 
  x1="${startPosition.x}" 
  y1="${startPosition.y}" 
  x2="${endPosition.x}" 
  y2="${endPosition.y}" 
  stroke="black" 
  stroke-width="1"
  stroke-linecap="round"
  />`;
}
