import { renderRect } from '../render/Rect';
import { renderText } from '../render/Text';
import { Scenario } from '../types/Scenario';
import { HorizontalAxis } from './HorizontalAxis';

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
    } = column;

    const colorMap = [
      'rgb(230,230,230)',
      'rgb(130,130,130)',

      'rgb(200,200,200)',
      'rgb(100,100,100)',

      'rgb(170,170,170)',
      'rgb(70,70,70)',
    ];

    const valueToRGB = (value) => `rgb(${value},${value},${value})`;

    const colorMap2 = [230, 130, 200, 100, 170, 70];
    const textColorMap = [0, 255, 0, 255, 0, 255];

    const valueLabel =
      stack && HorizontalAxis.innerFit(unstackValue, axialRect.draw().height)
        ? renderText({
            ...axialRect.centerWord(unstackValue),
            word: unstackValue,
            color: valueToRGB(textColorMap[stackIndex - 1]),
          })
        : '';

    if (stackIndex === 0) {
      switch (scenario) {
        case Scenario.PY:
          return [
            renderRect({
              ...axialRect.draw(),
              fill: 'rgb(157,157,156)',
            }),
            stack
              ? renderText({
                  ...axialRect.centerWord(unstackValue),
                  word: unstackValue,
                })
              : '',
          ];
        case Scenario.AC:
          return [
            renderRect({
              ...axialRect.draw(),
              fill: 'rgb(73,73,72)',
            }),
            '',
          ];
        case Scenario.FC:
          return [
            renderRect({
              ...axialRect.draw(),
              fill: 'rgb(255,255,255)',
            }) +
              renderRect({
                ...axialRect.draw(),
                fill: 'url(%23stripes)',
                stroke: 'rgb(65,65,64)',
                strokeWidth: 1.5,
              }),
            '',
          ];
        case Scenario.PL:
          return [
            renderRect({
              ...axialRect.draw(),
              fill: 'rgb(255,255,255)',
              stroke: 'rgb(73,73,72)',
              strokeWidth: 1.5,
            }),
            '',
          ];
      }
    }

    if (scenario === Scenario.PL) {
      const rectDraw = axialRect.draw();
      return [
        renderRect({
          ...rectDraw,
          y: rectDraw.y - (value < 0 ? 1.5 : 0), // Overlap stroke for negative values.
          height: rectDraw.height + 1.5, // Overlap stroke for positive/negative values.
          fill: colorMap[stackIndex - 1],
          stroke: scenario === Scenario.PL ? 'rgb(73,73,72)' : null,
          strokeWidth: scenario === Scenario.PL ? 1.5 : null,
        }),
        '',
      ];
    }

    return [
      renderRect({
        ...axialRect.draw(),
        fill: colorMap[stackIndex - 1],
      }),
      valueLabel,
    ];
  }
}
