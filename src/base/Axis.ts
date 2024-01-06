import { Color } from './Color';
import { Scenario } from './Data';
import { Rect } from './Rect';
import { Position } from './Types';

export class ColumnAxis {
  x: number;
  y: number;
  width: number;

  constructor({ x, y }: Position, width: number) {
    this.x = x;
    this.y = y;
    this.width = width;
  }

  draw(
    context: OffscreenCanvasRenderingContext2D,
    scenario: Scenario = undefined
  ) {
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
  }

  drawPY(context: OffscreenCanvasRenderingContext2D) {
    context.fillStyle = Color.Fill.PY;
    context.fillRect(this.x, this.y - 2, this.width, 4);
  }

  drawAC(context: OffscreenCanvasRenderingContext2D) {
    context.fillStyle = Color.Fill.AC;
    context.fillRect(this.x, this.y - 1, this.width, 2);
  }

  drawFC(context: OffscreenCanvasRenderingContext2D) {
    context.fillStyle = context.createPattern(
      Rect.createPinstripeCanvas(undefined),
      'repeat'
    );
    context.fillRect(this.x, this.y - 2, this.width, 4);
    //
    context.fillStyle = Color.Stroke.FC;
    context.fillRect(this.x, this.y - 2, this.width, 1);
    context.fillRect(this.x, this.y + 1, this.width, 1);
  }

  drawPL(context: OffscreenCanvasRenderingContext2D) {
    context.fillStyle = Color.Stroke.PL;
    context.fillRect(this.x, this.y - 2, this.width, 1);
    context.fillRect(this.x, this.y + 1, this.width, 1);
  }
}
