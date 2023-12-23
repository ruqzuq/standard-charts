"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Text = void 0;
const Box_1 = require("./Box");
const Rect_1 = require("./Rect");
class Text {
    constructor(context, text, props = {}) {
        const { bold = false, size = 10, family = 'Arial' } = props;
        this.text = text;
        this.font = `${bold ? 'bold' : ''} ${size}px ${family}`;
        context.font = this.font;
        this.width = context.measureText(text).width;
        this.height = size;
        this.padding = Math.ceil(size / 8);
        this.boxWidth = this.width + this.padding * 2;
        this.boxHeight = this.height + this.padding * 2;
    }
    // Drawing
    draw(context, debug = false) {
        context.font = this.font;
        context.fillStyle = 'black';
        context.fillText(this.text, this.box.drawX() + this.padding, this.box.drawY() + this.padding);
        if (debug) {
            Rect_1.Rect.drawDebug(context, this.box);
        }
    }
    //
    // Placements
    placeTopLeft(box) {
        const { x, y } = box.topLeft();
        this.box = new Box_1.Box({ x: x - this.boxWidth / 2, y: y - this.boxHeight / 2 }, this.boxWidth, this.boxHeight);
    }
    placeTopMiddle(box) {
        const { x, y } = box.topMiddle();
        this.box = new Box_1.Box({ x, y: y - this.boxHeight / 2 }, this.boxWidth, this.boxHeight);
    }
    placeTopRight(box) {
        const { x, y } = box.topRight();
        this.box = new Box_1.Box({ x: x + this.boxWidth / 2, y: y - this.boxHeight / 2 }, this.boxWidth, this.boxHeight);
    }
    placeMiddleLeft(box) {
        const { x, y } = box.middleLeft();
        this.box = new Box_1.Box({ x: x - this.boxWidth / 2, y }, this.boxWidth, this.boxHeight);
    }
    placeCenter(box) {
        const { x, y } = box.center();
        this.box = new Box_1.Box({ x, y }, this.boxWidth, this.boxHeight);
    }
    placeMiddleRight(box) {
        const { x, y } = box.middleRight();
        this.box = new Box_1.Box({ x: x + this.boxWidth / 2, y }, this.boxWidth, this.boxHeight);
    }
    placeBottomLeft(box) {
        const { x, y } = box.bottomLeft();
        this.box = new Box_1.Box({ x: x - this.boxWidth / 2, y: y + this.boxHeight / 2 }, this.boxWidth, this.boxHeight);
    }
    placeBottomMiddle(box) {
        const { x, y } = box.bottomMiddle();
        this.box = new Box_1.Box({ x, y: y + this.boxHeight / 2 }, this.boxWidth, this.boxHeight);
    }
    placeBottomRight(box) {
        const { x, y } = box.bottomRight();
        this.box = new Box_1.Box({ x: x + this.boxWidth / 2, y: y + this.boxHeight / 2 }, this.boxWidth, this.boxHeight);
    }
}
exports.Text = Text;
//# sourceMappingURL=Text.js.map