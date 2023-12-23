import { ChartTypes } from '..';
import { ParallelDataType } from '../base/DataTypes';
import { Chart, ChartProps } from './Chart';
export interface ColumnChartProps extends ChartProps<ParallelDataType> {
    chartType: ChartTypes.Column;
}
export declare class ColumnChart extends Chart<ParallelDataType> {
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
