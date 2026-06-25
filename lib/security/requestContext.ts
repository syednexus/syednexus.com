export function getClientIp(req: Request): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return req.headers.get("x-real-ip") || "unknown";
}

export function getRequestSecurityContext(req: Request) {
  const url = new URL(req.url);

  return {
    ipAddress: getClientIp(req),
    userAgent: req.headers.get("user-agent"),
    endpoint: url.pathname,
    method: req.method
  };
}
