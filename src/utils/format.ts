export function formatDMY(date: string) {
  return new Date(date).toISOString().substring(0, 10);
}
