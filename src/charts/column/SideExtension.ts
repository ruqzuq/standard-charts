import { Box } from '../../base/Box';
import { Rect } from '../../base/Rect';
import { Text } from '../../base/Text';
import { Constants } from '../Constants';

export interface SideExtensionProps {
  value: number;
}

export class SideExtension {
  value: number;
  context: OffscreenCanvasRenderingContext2D;

  width: number;
  fontSize: number;
  isLeft: boolean;

  constructor(
    props: SideExtensionProps,
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
      const index = new Box(
        {
          x: Constants.ChartPadding + this.width - Constants.IndexArrowSize / 2,
          y: axisOrigin - scale * this.value,
        },
        Constants.IndexArrowSize,
        Constants.IndexArrowSize
      );

      // Line
      const transparentLine = Box.fromMiddleRight(index, axisWidth, 4);
      const line = Box.fromMiddleRight(index, axisWidth, 2);
      //
      this.context.globalAlpha = 0.5;
      Rect.drawFill(this.context, transparentLine, '#FFFFFF');
      this.context.globalAlpha = 1;
      Rect.drawFill(this.context, line, '#7B7B7B');

      // Arrow
      this.context.fillStyle = 'black';
      this.context.beginPath();
      this.context.moveTo(index.topLeft().x, index.topLeft().y);
      this.context.lineTo(index.middleRight().x, index.middleRight().y);
      this.context.lineTo(index.bottomLeft().x, index.bottomLeft().y);
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
