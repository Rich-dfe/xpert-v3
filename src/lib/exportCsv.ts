
interface ExportCSVOptions {
  filename: string;
  headers: string[];
  rows: (string | number | null | undefined)[][];
}

export function exportCSV({
  filename,
  headers,
  rows,
}: ExportCSVOptions) {
  // Escape values to ensure valid CSV formatting.
  const escapeCSV = (value: string | number | null | undefined) => {
    const stringValue = String(value ?? "");

    return `"${stringValue.replace(/"/g, '""')}"`;
  };

  // Convert headers and rows into CSV format.
  const csvContent = [
    headers.map(escapeCSV).join(","),
    ...rows.map((row) => row.map(escapeCSV).join(",")),
  ].join("\n");

  // Create downloadable CSV file.
  const blob = new Blob(
    ["\uFEFF", csvContent],
    { type: "text/csv;charset=utf-8;" }
  );

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename.endsWith(".csv")
    ? filename
    : `${filename}.csv`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}
