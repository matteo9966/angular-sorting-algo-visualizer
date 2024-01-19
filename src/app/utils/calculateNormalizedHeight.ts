export function calculateNormailizedHeight(
    containerHeight: number,
    maxValue: number,
    value: number
  ) {
    return (value / maxValue) * containerHeight;
  }