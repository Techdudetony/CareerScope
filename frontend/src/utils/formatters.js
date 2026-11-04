export function formatCurrency(value) {
  if (value === null || value === undefined) {
    return 'Not available';
  }

  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return 'Not available';
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(value) {
  if (value === null || value === undefined) {
    return 'Not available';
  }

  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return 'Not available';
  }

  return new Intl.NumberFormat('en-US').format(amount);
}
