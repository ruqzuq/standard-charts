import { Box } from '../base/Box';
import { Orientation } from '../base/orientation/Orientation';
import { OrientationBox } from '../base/orientation/OrientationBox';
import { OrientationText } from '../base/orientation/OrientationText';
import { Rect } from '../base/Rect';
import { Constants } from '../charts/Constants';

export interface AxisExtensionProps {
  value: number;
}

export class AxisExtension {
  value: number;
  context: OffscreenCanvasRenderingContext2D;

  orientationWidth: number;
  fontSize: number;
  isLeft: boolean;

  orientation: Orientation;
  axisExtensionOffset: number = 0;

  indexArrowSize: number;

  constructor(
    props: AxisExtensionProps,
    context: OffscreenCanvasRenderingContext2D,
    isLeft: boolean,
    orientation: Orientation
  ) {
    this.value = props.value;
    this.context = context;
    this.isLeft = isLeft;
    this.orientation = orientation;
  }

  fontToWidth(fontSize: number) {
    const valueText = new OrientationText(
      this.context,
      this.value,
      {
        size: fontSize,
      },
      this.orientation
    );

    return valueText.orientationBoxWidth + fontSize;
  }

  setSize(fontSize: number, axisExtensionOffset: number = 0) {
    this.fontSize = fontSize;
    this.orientationWidth = this.fontToWidth(fontSize);
    this.axisExtensionOffset = axisExtensionOffset;
    this.indexArrowSize = fontSize / 2;
  }

  scaleToHeight(scale: number) {
    const valueText = new OrientationText(
      this.context,
      this.value,
      {
        size: this.fontSize,
      },
      this.orientation
    );
    return (
      scale * this.value +
      (this.value >= 0 ? 1 : -1) * (valueText.orientationBoxHeight / 2)
    );
  }

  draw(scale: number, axisOrigin: number, axisWidth: number) {
    const index = new OrientationBox(
      new Box(
        {
          x:
            Constants.ChartPadding +
            (this.isLeft
              ? this.orientationWidth - this.indexArrowSize / 2
              : this.axisExtensionOffset + axisWidth + this.indexArrowSize / 2),
          y:
            axisOrigin +
            (this.orientation === Orientation.Horizontal ? -1 : 1) *
              (scale * this.value),
        },
        this.indexArrowSize,
        this.indexArrowSize
      ),
      this.orientation,
      true
    );
    // remove
    this.scaleToHeight(scale);

    // Lines
    const transparentLine = this.isLeft
      ? OrientationBox.fromEast(index, axisWidth, 4)
      : OrientationBox.fromWest(index, axisWidth, 4);

    const line = this.isLeft
      ? OrientationBox.fromEast(index, axisWidth, 2)
      : OrientationBox.fromWest(index, axisWidth, 2);

    this.context.globalAlpha = 0.5;
    Rect.drawFill(this.context, transparentLine, '#FFFFFF');
    this.context.globalAlpha = 1;
    Rect.drawFill(this.context, line, '#7B7B7B');

    // Arrow
    this.context.fillStyle = 'black';
    this.context.beginPath();
    if (this.isLeft) {
      this.context.moveTo(index.northWest().x, index.northWest().y);
      this.context.lineTo(index.east().x, index.east().y);
      this.context.lineTo(index.southWest().x, index.southWest().y);
    } else {
      this.context.moveTo(index.northEast().x, index.northEast().y);
      this.context.lineTo(index.west().x, index.west().y);
      this.context.lineTo(index.southEast().x, index.southEast().y);
    }
    this.context.fill();

    // Text
    const valueText = new OrientationText(
      this.context,
      this.value,
      {
        size: this.fontSize,
      },
      this.orientation
    );
    if (this.isLeft) valueText.placeWest(index);
    else valueText.placeEast(index);
    valueText.draw(this.context, false);
  }
}
