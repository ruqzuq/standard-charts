import { Position } from './Types';

/**
    Top-Left─────────Top-Middle─────────Top-Right
        │                                  │
        │                                  │
    Middle-Left        Center        Middle-Right
        │                                  │
        │                                  │
    Bottom-Left─────Bottom-Middle────Bottom-Right
*/

/**
 * Box.
 */
export class Box {
  // Constructors
  static fromTopLeft(box: Box, width: number, height: number) {
    const { x, y } = box.topLeft();
    return new Box({ x: x - width / 2, y: y - height / 2 }, width, height);
  }
  static fromTopMiddle(box: Box, width: number, height: number) {
    const { x, y } = box.topMiddle();
    return new Box({ x, y: y - height / 2 }, width, height);
  }
  static fromTopRight(box: Box, width: number, height: number) {
    const { x, y } = box.topRight();
    return new Box({ x: x + width / 2, y: y - height / 2 }, width, height);
  }

  static fromMiddleLeft(box: Box, width: number, height: number) {
    const { x, y } = box.middleLeft();
    return new Box({ x: x - width / 2, y }, width, height);
  }
  static fromCenter(box: Box, width: number, height: number) {
    const { x, y } = box.center();
    return new Box({ x, y }, width, height);
  }
  static fromMiddleRight(box: Box, width: number, height: number) {
    const { x, y } = box.middleRight();
    return new Box({ x: x + width / 2, y }, width, height);
  }

  static fromBottomLeft(box: Box, width: number, height: number) {
    const { x, y } = box.bottomLeft();
    return new Box({ x: x - width / 2, y: y + height / 2 }, width, height);
  }
  static fromBottomMiddle(box: Box, width: number, height: number) {
    const { x, y } = box.bottomMiddle();
    return new Box({ x, y: y + height / 2 }, width, height);
  }
  static fromBottomRight(box: Box, width: number, height: number) {
    const { x, y } = box.bottomRight();
    return new Box({ x: x + width / 2, y: y + height / 2 }, width, height);
  }

  /**
   *  X-Position of the box in `px` (centered).
   */
  x: number;
  /**
   *  Y-Position of the box in `px` (centered).
   */
  y: number;
  /**
   *  Width of the box in `px`.
   */
  width: number;
  /**
   *  Height of the box in `px`.
   */
  height: number;

  // from Center
  constructor({ x, y }: Position, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  // Position Getter
  topLeft(): Position {
    return { x: this.x - this.width / 2, y: this.y - this.height / 2 };
  }
  topMiddle(): Position {
    return { x: this.x, y: this.y - this.height / 2 };
  }
  topRight(): Position {
    return { x: this.x + this.width / 2, y: this.y - this.height / 2 };
  }

  middleLeft(): Position {
    return { x: this.x - this.width / 2, y: this.y };
  }
  center(): Position {
    return { x: this.x, y: this.y };
  }
  middleRight(): Position {
    return { x: this.x + this.width / 2, y: this.y };
  }

  bottomLeft(): Position {
    return { x: this.x - this.width / 2, y: this.y + this.height / 2 };
  }
  bottomMiddle(): Position {
    return { x: this.x, y: this.y + this.height / 2 };
  }
  bottomRight(): Position {
    return { x: this.x + this.width / 2, y: this.y + this.height / 2 };
  }
  //

  // Draw Position Getter (Top-Left)
  drawX() {
    return this.x - this.width / 2;
  }
  drawY() {
    return this.y - this.height / 2;
  }
  //
}
