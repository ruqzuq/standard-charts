import { Box } from '../base/Box';
import { Orientation, OrientationBox } from '../base/OrientationBox';
import { Rect } from '../base/Rect';
import { Text } from '../base/Text';
import { Constants } from './Constants';

export interface AxisExtensionProps {
  value: number;
}

export class AxisExtension {
  value: number;
  context: OffscreenCanvasRenderingContext2D;

  width: number;
  fontSize: number;
  isLeft: boolean;

  orientation: Orientation = Orientation.Horizontal;

  constructor(
    props: AxisExtensionProps,
    context: OffscreenCanvasRenderingContext2D,
    isLeft: boolean
  ) {
    this.value = props.value;
    this.context = context;
    this.isLeft = isLeft;
  }

  fontToWidth(fontSize: number) {
    const valueText = new Text(this.context, this.value, { size: fontSize });

    return valueText.boxWidth + Constants.IndexArrowSize;
  }

  scaleToHeight(scale: number) {
    const valueText = new Text(this.context, this.value, {
      size: this.fontSize,
    });
    return (
      scale * this.value +
      (this.value >= 0 ? 1 : -1) * (valueText.boxHeight / 2)
    );
  }

  draw(scale: number, axisOrigin: number, axisWidth: number) {
    // remove
    this.scaleToHeight(scale);
    if (this.isLeft) {
      const index = new OrientationBox(
        new Box(
          {
            x:
              Constants.ChartPadding +
              this.width -
              Constants.IndexArrowSize / 2,
            y: axisOrigin - scale * this.value,
          },
          Constants.IndexArrowSize,
          Constants.IndexArrowSize
        ),
        this.orientation
      );

      // Line
      const transparentLine = OrientationBox.fromEast(index, axisWidth, 4);
      const line = OrientationBox.fromEast(index, axisWidth, 2);
      //
      this.context.globalAlpha = 0.5;
      Rect.drawFill(this.context, transparentLine, '#FFFFFF');
      this.context.globalAlpha = 1;
      Rect.drawFill(this.context, line, '#7B7B7B');

      // Arrow
      this.context.fillStyle = 'black';
      this.context.beginPath();
      this.context.moveTo(index.northWest().x, index.northWest().y);
      this.context.lineTo(index.east().x, index.east().y);
      this.context.lineTo(index.southWest().x, index.southWest().y);
      this.context.fill();

      // Text
      const valueText = new Text(this.context, this.value, {
        size: this.fontSize,
      });
      valueText.placeMiddleLeft(index);
      valueText.draw(this.context, false);
    }
  }
}
