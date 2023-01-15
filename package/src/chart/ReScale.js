import { ColumnAxis } from './column/ColumnAxis';
import { Scale } from './Scale';

export class ReScale {
  static DefaultColumn(chart, scale) {
    const { width, data } = chart;

    if (!width) {
      return 1;
    }

    const axis = new ColumnAxis(Scale.chartPadding, 0, data, scale);

    const reScale = axis.chartWidth / width;

    return reScale;
  }
}
