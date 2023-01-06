import { SvgFont } from '../text/SvgFont';

export function renderChart(props = {}) {
  const { chart, height = '100%', width = '100%' } = props;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" version="1.2" >
    <defs>
        <pattern id="stripes" patternUnits="userSpaceOnUse" width="4" height="4" fill="red" patternTransform="rotate(45)">
            <line x1="0" y="0" x2="0" y2="4" stroke="rgb(65,65,64)" stroke-width="4" />
        </pattern>
        ${SvgFont}
    </defs>
    <g >
    ${chart}
    </g>
    </svg>`;
}
//shape-rendering="crispEdges"
