# Syed Nexus — Project Overview

**Syed Nexus** is a personal cybersecurity portfolio and interactive learning platform. It combines a public professional site with a simulated cyber range for SOC, attack, forensics, and career practice.

## Core systems

### Nexus OS (`/nexus`)

Central hub linking portfolio sections, cyber modules, tools, and career paths. Entry point for visitors exploring the platform.

### Cyber Range

Mission-driven labs routed through:

```
MissionEngine → NexusRoom → NexusWorkstation → Tool windows
```

| Module | Route | Focus |
|--------|-------|-------|
| SOC | `/soc` | Alert triage, SIEM, tickets |
| Attack | `/attack` | Recon, web testing, exploitation sims |
| Forensics | `/forensics` | Logs, files, hashes, timelines |
| Games | `/games` | Beginner interactive challenges |
| Tools | `/tools` | Standalone tool practice |
| Career | `/career` | Day-in-the-life analyst simulation |

Missions use **NexusRoom** for briefing and objectives, then **NexusWorkstation** with realistic tool windows (Terminal, Nmap, Wireshark, Burp, SIEM, etc.).

### SOC Simulator

Workstation presets mirror analyst workflows: inbox messages, SIEM alert queues, ticket updates, Slack coordination, and investigation notes—not static quiz cards.

### Portfolio (`/portfolio`, `/`)

Public profile fed from PostgreSQL:

- Education (Pharmacy → Cybersecurity path)
- Amazon operations experience
- Skills, certifications, projects
- Resume download

### Blogs (`/blogs`)

Markdown articles seeded via `prisma/seed/blogPack001.ts` covering career transition, foundations, SOC, pentest, cloud, and AI security topics.

### Vault (`/vault`) — Owner only

Protected admin area for:

- Content management (`/vault/admin`)
- Mission editor
- AI memory
- World analytics
- **Security / MFA** (`/vault/security`)

Access requires Google OAuth with `OWNER_EMAIL` and TOTP when MFA is enabled.

### World Provider (client)

`WorldProvider` persists local progress (credits, notes, desktop presets, career week) in `localStorage`. **XP, rank, and mission completion remain server-authoritative** via `MissionProgress`.

## Security architecture

| Layer | Behaviour |
|-------|-----------|
| Public missions API | `PublicMission` DTO — no answers, hints, or explanations |
| Completion API | Server validates answer; assigns XP from database |
| Vault middleware | OWNER role + MFA verification |
| MFA | TOTP (encrypted secret at rest) |

## Key directories

```
app/              Next.js routes and API
components/       UI, workstation windows, world HUD
context/          React providers (Analyst, Missions, World)
lib/              Mission config, security, world state
prisma/           Schema, migrations, seeds
data/profile.ts   Portfolio seed source
```

## Tech stack

- **Next.js 16** (App Router)
- **React 19**
- **Prisma 7** + PostgreSQL
- **NextAuth** (Google OAuth)
- **Tailwind CSS 4**
- **otplib** (TOTP MFA)

## What this is not

- Not a commercial LMS replacement
- Not a live penetration testing platform against real targets
- Not a duplicate XP or mission engine — one `MissionEngine`, one workstation

## Release status

**RC1** targets production deployment: build gate, MFA, content seed, SEO metadata, and deployment documentation. Post-RC1: deployment fixes only, no V3.7 feature work.

See [DEPLOYMENT.md](./DEPLOYMENT.md) for install and production steps.
