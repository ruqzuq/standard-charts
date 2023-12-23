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
    scenario: Scenario
  ) {
    switch (scenario) {
      case Scenario.PY:
        this.drawPY(context, box);
        break;
      case Scenario.AC:
        this.drawAC(context, box);
        break;
      case Scenario.FC:
        this.drawFC(context, box);
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
  static drawAC(context: OffscreenCanvasRenderingContext2D, box: Box) {
    context.fillStyle = Color.Fill.AC;
    context.fillRect(box.drawX(), box.drawY(), box.width, box.height);
  }
  static drawFC(context: OffscreenCanvasRenderingContext2D, box: Box) {
    context.fillStyle = context.createPattern(
      this.createPinstripeCanvas(),
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
    context.strokeStyle = '#404040';
    context.strokeRect(
      box.drawX() + 1,
      box.drawY() + 1,
      box.width - 2,
      box.height - 2
    );
  }
  static drawPL(context: OffscreenCanvasRenderingContext2D, box: Box) {
    context.fillStyle = '#ffffff';
    context.fillRect(
      box.drawX() + 1,
      box.drawY() + 1,
      box.width - 2,
      box.height - 2
    );
    //
    context.lineWidth = 2;
    context.strokeStyle = '#494949';
    context.strokeRect(
      box.drawX() + 1,
      box.drawY() + 1,
      box.width - 2,
      box.height - 2
    );
  }

  static createPinstripeCanvas() {
    const patternCanvas = new OffscreenCanvas(8, 8);
    const pctx = patternCanvas.getContext('2d', {
      antialias: false,
    });
    const color = '#404040';

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
