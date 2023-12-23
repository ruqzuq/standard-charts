import { Position } from './Types';
/**
    Top-Left─────────Top-Middle─────────Top-Right
        │                                  │
        │                                  │
    Middle-Left        Center        Middle-Right
        │                                  │
        │                                  │
    Bottom-Left─────Bottom-Middle────Bottom-Right
*/
/**
 * Box.
 */
export declare class Box {
    static fromTopLeft(box: Box, width: number, height: number): Box;
    static fromTopMiddle(box: Box, width: number, height: number): Box;
    static fromTopRight(box: Box, width: number, height: number): Box;
    static fromMiddleLeft(box: Box, width: number, height: number): Box;
    static fromCenter(box: Box, width: number, height: number): Box;
    static fromMiddleRight(box: Box, width: number, height: number): Box;
    static fromBottomLeft(box: Box, width: number, height: number): Box;
    static fromBottomMiddle(box: Box, width: number, height: number): Box;
    static fromBottomRight(box: Box, width: number, height: number): Box;
    /**
     *  X-Position of the box in `px` (centered).
     */
    x: number;
    /**
     *  Y-Position of the box in `px` (centered).
     */
    y: number;
    /**
     *  Width of the box in `px`.
     */
    width: number;
    /**
     *  Height of the box in `px`.
     */
    height: number;
    constructor({ x, y }: Position, width: number, height: number);
    topLeft(): Position;
    topMiddle(): Position;
    topRight(): Position;
    middleLeft(): Position;
    center(): Position;
    middleRight(): Position;
    bottomLeft(): Position;
    bottomMiddle(): Position;
    bottomRight(): Position;
    drawX(): number;
    drawY(): number;
}
