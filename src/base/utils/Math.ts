// Javascript calculations are inaccurate.
export const round = (value, digits = 4) => {
  const factor = Math.pow(10, digits - 1);
  return Math.round(value * factor) / factor;
};
