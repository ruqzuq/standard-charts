export const formatValue = (value: number, percentage: boolean = false) =>
  `${value}${percentage ? '%' : ''}`;
