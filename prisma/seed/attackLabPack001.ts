import { prisma } from "../../lib/prisma";
import { attackLabContent, attackLabHints } from "./lib/attackLabConfigs";
import { runSeedIfMain } from "./lib/runIfMain";

type MissionSeed = {
  title: string;
  slug: string;
  type: string;
  category: string;
  difficulty: string;
  description: string;
  scenario: string;
  content: string;
  answer: string;
  explanation: string;
  xp: number;
};

function withLabConfig({
  brief,
  content,
  ...mission
}: Omit<MissionSeed, "content"> & { brief: string; content?: string }) {
  const hints = attackLabHints(mission.slug);
  return {
    ...mission,
    content: content ?? attackLabContent(mission.slug, brief),
    ...(hints ? { hints } : {})
  };
}

export async function seedAttackLabPack001() {
  await prisma.mission.deleteMany({
    where: { slug: { startsWith: "atk001-" } }
  });

  const missions: (MissionSeed & { hints?: string[] })[] = [
    withLabConfig({
      title: "Nmap Quick Scan",
      slug: "atk001-recon-nmap",
      type: "RECON",
      category: "Nmap Simulator",
      difficulty: "Beginner",
      description: "Identify open ports on a staging server using nmap output.",
      scenario: "Client scope: 10.10.1.50 — perform initial port discovery.",
      brief: "Client scope: 10.10.1.50 — perform initial port discovery.",
      answer: "3306",
      explanation:
        "MySQL on 3306 is an unexpected database port exposed externally — high priority finding for the report.",
      xp: 100
    }),
    withLabConfig({
      title: "Service Enumeration",
      slug: "atk001-recon-services",
      type: "RECON",
      category: "Service Enumeration",
      difficulty: "Beginner",
      description: "Determine which SMB service version is running on the target.",
      scenario: "Internal pentest on 192.168.4.12 — enumerate SMB.",
      brief: "Internal pentest on 192.168.4.12 — enumerate SMB.",
      answer: "smb",
      explanation:
        "Port 445 exposes Microsoft SMB — a common lateral movement and credential relay vector.",
      xp: 100
    }),
    withLabConfig({
      title: "Banner Grabbing FTP",
      slug: "atk001-recon-banner",
      type: "RECON",
      category: "Banner Grabbing",
      difficulty: "Intermediate",
      description: "Grab the service banner and identify the vulnerable FTP daemon.",
      scenario: "Anonymous FTP allowed on legacy DMZ host.",
      brief: "Anonymous FTP allowed on legacy DMZ host.",
      answer: "proftpd",
      explanation:
        "ProFTPD 1.3.5b has known CVEs — banner grabbing confirms version for exploit research.",
      xp: 250
    }),
    withLabConfig({
      title: "Stealth SYN Scan",
      slug: "atk001-recon-stealth",
      type: "RECON",
      category: "Nmap Simulator",
      difficulty: "Advanced",
      description: "Interpret a half-open scan result against a hardened perimeter.",
      scenario: "IDS evasion required — analyze SYN scan output only.",
      brief: "IDS evasion required — analyze SYN scan output only.",
      answer: "8443",
      explanation:
        "Non-standard 8443/https-alt is often an admin panel — filtered 22 suggests firewall ACL in place.",
      xp: 500
    }),
    withLabConfig({
      title: "DNS Reconnaissance",
      slug: "atk001-recon-dns",
      type: "RECON",
      category: "Service Enumeration",
      difficulty: "Intermediate",
      description: "Enumerate subdomains via DNS zone transfer attempt.",
      scenario: "Target domain: nexuscorp.lab",
      brief: "Target domain: nexuscorp.lab",
      answer: "axfr",
      explanation:
        "Successful AXFR zone transfer leaks internal hostnames — critical misconfiguration (MITRE T1590).",
      xp: 250
    }),
    withLabConfig({
      title: "Corporate OSINT Sweep",
      slug: "atk001-osint-corporate",
      type: "OSINT",
      category: "OSINT Investigation",
      difficulty: "Beginner",
      description: "Identify exposed employee emails from public breach data.",
      scenario: "Pre-engagement OSINT on target org before phishing test.",
      brief: "Pre-engagement OSINT on target org before phishing test.",
      answer: "first.last",
      explanation:
        "Email format enumeration enables targeted spear-phishing and credential stuffing campaigns.",
      xp: 100
    }),
    withLabConfig({
      title: "TheHarvester Email Pass",
      slug: "atk001-osint-harvester",
      type: "OSINT",
      category: "TheHarvester Simulation",
      difficulty: "Beginner",
      description: "Extract hosts and emails from search engine dorks.",
      scenario: "Run theHarvester against nexuscorp.com.",
      brief: "Run theHarvester against nexuscorp.com.",
      answer: "theharvester",
      explanation:
        "theHarvester aggregates public OSINT — vpn subdomain reveals external entry point.",
      xp: 100
    }),
    withLabConfig({
      title: "LinkedIn Role Mapping",
      slug: "atk001-osint-social",
      type: "OSINT",
      category: "OSINT Investigation",
      difficulty: "Intermediate",
      description: "Map target employees to departments for social engineering scope.",
      scenario: "OSINT on hiring posts and LinkedIn profiles.",
      brief: "OSINT on hiring posts and LinkedIn profiles.",
      answer: "devops",
      explanation:
        "DevOps team profiles often reveal tech stack and internal tooling — prime OSINT target.",
      xp: 250
    }),
    withLabConfig({
      title: "WHOIS & DNS Intel",
      slug: "atk001-osint-whois",
      type: "OSINT",
      category: "OSINT Investigation",
      difficulty: "Intermediate",
      description: "Analyze WHOIS for recently registered lookalike domains.",
      scenario: "Brand protection assessment for nexuscorp.com.",
      brief: "Brand protection assessment for nexuscorp.com.",
      answer: "typosquatting",
      explanation:
        "Recently registered typosquat domain with no MX but active A record suggests phishing infrastructure.",
      xp: 250
    }),
    withLabConfig({
      title: "Email Harvesting OSINT",
      slug: "atk001-osint-email",
      type: "OSINT",
      category: "TheHarvester Simulation",
      difficulty: "Advanced",
      description: "Combine breach data and certificate transparency for email discovery.",
      scenario: "Full OSINT pass before red team engagement.",
      brief: "Full OSINT pass before red team engagement.",
      answer: "crt.sh",
      explanation:
        "Certificate transparency logs expose subdomains and mail hosts not found via DNS brute force alone.",
      xp: 500
    }),
    withLabConfig({
      title: "SQL Injection Login Bypass",
      slug: "atk001-web-sqli",
      type: "WEB_ATTACK",
      category: "SQL Injection",
      difficulty: "Beginner",
      description: "Bypass authentication using classic SQL injection.",
      scenario: "Login form at /admin/login.php accepts POST parameters.",
      brief: "Login form at /admin/login.php accepts POST parameters.",
      answer: "sql injection",
      explanation:
        "OR 1=1 tautology bypasses WHERE clause — textbook SQLi authentication bypass (OWASP A03).",
      xp: 100
    }),
    withLabConfig({
      title: "Reflected XSS Hunt",
      slug: "atk001-web-xss",
      type: "WEB_ATTACK",
      category: "XSS",
      difficulty: "Beginner",
      description: "Identify reflected XSS in search parameter.",
      scenario: "Public search endpoint reflects query unsanitized.",
      brief: "Public search endpoint reflects query unsanitized.",
      answer: "xss",
      explanation:
        "Unencoded reflection of user input in HTML enables reflected XSS (OWASP A03).",
      xp: 100
    }),
    withLabConfig({
      title: "Authentication Bypass via Cookie",
      slug: "atk001-web-auth-bypass",
      type: "WEB_ATTACK",
      category: "Authentication Bypass",
      difficulty: "Intermediate",
      description: "Escalate privileges by tampering with session cookie.",
      scenario: "Cookie role=user — app trusts client-side role value.",
      brief: "Cookie role=user — app trusts client-side role value.",
      answer: "authentication bypass",
      explanation:
        "Client-controlled role cookies without server validation is broken authentication (OWASP A07).",
      xp: 250
    }),
    withLabConfig({
      title: "IDOR Invoice Access",
      slug: "atk001-web-idor",
      type: "WEB_ATTACK",
      category: "IDOR",
      difficulty: "Intermediate",
      description: "Access another user's invoice by changing the ID parameter.",
      scenario: "Authenticated user ID 1042 can fetch /api/invoices/1042.",
      brief: "Authenticated user ID 1042 can fetch /api/invoices/1042.",
      answer: "idor",
      explanation:
        "Insecure Direct Object Reference — accessing objects by ID without ownership check (OWASP A01).",
      xp: 250
    }),
    withLabConfig({
      title: "Broken Access Control",
      slug: "atk001-web-bac",
      type: "WEB_ATTACK",
      category: "Broken Access Control",
      difficulty: "Intermediate",
      description: "Reach admin endpoints as a standard user.",
      scenario: "Role stored in JWT claim but not enforced on /admin/* routes.",
      brief: "Role stored in JWT claim but not enforced on /admin/* routes.",
      answer: "broken access control",
      explanation:
        "Missing function-level access control lets standard users hit admin API routes (OWASP A01).",
      xp: 250
    }),
    withLabConfig({
      title: "Unrestricted File Upload",
      slug: "atk001-web-upload",
      type: "WEB_ATTACK",
      category: "File Upload Vulnerability",
      difficulty: "Advanced",
      description: "Upload a web shell via unrestricted file upload.",
      scenario: "Profile photo upload accepts any extension.",
      brief: "Profile photo upload accepts any extension.",
      answer: "file upload",
      explanation:
        "Missing extension/MIME validation allows webshell upload — RCE path (OWASP A04).",
      xp: 500
    }),
    withLabConfig({
      title: "Directory Brute Force",
      slug: "atk001-web-dir-enum",
      type: "WEB_ATTACK",
      category: "Directory Enumeration",
      difficulty: "Beginner",
      description: "Find hidden admin directory from enumeration output.",
      scenario: "gobuster scan against https://target.lab",
      brief: "gobuster scan against https://target.lab",
      answer: "backup",
      explanation:
        "Exposed /backup directory with 200 response likely contains sensitive archives.",
      xp: 100
    }),
    withLabConfig({
      title: "Insecure Cookie Flags",
      slug: "atk001-web-cookie",
      type: "WEB_ATTACK",
      category: "Cookie Security",
      difficulty: "Intermediate",
      description: "Identify missing security flags on session cookie.",
      scenario: "Review Set-Cookie headers on login response.",
      brief: "Review Set-Cookie headers on login response.",
      answer: "secure flag",
      explanation:
        "Missing Secure and HttpOnly flags expose session cookies to theft via XSS and MITM.",
      xp: 250
    }),
    withLabConfig({
      title: "JWT Algorithm Confusion",
      slug: "atk001-web-jwt",
      type: "WEB_ATTACK",
      category: "JWT Analysis",
      difficulty: "Advanced",
      description: "Exploit JWT alg:none acceptance to forge admin token.",
      scenario: "API accepts unsigned JWT when alg header set to none.",
      brief: "API accepts unsigned JWT when alg header set to none.",
      answer: "jwt",
      explanation:
        "Accepting alg:none or weak JWT validation enables token forgery — broken authentication.",
      xp: 500
    }),
    withLabConfig({
      title: "CSRF Account Takeover",
      slug: "atk001-web-csrf",
      type: "WEB_ATTACK",
      category: "Broken Access Control",
      difficulty: "Advanced",
      description: "Craft CSRF payload to change victim email address.",
      scenario: "POST /account/email has no CSRF token.",
      brief: "POST /account/email has no CSRF token.",
      answer: "csrf",
      explanation:
        "Missing CSRF protection on state-changing endpoints enables cross-site request forgery (OWASP A01).",
      xp: 500
    }),
    withLabConfig({
      title: "CVE-2021-44228 Log4Shell",
      slug: "atk001-exploit-cve",
      type: "EXPLOITATION",
      category: "CVE Investigation",
      difficulty: "Intermediate",
      description: "Match observed behavior to the correct CVE.",
      scenario: "Outbound LDAP callback from Java app after crafted User-Agent.",
      brief: "Outbound LDAP callback from Java app after crafted User-Agent.",
      answer: "log4shell",
      explanation:
        "JNDI lookup in Log4j 2.x is Log4Shell (CVE-2021-44228) — critical RCE vector.",
      xp: 250
    }),
    withLabConfig({
      title: "Metasploit EternalBlue",
      slug: "atk001-exploit-metasploit",
      type: "EXPLOITATION",
      category: "Metasploit Simulator",
      difficulty: "Intermediate",
      description: "Select the correct Metasploit module for SMB vulnerability.",
      scenario: "Windows 7 SP1 target, SMB signing disabled, MS17-010 detected.",
      brief: "Windows 7 SP1 target, SMB signing disabled, MS17-010 detected.",
      answer: "eternalblue",
      explanation:
        "MS17-010 EternalBlue is the matching exploit for unpatched SMBv1 Windows hosts.",
      xp: 250
    }),
    withLabConfig({
      title: "Exploit Matching Exercise",
      slug: "atk001-exploit-match",
      type: "EXPLOITATION",
      category: "Exploit Matching",
      difficulty: "Beginner",
      description: "Match service version to known exploit.",
      scenario: "OpenSSH 7.2p2 on Ubuntu 16.04 — consult exploit-db.",
      brief: "OpenSSH 7.2p2 on Ubuntu 16.04 — consult exploit-db.",
      answer: "cve-2018-15473",
      explanation:
        "CVE-2018-15473 affects OpenSSH before 7.7 — allows username enumeration via malformed AUTH.",
      xp: 100
    }),
    withLabConfig({
      title: "Payload Selection",
      slug: "atk001-exploit-payload",
      type: "EXPLOITATION",
      category: "Payload Selection",
      difficulty: "Advanced",
      description: "Choose payload for Windows x64 HTTPS egress-only host.",
      scenario: "Target blocks all inbound except 443/tcp outbound allowed.",
      brief: "Target blocks all inbound except 443/tcp outbound allowed.",
      answer: "reverse_https",
      explanation:
        "Reverse HTTPS meterpreter egresses over allowed 443 outbound — bind shells fail on filtered inbound.",
      xp: 500
    }),
    withLabConfig({
      title: "Vulnerability Chain Analysis",
      slug: "atk001-exploit-vuln-analysis",
      type: "EXPLOITATION",
      category: "Vulnerability Analysis",
      difficulty: "Advanced",
      description: "Identify the critical finding in a pentest summary.",
      scenario: "Multiple findings ranked by severity for exec report.",
      brief: "Multiple findings ranked by severity for exec report.",
      answer: "rce",
      explanation:
        "Unauthenticated remote code execution is P1 critical — immediate remediation required.",
      xp: 500
    }),
    withLabConfig({
      title: "Hash Type Identifier",
      slug: "atk001-pass-hash-id",
      type: "PASSWORD_ATTACK",
      category: "Hash Identifier",
      difficulty: "Beginner",
      description: "Identify the hash algorithm from the digest format.",
      scenario: "Dump from compromised Linux /etc/shadow entry.",
      brief: "Dump from compromised Linux /etc/shadow entry.",
      answer: "sha512",
      explanation:
        "$6$ prefix in /etc/shadow denotes sha512crypt — use hashcat mode 1800 or john sha512crypt.",
      xp: 100
    }),
    withLabConfig({
      title: "John the Ripper Crack",
      slug: "atk001-pass-john",
      type: "PASSWORD_ATTACK",
      category: "John The Ripper Challenge",
      difficulty: "Intermediate",
      description: "Crack MD5 hash using wordlist attack.",
      scenario: "Single MD5 hash recovered from database dump.",
      brief: "Single MD5 hash recovered from database dump.",
      answer: "password",
      explanation:
        "5f4dcc3b5aa765d61d8327deb882cf99 is the MD5 hash of 'password' — top rockyou entry.",
      xp: 250
    }),
    withLabConfig({
      title: "Hashcat GPU Attack",
      slug: "atk001-pass-hashcat",
      type: "PASSWORD_ATTACK",
      category: "Hashcat Challenge",
      difficulty: "Intermediate",
      description: "Select correct hashcat mode for NTLM hashes.",
      scenario: "NTLM hashes extracted via secretsdump from DC.",
      brief: "NTLM hashes extracted via secretsdump from DC.",
      answer: "1000",
      explanation:
        "Hashcat mode 1000 is NTLM — standard for Windows password hash cracking.",
      xp: 250
    }),
    withLabConfig({
      title: "Hydra SSH Brute Force",
      slug: "atk001-pass-hydra",
      type: "PASSWORD_ATTACK",
      category: "Hydra Login Investigation",
      difficulty: "Beginner",
      description: "Identify successful Hydra credential from output.",
      scenario: "SSH brute force against lab target with weak password policy.",
      brief: "SSH brute force against lab target with weak password policy.",
      answer: "admin123",
      explanation:
        "Hydra found valid SSH credentials admin:admin123 — weak password policy failure.",
      xp: 100
    }),
    withLabConfig({
      title: "Password Spraying Campaign",
      slug: "atk001-pass-spray",
      type: "PASSWORD_ATTACK",
      category: "Hydra Login Investigation",
      difficulty: "Advanced",
      description: "Analyze password spray results against Azure AD.",
      scenario: "Single common password tested against 500 accounts — one lockout threshold.",
      brief: "Single common password tested against 500 accounts — one lockout threshold.",
      answer: "password spraying",
      explanation:
        "Password spraying uses one password against many accounts to evade lockout — success on jsmith is breach point.",
      xp: 500
    })
  ];

  await prisma.mission.createMany({
    skipDuplicates: true,
    data: missions
  });

  console.log("Nexus Attack Lab Pack 001 seeded (30 missions with LAB_CONFIG)");
}

async function main() {
  await seedAttackLabPack001();
}

runSeedIfMain("attackLabPack001", main);