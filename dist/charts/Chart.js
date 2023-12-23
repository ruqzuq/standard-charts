"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chart = void 0;
const Box_1 = require("../base/Box");
const Rect_1 = require("../base/Rect");
const Constants_1 = require("./Constants");
class Chart {
    constructor(props) {
        const { width, height, data, debug } = props;
        // Props
        this.width = width;
        this.height = height;
        this.data = data;
        this.debug = debug;
        // Canvas
        this.canvas = new OffscreenCanvas(width, height);
        this.context = this.canvas.getContext('2d', {
            alpha: true,
            antialias: false,
        });
        this.context.globalAlpha = 1;
        this.context.textBaseline = 'top';
    }
    drawDebug() {
        if (this.debug) {
            const outerBox = new Box_1.Box({
                x: this.width / 2,
                y: this.height / 2,
            }, this.width, this.height);
            const innerBox = new Box_1.Box({
                x: this.width / 2,
                y: this.height / 2,
            }, this.width - 2 * Constants_1.Constants.ChartPadding, this.height - 2 * Constants_1.Constants.ChartPadding);
            Rect_1.Rect.drawDebug(this.context, innerBox);
            Rect_1.Rect.drawDebug(this.context, outerBox);
        }
    }
}
exports.Chart = Chart;
//# sourceMappingURL=Chart.js.map