import { Box } from './Box';
import { Color } from './Color';
import { Scenario } from './Data';
import { Debug } from './utils/Debug';

export class Rect {
  static asyncDraw: (() => void)[] = [];

  static drawDebug(context: OffscreenCanvasRenderingContext2D, box: Box) {
    context.lineWidth = 2;
    context.strokeStyle = Debug.color();
    context.strokeRect(box.drawX(), box.drawY(), box.width, box.height);
  }

  static draw(
    context: OffscreenCanvasRenderingContext2D,
    box: Box,
    scenario: Scenario,
    customColor: string = undefined
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
        this.drawPL(context, box, customColor);
        break;
    }
  }

  // todo refactor Rect drawing
  static drawFill(context, box, color) {
    Rect.asyncDraw.push(() => {
      context.fillStyle = color;
      context.fillRect(box.drawX(), box.drawY(), box.width, box.height);
    });
  }

  static drawPY(context: OffscreenCanvasRenderingContext2D, box: Box) {
    Rect.asyncDraw.push(() => {
      context.fillStyle = Color.Fill.PY;
      context.fillRect(box.drawX(), box.drawY(), box.width, box.height);
    });
  }
  static drawAC(
    context: OffscreenCanvasRenderingContext2D,
    box: Box,
    customColor: string
  ) {
    Rect.asyncDraw.push(() => {
      context.fillStyle = customColor ?? Color.Fill.AC;
      context.fillRect(box.drawX(), box.drawY(), box.width, box.height);
    });
  }
  static drawFC(
    context: OffscreenCanvasRenderingContext2D,
    box: Box,
    customColor
  ) {
    Rect.asyncDraw.push(() => {
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
    });
  }
  static drawPL(
    context: OffscreenCanvasRenderingContext2D,
    box: Box,
    customColor: string
  ) {
    Rect.asyncDraw.push(() => {
      context.fillStyle = Color.Fill.PL;
      context.fillRect(
        box.drawX() + 1,
        box.drawY() + 1,
        box.width - 2,
        box.height - 2
      );
      //
      context.lineWidth = 2;
      context.strokeStyle = customColor ?? Color.Stroke.PL;
      context.strokeRect(
        box.drawX() + 1,
        box.drawY() + 1,
        box.width - 2,
        box.height - 2
      );
    });
  }

  static createPinstripeCanvas(customColor) {
    const patternCanvas = new OffscreenCanvas(8, 8);
    const pctx = patternCanvas.getContext('2d', {
      antialias: false,
    });
    const color = customColor ?? '#404040';

    const canvasSideLength = 8;
    const canvasWidth = canvasSideLength;
    const canvasHeight = canvasSideLength;
    const divisions = 4;

    patternCanvas.width = canvasWidth;
    patternCanvas.height = canvasHeight;
    pctx.fillStyle = color;

    // Top line
    pctx.beginPath();
    pctx.moveTo(0, canvasHeight * (1 / divisions));
    pctx.lineTo(canvasWidth * (1 / divisions), 0);
    pctx.lineTo(0, 0);
    pctx.lineTo(0, canvasHeight * (1 / divisions));
    pctx.fill();

    // Middle line
    pctx.beginPath();
    pctx.moveTo(canvasWidth, canvasHeight * (1 / divisions));
    pctx.lineTo(canvasWidth * (1 / divisions), canvasHeight);
    pctx.lineTo(0, canvasHeight);
    pctx.lineTo(0, canvasHeight * ((divisions - 1) / divisions));
    pctx.lineTo(canvasWidth * ((divisions - 1) / divisions), 0);
    pctx.lineTo(canvasWidth, 0);
    pctx.lineTo(canvasWidth, canvasHeight * (1 / divisions));
    pctx.fill();

    // Bottom line
    pctx.beginPath();
    pctx.moveTo(canvasWidth, canvasHeight * ((divisions - 1) / divisions));
    pctx.lineTo(canvasWidth * ((divisions - 1) / divisions), canvasHeight);
    pctx.lineTo(canvasWidth, canvasHeight);
    pctx.lineTo(canvasWidth, canvasHeight * ((divisions - 1) / divisions));
    pctx.fill();

    return patternCanvas;
  }
}
