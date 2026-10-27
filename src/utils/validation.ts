
function isIPv4(value: string): boolean {
  const parts = value.split('.');
  if (parts.length !== 4) return false;

  return parts.every((part) =>
    /^(0|[1-9]\d{0,2})$/.test(part) && Number(part) <= 255
  );
}

function isIPv6(value: string): boolean {
  try {
    const url = new URL(`http://[${value}]/`);
    return url.hostname.startsWith('[');
  } catch {
    return false;
  }
}

function isDomain(value: string): boolean {
  if (value.length > 253 || !value.includes('.')) return false;

  const labels = value.split('.');
  const validLabel = /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/;

  return labels.every((label) => validLabel.test(label)) &&
    /[a-zA-Z]/.test(labels[labels.length - 1]);
}

// Return an error message or null when the input is valid
export function validateIpQuery(query: string): string | null {
  const value = query.trim();

  if (!value) {
    return 'Please enter an IP address or domain.';
  }

  if (isIPv4(value) || isIPv6(value) || isDomain(value)) {
    return null;
  }

  return 'Please enter a valid IP address or domain.';
}
