import { Box } from '../base/Box';
import { Data } from '../base/Data';
import { DataType } from '../base/DataTypes';
import { Rect } from '../base/Rect';
import { Constants } from './Constants';

export interface ChartProps<Type extends DataType> {
  width: number;
  height: number;
  data: Data<Type>;
  debug?: boolean;
}

export class Chart<Type extends DataType> implements ChartProps<Type> {
  width: number;
  height: number;
  data: Data<Type>;
  debug?: boolean;

  canvas: OffscreenCanvas;
  context: OffscreenCanvasRenderingContext2D;

  constructor(props: ChartProps<Type>) {
    const { width, height, data, debug } = props;

    // Props
    this.width = width;
    this.height = height;
    this.data = data;
    this.debug = debug;

    // Canvas
    this.canvas = new OffscreenCanvas(width, height);
    this.context = this.canvas.getContext('2d', {
      alpha: true,
    });
    this.context.globalAlpha = 1;
    this.context.textBaseline = 'top';
  }

  drawDebug() {
    if (this.debug) {
      const outerBox = new Box(
        {
          x: this.width / 2,
          y: this.height / 2,
        },
        this.width,
        this.height
      );
      const innerBox = new Box(
        {
          x: this.width / 2,
          y: this.height / 2,
        },
        this.width - 2 * Constants.ChartPadding,
        this.height - 2 * Constants.ChartPadding
      );

      Rect.drawDebug(this.context, innerBox);
      Rect.drawDebug(this.context, outerBox);
    }
  }
}
