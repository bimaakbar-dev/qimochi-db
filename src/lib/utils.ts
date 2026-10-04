// src/lib/utils.ts
export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function padNumber(n: number, length = 2): string {
  return String(n).padStart(length, '0');
}