import { Color } from './Color';
import { Scenario } from './Data';
import { Orientation } from './orientation/Orientation';
import { Rect } from './Rect';
import { Position } from './Types';

export class ColumnAxis {
  x: number;
  y: number;
  width: number;
  orientation: Orientation;

  static asyncDraw: (() => void)[] = [];

  constructor({ x, y }: Position, width: number, orientation: Orientation) {
    this.x = orientation === Orientation.Horizontal ? x : y;
    this.y = orientation === Orientation.Horizontal ? y : x;
    this.width = width;
    this.orientation = orientation;
  }

  draw(
    context: OffscreenCanvasRenderingContext2D,
    scenario: Scenario = undefined,
    async = true
  ) {
    const draw = () => {
      switch (scenario) {
        case Scenario.PY:
          this.drawPY(context);
          break;
        case Scenario.AC:
          this.drawAC(context);
          break;
        case Scenario.FC:
          this.drawFC(context);
          break;
        case Scenario.PL:
          this.drawPL(context);
          break;
        default:
          this.drawAC(context);
      }
    };

    if (async) {
      ColumnAxis.asyncDraw.push(draw);
    } else {
      draw();
    }
  }

  fillRect(
    context: OffscreenCanvasRenderingContext2D,
    x: number,
    y: number,
    height: number
  ) {
    context.fillRect(
      x,
      y,
      this.orientation === Orientation.Horizontal ? this.width : height,
      this.orientation === Orientation.Horizontal ? height : this.width
    );
  }

  drawPY(context: OffscreenCanvasRenderingContext2D) {
    context.fillStyle = Color.Fill.PY;
    this.fillRect(context, this.x, this.y - 2, 4);
  }

  drawAC(context: OffscreenCanvasRenderingContext2D) {
    context.fillStyle = Color.Fill.AC;
    this.fillRect(context, this.x, this.y - 1, 2);
  }

  drawFC(context: OffscreenCanvasRenderingContext2D) {
    context.fillStyle = context.createPattern(
      Rect.createPinstripeCanvas(undefined),
      'repeat'
    );
    this.fillRect(context, this.x, this.y - 2, 4);
    //
    context.fillStyle = Color.Stroke.FC;
    this.fillRect(context, this.x, this.y - 2, 1);
    this.fillRect(context, this.x, this.y + 1, 1);
  }

  drawPL(context: OffscreenCanvasRenderingContext2D) {
    context.fillStyle = Color.Stroke.PL;
    this.fillRect(context, this.x, this.y - 2, 1);
    this.fillRect(context, this.x, this.y + 1, 1);
  }
}
