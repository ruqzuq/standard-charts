import { Box } from './Box';
export interface TextProps {
    bold?: boolean;
    size?: number;
    family?: string;
}
export declare class Text {
    text: string;
    font: string;
    width: number;
    height: number;
    padding: number;
    box: Box;
    boxWidth: number;
    boxHeight: number;
    constructor(context: any, text: any, props?: TextProps);
    draw(context: OffscreenCanvasRenderingContext2D, debug?: boolean): void;
    placeTopLeft(box: Box): void;
    placeTopMiddle(box: Box): void;
    placeTopRight(box: Box): void;
    placeMiddleLeft(box: Box): void;
    placeCenter(box: Box): void;
    placeMiddleRight(box: Box): void;
    placeBottomLeft(box: Box): void;
    placeBottomMiddle(box: Box): void;
    placeBottomRight(box: Box): void;
}
