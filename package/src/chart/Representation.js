import { renderRect } from '../render/Rect';
import { renderText } from '../render/Text';
import { Scenario } from '../types/Scenario';
import { ColumnAxis } from './column/ColumnAxis';

export class Representation {
  /**
   * R40A
   *
   * PY: fill: 'rgb(157,157,156)'
   * AC: fill: 'rgb(73,73,72)'
   *
   * FC: color: rgb(65,65,64)
   * PL: color: rgb(73,73,72)
   */
  static renderAxialRectByScenario(column) {
    const {
      value,
      unstackValue,
      scenario,
      axialRect,
      stackIndex = 0,
      stack,
      primary,
    } = column;

    const valueToRGB = (value) => `rgb(${value},${value},${value})`;

    const defaultRectFillColor = valueToRGB(
      [230, 130, 200, 100, 170, 70][(stackIndex + 1) % 6]
    );
    const defaultTextColor = valueToRGB([255, 0][stackIndex % 2]);

    let rectFillColor = undefined;
    let textColor = undefined;

    let strokeRectFillColor = undefined;
    let strokeRectStrokeColor = undefined;

    switch (scenario) {
      case Scenario.PY:
        rectFillColor =
          stackIndex === 0 ? valueToRGB(157) : defaultRectFillColor;
        textColor = defaultTextColor;
        break;
      case Scenario.AC:
        rectFillColor =
          stackIndex === 0 ? valueToRGB(73) : defaultRectFillColor;
        textColor = defaultTextColor;
        break;
      case Scenario.FC:
        rectFillColor =
          stackIndex === 0 ? valueToRGB(255) : defaultRectFillColor;
        textColor = stackIndex === 0 ? valueToRGB(0) : defaultTextColor;
        strokeRectFillColor =
          stackIndex === 0 ? 'url(%23stripes)' : defaultRectFillColor;
        strokeRectStrokeColor = valueToRGB(65);
        break;
      case Scenario.PL:
        rectFillColor =
          stackIndex === 0 ? valueToRGB(255) : defaultRectFillColor;
        textColor = stackIndex === 0 ? valueToRGB(0) : defaultTextColor;
        strokeRectStrokeColor = valueToRGB(73);
        break;
    }

    const rectDraw = axialRect.draw();

    const renderInnerValueLabel =
      stack &&
      primary &&
      ColumnAxis.innerFit(unstackValue, axialRect.draw().height)
        ? renderText({
            ...axialRect.centerWord(unstackValue),
            word: unstackValue,
            color: textColor,
            background:
              scenario === Scenario.FC && stackIndex === 0
                ? valueToRGB(255)
                : null, // To highlight from the stripes.
            backgroundOpacity: 0.8,
          })
        : '';

    const renderStrokeRect =
      strokeRectFillColor || strokeRectStrokeColor
        ? renderRect({
            ...rectDraw,
            y: rectDraw.y - (value < 0 ? 1.5 : 0), // Overlap stroke for negative values.
            height: rectDraw.height + (stackIndex > 0 ? 1.5 : 0), // Overlap stroke for positive/negative values.
            fill: strokeRectFillColor,
            stroke: strokeRectStrokeColor,
            strokeWidth: 1.5,
          })
        : '';

    return [
      renderRect({
        ...rectDraw,
        fill: rectFillColor,
      }) + renderStrokeRect,
      renderInnerValueLabel,
    ];
  }
}
