import { TextDimension } from '../text/TextDimension';

export class Direction {
  static LEFT = 'LEFT';
  static RIGHT = 'RIGHT';
  static TOP = 'TOP';
  static BOTTOM = 'BOTTOM';

  static oppositeDirection(direction) {
    switch (direction) {
      case Direction.LEFT:
        return Direction.RIGHT;
      case Direction.RIGHT:
        return Direction.LEFT;
      case Direction.TOP:
        return Direction.BOTTOM;
      case Direction.BOTTOM:
        return Direction.TOP;
    }
  }
}

/**
 * R2
 */
export class AxialRect {
  /**
   *
   * @param {number} x
   * @param {number} y
   * @param {number} width
   * @param {number} height
   * @param {"LEFT"|"RIGHT"|"TOP"|"BOTTOM"} direction
   */
  constructor(x, y, width, height, direction) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.direction = direction;
  }

  /**
   * R3
   *
   * @returns
   */
  draw() {
    const rect = {};

    if (
      this.direction === Direction.LEFT ||
      this.direction === Direction.RIGHT
    ) {
      rect.x = this.x - (this.direction === Direction.LEFT ? this.height : 0);
      rect.y = this.y - this.width / 2;
      rect.width = this.height;
      rect.height = this.width;
    } else {
      rect.x = this.x - this.width / 2;
      rect.y = this.y - (this.direction === Direction.TOP ? this.height : 0);
      rect.width = this.width;
      rect.height = this.height;
    }

    return rect;
  }

  /**
   * R4
   *
   * @param {string} word
   * @returns {{x: number, y: number}}
   */
  centerWord(word) {
    return TextDimension.centerWordInRect(word, this.draw());
  }

  /**
   * R6
   *
   * @returns {{x: number, y: number}}
   */
  topPosition() {
    switch (this.direction) {
      case Direction.LEFT:
        return { x: this.x - this.height, y: this.y };
      case Direction.RIGHT:
        return { x: this.x + this.height, y: this.y };
      case Direction.TOP:
        return { x: this.x, y: this.y - this.height };
      case Direction.BOTTOM:
        return { x: this.x, y: this.y + this.height };
    }
  }

  /**
   * R7
   *
   * @param {string} word
   * @returns {{x: number, y: number}}
   */
  topWord(word) {
    const topRect = new AxialRect(
      this.x,
      this.topPosition().y,
      this.width,
      this.direction === Direction.LEFT || this.direction === Direction.RIGHT
        ? TextDimension.widthOfWord(word) + 4
        : TextDimension.totalHeight + 1, // Some distance to the column.
      this.direction
    );

    return TextDimension.centerWordInRect(word, topRect.draw());
  }

  /**
   * R7
   *
   * @param {string} word
   * @returns {{x: number, y: number}}
   */
  bottomWord(word) {
    const bottomRect = new AxialRect(
      this.x,
      this.y,
      this.width,
      this.direction === Direction.LEFT || this.direction === Direction.RIGHT
        ? TextDimension.widthOfWord(word) + 4
        : TextDimension.totalHeight + 3, // Some distance to the axis.
      Direction.oppositeDirection(this.direction)
    );

    return TextDimension.centerWordInRect(word, bottomRect.draw());
  }
}
