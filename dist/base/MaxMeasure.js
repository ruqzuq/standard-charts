"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaxMeasure = void 0;
/**
 * Calculate the maximum value.
 */
class MaxMeasure {
    constructor() {
        this.max = 0;
    }
    /**
     * Add cumultative entry of values, which could be the maximum.
     */
    addEntry(...values) {
        this.max = Math.max(this.max, values.reduce((sum, value) => sum + value, 0));
    }
}
exports.MaxMeasure = MaxMeasure;
//# sourceMappingURL=MaxMeasure.js.map