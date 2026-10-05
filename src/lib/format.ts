// src/lib/format.ts
import { MONTHS_ID } from '~/constants';

function toDate(value: string | Date): Date {
  if (value instanceof Date) return value;
  const [y, m, d] = value.split('-').map(Number);
  return new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1));
}

export function formatDate(value: string | Date): string {
  const date = toDate(value);
  const d = date.getUTCDate();
  const m = date.getUTCMonth();
  const y = date.getUTCFullYear();
  return `${d} ${MONTHS_ID[m]} ${y}`;
}

export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} menit`;
  if (m === 0) return `${h} jam`;
  return `${h} jam ${m} menit`;
}

export function formatDateRange(
  from: string | Date,
  to?: string | Date | null
): string | null {
  const fromLabel = formatDate(from);
  const toLabel = to ? formatDate(to) : 'Sekarang';
  return `${fromLabel} – ${toLabel}`;
}