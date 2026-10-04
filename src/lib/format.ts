/** Format tanggal Indonesia, mis. "15 Februari 2026".
 *  Pakai UTC karena tanggal di frontmatter dibaca sebagai UTC. */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}
