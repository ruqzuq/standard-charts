import { Box } from './Box';
import { Scenario } from './Data';
export declare class Rect {
    static drawDebug(context: OffscreenCanvasRenderingContext2D, box: Box): void;
    static draw(context: OffscreenCanvasRenderingContext2D, box: Box, scenario: Scenario): void;
    static drawPY(context: OffscreenCanvasRenderingContext2D, box: Box): void;
    static drawAC(context: OffscreenCanvasRenderingContext2D, box: Box): void;
    static drawFC(context: OffscreenCanvasRenderingContext2D, box: Box): void;
    static drawPL(context: OffscreenCanvasRenderingContext2D, box: Box): void;
    static createPinstripeCanvas(): OffscreenCanvas;
}
