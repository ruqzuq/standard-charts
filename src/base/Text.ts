import { Box } from './Box';
import { Rect } from './Rect';

export interface TextProps {
  bold?: boolean;
  size?: number;
  family?: string;
}

export class Text {
  text: string;
  font: string;
  width: number;
  height: number;
  padding: number;
  box: Box;
  boxWidth: number;
  boxHeight: number;

  constructor(context, text, props: TextProps = {}) {
    const { bold = false, size = 10, family = 'Arial' } = props;

    this.text = text;
    this.font = `${bold ? 'bold' : ''} ${size}px ${family}`;

    context.font = this.font;
    this.width = context.measureText(text).width;

    this.height = size;

    this.padding = Math.ceil(size / 8);

    this.boxWidth = this.width + this.padding * 2;
    this.boxHeight = this.height + this.padding * 2;
  }

  // Drawing
  draw(context: OffscreenCanvasRenderingContext2D, debug: boolean = false) {
    context.fillStyle = 'white';
    context.globalAlpha = 0.5;
    context.fillRect(
      this.box.drawX(),
      this.box.drawY(),
      this.box.width,
      this.box.height
    );
    context.globalAlpha = 1;

    context.font = this.font;
    context.fillStyle = 'black';
    context.fillText(
      this.text,
      this.box.drawX() + this.padding,
      this.box.drawY() + this.padding
    );

    if (debug) {
      Rect.drawDebug(context, this.box);
    }
  }
  //

  // Placements
  placeTopLeft(box: Box) {
    const { x, y } = box.topLeft();
    this.box = new Box(
      { x: x - this.boxWidth / 2, y: y - this.boxHeight / 2 },
      this.boxWidth,
      this.boxHeight
    );
  }
  placeTopMiddle(box: Box) {
    const { x, y } = box.topMiddle();
    this.box = new Box(
      { x, y: y - this.boxHeight / 2 },
      this.boxWidth,
      this.boxHeight
    );
  }
  placeTopRight(box: Box) {
    const { x, y } = box.topRight();
    this.box = new Box(
      { x: x + this.boxWidth / 2, y: y - this.boxHeight / 2 },
      this.boxWidth,
      this.boxHeight
    );
  }

  placeMiddleLeft(box: Box) {
    const { x, y } = box.middleLeft();
    this.box = new Box(
      { x: x - this.boxWidth / 2, y },
      this.boxWidth,
      this.boxHeight
    );
  }
  placeCenter(box: Box) {
    const { x, y } = box.center();
    this.box = new Box({ x, y }, this.boxWidth, this.boxHeight);
  }
  placeMiddleRight(box: Box) {
    const { x, y } = box.middleRight();
    this.box = new Box(
      { x: x + this.boxWidth / 2, y },
      this.boxWidth,
      this.boxHeight
    );
  }

  placeBottomLeft(box: Box) {
    const { x, y } = box.bottomLeft();
    this.box = new Box(
      { x: x - this.boxWidth / 2, y: y + this.boxHeight / 2 },
      this.boxWidth,
      this.boxHeight
    );
  }
  placeBottomMiddle(box: Box) {
    const { x, y } = box.bottomMiddle();
    this.box = new Box(
      { x, y: y + this.boxHeight / 2 },
      this.boxWidth,
      this.boxHeight
    );
  }
  placeBottomRight(box: Box) {
    const { x, y } = box.bottomRight();
    this.box = new Box(
      { x: x + this.boxWidth / 2, y: y + this.boxHeight / 2 },
      this.boxWidth,
      this.boxHeight
    );
  }
  //
}
