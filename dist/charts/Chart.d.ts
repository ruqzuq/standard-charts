import { Data } from '../base/Data';
export interface ChartProps {
    width: number;
    height: number;
    data: Data;
    debug?: boolean;
}
export declare class Chart implements ChartProps {
    width: number;
    height: number;
    data: Data;
    debug?: boolean;
    canvas: OffscreenCanvas;
    context: OffscreenCanvasRenderingContext2D;
    constructor(props: ChartProps);
    drawDebug(): void;
}
