import { Axis } from '../base/Axis';
import { Box } from '../base/Box';
import { Color } from '../base/Color';
import { Scenario, extractSimpleValue } from '../base/Data';
import { SimpleDataType } from '../base/DataTypes';
import { Orientation } from '../base/orientation/Orientation';
import { OrientationBox } from '../base/orientation/OrientationBox';
import { OrientationText } from '../base/orientation/OrientationText';
import { Polygon } from '../base/Polgyon';
import { Rect } from '../base/Rect';
import { Position } from '../base/Types';
import { MaxMeasure } from '../base/utils/MaxMeasure';
import { Chart, ChartProps } from './Chart';
import { Constants } from './Constants';
import { ChartStyle, ChartType } from './Types';

export interface VarianceChartProps extends ChartProps<SimpleDataType> {
  type: ChartType.Variance;
  variance: 'ABSOLUTE' | 'RELATIVE';
  axis?: Scenario;
}

export class VarianceChart extends Chart<SimpleDataType> {
  axisWidth: number;
  axisOrigin: number;
  axisExtensionOffset: number = 0;

  columnWidth: number;
  columnMargin: number;
  axisElementWidth: number;
  secondaryLeftOffset: number = 0;
  axis: Scenario = Scenario.AC;

  fontSize: number;

  constructor(props: VarianceChartProps) {
    super(props);

    const { axis } = props;

    this.fontSize = 8;
    [10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32].forEach((fontSize) => {
      if (!this.fontTooBig(fontSize)) {
        this.fontSize = fontSize;
      }
    });

    this.axisWidth = this.orientationWidth - 2 * Constants.ChartPadding;

    this.axisElementWidth = this.axisWidth / this.data.length;

    this.columnWidth = Constants.ColumnToWidthRelation * this.axisElementWidth;
    this.columnMargin =
      Constants.ColumnMarginToWidthRelation * this.axisElementWidth;

    if (axis) {
      this.axis = axis;
    }
  }

  fontTooBig(fontSize: number) {
    const maxTextWidth = new MaxMeasure();

    this.data.forEach((dataPoint) => {
      const { value } = extractSimpleValue(dataPoint);
      const valueText = new OrientationText(
        this.context,
        value,
        {
          size: fontSize,
        },
        this.orientation
      );

      if (value) {
        maxTextWidth.addEntry(
          valueText.orientationBoxWidth + 2 * Constants.ColumnPadding
        );
      }
    });

    const elementWidth = maxTextWidth.max / Constants.ColumnToWidthRelation;

    return (
      this.data.length * elementWidth >
      this.orientationWidth - 2 * Constants.ChartPadding
    );
  }

  scaleToHeight(scale: number, orientationHeight = this.orientationHeight) {
    const negativeMax = new MaxMeasure();
    const positiveMax = new MaxMeasure();

    this.data.forEach((dataPoint) => {
      const { value } = extractSimpleValue(dataPoint);

      if (value) {
        const valueText = new OrientationText(
          this.context,
          (value > 0 ? '+' : '-') + Math.abs(value),
          {
            size: this.fontSize,
          },
          this.orientation
        );
        if (value >= 0) {
          positiveMax.addEntry(scale * value, valueText.orientationBoxHeight);
        } else {
          negativeMax.addEntry(
            scale * Math.abs(value),
            valueText.orientationBoxHeight
          );
        }
      }
    });

    // annahme, dass scaling präziser wird
    this.axisOrigin =
      this.orientation === Orientation.Horizontal
        ? this.chartOffset + Constants.ChartPadding + positiveMax.max
        : orientationHeight -
          (this.chartOffset + Constants.ChartPadding + positiveMax.max);

    return (
      negativeMax.max +
      positiveMax.max +
      (this.isExtension ? 1 : 2) * Constants.ChartPadding
    );
  }

  scaleTooBig(scale: number) {
    return this.scaleToHeight(scale) > this.orientationHeight;
  }

