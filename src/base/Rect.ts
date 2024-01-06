import { Box } from './Box';
import { Color } from './Color';
import { Scenario } from './Data';
import { Debug } from './Debug';

export class Rect {
  static drawDebug(context: OffscreenCanvasRenderingContext2D, box: Box) {
    context.lineWidth = 2;
    context.strokeStyle = Debug.color();
    context.strokeRect(box.drawX(), box.drawY(), box.width, box.height);
  }

  static draw(
    context: OffscreenCanvasRenderingContext2D,
    box: Box,
    scenario: Scenario,
    customColor = undefined
  ) {
    switch (scenario) {
      case Scenario.PY:
        this.drawPY(context, box);
        break;
      case Scenario.AC:
        this.drawAC(context, box, customColor);
        break;
      case Scenario.FC:
        this.drawFC(context, box, customColor);
        break;
      case Scenario.PL:
        this.drawPL(context, box);
        break;
    }
  }

  static drawPY(context: OffscreenCanvasRenderingContext2D, box: Box) {
    context.fillStyle = Color.Fill.PY;
    context.fillRect(box.drawX(), box.drawY(), box.width, box.height);
  }
  static drawAC(
    context: OffscreenCanvasRenderingContext2D,
    box: Box,
    customColor
  ) {
    context.fillStyle = customColor ?? Color.Fill.AC;
    context.fillRect(box.drawX(), box.drawY(), box.width, box.height);
  }
  static drawFC(
    context: OffscreenCanvasRenderingContext2D,
    box: Box,
    customColor
  ) {
    context.fillStyle = Color.Fill.FC;
    context.fillRect(
      box.drawX() + 1,
      box.drawY() + 1,
      box.width - 2,
      box.height - 2
    );
    //
    context.fillStyle = context.createPattern(
      this.createPinstripeCanvas(customColor),
      'repeat'
    );
    context.fillRect(
      box.drawX() + 1,
      box.drawY() + 1,
      box.width - 2,
      box.height - 2
    );
    //
    context.lineWidth = 2;
    context.strokeStyle = customColor ?? Color.Stroke.FC;
    context.strokeRect(
      box.drawX() + 1,
      box.drawY() + 1,
      box.width - 2,
      box.height - 2
    );
  }
  static drawPL(context: OffscreenCanvasRenderingContext2D, box: Box) {
    context.fillStyle = Color.Fill.PL;
    context.fillRect(
      box.drawX() + 1,
      box.drawY() + 1,
      box.width - 2,
      box.height - 2
    );
    //
    context.lineWidth = 2;
    context.strokeStyle = Color.Stroke.PL;
    context.strokeRect(
      box.drawX() + 1,
      box.drawY() + 1,
      box.width - 2,
      box.height - 2
    );
  }

  static createPinstripeCanvas(customColor) {
    const patternCanvas = new OffscreenCanvas(8, 8);
    const pctx = patternCanvas.getContext('2d', {
      antialias: false,
    });
    const color = customColor ?? '#404040';

    const CANVAS_SIDE_LENGTH = 8;
    const WIDTH = CANVAS_SIDE_LENGTH;
    const HEIGHT = CANVAS_SIDE_LENGTH;
    const DIVISIONS = 4;

    patternCanvas.width = WIDTH;
    patternCanvas.height = HEIGHT;
    pctx.fillStyle = color;

    // Top line
    pctx.beginPath();
    pctx.moveTo(0, HEIGHT * (1 / DIVISIONS));
    pctx.lineTo(WIDTH * (1 / DIVISIONS), 0);
    pctx.lineTo(0, 0);
    pctx.lineTo(0, HEIGHT * (1 / DIVISIONS));
    pctx.fill();

    // Middle line
    pctx.beginPath();
    pctx.moveTo(WIDTH, HEIGHT * (1 / DIVISIONS));
    pctx.lineTo(WIDTH * (1 / DIVISIONS), HEIGHT);
    pctx.lineTo(0, HEIGHT);
    pctx.lineTo(0, HEIGHT * ((DIVISIONS - 1) / DIVISIONS));
    pctx.lineTo(WIDTH * ((DIVISIONS - 1) / DIVISIONS), 0);
    pctx.lineTo(WIDTH, 0);
    pctx.lineTo(WIDTH, HEIGHT * (1 / DIVISIONS));
    pctx.fill();

    // Bottom line
    pctx.beginPath();
    pctx.moveTo(WIDTH, HEIGHT * ((DIVISIONS - 1) / DIVISIONS));
    pctx.lineTo(WIDTH * ((DIVISIONS - 1) / DIVISIONS), HEIGHT);
    pctx.lineTo(WIDTH, HEIGHT);
    pctx.lineTo(WIDTH, HEIGHT * ((DIVISIONS - 1) / DIVISIONS));
    pctx.fill();

    return patternCanvas;
  }
}
