export function formatWeight(kg: number): string {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(Math.round(kg)) + " kg";
}

export function formatVolume(m3: number): string {
  return new Intl.NumberFormat("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(m3) + " m\u00B3";
}

export function formatPercent(value: number): string {
  return (value * 100).toFixed(1) + "%";
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(Math.round(n));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount);
}

export function formatCO2(kg: number): string {
  if (kg >= 1000) {
    return (kg / 1000).toFixed(1) + " t CO\u2082";
  }
  return Math.round(kg) + " kg CO\u2082";
}

export function formatRoute(origin: string, destination: string): string {
  return `${origin} \u2192 ${destination}`;
}
