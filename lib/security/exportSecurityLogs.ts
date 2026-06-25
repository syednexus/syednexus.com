import type { SecurityEventType, SecuritySeverity } from "@/lib/security/securityEvents";

export type ExportableSecurityLog = {
  id: number;
  eventType: SecurityEventType;
  severity: SecuritySeverity;
  userEmail: string | null;
  ipAddress: string | null;
  endpoint: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
};

function escapeCsv(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function securityLogsToCsv(logs: ExportableSecurityLog[]): string {
  const headers = ["Time", "Event", "Severity", "User", "IP", "Endpoint", "Metadata"];
  const rows = logs.map(log => [
    new Date(log.createdAt).toISOString(),
    log.eventType,
    log.severity,
    log.userEmail ?? "",
    log.ipAddress ?? "",
    log.endpoint ?? "",
    log.metadata ? JSON.stringify(log.metadata) : ""
  ]);

  return [headers, ...rows].map(row => row.map(cell => escapeCsv(String(cell))).join(",")).join("\n");
}

export function downloadTextFile(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
