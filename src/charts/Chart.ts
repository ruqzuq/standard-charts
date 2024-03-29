import { Box } from '../base/Box';
import { Data } from '../base/Data';
import { DataType } from '../base/DataTypes';
import { Orientation } from '../base/orientation/Orientation';
import { Rect } from '../base/Rect';
import { Constants } from './Constants';
import { ChartStyle, ChartType } from './Types';

export interface ChartProps<Type extends DataType> {
  type: ChartType;
  style: ChartStyle;
  width: number;
  height: number;
  data: Data<Type>;
  debug?: boolean;
}

export class Chart<Type extends DataType> implements ChartProps<Type> {
  type: ChartType;
  style: ChartStyle;
  width: number;
  height: number;
  data: Data<Type>;
  debug?: boolean;

  canvas: OffscreenCanvas;
  context: OffscreenCanvasRenderingContext2D;
  chartOffset: number = 0;
  isExtension: boolean = false;

  //
  orientation: Orientation;
  orientationWidth: number;
  orientationHeight: number;

  constructor(props: ChartProps<Type>) {
    const { type, style, width, height, data, debug } = props;

    // Props
    this.type = type;
    this.style = style;
    this.width = width;
    this.height = height;
    this.data = data;
    this.debug = debug;

    this.orientation =
      this.style === ChartStyle.Bar
        ? Orientation.Vertical
        : Orientation.Horizontal;

    this.orientationWidth =
      this.orientation === Orientation.Horizontal ? this.width : this.height;
    this.orientationHeight =
      this.orientation === Orientation.Horizontal ? this.height : this.width;

    // Canvas
    this.canvas = new OffscreenCanvas(width, height);
    this.context = this.canvas.getContext('2d', {
      alpha: false,
    });
    this.context.globalAlpha = 1;
    this.context.textBaseline = 'top';
    this.context.fillStyle = '#ffffff';
    this.context.fillRect(0, 0, width, height);
    this.context.imageSmoothingEnabled = false;
  }

  drawDebug() {
    const chartHeight = this.isExtension
      ? this.height
      : this.height - this.chartOffset;
    if (this.debug) {
      const outerBox = new Box(
        {
          x: this.width / 2,
          y: this.chartOffset + chartHeight / 2,
        },
        this.width,
        chartHeight
      );
      const innerBox = new Box(
        {
          x: this.width / 2,
          y: this.chartOffset + chartHeight / 2,
        },
        this.width - 2 * Constants.ChartPadding,
        chartHeight - 2 * Constants.ChartPadding
      );

      Rect.drawDebug(this.context, innerBox);
      Rect.drawDebug(this.context, outerBox);
    }
  }
}
