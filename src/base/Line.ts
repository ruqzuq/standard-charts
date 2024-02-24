import { Color } from './Color';
import { Scenario } from './Data';
import { Position } from './Types';

export class Line {
  static asyncDraw: (() => void)[] = [];

  static draw(
    context: OffscreenCanvasRenderingContext2D,
    start: Position,
    end: Position,
    scenario: Scenario
  ) {
    let color;
    switch (scenario) {
      case Scenario.PY:
        color = Color.Fill.PY;
        break;
      case Scenario.AC:
        color = Color.Fill.AC;
        break;
      case Scenario.FC:
        color = Color.Stroke.FC;
        break;
      case Scenario.PL:
        color = Color.Stroke.PL;
        break;
    }
    Line.asyncDraw.push(() => {
      context.strokeStyle = color;
      context.lineWidth = 3;
      context.beginPath();
      context.moveTo(start.x, start.y);
      context.lineTo(end.x, end.y);
      context.stroke();
    });
  }
}
