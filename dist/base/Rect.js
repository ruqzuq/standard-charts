"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rect = void 0;
const Color_1 = require("./Color");
const Data_1 = require("./Data");
const Debug_1 = require("./Debug");
class Rect {
    static drawDebug(context, box) {
        context.lineWidth = 2;
        context.strokeStyle = Debug_1.Debug.color();
        context.strokeRect(box.drawX(), box.drawY(), box.width, box.height);
    }
    static draw(context, box, scenario) {
        switch (scenario) {
            case Data_1.Scenario.PY:
                this.drawPY(context, box);
                break;
            case Data_1.Scenario.AC:
                this.drawAC(context, box);
                break;
            case Data_1.Scenario.FC:
                this.drawFC(context, box);
                break;
            case Data_1.Scenario.PL:
                this.drawPL(context, box);
                break;
        }
    }
    static drawPY(context, box) {
        context.fillStyle = Color_1.Color.Fill.PY;
        context.fillRect(box.drawX(), box.drawY(), box.width, box.height);
    }
    static drawAC(context, box) {
        context.fillStyle = Color_1.Color.Fill.AC;
        context.fillRect(box.drawX(), box.drawY(), box.width, box.height);
    }
    static drawFC(context, box) {
        context.fillStyle = context.createPattern(this.createPinstripeCanvas(), 'repeat');
        context.fillRect(box.drawX() + 1, box.drawY() + 1, box.width - 2, box.height - 2);
        //
        context.lineWidth = 2;
        context.strokeStyle = '#404040';
        context.strokeRect(box.drawX() + 1, box.drawY() + 1, box.width - 2, box.height - 2);
    }
    static drawPL(context, box) {
        context.lineWidth = 2;
        context.strokeStyle = '#494949';
        context.strokeRect(box.drawX(), box.drawY(), box.width, box.height);
    }
    static createPinstripeCanvas() {
        const patternCanvas = new OffscreenCanvas(8, 8);
        const pctx = patternCanvas.getContext('2d', {
            antialias: false,
        });
        const color = '#404040';
        const CANVAS_SIDE_LENGTH = 8;
        const WIDTH = CANVAS_SIDE_LENGTH;
        const HEIGHT = CANVAS_SIDE_LENGTH;
        const DIVISIONS = 4;
        patternCanvas.width = WIDTH;
        patternCanvas.height = HEIGHT;
        pctx.fillStyle = color;
        // Top line
        pctx.beginPath();
        pctx.moveTo(0, HEIGHT * (1 / DIVISIONS));
        pctx.lineTo(WIDTH * (1 / DIVISIONS), 0);
        pctx.lineTo(0, 0);
        pctx.lineTo(0, HEIGHT * (1 / DIVISIONS));
        pctx.fill();
        // Middle line
        pctx.beginPath();
        pctx.moveTo(WIDTH, HEIGHT * (1 / DIVISIONS));
        pctx.lineTo(WIDTH * (1 / DIVISIONS), HEIGHT);
        pctx.lineTo(0, HEIGHT);
        pctx.lineTo(0, HEIGHT * ((DIVISIONS - 1) / DIVISIONS));
        pctx.lineTo(WIDTH * ((DIVISIONS - 1) / DIVISIONS), 0);
        pctx.lineTo(WIDTH, 0);
        pctx.lineTo(WIDTH, HEIGHT * (1 / DIVISIONS));
        pctx.fill();
        // Bottom line
        pctx.beginPath();
        pctx.moveTo(WIDTH, HEIGHT * ((DIVISIONS - 1) / DIVISIONS));
        pctx.lineTo(WIDTH * ((DIVISIONS - 1) / DIVISIONS), HEIGHT);
        pctx.lineTo(WIDTH, HEIGHT);
        pctx.lineTo(WIDTH, HEIGHT * ((DIVISIONS - 1) / DIVISIONS));
        pctx.fill();
        return patternCanvas;
    }
}
exports.Rect = Rect;
//# sourceMappingURL=Rect.js.map