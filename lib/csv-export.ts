export function escapeCsvCell(value: unknown): string {
  const text = value == null ? '' : String(value);
  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

export function rowsToCsv(rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return '';
  const headers = Object.keys(rows[0]);
  const lines = [
    headers.map(escapeCsvCell).join(','),
    ...rows.map((row) => headers.map((key) => escapeCsvCell(row[key])).join(',')),
  ];
  return lines.join('\r\n');
}

export function csvDownloadResponse(filename: string, csv: string) {
  return new Response(`\uFEFF${csv}`, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}

export function parseDateRange(searchParams: URLSearchParams) {
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const fromDate = from ? new Date(`${from}T00:00:00`) : null;
  const toDate = to ? new Date(`${to}T23:59:59.999`) : null;
  return { fromDate, toDate };
}
