# NEXUS V3.6 — Persistent Cyber World

## 1. Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  Root layout: Auth → NexusData → Missions → Analyst → WORLD → Nexus │
└─────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    ▼                               ▼
            WorldContext (global)            MissionEngine (unchanged)
         · Save slots A/B/C                  · PracticalEngine → NexusRoom
         · Credits (CR)                      · useMissionComplete (XP only)
         · Reputation (derived from XP)       └→ NexusWorkstation
         · Chain artifacts                         · WorkstationProvider
         · Career week state                       · Environment persist (400ms)
         · Analytics events                        · NexusMentor (story-aware)
         · Desktop preset                          · TopBar + preset switcher
                    │
         localStorage: nexus_v36_world_v1
                    │
    ┌───────────────┼───────────────┐
    ▼               ▼               ▼
organizations   incidentChain   certificationTracks
(catalog)       (IOC carryover)  (5 tracks + /certs)
```

**Design principles (constraints honored):**

| Constraint | Approach |
|------------|----------|
| No workstation rebuild | Extended `WorkstationProvider`, `TopBar`, `NexusWorkstation` only |
| No duplicate XP | XP stays on `MissionProgress`; CR is separate economy |
| No new mission engine | `WORLD_CONFIG:` marker in existing `mission.content` |
| No new auth | Reputation from `AnalystContext` XP |
| No Prisma model changes | All world state in `localStorage` per save slot |

**Data flow — incident chaining:**

```
Mission 1 complete → chain artifact saved (IOC)
        ↓
Mission 2 layout → applyChainToLayout() injects SIEM alert + file
        ↓
