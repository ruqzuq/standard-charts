export function renderRect(props = {}) {
  const {
    x = 0,
    y = 0,
    width = 10,
    height = 10,
    fill = 'none',
    stroke = 'none',
    strokeWidth = 0,
    opacity = 1,
  } = props;

  const baseProps = `
    fill="${fill}" 
    opacity="${opacity}"
    `;

  // Inner stroke.
  if (stroke !== 'none') {
    return `<rect 
    ${baseProps}
    x="${x + strokeWidth / 2}" 
    y="${y + strokeWidth / 2}" 
    width="${width - strokeWidth}" 
    height="${height - strokeWidth}" 
    stroke="${stroke}" 
    stroke-width="${strokeWidth}"
    />`;
  }

  return `<rect 
    ${baseProps}
    x="${x}" 
    y="${y}" 
    width="${width}" 
    height="${height}" 
    />`;
}
