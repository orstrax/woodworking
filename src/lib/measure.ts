const FRACTION_DENOMS = [2, 4, 8, 16, 32, 64] as const;

export function parseInches(input: string): number | null {
  const trimmed = input.trim().toLowerCase();
  if (!trimmed) return null;

  const mm = trimmed.match(/^(-?[\d.]+)\s*mm$/);
  if (mm) {
    const value = Number(mm[1]);
    return Number.isFinite(value) ? value / 25.4 : null;
  }

  const cm = trimmed.match(/^(-?[\d.]+)\s*cm$/);
  if (cm) {
    const value = Number(cm[1]);
    return Number.isFinite(value) ? (value * 10) / 25.4 : null;
  }

  const raw = trimmed.replace(/inches?|in\.?|"/g, "").trim();
  if (!raw) return null;

  const mixed = raw.match(/^(-?)(\d+)\s+(\d+)\s*\/\s*(\d+)$/);
  if (mixed) {
    const sign = mixed[1] ? -1 : 1;
    const whole = Number(mixed[2]);
    const num = Number(mixed[3]);
    const den = Number(mixed[4]);
    if (!den) return null;
    return sign * (whole + num / den);
  }

  const fraction = raw.match(/^(-?)(\d+)\s*\/\s*(\d+)$/);
  if (fraction) {
    const sign = fraction[1] ? -1 : 1;
    const num = Number(fraction[2]);
    const den = Number(fraction[3]);
    if (!den) return null;
    return sign * (num / den);
  }

  const decimal = Number(raw.replace(/,/g, ""));
  if (!Number.isFinite(decimal)) return null;
  return decimal;
}

export function toFraction(inches: number, maxDenom = 32): string {
  if (!Number.isFinite(inches)) return "—";
  const sign = inches < 0 ? "-" : "";
  const abs = Math.abs(inches);
  const whole = Math.floor(abs + 1e-9);
  const remainder = abs - whole;

  if (remainder < 1 / (maxDenom * 2)) {
    return `${sign}${whole}`;
  }

  let bestNum = 1;
  let bestDen = maxDenom;
  let bestErr = Infinity;

  for (const den of FRACTION_DENOMS) {
    if (den > maxDenom) continue;
    const num = Math.round(remainder * den);
    const err = Math.abs(remainder - num / den);
    if (err < bestErr - 1e-12 || (Math.abs(err - bestErr) < 1e-12 && den < bestDen)) {
      bestErr = err;
      bestNum = num;
      bestDen = den;
    }
  }

  if (bestNum === 0) return `${sign}${whole}`;
  if (bestNum === bestDen) return `${sign}${whole + 1}`;

  const g = gcd(bestNum, bestDen);
  const frac = `${bestNum / g}/${bestDen / g}`;
  return whole === 0 ? `${sign}${frac}` : `${sign}${whole} ${frac}`;
}

export function formatInches(inches: number, maxDenom = 32): string {
  return `${toFraction(inches, maxDenom)}"`;
}

export function formatNumber(value: number, digits = 2): string {
  if (!Number.isFinite(value)) return "—";
  return value.toLocaleString(undefined, {
    maximumFractionDigits: digits,
    minimumFractionDigits: 0,
  });
}

export function boardFeet(thicknessIn: number, widthIn: number, lengthIn: number, qty = 1): number {
  return (thicknessIn * widthIn * lengthIn * qty) / 144;
}

function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}
