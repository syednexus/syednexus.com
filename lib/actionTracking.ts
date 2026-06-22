export type ActionType =
  | "command"
  | "file_open"
  | "packet_inspect"
  | "packet_filter"
  | "tcp_stream"
  | "siem_alert"
  | "siem_verdict"
  | "browser_payload"
  | "burp_intercept"
  | "burp_repeater"
  | "network_inspect"
  | "hash_verified"
  | "evidence"
  | "finding_submitted";

export type TrackedAction = {
  type: ActionType;
  value: string;
  at: number;
};

export function createAction(type: ActionType, value: string): TrackedAction {
  return { type, value, at: Date.now() };
}

export function matchesValidator(validator: string, actions: TrackedAction[]): boolean {
  const v = validator.toLowerCase();

  const hasCommand = (pattern: RegExp) =>
    actions.some(action => action.type === "command" && pattern.test(action.value.toLowerCase()));

  const hasType = (type: ActionType, pattern?: RegExp) =>
    actions.some(
      action =>
        action.type === type && (!pattern || pattern.test(action.value.toLowerCase()))
    );

  switch (v) {
    case "nmap_completed":
      return hasCommand(/\bnmap\b/);
    case "service_found":
      return hasCommand(/\bnmap\b/) || hasCommand(/\bnetstat\b/) || hasType("network_inspect");
    case "file_found":
    case "suspicious_file":
      return (
        hasType("file_open", /\.miner|\.hidden|secret|auth\.log/) ||
        hasCommand(/\bfind\b/) ||
        hasCommand(/\bls\b/)
      );
    case "permissions_analyzed":
      return hasCommand(/\bchmod\b/) || hasCommand(/\bls\s+-l\b/) || hasType("file_open", /secret/);
    case "evidence_collected":
      return actions.filter(action => action.type === "evidence").length >= 2;
    case "siem_alert_reviewed":
      return hasType("siem_alert");
    case "packet_inspected":
      return hasType("packet_inspect") || hasType("packet_filter");
    case "browser_payload_tested":
      return hasType("browser_payload") || hasType("burp_intercept");
    case "burp_modified":
      return hasType("burp_repeater") || hasType("burp_intercept", /'|or\s+1/);
    case "hash_verified":
      return hasType("hash_verified");
    case "finding_submitted":
      return hasType("finding_submitted");
    case "verdict_set":
      return hasType("siem_verdict");
    default:
      return (
        hasCommand(new RegExp(v.replace(/_/g, ".*"))) ||
        actions.some(action => action.value.toLowerCase().includes(v.replace(/_/g, " ")))
      );
  }
}

export function validatorLabel(validator: string): string {
  const labels: Record<string, string> = {
    nmap_completed: "Run nmap scan",
    service_found: "Discover a service",
    evidence_collected: "Collect 2+ evidence items",
    siem_alert_reviewed: "Review a SIEM alert",
    browser_payload_tested: "Test browser/Burp payload",
    finding_submitted: "Submit finding",
    hash_verified: "Verify file hash",
    verdict_set: "Set alert verdict"
  };
  return labels[validator] ?? validator.replace(/_/g, " ");
}
