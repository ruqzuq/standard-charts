import { Box } from '../Box';
import { Position } from '../Types';
import { Orientation } from './Orientation';

/**
    North-West─────────North─────────North-East
        │                                  │
        │                                  │
       West           Center              East
        │                                  │
        │                                  │
    South-West─────────South─────────South-East
*/

const fromGenericOrientationBox = (
  orientationBox: OrientationBox,
  width: number,
  height: number,
  horizontalConstructor: (box: Box, width: number, height: number) => Box,
  verticalConstructor: (box: Box, width: number, height: number) => Box
): OrientationBox => {
  return new OrientationBox(
    orientationBox.orientation === Orientation.Horizontal
      ? horizontalConstructor(orientationBox, width, height)
      : verticalConstructor(orientationBox, height, width),
    orientationBox.orientation
  );
};

/**
 * DirectionBox.
 */
export class OrientationBox extends Box {
  // Constructors

  static fromNorthWest(
    orientationBox: OrientationBox,
    width: number,
    height: number
  ) {
    return fromGenericOrientationBox(
      orientationBox,
      width,
      height,
      Box.fromTopLeft,
      Box.fromTopRight
    );
  }
  static fromNorth(
    orientationBox: OrientationBox,
    width: number,
    height: number
  ) {
    return fromGenericOrientationBox(
      orientationBox,
      width,
      height,
      Box.fromTopMiddle,
      Box.fromMiddleRight
    );
  }
  static fromNorthEast(
    orientationBox: OrientationBox,
    width: number,
    height: number
  ) {
    return fromGenericOrientationBox(
      orientationBox,
      width,
      height,
      Box.fromTopRight,
      Box.fromBottomRight
    );
  }

  static fromWest(
    orientationBox: OrientationBox,
    width: number,
    height: number
  ) {
    return fromGenericOrientationBox(
      orientationBox,
      width,
      height,
      Box.fromMiddleLeft,
      Box.fromTopMiddle
    );
  }
  static fromCenter(
    orientationBox: OrientationBox,
    width: number,
    height: number
  ) {
    return fromGenericOrientationBox(
      orientationBox,
      width,
      height,
      Box.fromCenter,
      Box.fromCenter
    );
  }
  static fromEast(
    orientationBox: OrientationBox,
    width: number,
    height: number
  ) {
    return fromGenericOrientationBox(
      orientationBox,
      width,
      height,
      Box.fromMiddleRight,
      Box.fromBottomMiddle
    );
  }

  static fromSouthWest(
    orientationBox: OrientationBox,
    width: number,
    height: number
  ) {
    return fromGenericOrientationBox(
      orientationBox,
      width,
      height,
      Box.fromBottomLeft,
      Box.fromTopLeft
    );
  }
  static fromSouth(
    orientationBox: OrientationBox,
    width: number,
    height: number
  ) {
    return fromGenericOrientationBox(
      orientationBox,
      width,
      height,
      Box.fromBottomMiddle,
      Box.fromMiddleLeft
    );
  }
  static fromSouthEast(
    orientationBox: OrientationBox,
    width: number,
    height: number
  ) {
    return fromGenericOrientationBox(
      orientationBox,
      width,
      height,
      Box.fromBottomRight,
      Box.fromBottomLeft
    );
  }

  /**
   * Orientation.
   */
  orientation: Orientation;

  constructor(box: Box, orientation: Orientation, adaptOrientation = false) {
    super(
      {
        x:
          !adaptOrientation || orientation === Orientation.Horizontal
            ? box.center().x
            : box.center().y,
        y:
          !adaptOrientation || orientation === Orientation.Horizontal
            ? box.center().y
            : box.center().x,
      },
      !adaptOrientation || orientation === Orientation.Horizontal
        ? box.width
        : box.height,
      !adaptOrientation || orientation === Orientation.Horizontal
        ? box.height
        : box.width
    );
    this.orientation = orientation;
  }

  // Position Getter
  northWest(): Position {
    return this.orientation === Orientation.Horizontal
      ? this.topLeft()
      : this.topRight();
  }
  north(): Position {
    return this.orientation === Orientation.Horizontal
      ? this.topMiddle()
      : this.middleRight();
  }
  northEast(): Position {
    return this.orientation === Orientation.Horizontal
      ? this.topRight()
      : this.bottomRight();
  }

  west(): Position {
    return this.orientation === Orientation.Horizontal
      ? this.middleLeft()
      : this.topMiddle();
  }
  east(): Position {
    return this.orientation === Orientation.Horizontal
      ? this.middleRight()
      : this.bottomMiddle();
  }

  southWest(): Position {
    return this.orientation === Orientation.Horizontal
      ? this.bottomLeft()
      : this.topLeft();
  }
  south(): Position {
    return this.orientation === Orientation.Horizontal
      ? this.bottomMiddle()
      : this.middleLeft();
  }
  southEast(): Position {
    return this.orientation === Orientation.Horizontal
      ? this.bottomRight()
      : this.bottomLeft();
  }
}
