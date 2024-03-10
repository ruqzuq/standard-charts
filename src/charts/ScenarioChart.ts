import { Axis } from '../base/Axis';
import { Box } from '../base/Box';
import { Color } from '../base/Color';
import { Scenario, Scenarios, extractParallelValues } from '../base/Data';
import { ParallelDataType } from '../base/DataTypes';
import { Line } from '../base/Line';
import { Orientation } from '../base/orientation/Orientation';
import { OrientationBox } from '../base/orientation/OrientationBox';
import { OrientationText } from '../base/orientation/OrientationText';
import { Rect } from '../base/Rect';
import { Position } from '../base/Types';
import { round } from '../base/utils/Math';
import { MaxMeasure } from '../base/utils/MaxMeasure';
import { formatValue } from '../base/utils/ValueFormat';
import {
  ReferenceExtensionProps,
  ReferenceExtension,
} from '../extensions/ReferenceExtension';
import { Chart, ChartProps } from './Chart';
import { Constants } from './Constants';
import { ChartStyle, ChartType } from './Types';
import { VarianceChart } from './VarianceChart';

export interface ScenarioChartProps extends ChartProps<ParallelDataType> {
  type: ChartType.Scenario;
  style: ChartStyle.Column | ChartStyle.Line | ChartStyle.Bar;
  variance?: VarianceExtension[];
  start?: ReferenceExtensionProps;
  end?: ReferenceExtensionProps;
  percentage?: boolean;
}

export interface VarianceExtension {
  variance: 'ABSOLUTE' | 'RELATIVE';
  delta: Scenario.PY | Scenario.PL;
}