  draw(scale: number) {
    this.drawDebug();

    const axis = new Axis(
      {
        x: Constants.ChartPadding + this.axisExtensionOffset,
        y: this.axisOrigin,
      },
      this.axisWidth,
      this.orientation
    );
    axis.draw(this.context, this.axis, false);

    // Arra
    let lastValue: number;
    let lastValuePosition: Position;
    let lastScenario: Scenario;
    const area: Position[] = [];

    this.data.forEach((dataPoint, index) => {
      const { value, scenario } = extractSimpleValue(dataPoint);

      const origin = new OrientationBox(
        new Box(
          {
            x:
              Constants.ChartPadding +
              this.axisExtensionOffset +
              (this.columnMargin + this.columnWidth / 2) +
              this.secondaryLeftOffset +
              +index * this.axisElementWidth,
            y: this.axisOrigin,
          },
          this.axisElementWidth,
          0
        ),
        this.orientation,
        true
      );

      if (value) {
        const valueText = new OrientationText(
          this.context,
          (value > 0 ? '+' : '') + value,
          {
            size: this.fontSize,
          },
          this.orientation
        );

        let valueBox;
        if (value >= 0) {
          valueBox = OrientationBox.fromNorth(
            origin,
            this.columnWidth,
            scale * value
          );
          valueText.placeNorth(valueBox);
        } else {
          valueBox = OrientationBox.fromSouth(
            origin,
            this.columnWidth,
            scale * Math.abs(value)
          );
          valueText.placeSouth(valueBox);
        }

        if (this.style === ChartStyle.Area) {
          //
          const valuePosition =
            value >= 0 ? valueBox.north() : valueBox.south();
          if (index === 0) {
            area.push(origin.center());
          } else if (Math.sign(value) !== Math.sign(lastValue)) {
            //draw
            const intersectionAxis = {
              x:
                valuePosition.x +
                ((this.axisOrigin - valuePosition.y) *
                  (lastValuePosition.x - valuePosition.x)) /
                  (lastValuePosition.y - valuePosition.y),
              y: this.axisOrigin,
            };
            area.push(intersectionAxis);
            Polygon.draw(
              this.context,
              area,
              lastScenario,
              lastValue >= 0
                ? Color.Impact.Color.Positive
                : Color.Impact.Color.Negative
            );
            while (area.length > 0) area.pop();
            area.push(intersectionAxis);
          } else if (lastScenario !== scenario) {
            //draw
            const intersectionTop = {
              x:
                lastValuePosition.x +
                (valuePosition.x - lastValuePosition.x) / 2,
              y:
                lastValuePosition.y +
                (valuePosition.y - lastValuePosition.y) / 2,
            };
            const intersectionBottom = {
              x: intersectionTop.x,
              y: this.axisOrigin,
            };
            area.push(intersectionTop);
            area.push(intersectionBottom);
            Polygon.draw(
              this.context,
              area,
              lastScenario,
              lastValue >= 0
                ? Color.Impact.Color.Positive
                : Color.Impact.Color.Negative
            );
            while (area.length > 0) area.pop();
            area.push(intersectionBottom);
            area.push(intersectionTop);
          }

          area.push(valuePosition);

          if (index === this.data.length - 1) {
            area.push(origin.center());
            //draw
            Polygon.draw(
              this.context,
              area,
              scenario,
              value >= 0
                ? Color.Impact.Color.Positive
                : Color.Impact.Color.Negative
            );
          }

          lastValue = value;
          lastValuePosition = valuePosition;
          lastScenario = scenario;

          const pointSize =
            Constants.PointToWidthRelation * this.axisElementWidth;
          const tick =
            value >= 0
              ? OrientationBox.fromSouth(origin, 2, pointSize / 2)
              : OrientationBox.fromNorth(origin, 2, pointSize / 2);
          Rect.drawFill(this.context, tick, Color.Fill.AC);
        } else {
          Rect.draw(
            this.context,
            valueBox,
            scenario,
            value >= 0
              ? Color.Impact.Color.Positive
              : Color.Impact.Color.Negative
          );
        }

        valueText.draw(this.context, this.debug);
      }
    });
  }
}
