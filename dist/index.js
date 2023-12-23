"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StandardCharts = exports.ChartTypes = void 0;
const ColumnChart_1 = require("./charts/ColumnChart");
var ChartTypes;
(function (ChartTypes) {
    ChartTypes["Column"] = "COLUMN";
})(ChartTypes || (exports.ChartTypes = ChartTypes = {}));
/**
 * Return URL of the rendered chart png-images.
 */
const StandardCharts = async (charts) => {
    const chartObjects = [];
    charts.forEach((chart) => {
        switch (chart.chartType) {
            case ChartTypes.Column:
                chartObjects.push(new ColumnChart_1.ColumnChart(chart));
                break;
        }
    });
    let scale;
    let min = 0;
    let max = 10;
    for (let i = 0; i < 100; i++) {
        scale = min + (max - min) / 2;
        if (chartObjects.some((chart) => chart.scaleTooBig(scale))) {
            max = scale;
        }
        else {
            min = scale;
        }
    }
    chartObjects.forEach((chart) => {
        chart.draw(scale);
    });
    const promises = chartObjects.map(async (chart) => {
        return new Promise((resolve, reject) => {
            try {
                chart.canvas
                    .convertToBlob({ type: 'image/png' })
                    .then((blob) => resolve(blob))
                    .catch((error) => reject(error));
            }
            catch (error) {
                reject(error);
            }
        });
    });
    try {
        const blobs = await Promise.all(promises);
        return blobs.map((blob) => URL.createObjectURL(blob));
    }
    catch (error) {
        console.error('Error converting images:', error);
        throw error;
    }
};
exports.StandardCharts = StandardCharts;
//# sourceMappingURL=index.js.map