# Nexus Deployment Guide

Production deployment checklist for **Syed Nexus** (Next.js 16 + PostgreSQL + Prisma).

## Requirements

- Node.js 20+
- PostgreSQL database (Neon, Supabase, or self-hosted)
- Google OAuth credentials
- Domain with HTTPS

## 1. Install

```bash
git clone <repository-url>
cd syednexus-web
npm install
```

## 2. Environment variables

Copy the example file and fill in values:

```bash
cp .env.example .env
```

| Variable | Required | Purpose |
|----------|----------|---------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Yes | Session signing (`openssl rand -base64 32`) |
| `NEXTAUTH_URL` | Yes | Public site URL (e.g. `https://syednexus.com`) |
| `GOOGLE_CLIENT_ID` | Yes | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Yes | Google OAuth client secret |
| `OWNER_EMAIL` | Yes | Google account granted OWNER/Vault access |
| `NEXUS_SECRET` | Yes | Encrypts MFA secrets and sensitive vault data |
| `NEXT_PUBLIC_SITE_URL` | Yes | Canonical URL for sitemap/OpenGraph |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Optional | AI mentor features |
| `ALLOW_DB_SEED` | Seed only | Must be `true` to run `npm run seed` |

Never commit `.env`. `.env.example` is safe to commit.

## 3. Database setup

```bash
npx prisma migrate deploy
npx prisma generate
```

For local development with a fresh database:

```bash
npx prisma migrate dev
```

## 4. Seed content

Seeding **replaces** portfolio identity, education, experience, skills, projects, certifications, and blogs.

```bash
# Linux/macOS
ALLOW_DB_SEED=true npm run seed

# Windows PowerShell
$env:ALLOW_DB_SEED="true"; npm run seed
```

Mission packs (run separately as needed):

```bash
npm run seed:cyber
npm run seed:attack
npm run seed:games
npm run seed:practical
```

Blog pack is included in the main `npm run seed` via `blogPack001`.

## 5. Production build

```bash
npm run build
npm run start
```

Verify locally:

```bash
npx tsc --noEmit
```

## 6. Owner access & MFA

1. Sign in with Google using `OWNER_EMAIL`.
2. Open **Vault → Security** (`/vault/security`).
3. Scan the TOTP QR code with Google/Microsoft Authenticator or Authy.
4. Enter a 6-digit code to activate MFA.

After MFA is enabled, every Vault visit requires a second factor at `/auth/mfa`.

## 7. Recommended hosting

- **Vercel** or similar for Next.js
- **Neon** or managed PostgreSQL for `DATABASE_URL`
- Set all environment variables in the hosting dashboard
- Point custom domain and update `NEXTAUTH_URL` + `NEXT_PUBLIC_SITE_URL`

## 8. Post-deploy checks

- [ ] Homepage and `/nexus` load
- [ ] `/soc`, `/attack`, `/forensics` missions open NexusRoom
- [ ] `/blogs` shows seeded articles
- [ ] Google login works for owner
- [ ] Vault redirects non-owners
- [ ] MFA challenge appears when enabled
- [ ] `robots.txt` and `sitemap.xml` reachable
- [ ] No mission answers in browser DevTools (PublicMission API)

## 9. Rollback

- Redeploy previous build artifact
- Database: restore from backup before re-running destructive seeds
- Disable MFA via authenticator code at `/vault/security` if locked out (requires working TOTP)

## 10. Security notes

- `/vault/**` is middleware-protected (OWNER + MFA when enabled)
- Admin APIs use `requireAdmin()` (owner + MFA satisfied)
- Mission answers are server-validated only
- Set strong `NEXTAUTH_SECRET` and `NEXUS_SECRET` in production
