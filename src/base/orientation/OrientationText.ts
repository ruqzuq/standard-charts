import { Box } from '../Box';
import { Text, TextProps } from '../Text';
import { Orientation } from './Orientation';

export class OrientationText extends Text {
  orientation: Orientation;
  orientationBoxWidth: number;
  orientationBoxHeight: number;

  constructor(context, text, props: TextProps = {}, orientation: Orientation) {
    super(context, text, props);

    this.orientation = orientation;

    this.orientationBoxWidth =
      orientation === Orientation.Horizontal ? this.boxWidth : this.boxHeight;
    this.orientationBoxHeight =
      orientation === Orientation.Horizontal ? this.boxHeight : this.boxWidth;
  }

  placeNorthWest(box: Box) {
    return this.orientation === Orientation.Horizontal
      ? this.placeTopLeft(box)
      : this.placeTopRight(box);
  }
  placeNorth(box: Box) {
    return this.orientation === Orientation.Horizontal
      ? this.placeTopMiddle(box)
      : this.placeMiddleRight(box);
  }
  placeNorthEast(box: Box) {
    return this.orientation === Orientation.Horizontal
      ? this.placeTopRight(box)
      : this.placeBottomRight(box);
  }

  placeWest(box: Box) {
    return this.orientation === Orientation.Horizontal
      ? this.placeMiddleLeft(box)
      : this.placeTopMiddle(box);
  }
  placeEast(box: Box) {
    return this.orientation === Orientation.Horizontal
      ? this.placeMiddleRight(box)
      : this.placeBottomMiddle(box);
  }

  placeSouthWest(box: Box) {
    return this.orientation === Orientation.Horizontal
      ? this.placeBottomLeft(box)
      : this.placeTopLeft(box);
  }
  placeSouth(box: Box) {
    return this.orientation === Orientation.Horizontal
      ? this.placeBottomMiddle(box)
      : this.placeMiddleLeft(box);
  }
  placeSouthEast(box: Box) {
    return this.orientation === Orientation.Horizontal
      ? this.placeBottomRight(box)
      : this.placeBottomLeft(box);
  }
}
