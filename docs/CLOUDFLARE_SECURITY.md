# Cloudflare Production Hardening — Syed Nexus

This guide complements application headers in `lib/security/securityHeaders.ts` and edge protection on Cloudflare.

## Prerequisites

- Domain pointed to Cloudflare (orange cloud / proxied)
- HTTPS enforced (Full Strict recommended)
- Environment variables set on the origin (`NEXTAUTH_URL`, `NEXT_PUBLIC_SITE_URL` match public domain)

## Recommended security level

| Setting | Recommendation |
|---------|----------------|
| **Security Level** | *High* (or *I'm Under Attack* during active incidents) |
| **Bot Fight Mode** | Enabled |
| **Browser Integrity Check** | Enabled |
| **Challenge Passage** | 30 minutes |

## WAF custom rules (examples)

Create rules in **Security → WAF → Custom rules**:

1. **Block obvious scanners**
   - Expression: `(http.user_agent contains "sqlmap") or (http.user_agent contains "nikto")`
   - Action: Block

2. **Protect auth endpoints**
   - Expression: `(http.request.uri.path starts_with "/api/auth") and (cf.threat_score gt 10)`
   - Action: Managed Challenge

3. **Protect vault**
   - Expression: `http.request.uri.path starts_with "/vault"`
   - Action: Managed Challenge (optional second layer; app enforces OWNER + MFA)

4. **Protect security APIs**
   - Expression: `http.request.uri.path starts_with "/api/security"`
   - Action: Block if not from owner IP allowlist (optional)

## Rate limiting (Cloudflare)

Create **Rate limiting rules** in addition to app-level Redis/memory limits:

| Path | Threshold | Action |
|------|-----------|--------|
| `/api/auth/login` | 10 req / 15 min per IP | Block |
| `/api/auth/mfa/*` | 20 req / 15 min per IP | Challenge |
| `/api/security/*` | 30 req / 5 min per IP | Block |
| `/api/ai` | 60 req / 1 min per IP | Challenge |

## Bot protection

- Enable **Super Bot Fight Mode** (Pro+) or **Bot Fight Mode** (Free)
- Allow verified bots needed for SEO: Googlebot (sitemap, portfolio indexing)
- Do **not** cache authenticated routes

## Cache rules

| Path | Cache |
|------|-------|
| `/_next/static/*` | Cache Everything, long TTL |
| `/public/sounds/*` | Cache Everything |
| `/api/*` | Bypass cache |
| `/vault/*` | Bypass cache |
| `/auth/*` | Bypass cache |
| HTML pages | Standard (respect origin headers) |

## Origin headers (already in app)

Next.js serves via `getProductionSecurityHeaders()`:

- `Content-Security-Policy` (Gemini, Google OAuth, Resend allowed in `connect-src`)
- `X-Frame-Options: SAMEORIGIN`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` (camera/mic/geo disabled)
- `Strict-Transport-Security` (production only)

## TLS & DNS

- **SSL/TLS mode:** Full (strict)
- **Minimum TLS:** 1.2
- **Always Use HTTPS:** On
- **Automatic HTTPS Rewrites:** On

## Logging & SOC integration

- Stream Cloudflare firewall events to your SIEM if available
- Correlate with Nexus `SecurityLog` via `/vault/security` (owner-only)
- Upstash Redis threat reputation keys: `security:ip:{ip}`

## Deployment checklist

- [ ] Orange-cloud proxy enabled
- [ ] WAF + rate limits configured
- [ ] Cache bypass on `/api`, `/vault`, `/auth`
- [ ] `UPSTASH_REDIS_REST_URL` + token set for distributed rate limits
- [ ] Health check: `GET /api/health` returns `{ status: "ok", database: true }`
- [ ] MFA verified for owner before vault access
