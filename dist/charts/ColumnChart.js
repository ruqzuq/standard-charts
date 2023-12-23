"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColumnChart = void 0;
const Box_1 = require("../base/Box");
const Data_1 = require("../base/Data");
const MaxMeasure_1 = require("../base/MaxMeasure");
const Rect_1 = require("../base/Rect");
const Text_1 = require("../base/Text");
const Chart_1 = require("./Chart");
const Constants_1 = require("./Constants");
class ColumnChart extends Chart_1.Chart {
    constructor(props) {
        super(props);
        this.fontSize = 8;
        [10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32].forEach((fontSize) => {
            if (!this.fontTooBig(fontSize)) {
                this.fontSize = fontSize;
            }
        });
        this.axisElementWidth =
            (this.width - 2 * Constants_1.Constants.ChartPadding) / this.data.length;
        this.columnWidth =
            (Constants_1.Constants.ColumnMarginToWidthRelation * this.axisElementWidth) /
                (Constants_1.Constants.ColumnMarginToWidthRelation + 2);
        this.columnMargin =
            this.columnWidth / Constants_1.Constants.ColumnMarginToWidthRelation;
    }
    fontTooBig(fontSize) {
        const maxTextWidth = new MaxMeasure_1.MaxMeasure();
        this.data.forEach(({ key, AC, PY, FC, PL }) => {
            const value = AC ?? PY ?? FC ?? PL ?? '?';
            const keyText = new Text_1.Text(this.context, key, { size: fontSize });
            if (!(value === '?')) {
                const valueText = new Text_1.Text(this.context, value, { size: fontSize });
                maxTextWidth.addEntry(valueText.boxWidth + 2 * Constants_1.Constants.ColumnPadding);
            }
            maxTextWidth.addEntry(keyText.boxWidth);
        });
        return (this.data.length *
            (maxTextWidth.max +
                2 * (maxTextWidth.max / Constants_1.Constants.ColumnMarginToWidthRelation)) >
            this.width - 2 * Constants_1.Constants.ChartPadding);
    }
    scaleTooBig(scale) {
        const negativeMax = new MaxMeasure_1.MaxMeasure();
        const positiveMax = new MaxMeasure_1.MaxMeasure();
        this.data.forEach((dataPoint) => {
            const { left, primary, right } = (0, Data_1.extractValues)(dataPoint);
            const keyText = new Text_1.Text(this.context, dataPoint.key, {
                size: this.fontSize,
            });
            const [positiveValue, negativeValue] = (0, Data_1.stackValues)(primary);
            const positiveValueText = new Text_1.Text(this.context, positiveValue, {
                size: this.fontSize,
            });
            const negativeValueText = new Text_1.Text(this.context, negativeValue, {
                size: this.fontSize,
            });
            if (positiveValue && negativeValue) {
                negativeMax.addEntry(scale * Math.abs(negativeValue), negativeValueText.boxHeight, keyText.boxHeight);
                positiveMax.addEntry(scale * positiveValue, positiveValueText.boxHeight);
            }
            else if (positiveValue) {
                negativeMax.addEntry(keyText.boxHeight);
                positiveMax.addEntry(scale * positiveValue, positiveValueText.boxHeight);
            }
            else if (negativeValue) {
                negativeMax.addEntry(scale * Math.abs(negativeValue), negativeValueText.boxHeight);
                positiveMax.addEntry(keyText.boxHeight);
            }
            [left, right].forEach((side) => {
                const [positiveValue, negativeValue] = (0, Data_1.stackValues)(side);
                if (positiveValue) {
                    positiveMax.addEntry(scale * Math.abs(positiveValue));
                }
                if (negativeValue) {
                    negativeMax.addEntry(scale * Math.abs(negativeValue));
                }
            });
        });
        // annahme, dass scaling präziser wird
        this.axisOffset = this.height - Constants_1.Constants.ChartPadding - negativeMax.max;
        return (negativeMax.max + positiveMax.max >
            this.height - 2 * Constants_1.Constants.ChartPadding);
    }
    draw(scale) {
        this.drawDebug();
        this.data.forEach((dataPoint, index) => {
            const { left, primary, right } = (0, Data_1.extractValues)(dataPoint);
            const origin = new Box_1.Box({
                x: Constants_1.Constants.ChartPadding +
                    (this.columnMargin + this.columnWidth / 2) +
                    index * this.axisElementWidth,
                y: this.axisOffset,
            }, this.axisElementWidth, 0);
            const keyText = new Text_1.Text(this.context, dataPoint.key, {
                size: this.fontSize,
            });
            let positiveAnchor = origin;
            let negativeAnchor = origin;
            primary.forEach(({ value, scenario }) => {
                let valueBox;
                if (value >= 0) {
                    valueBox = Box_1.Box.fromTopMiddle(positiveAnchor, this.columnWidth, scale * value);
                    positiveAnchor = valueBox;
                }
                else {
                    valueBox = Box_1.Box.fromBottomMiddle(negativeAnchor, this.columnWidth, scale * Math.abs(value));
                    negativeAnchor = valueBox;
                }
                Rect_1.Rect.draw(this.context, valueBox, scenario);
            });
            const [positiveValue, negativeValue] = (0, Data_1.stackValues)(primary);
            const positiveValueText = new Text_1.Text(this.context, positiveValue, {
                size: this.fontSize,
            });
            const negativeValueText = new Text_1.Text(this.context, negativeValue, {
                size: this.fontSize,
            });
            if (positiveValue && negativeValue) {
                positiveValueText.placeTopMiddle(positiveAnchor);
                negativeValueText.placeBottomMiddle(negativeAnchor);
                keyText.placeBottomMiddle(negativeValueText.box);
                //
                positiveValueText.draw(this.context, this.debug);
                negativeValueText.draw(this.context, this.debug);
            }
            else if (positiveValue) {
                positiveValueText.placeTopMiddle(positiveAnchor);
                keyText.placeBottomMiddle(origin);
                //
                positiveValueText.draw(this.context, this.debug);
            }
            else if (negativeValue) {
                negativeValueText.placeBottomMiddle(negativeAnchor);
                keyText.placeTopMiddle(origin);
                //
                negativeValueText.draw(this.context, this.debug);
            }
            keyText.draw(this.context, this.debug);
            // Axis
            this.context.lineWidth = 2;
            this.context.strokeStyle = '#494949';
            this.context.strokeRect(origin.drawX(), origin.drawY(), origin.width, origin.height);
        });
    }
}
exports.ColumnChart = ColumnChart;
//# sourceMappingURL=ColumnChart.js.map