Mission 3 → prerequisiteSlug gate on NexusRoom intro
```

---

## 2. Files

### New — `lib/world/`

| File | Purpose |
|------|---------|
| `types.ts` | Shared world types |
| `organizations.ts` | 5 clients, reputation from XP, contract gates |
| `worldConfig.ts` | Parse/emit `WORLD_CONFIG:` in mission content |
| `incidentChain.ts` | Chain unlock, artifact injection into layout |
| `credits.ts` | CR costs/rewards (not XP) |
| `saveSlots.ts` | Profile A/B/C persistence |
| `desktopPresets.ts` | SOC / Kali / Forensics / Executive layouts |
| `certificationTracks.ts` | 5 certification paths |
| `careerWeek.ts` | Mon–Fri events, performance, manager review |
| `analytics.ts` | Event aggregation |

### New — `context/`

| File | Purpose |
|------|---------|
| `WorldContext.tsx` | Global world state provider |
| `EnvironmentState.tsx` | Room snapshot merge helpers |

### New — `components/world/`

| File | Purpose |
|------|---------|
| `WorldHud.tsx` | Credits, reputation, slot switcher |
| `DesktopPresetSwitcher.tsx` | Desktop mode toggle |
| `CareerWeekPanel.tsx` | Real work week UI |
| `CertificationTracksPanel.tsx` | Track progress on skills-map |

### New — pages

| File | Purpose |
|------|---------|
| `app/certs/[trackId]/page.tsx` | Printable certificate |
| `app/vault/analytics/page.tsx` | Owner analytics dashboard |

### Modified (integration only)

| File | Change |
|------|--------|
| `app/layout.tsx` | `WorldProvider` after `AnalystProvider` |
| `components/workspace/WorkstationContext.tsx` | Restore/save room state, analytics hooks |
| `components/workspace/NexusWorkstation.tsx` | Chain + preset layout |
| `components/workspace/TopBar.tsx` | Org label + desktop switcher |
| `components/room/NexusRoom.tsx` | Org, chain gate, WorldHud |
| `components/mentor/NexusMentor.tsx` | Story context + CR-gated hints |
| `hooks/useMissionComplete.ts` | `recordRoomComplete` + chain output |
| `app/career/page.tsx` | Career week + WorldHud |
| `app/skills-map/page.tsx` | Certification tracks panel |

---

## 3. Migrations

**No Prisma migrations.** World state is client-side.

### Content migration (mission seeds)

Add `WORLD_CONFIG:` to mission `content` field:

```json
WORLD_CONFIG:{"world":{"organizationId":"blueforge-bank","chainId":"apt-blueforge","chainStep":2,"prerequisiteSlug":"recon-blueforge-01","chainOutputKey":"c2_domain","injectInto":["siem","files"]}}
```

### Example chain (3 missions)

| Step | Slug | Output | Injection |
|------|------|--------|-----------|
| 1 | `recon-blueforge-01` | `c2_domain` | — |
| 2 | `triage-blueforge-02` | `host_id` | SIEM + files |
| 3 | `contain-blueforge-03` | — | tickets + prerequisite step 2 |

### localStorage schema

- Key: `nexus_v36_world_v1`
- Version: `1`
- Per slot: credits, rooms, chainArtifacts, careerWeek, analytics, contracts

### Bump migration

If schema changes, increment version in `saveSlots.ts` and add loader migration function.

---

## 4. Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| localStorage loss (clear browser) | Medium | Document slot export; future optional API sync |
| localStorage quota | Low | Trim analytics to 500 events; room snapshots per slug |
| Chain artifacts not synced across devices | Medium | Expected for v3.6; server sync is v3.7+ |
| Reputation derived from XP can be gamed | High | Same as existing mission-complete bypass (security audit) |
| Career week state per slot only | Low | By design for save slots |
| Desktop preset + module defaults conflict | Low | Preset merges with module windows |
| Mentor CR spend without server validation | Low | Client-side economy only |
| `useEffect` save debounce on every keystroke | Low | 400ms debounce |

---

## 5. Testing checklist

### Save slots
- [ ] Switch Profile A → B → A; credits and room notes differ
- [ ] Complete mission on A; B does not inherit chain artifacts

### Environment persistence
- [ ] Enter room, add notes/evidence, refresh page — state restored
- [ ] Complete task, leave room, return — `completedTaskIds` restored

### Organizations & reputation
- [ ] Room intro shows correct client org
- [ ] Low REP shows `critical` incident load label

### Incident chaining
- [ ] Mission with `prerequisiteSlug` locked until prior complete
- [ ] Mission 2 SIEM shows artifact from Mission 1

### Credits economy
- [ ] Mission complete awards CR (not extra XP)
- [ ] Mentor hint deducts 15 CR; fails gracefully when broke

### Career week
- [ ] `/career` loads Mon–Fri events
- [ ] Resolve events → performance score updates
- [ ] Friday → manager review + 12 CR

### Certification tracks
- [ ] `/skills-map` shows 5 tracks with progress bars
- [ ] Complete track → `/certs/soc` printable

### Desktop presets
- [ ] Switch SOC / Kali / Forensics / Executive — windows change
- [ ] Preset survives room re-entry (via snapshot)

### Analytics
- [ ] `/vault/analytics` shows completion %, drop-off, tools
- [ ] Tool use in terminal increments `topTools`

### Performance
- [ ] Room interaction feels responsive (<200ms UI)
- [ ] No duplicate provider nesting errors in console

---

## 6. Rollback plan

1. **Instant UI rollback:** Remove `WorldProvider` from `app/layout.tsx` — site reverts to V3.5 behavior.
2. **Feature flags (optional):** Wrap world imports in `process.env.NEXT_PUBLIC_NEXUS_WORLD !== '0'`.
3. **Data rollback:** Users clear `localStorage` key `nexus_v36_world_v1` — XP/missions unaffected (server-side).
4. **Git rollback:** Revert single commit touching `lib/world/`, `context/WorldContext.tsx`, and integration files.
5. **Content rollback:** Remove `WORLD_CONFIG:` markers from seeds; missions work as before.

**Safe order:** layout provider → integration files → delete `lib/world/` last.

---

## Mission content authoring

```ts
import { buildWorldContent } from "@/lib/world/worldConfig";

const content = buildWorldContent(briefText, {
  organizationId: "healthcore",
  chainId: "ransomware-healthcore",
  chainStep: 1,
  chainOutputKey: "patient_db_hash",
  injectInto: ["siem", "files"]
});
```

Pair with existing `buildRoomContent()` by concatenating markers in `mission.content`.
