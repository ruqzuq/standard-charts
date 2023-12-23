/**
 * Calculate the maximum value.
 */
export class MaxMeasure {
  max: number;

  constructor() {
    this.max = 0;
  }
  /**
   * Add cumultative entry of values, which could be the maximum.
   */
  addEntry(...values: number[]) {
    this.max = Math.max(
      this.max,
      values.reduce((sum, value) => sum + value, 0)
    );
  }
}
