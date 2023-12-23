import { Data } from '../base/Data';
import { DataType } from '../base/DataTypes';
export interface ChartProps<Type extends DataType> {
    width: number;
    height: number;
    data: Data<Type>;
    debug?: boolean;
}
export declare class Chart<Type extends DataType> implements ChartProps<Type> {
    width: number;
    height: number;
    data: Data<Type>;
    debug?: boolean;
    canvas: OffscreenCanvas;
    context: OffscreenCanvasRenderingContext2D;
    constructor(props: ChartProps<Type>);
    drawDebug(): void;
}
