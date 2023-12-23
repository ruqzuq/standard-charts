"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Box = void 0;
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
class Box {
    // Constructors
    static fromTopLeft(box, width, height) {
        const { x, y } = box.topLeft();
        return new Box({ x: x - width / 2, y: y - height / 2 }, width, height);
    }
    static fromTopMiddle(box, width, height) {
        const { x, y } = box.topMiddle();
        return new Box({ x, y: y - height / 2 }, width, height);
    }
    static fromTopRight(box, width, height) {
        const { x, y } = box.topRight();
        return new Box({ x: x + width / 2, y: y - height / 2 }, width, height);
    }
    static fromMiddleLeft(box, width, height) {
        const { x, y } = box.middleLeft();
        return new Box({ x: x - width / 2, y }, width, height);
    }
    static fromCenter(box, width, height) {
        const { x, y } = box.center();
        return new Box({ x, y }, width, height);
    }
    static fromMiddleRight(box, width, height) {
        const { x, y } = box.middleRight();
        return new Box({ x: x + width / 2, y }, width, height);
    }
    static fromBottomLeft(box, width, height) {
        const { x, y } = box.bottomLeft();
        return new Box({ x: x - width / 2, y: y + height / 2 }, width, height);
    }
    static fromBottomMiddle(box, width, height) {
        const { x, y } = box.bottomMiddle();
        return new Box({ x, y: y + height / 2 }, width, height);
    }
    static fromBottomRight(box, width, height) {
        const { x, y } = box.bottomRight();
        return new Box({ x: x + width / 2, y: y + height / 2 }, width, height);
    }
    // from Center
    constructor({ x, y }, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    // Position Getter
    topLeft() {
        return { x: this.x - this.width / 2, y: this.y - this.height / 2 };
    }
    topMiddle() {
        return { x: this.x, y: this.y - this.height / 2 };
    }
    topRight() {
        return { x: this.x + this.width / 2, y: this.y - this.height / 2 };
    }
    middleLeft() {
        return { x: this.x - this.width / 2, y: this.y };
    }
    center() {
        return { x: this.x, y: this.y };
    }
    middleRight() {
        return { x: this.x + this.width / 2, y: this.y };
    }
    bottomLeft() {
        return { x: this.x - this.width / 2, y: this.y + this.height / 2 };
    }
    bottomMiddle() {
        return { x: this.x, y: this.y + this.height / 2 };
    }
    bottomRight() {
        return { x: this.x + this.width / 2, y: this.y + this.height / 2 };
    }
    //
    // Draw Position Getter (Top-Left)
    drawX() {
        return this.x - this.width / 2;
    }
    drawY() {
        return this.y - this.height / 2;
    }
}
exports.Box = Box;
//# sourceMappingURL=Box.js.map