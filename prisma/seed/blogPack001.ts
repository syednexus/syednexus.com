import type { PrismaClient } from "../../lib/generated/prisma/client";

export type BlogSeedEntry = {
  title: string;
  slug: string;
  summary: string;
  category: string;
  tags: string[];
  readMinutes: number;
  content: string;
  published: boolean;
};

function formatTags(entry: BlogSeedEntry): string {
  return `slug:${entry.slug}|${entry.tags.join(",")}|${entry.readMinutes} min`;
}

export const BLOG_PACK_001: BlogSeedEntry[] = [
  {
    title: "My Journey from Pharmacy to Cybersecurity",
    slug: "pharmacy-to-cybersecurity",
    summary:
      "Why I moved from pharmaceutical sciences into cybersecurity, what skills transferred, and how I structured my learning path as a student.",
    category: "Career Journey",
    tags: ["career", "transition", "learning"],
    readMinutes: 8,
    published: true,
    content: `## Starting somewhere unexpected

I did not begin in a SOC or a red team lab. My first degree was **Bachelor of Pharmacy**, where I spent years studying pharmacology, patient safety, and evidence-based decision making. That background still shapes how I think about risk, documentation, and consequences.

Cybersecurity attracted me because it combines technical depth with real-world impact. Every control, alert, and investigation connects to people and systems that matter.

## Skills that actually transferred

Several habits from pharmacy carried over more than I expected:

- **Attention to detail** — small errors in dosage or documentation can have serious outcomes. Security work rewards the same discipline when reviewing logs or configs.
- **Structured analysis** — literature reviews taught me to gather evidence, compare sources, and reach a defensible conclusion. Incident triage uses a similar mindset.
- **Compliance awareness** — healthcare environments emphasise policy, audit trails, and accountability. That maps well to security governance and logging.

What did *not* transfer automatically was networking, Linux fluency, and hands-on tooling. Those required deliberate practice.

## My learning roadmap

I built a practical stack instead of trying to learn everything at once:

1. **Foundations** — networking basics, Linux command line, CIA triad
2. **Hands-on platforms** — TryHackMe rooms for guided practice
3. **SOC skills** — log reading, SIEM concepts, alert triage
4. **Formal study** — Master of Cybersecurity to deepen theory and structure

I still treat myself as a **junior analyst in development**. Progress is measured in completed labs, documented notes, and the ability to explain findings clearly—not job titles.

## Advice for career changers

If you are switching fields, document your journey. Write down what you tried, what failed, and what clicked. Employers and mentors respond to honest growth more than buzzwords.

Cybersecurity is broad. Pick a lane (SOC, GRC, pentest, cloud) for depth, but keep enough breadth to understand how teams connect.

The path is long. Consistency beats intensity.`
  },
  {
    title: "Understanding the CIA Triad",
    slug: "cia-triad-explained",
    summary:
      "A practical introduction to Confidentiality, Integrity, and Availability—the three pillars behind most security controls.",
    category: "Foundation",
    tags: ["fundamentals", "cia", "risk"],
    readMinutes: 6,
    published: true,
    content: `## Why the CIA triad matters

Before tools and certifications, security teams align decisions to three goals: **Confidentiality**, **Integrity**, and **Availability**. Almost every control maps to at least one.

## Confidentiality

Confidentiality means only authorised parties can access information.

Examples:
- Encryption at rest and in transit
- Access control lists and least privilege
- MFA for sensitive systems

When you investigate a data leak, you are usually dealing with a confidentiality failure.

## Integrity

Integrity ensures data is accurate and has not been tampered with.

Examples:
- File hash verification in forensics
- Digital signatures
- Change management and version control

If an attacker modifies logs or swaps a binary, integrity is the concern.

## Availability

Availability means systems and data are accessible when needed.

Examples:
- Backups and disaster recovery
- DDoS mitigation
- Patch windows planned to avoid unnecessary downtime

Ransomware often hits both integrity and availability.

## Using the triad in practice

When you review a control or write an incident summary, ask:

1. Which leg of the triad is at risk?
2. What detective and preventive controls exist?
3. What is the business impact if this fails?

This framework keeps analysis grounded when alerts get noisy.`
  },
  {
    title: "Linux Fundamentals for Cybersecurity Beginners",
    slug: "linux-fundamentals-cybersecurity",
    summary:
      "Essential Linux commands and concepts every new security student should practice on a lab VM.",
    category: "Foundation",
    tags: ["linux", "cli", "labs"],
    readMinutes: 7,
    published: true,
    content: `## Why Linux shows up everywhere

SOC analysts, pentesters, and cloud engineers all touch Linux. Many servers, security tools, and lab environments run on it. Comfort on the command line saves time during investigations.

## Commands worth drilling

Start with these on a safe practice VM (never on production systems you do not own):

| Command | Purpose |
|---------|---------|
| \`pwd\` | Show current directory |
| \`ls -la\` | List files with permissions |
| \`cd\` | Change directory |
| \`cat\` | View file contents |
| \`grep\` | Search text patterns |
| \`find\` | Locate files by name or path |
| \`ps\` | List running processes |
| \`netstat\` / \`ss\` | View network connections |
| \`whoami\` | Current user context |

## Permissions matter

Linux file modes (\`rwx\`) explain why a web shell in \`/tmp\` might be executable or why a misconfigured cron job is dangerous. When you see a suspicious file during a lab, check owner, permissions, and timestamp.

## Logs to know

- \`/var/log/auth.log\` — authentication events (distribution-dependent)
- \`/var/log/syslog\` — general system messages
- Application-specific logs under \`/var/log/\`

Reading raw logs is slow at first. Combine \`grep\` with time ranges to narrow events.

## Build muscle memory

Use Linux daily for small tasks: navigate directories, inspect processes, search logs. Labs become easier when the CLI feels familiar instead of foreign.`
  },
  {
    title: "Networking Concepts Every Security Analyst Needs",
    slug: "networking-for-security-analysts",
    summary:
      "TCP/IP, DNS, HTTP, and ports explained from a defender's perspective—not just theory for a certification exam.",
    category: "Foundation",
    tags: ["networking", "tcpip", "dns"],
    readMinutes: 7,
    published: true,
    content: `## Networks are the attack surface

Most incidents involve network movement: phishing links, C2 traffic, lateral SMB, DNS tunnels. Analysts do not need to be CCIEs, but they must read packets and logs with confidence.

## TCP/IP basics

- **IP addresses** identify hosts on a network
- **Ports** identify services (22 SSH, 80 HTTP, 443 HTTPS)
- **TCP** is connection-oriented; **UDP** is often used for DNS and streaming

When Wireshark shows a conversation, you are watching endpoints talk over a port with a protocol on top.

## DNS

DNS translates names to IPs. Suspicious domains, fast-flux patterns, and long subdomains appear constantly in SOC alerts. Ask: *Is this domain expected for this user or application?*

## HTTP/HTTPS

Web attacks—SQL injection, XSS, credential phishing—ride on HTTP. Understand methods (GET, POST), headers, cookies, and status codes. TLS encrypts content, but metadata (SNI, timing, volume) still helps detection.

## Practical study tips

1. Draw a simple home lab: client → firewall → server
2. Run \`nmap\` only in authorised lab targets
3. Capture traffic in Wireshark during a benign login and label each layer

Networking knowledge turns vague alerts into specific hypotheses.`
  },
  {
    title: "A Day as a SOC Analyst",
    slug: "day-as-soc-analyst",
    summary:
      "What a typical SOC shift can look like for a junior analyst—from inbox triage to closing a ticket.",
    category: "SOC",
    tags: ["soc", "operations", "triage"],
    readMinutes: 8,
    published: true,
    content: `## Morning: shift handover

A SOC day often starts with context. The outgoing analyst summarises open incidents, noisy rules, and anything waiting on another team. You check the ticket queue and SIEM dashboard for overnight alerts.

## Mid-morning: alert triage

Alerts rarely arrive one at a time. You prioritise by severity, asset criticality, and whether similar events fired across multiple hosts.

Typical workflow:
1. Read the alert title and MITRE mapping
2. Pull supporting logs (auth, endpoint, proxy)
3. Decide: false positive, benign true positive, or escalate
4. Document your reasoning in the ticket

Speed matters, but **documentation matters more**. The next analyst continues your work.

## Afternoon: deeper investigation

When an alert looks real, you correlate indicators: IP reputation, user behaviour, parent process chains. You might pivot from SIEM to a sandbox report or ask IT to isolate a host.

Junior analysts are not expected to solve every case alone. Knowing **when to escalate** is a skill.

## Collaboration

SOC work is team-based. You message IT ops in Slack, update stakeholders via email templates, and link evidence in the ticket. Clear communication prevents duplicate work.

## End of shift

Before you log off, update ticket status, note open questions, and flag anything that needs follow-up. A good handover respects the person starting the next shift.

Simulated labs on Nexus mirror this rhythm: inbox, SIEM, tickets, report. Treat them like rehearsal, not a quiz.`
  },
  {
    title: "How SIEM Detects Cyber Threats",
    slug: "how-siem-detects-threats",
    summary:
      "How correlation rules, log sources, and context turn raw events into actionable SOC alerts.",
    category: "SOC",
    tags: ["siem", "detection", "logs"],
    readMinutes: 7,
    published: true,
    content: `## What a SIEM actually does

A **Security Information and Event Management** platform collects logs from many sources—firewalls, identity providers, endpoints, cloud services—and lets analysts search, correlate, and alert on patterns.

Without aggregation, defenders would drown in disconnected files on hundreds of systems.

## Log sources

Common inputs include:
- Authentication logs (failed logins, MFA events)
- Endpoint detection (process creation, registry changes)
- Network devices (denied connections, DNS queries)
- Application logs (web server errors, API abuse)

Detection quality depends on **coverage**. A blind spot in logging is a blind spot in defense.

## Correlation rules

Rules encode logic: *If X happens N times in M minutes from the same IP, create an alert.* Examples:
- Multiple failed logins → possible brute force
- Impossible travel → credential compromise
- PowerShell from Office macro parent → possible malware

Rules produce false positives. Tuning is ongoing.

## Context enrichment

Modern SIEMs add context: user department, asset tier, threat intel feeds, MITRE technique IDs. Context helps you decide if a rare event is normal for that user or alarming.

## Analyst workflow

Detection is not the finish line. Analysts validate alerts, gather evidence, and assign verdicts. The SIEM starts the conversation; humans close it.

Practice in lab environments by reading alert details, timelines, and IOC panels—not just clicking through.`
  },
  {
    title: "Reconnaissance Methodology Explained",
    slug: "recon-methodology",
    summary:
      "Passive and active recon in authorised engagements—what junior pentesters learn before touching exploit tooling.",
    category: "Pentest",
    tags: ["recon", "osint", "methodology"],
    readMinutes: 7,
    published: true,
    content: `## Recon comes first

In authorised penetration tests and CTF challenges, **reconnaissance** maps the target: hosts, services, users, and technologies. Skipping recon leads to noisy scans and missed paths.

Always confirm scope and written permission before any active testing.

## Passive recon

Passive techniques avoid direct interaction with the target where possible:
- Public DNS and certificate transparency records
- Job postings revealing tech stacks
- Social profiles (within legal and ethical bounds)

Passive data shapes hypotheses without triggering IDS alerts.

## Active recon

Active recon directly probes systems:
- **Port scanning** (\`nmap\`) to find open services
- **Banner grabbing** to learn versions
- **Directory enumeration** on web apps

In labs, scan only designated targets. In the real world, unauthorised scanning can be illegal.

## Document everything

Good recon notes include:
- Timestamp and tool used
- Command or query
- Raw output summary
- Your interpretation

Reports live on evidence. Screenshots and command output support your findings.

## Link to later phases

Service versions suggest vulnerability research. Subdomains may expose admin panels. Usernames feed password-spray awareness exercises in controlled environments.

Recon is not glamorous, but senior testers spend significant time here because it multiplies everything downstream.`
  },
  {
    title: "Understanding OWASP Top 10",
    slug: "owasp-top-10-intro",
    summary:
      "A student-friendly overview of the OWASP Top 10 web risks and why they appear in labs and bug bounty write-ups.",
    category: "Pentest",
    tags: ["owasp", "web", "appsec"],
    readMinutes: 8,
    published: true,
    content: `## Why OWASP matters

The **OWASP Top 10** lists the most common critical web application risks. It is not a checklist for every app, but a vocabulary teams share when discussing web security.

## Categories you will meet in labs

**Broken Access Control** — users access data or functions they should not. IDOR labs often demonstrate this.

**Cryptographic Failures** — weak TLS, exposed secrets, poor password storage.

**Injection** — SQL injection, command injection. Input treated as code.

**Insecure Design** — missing threat modeling, weak workflows (e.g. password reset flaws).

**Security Misconfiguration** — default credentials, verbose errors, open cloud buckets.

**Vulnerable Components** — outdated libraries with known CVEs.

**Authentication Failures** — weak MFA, session fixation, credential stuffing.

**Software/Data Integrity Failures** — unsigned updates, CI/CD pipeline risks.

**Logging & Monitoring Failures** — attacks succeed because nobody sees them.

**SSRF** — server tricked into requesting internal resources.

## How to study them

Do not memorise names only. For each category:
1. Read one real CVE or breach summary
2. Complete one lab demonstrating the issue
3. Write one mitigation in plain language

## Defender and attacker overlap

SOC analysts benefit from OWASP knowledge too. Web attack patterns appear in WAF alerts, proxy logs, and bug bounty reports. Shared language speeds handoffs between AppSec and operations.`
  },
  {
    title: "Introduction to Cloud Security",
    slug: "introduction-cloud-security",
    summary:
      "Shared responsibility, identity in the cloud, and basic hardening ideas for students new to AWS/Azure/GCP concepts.",
    category: "Cloud",
    tags: ["cloud", "iam", "shared-responsibility"],
    readMinutes: 6,
    published: true,
    content: `## Cloud changes the boundary

In cloud environments, you rarely touch physical hardware. Security focuses on **identity**, **configuration**, and **data** across APIs and consoles.

## Shared responsibility

Cloud providers secure the underlying platform. Customers secure what they deploy:
- IAM policies and roles
- Storage bucket permissions
- Network security groups
- Application code

Misconfigured storage exposing public data is a recurring headline—not because the cloud is insecure, but because settings are wrong.

## Identity is the perimeter

Keys, service accounts, and federated logins replace traditional network perimeters. MFA, least privilege, and role separation matter more than ever.

## Logging and visibility

Enable audit logs (e.g. CloudTrail-style services) early in lab accounts. Detection depends on knowing who changed what.

## Starting point for students

1. Learn one provider's IAM model in a free tier lab
2. Practice denying public access by default
3. Review a misconfiguration case study (open S3 bucket, overly permissive role)

Cloud security is not a separate career from SOC—it intersects daily as companies migrate workloads.`
  },
  {
    title: "AI and the Future of Cybersecurity",
    slug: "ai-future-cybersecurity",
    summary:
      "How AI assists defenders and attackers—and why critical thinking still matters for junior analysts.",
    category: "AI Security",
    tags: ["ai", "automation", "analysis"],
    readMinutes: 6,
    published: true,
    content: `## Hype vs. daily work

AI is reshaping security tooling: summarising logs, drafting runbooks, clustering phishing samples. It does not replace accountability. Analysts still verify outputs and sign decisions.

## Defender use cases

- **Triage assistance** — ranking alerts, suggesting related events
- **Search acceleration** — natural language queries over log platforms
- **Training** — guided labs and explanations for new staff

Used well, AI reduces toil. Used blindly, it spreads confident wrong answers.

## Attacker use cases

Threat actors experiment with AI for phishing lures, malware variation, and social engineering. Detection evolves in response—style anomalies, metadata, and traditional IOCs still apply.

## Risks to watch

- **Data leakage** — pasting sensitive logs into public chatbots
- **Poisoned models** — supply chain concerns for ML pipelines
- **Over-trust** — skipping validation because "the AI said so"

## Skills that remain human

Curiosity, ethics, communication, and structured incident documentation age better than any single tool fad.

As a student, experiment with AI in **sanitised lab data only**. Build the habit of asking: *What evidence supports this conclusion?*

The future of cybersecurity is augmented analysts—not absent ones.`
  }
];

export async function seedBlogPack001(prisma: PrismaClient) {
  const slugs = BLOG_PACK_001.map(post => post.slug);

  await prisma.blog.deleteMany({
    where: {
      OR: slugs.map(slug => ({ tags: { contains: `slug:${slug}` } }))
    }
  });

  for (const entry of BLOG_PACK_001) {
    if (!entry.published) continue;

    const body = `${entry.summary}\n\n---\n\n${entry.content}`;

    await prisma.blog.create({
      data: {
        title: entry.title,
        category: entry.category,
        content: body,
        tags: formatTags(entry),
        date: new Date()
      }
    });
  }

  console.log(`📝 Seeded ${BLOG_PACK_001.length} production blogs (blogPack001)`);
}
