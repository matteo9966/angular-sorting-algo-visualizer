export function hasSameValue(rect: HTMLDivElement, value: number) {
    const currentValue = rect.getAttribute('data-value');
    if (!currentValue) return false;
    return +currentValue === value;
  }