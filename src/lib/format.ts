// src/lib/format.ts
import { MONTHS_ID } from '~/constants';

export function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return `${d} ${MONTHS_ID[m - 1]} ${y}`;
}

export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} menit`;
  if (m === 0) return `${h} jam`;
  return `${h} jam ${m} menit`;
}

export function formatDateRange(from: string, to?: string | null): string | null {
  const fromLabel = formatDate(from);
  const toLabel = to ? formatDate(to) : 'Sekarang';
  return `${fromLabel} – ${toLabel}`;
}