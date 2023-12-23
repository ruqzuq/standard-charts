import { ChartTypes } from '..';
import { Chart, ChartProps } from './Chart';
export interface ColumnChartProps extends ChartProps {
    chartType: ChartTypes.Column;
}
export declare class ColumnChart extends Chart {
    axisOffset: number;
    columnWidth: number;
    columnMargin: number;
    axisElementWidth: number;
    fontSize: number;
    constructor(props: ColumnChartProps);
    fontTooBig(fontSize: number): boolean;
    scaleTooBig(scale: number): boolean;
    draw(scale: number): void;
}
