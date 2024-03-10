import { Color } from './Color';
import { Scenario } from './Data';
import { Rect } from './Rect';
import { Position } from './Types';

export class Polygon {
  static asyncDraw: (() => void)[] = [];

  static draw(
    context: OffscreenCanvasRenderingContext2D,
    points: Position[],
    scenario: Scenario,
    customColor: string = undefined
  ) {
    const asyncPoints = [...points];
    Polygon.asyncDraw.push(() => {
      switch (scenario) {
        case Scenario.PY:
          this.drawPY(context, asyncPoints, customColor);
          break;
        case Scenario.AC:
          this.drawAC(context, asyncPoints, customColor);
          break;
        case Scenario.FC:
          this.drawFC(context, asyncPoints, customColor);
          break;
        case Scenario.PL:
          this.drawPL(context, asyncPoints, customColor);
          break;
      }
    });
  }

  static createPolygon(
    context: OffscreenCanvasRenderingContext2D,
    points: Position[]
  ) {
    context.beginPath();
    context.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      context.lineTo(points[i].x, points[i].y);
    }
    context.closePath();
  }

  static drawPY(
    context: OffscreenCanvasRenderingContext2D,
    points: Position[],
    customColor: string
  ) {
    this.createPolygon(context, points);
    //
    context.filter = customColor ? 'opacity(0.6)' : 'none';
    context.fillStyle = customColor ?? Color.Fill.PY;
    context.fill();
    context.filter = 'none';
  }

  static drawAC(
    context: OffscreenCanvasRenderingContext2D,
    points: Position[],
    customColor: string
  ) {
    this.createPolygon(context, points);
    //
    context.fillStyle = customColor ?? Color.Fill.AC;
    context.fill();
  }

  static drawFC(
    context: OffscreenCanvasRenderingContext2D,
    points: Position[],
    customColor
  ) {
    this.createPolygon(context, points);
    //
    context.fillStyle = Color.Fill.FC;
    context.fill();
    //
    context.fillStyle = context.createPattern(
      Rect.createPinstripeCanvas(customColor),
      'repeat'
    );
    context.fill();
    //
    context.lineWidth = 2;
    context.strokeStyle = customColor ?? Color.Stroke.FC;
    context.stroke();
  }

  static drawPL(
    context: OffscreenCanvasRenderingContext2D,
    points: Position[],
    customColor: string
  ) {
    this.createPolygon(context, points);
    //
    context.fillStyle = Color.Fill.PL;
    context.fill();
    //
    context.lineWidth = 2;
    context.strokeStyle = customColor ?? Color.Stroke.PL;
    context.stroke();
  }
}