export class ScenarioChart extends Chart<ParallelDataType> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  axisWidth: number;
  axisOrigin: number;
  axisExtensionOffset: number = 0;

  columnWidth: number;
  columnMargin: number;
  axisElementWidth: number;

  fontSize: number;

  secondaryLeft: boolean;
  secondaryRight: boolean;

  //
  varianceCharts: VarianceChart[] = [];
  //
  startAxisExtension: ReferenceExtension;
  endAxisExtension: ReferenceExtension;
  //
  pointSize: number = 0; // Line-Chart
  //
  percentage: boolean;

  constructor(props: ScenarioChartProps) {
    super(props);
    const { variance, start, end, percentage } = props;

    this.percentage = percentage;

    if (start)
      this.startAxisExtension = new ReferenceExtension(
        start,
        this.context,
        true,
        this.orientation,
        this.percentage
      );
    if (end)
      this.endAxisExtension = new ReferenceExtension(
        end,
        this.context,
        false,
        this.orientation,
        this.percentage
      );

    this.fontSize = 8;
    [10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32].forEach((fontSize) => {
      if (!this.fontTooBig(fontSize)) this.fontSize = fontSize;
    });

    if (start) {
      this.startAxisExtension.setSize(this.fontSize);
    }
    this.axisExtensionOffset = this.startAxisExtension?.orientationWidth ?? 0;
    if (end) {
      this.endAxisExtension.setSize(this.fontSize, this.axisExtensionOffset);
    }

    this.secondaryLeft = this.data.some(
      (dataPoint) => extractParallelValues(dataPoint).left.value
    );
    this.secondaryRight = this.data.some(
      (dataPoint) => extractParallelValues(dataPoint).right.value
    );

    this.axisWidth =
      this.orientationWidth -
      this.axisExtensionOffset -
      (this.endAxisExtension?.orientationWidth ?? 0) -
      2 * Constants.ChartPadding;

    this.axisElementWidth = this.axisWidth / this.data.length;

    this.columnWidth =
      Constants.ColumnToWidthRelation * this.axisElementWidth -
      (this.secondaryLeft
        ? Constants.SecondaryColumnToWidthRelation * this.axisElementWidth
        : 0) -
      (this.secondaryRight
        ? Constants.SecondaryColumnToWidthRelation * this.axisElementWidth
        : 0);
    this.columnMargin =
      Constants.ColumnMarginToWidthRelation * this.axisElementWidth;

    if (variance) {
      variance.forEach((extension) => {
        this.varianceExtension(extension);
      });
    }

    if (this.style === ChartStyle.Line) {
      this.pointSize = Constants.PointToWidthRelation * this.axisElementWidth;
    }
  }

  fontTooBig(fontSize: number) {
    const maxTextWidth = new MaxMeasure();

    this.data.forEach((dataPoint) => {
      const { positiveStackValue, negativeStackValue } =
        extractParallelValues(dataPoint).primary;

      const keyText = new OrientationText(
        this.context,
        dataPoint.key,
        { size: fontSize },
        this.orientation
      );
      const positiveStackValueText = new OrientationText(
        this.context,
        formatValue(positiveStackValue, this.percentage),
        { size: fontSize },
        this.orientation
      );
      const negativeStackValueText = new OrientationText(
        this.context,
        formatValue(negativeStackValue, this.percentage),
        { size: fontSize },
        this.orientation
      );

      if (positiveStackValue) {
        maxTextWidth.addEntry(
          positiveStackValueText.orientationBoxWidth +
            2 * Constants.ColumnPadding
        );
      }
      if (negativeStackValue) {
        maxTextWidth.addEntry(
          negativeStackValueText.orientationBoxWidth +
            2 * Constants.ColumnPadding
        );
      }

      maxTextWidth.addEntry(keyText.orientationBoxWidth);
    });

    const elementWidth = maxTextWidth.max / Constants.ColumnToWidthRelation;

    return (
      this.data.length * elementWidth +
        (this.startAxisExtension?.fontToWidth(fontSize) ?? 0) +
        (this.endAxisExtension?.fontToWidth(fontSize) ?? 0) >
      this.orientationWidth - 2 * Constants.ChartPadding
    );
  }

  scaleTooBig(scale: number) {
    const negativeMax = new MaxMeasure();
    const positiveMax = new MaxMeasure();

    this.data.forEach((dataPoint) => {
      const { left, primary, right } = extractParallelValues(dataPoint);

      const keyText = new OrientationText(
        this.context,
        dataPoint.key,
        {
          size: this.fontSize,
        },
        this.orientation
      );

      const { positiveStackValue, negativeStackValue } = primary;

      const positiveValueText = new OrientationText(
        this.context,
        formatValue(positiveStackValue, this.percentage),
        {
          size: this.fontSize,
        },
        this.orientation
      );
      const negativeValueText = new OrientationText(
        this.context,
        formatValue(negativeStackValue, this.percentage),
        {
          size: this.fontSize,
        },
        this.orientation
      );

      if (primary.positiveStackValue && primary.negativeStackValue) {
        negativeMax.addEntry(
          scale * Math.abs(negativeStackValue),
          negativeValueText.orientationBoxHeight,
          keyText.orientationBoxHeight,
          this.pointSize / 2 // Line-Chart
        );
        positiveMax.addEntry(
          scale * positiveStackValue,
          positiveValueText.orientationBoxHeight,
          this.pointSize / 2 // Line-Chart
        );
      } else if (positiveStackValue) {
        negativeMax.addEntry(
          keyText.orientationBoxHeight,
          this.pointSize / 2 // Line-Chart
        );
        positiveMax.addEntry(
          scale * positiveStackValue,
          positiveValueText.orientationBoxHeight,
          this.pointSize / 2 // Line-Chart
        );
      } else if (negativeStackValue) {
        negativeMax.addEntry(
          scale * Math.abs(negativeStackValue),
          negativeValueText.orientationBoxHeight,
          this.pointSize / 2 // Line-Chart
        );
        positiveMax.addEntry(
          keyText.orientationBoxHeight,
          this.pointSize / 2 // Line-Chart
        );
      }

      [left, right].forEach(({ value }) => {
        if (value) {
          if (value >= 0) {
            positiveMax.addEntry(scale * value);
          } else {
            negativeMax.addEntry(scale * Math.abs(value));
          }
        }
      });
    });

    // Side-extensions
    [this.startAxisExtension, this.endAxisExtension].forEach((extension) => {
      if (extension) {
        const extensionHeight = extension.scaleToHeight(scale);
        if (extensionHeight > 0) {
          positiveMax.addEntry(extensionHeight);
        } else {
          negativeMax.addEntry(Math.abs(extensionHeight));
        }
      }
    });

    //
    let topExtensionHeight = 0;
    this.varianceCharts.forEach((chart) => {
      chart.chartOffset = topExtensionHeight;
      const varianceHeight = chart.scaleToHeight(scale, this.orientationHeight);
      chart.height = varianceHeight;
      topExtensionHeight += varianceHeight;
    });

    //

    this.chartOffset = topExtensionHeight;

    // annahme, dass scaling präziser wird
    this.axisOrigin =
      this.orientation === Orientation.Horizontal
        ? this.orientationHeight - Constants.ChartPadding - negativeMax.max
        : Constants.ChartPadding + negativeMax.max;

    const height =
      negativeMax.max + positiveMax.max + 2 * Constants.ChartPadding;

    return topExtensionHeight + height > this.orientationHeight;
  }

  draw(scale: number) {
    //
    this.varianceCharts.forEach((chart) => {
      chart.draw(scale);
    });
    //

    this.drawDebug();

    const scenarioLine: Record<Scenario, Position[]> = {
      [Scenario.PY]: [],
      [Scenario.AC]: [],
      [Scenario.FC]: [],
      [Scenario.PL]: [],
    };

    this.data.forEach((dataPoint, index) => {
      const { left, primary, right } = extractParallelValues(dataPoint);

      const origin = new OrientationBox(
        new Box(
          {
            x:
              Constants.ChartPadding +
              this.axisExtensionOffset +
              (this.columnMargin + this.columnWidth / 2) +
              (this.secondaryLeft
                ? Constants.SecondaryColumnToWidthRelation *
                  this.axisElementWidth
                : 0) +
              index * this.axisElementWidth,
            y: this.axisOrigin,
          },
          this.axisElementWidth,
          0
        ),
        this.orientation,
        true
      );

      [left, right].forEach(({ value, scenario }, index) => {
        const secondaryOrigin =
          this.style === ChartStyle.Line
            ? origin
            : new OrientationBox(
                new Box(
                  {
                    x:
                      (this.orientation === Orientation.Horizontal
                        ? origin.x
                        : origin.y) +
                      (index === 0 ? -1 : 1) *
                        Constants.SecondaryColumnToWidthRelation *
                        this.axisElementWidth,
                    y:
                      this.orientation === Orientation.Horizontal
                        ? origin.y
                        : origin.x,
                  },
                  0,
                  0
                ),
                this.orientation,
                true
              );

        let valueBox;
        if (value) {
          if (value >= 0) {
            valueBox = OrientationBox.fromNorth(
              secondaryOrigin,
              this.columnWidth,
              scale * value
            );
          } else {
            valueBox = OrientationBox.fromSouth(
              secondaryOrigin,
              this.columnWidth,
              scale * Math.abs(value)
            );
          }

          if (this.style === ChartStyle.Line) {
            const lineValueBox = new OrientationBox(
              new Box(
                value >= 0 ? valueBox.north() : valueBox.south(),
                this.pointSize,
                this.pointSize
              ),
              this.orientation
            );
            Rect.draw(this.context, lineValueBox, scenario);
            scenarioLine[scenario].push(lineValueBox.center());
          } else {
            Rect.draw(this.context, valueBox, scenario);
          }
        }
      });

      const keyText = new OrientationText(
        this.context,
        dataPoint.key,
        {
          size: this.fontSize,
        },
        this.orientation
      );

      let positiveAnchor = origin;
      let negativeAnchor = origin;

      let positiveTextAnchor;
      let negativeTextAnchor;

      primary.values.forEach(({ value, scenario }) => {
        let valueBox: OrientationBox;
        if (value >= 0) {
          valueBox = OrientationBox.fromNorth(
            positiveAnchor,
            this.columnWidth,
            scale * value
          );
          positiveAnchor = valueBox;
        } else {
          valueBox = OrientationBox.fromSouth(
            negativeAnchor,
            this.columnWidth,
            scale * Math.abs(value)
          );
          negativeAnchor = valueBox;
        }

        if (this.style === ChartStyle.Line) {
          const lineValueBox = new OrientationBox(
            new Box(
              value >= 0 ? valueBox.north() : valueBox.south(),
              this.pointSize,
              this.pointSize
            ),
            this.orientation
          );

          if (value >= 0) positiveTextAnchor = lineValueBox;
          else negativeTextAnchor = lineValueBox;

          Rect.draw(this.context, lineValueBox, scenario);
          scenarioLine[scenario].push(lineValueBox.center());
        } else {
          Rect.draw(this.context, valueBox, scenario);
        }
      });

      const { positiveStackValue, negativeStackValue } = primary;

      const positiveValueText = new OrientationText(
        this.context,
        formatValue(positiveStackValue, this.percentage),
        {
          size: this.fontSize,
        },
        this.orientation
      );
      const negativeValueText = new OrientationText(
        this.context,
        formatValue(negativeStackValue, this.percentage),
        {
          size: this.fontSize,
        },
        this.orientation
      );

      // Prevent text from being rendered above the axis.

      const tick =
        this.style !== ChartStyle.Line
          ? OrientationBox.fromCenter(origin, 4, 4)
          : positiveStackValue
            ? OrientationBox.fromSouth(origin, 2, this.pointSize / 2)
            : OrientationBox.fromNorth(origin, 2, this.pointSize / 2);

      if (positiveStackValue && negativeStackValue) {
        positiveValueText.placeNorth(positiveTextAnchor ?? positiveAnchor);
        negativeValueText.placeSouth(negativeTextAnchor ?? negativeAnchor);
        keyText.placeSouth(negativeValueText.box);
        //
        positiveValueText.draw(this.context, this.debug);
        negativeValueText.draw(this.context, this.debug);
      } else if (positiveStackValue) {
        positiveValueText.placeNorth(positiveTextAnchor ?? positiveAnchor);
        keyText.placeSouth(tick);
        //
        positiveValueText.draw(this.context, this.debug);
      } else if (negativeStackValue) {
        negativeValueText.placeSouth(negativeTextAnchor ?? negativeAnchor);
        keyText.placeNorth(tick);
        //
        negativeValueText.draw(this.context, this.debug);
      }

      if (this.style === ChartStyle.Line) {
        Rect.drawFill(this.context, tick, Color.Fill.AC);
      }

      keyText.draw(this.context, this.debug);
    });
    // Line
    if (this.style === ChartStyle.Line) {
      Scenarios.forEach((scenario) => {
        const line = scenarioLine[scenario];
        for (let i = 0; i < line.length - 1; i++) {
          const start = line[i];
          const end = line[i + 1];
          Line.draw(this.context, start, end, scenario);
        }
      });
    }

    // Axis
    const axis = new Axis(
      {
        x: Constants.ChartPadding + this.axisExtensionOffset,
        y: this.axisOrigin,
      },
      this.axisWidth,
      this.orientation
    );
    axis.draw(this.context);
    // Side extensions
    this.startAxisExtension?.draw(scale, this.axisOrigin, this.axisWidth);
    this.endAxisExtension?.draw(scale, this.axisOrigin, this.axisWidth);
  }

  varianceExtension(extension: VarianceExtension) {
    const varianceChart = new VarianceChart({
      type: ChartType.Variance,
      style: this.style,
      variance: extension.variance,
      height: 0,
      width: this.axisWidth,
      data: this.data.map((dataPoint) => {
        const { PY, AC, FC, PL } = dataPoint;

        const value = AC || FC ? (AC ?? 0) + (FC ?? 0) : undefined;
        const comparison =
          extension.delta === Scenario.PY ? PY ?? undefined : PL ?? undefined;

        const deviation =
          value && comparison ? round(value - comparison, 2) : undefined;

        if (FC) {
          return {
            key: dataPoint.key,
            [Scenario.FC]: deviation,
          };
        } else {
          return {
            key: dataPoint.key,
            [Scenario.AC]: deviation,
          };
        }
      }),
      axis: extension.delta,
      debug: this.debug,
    });
    varianceChart.axisWidth = this.axisWidth;
    varianceChart.axisElementWidth = this.axisElementWidth;
    varianceChart.columnWidth = this.columnWidth;
    varianceChart.columnMargin = this.columnMargin;
    varianceChart.secondaryLeftOffset = this.secondaryLeft
      ? Constants.SecondaryColumnToWidthRelation * this.axisElementWidth
      : 0;
    varianceChart.canvas = this.canvas;
    varianceChart.context = this.context;
    varianceChart.fontSize = this.fontSize;
    varianceChart.isExtension = true;
    varianceChart.axisExtensionOffset = this.axisExtensionOffset;

    this.varianceCharts.push(varianceChart);
  }
}
