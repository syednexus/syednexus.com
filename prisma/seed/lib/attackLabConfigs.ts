import type { LabConfig } from "../../../lib/labConfig";
import { buildLabContent } from "../../../lib/labConfig";

type AttackLabSeed = {
  brief: string;
  config: LabConfig;
  hints?: string[];
};

export const ATTACK_LAB_CONFIGS: Record<string, AttackLabSeed> = {
  "atk001-recon-nmap": {
    brief: "Client scope: 10.10.1.50 — run a service scan and identify the exposed database port.",
    config: {
      target: "10.10.1.50",
      objective: "Find the unexpected externally exposed database service.",
      commands: {
        nmap: `Starting Nmap 7.94 scan on 10.10.1.50
PORT     STATE SERVICE    VERSION
22/tcp   open  ssh        OpenSSH 8.9
80/tcp   open  http       nginx 1.24
443/tcp  open  ssl/http   nginx 1.24
3306/tcp open  mysql      MySQL 8.0.33`
      },
      reconTools: ["nmap", "ping", "submit"]
    },
    hints: ["Run nmap against the scoped target.", "Look for a database port that should not be public.", "Submit the port number."]
  },
  "atk001-recon-services": {
    brief: "Internal pentest on 192.168.4.12 — enumerate SMB.",
    config: {
      target: "192.168.4.12",
      commands: {
        "nmap -p445 --script smb-os-discovery 192.168.4.12": `445/tcp open  microsoft-ds (SMB)
| smb-os-discovery:
|   OS: Windows Server 2019 Standard 17763
|   Computer name: FILE-SRV-01`
      }
    },
    hints: ["Scan port 445 on the internal host.", "Identify the file-sharing protocol exposed."]
  },
  "atk001-recon-banner": {
    brief: "Anonymous FTP allowed on legacy DMZ host 203.0.113.44 — grab the banner.",
    config: {
      target: "203.0.113.44",
      commands: {
        "nc 203.0.113.44 21": `220 ProFTPD 1.3.5b Server (Corp FTP) [203.0.113.44]
214- ProFTPD 1.3.5b`
      }
    },
    hints: ["Connect to port 21 with nc.", "Read the daemon name from the banner."]
  },
  "atk001-recon-stealth": {
    brief: "IDS evasion required — analyze SYN scan output for the admin entry point.",
    config: {
      target: "198.51.100.5",
      commands: {
        "nmap -sS -Pn 198.51.100.0/28": `198.51.100.5  22/tcp filtered ssh
198.51.100.5  443/tcp open   https
198.51.100.5  8443/tcp open  https-alt`
      }
    },
    hints: ["Review non-standard HTTPS ports.", "Filtered SSH suggests a firewall in place."]
  },
  "atk001-recon-dns": {
    brief: "Target domain nexuscorp.lab — attempt a zone transfer.",
    config: {
      target: "nexuscorp.lab",
      commands: {
        "dig axfr nexuscorp.lab @ns1.nexuscorp.lab": `nexuscorp.lab.   IN  A    10.0.1.10
dev.nexuscorp.lab. IN A    10.0.2.55
staging.nexuscorp.lab. IN A 10.0.2.88`
      },
      trigger: "axfr"
    },
    hints: ["Use dig with the AXFR query type.", "Name the DNS misconfiguration technique."]
  },
  "atk001-osint-corporate": {
    brief: "Pre-engagement OSINT — identify the corporate email format from breach data.",
    config: {
      commands: {
        curl: `HaveIBeenPwned / breach dump summary:
  domain: nexuscorp.com
  exposed: 47 accounts in Collection #5
  pattern: first.last@nexuscorp.com (92%)`
      }
    },
    hints: ["Review the breach summary output.", "Note the dominant email naming pattern."]
  },
  "atk001-osint-harvester": {
    brief: "Run theHarvester against nexuscorp.com.",
    config: {
      commands: {
        theharvester: `theHarvester -d nexuscorp.com -b google
Hosts found: 14
Emails found:
  jsmith@nexuscorp.com
  devops@nexuscorp.com
  vpn.nexuscorp.com → 203.0.113.10`
      },
      trigger: "theharvester"
    },
    hints: ["Run the theHarvester command.", "Name the OSINT tool used."]
  },
  "atk001-osint-social": {
    brief: "Map employees to departments from public hiring and GitHub data.",
    config: {
      commands: {
        curl: `Profiles scraped (public):
  12x "Senior DevOps Engineer @ NexusCorp"
  3x "IT Helpdesk" with O365 admin keywords
  GitHub: nexuscorp-devops — leaked .env reference in commit 2024-03`
      },
      trigger: "devops"
    },
    hints: ["Which team appears most in technical hiring posts?", "DevOps profiles often reveal internal tooling."]
  },
  "atk001-osint-whois": {
    brief: "Brand protection assessment — analyze WHOIS for lookalike domains.",
    config: {
      commands: {
        whois: `WHOIS nexus-corp-login.com
  Created: 2026-06-01 (19 days ago)
  Registrar: NameCheap
  Registrant: REDACTED (privacy enabled)
  MX: none | A: 89.47.112.33
  Assessment: typosquatting risk — recently registered lookalike domain`
      }
    },
    hints: ["Recently registered domain with no MX but active A record.", "This technique impersonates a brand via similar domains."]
  },
  "atk001-osint-email": {
    brief: "Combine certificate transparency and Hunter.io for email discovery.",
    config: {
      commands: {
        curl: `crt.sh query: %.nexuscorp.com
  mail.nexuscorp.com
  autodiscover.nexuscorp.com
  dev-api.nexuscorp.com

Hunter.io: 214 verified emails, top dept: Engineering`
      },
      trigger: "crt.sh"
    },
    hints: ["Which transparency log service was queried?", "It exposes subdomains from issued certificates."]
  },
  "atk001-web-sqli": {
    brief: "Bypass authentication on /admin/login.php using SQL injection.",
    config: {
      web: {
        mode: "login",
        path: "admin/login.php",
        hint: "Try: admin' OR '1'='1'--",
        successOutput: "Login bypass successful — redirected to /admin/dashboard.php",
        acceptPatterns: ["'", "or 1=1", "or '1'='1", "sql injection"]
      }
    },
    hints: ["Classic tautology injection in the username field.", "Use OR 1=1 to bypass the WHERE clause."]
  },
  "atk001-web-xss": {
    brief: "Trigger reflected XSS in the public search endpoint.",
    config: {
      web: {
        mode: "search",
        path: "search",
        hint: "Try: <script>alert(1)</script>",
        successOutput: "Reflected XSS triggered — payload rendered unsanitized in HTML.",
        acceptPatterns: ["<script>", "xss", "alert("]
      }
    },
    hints: ["The search parameter reflects input without encoding.", "Inject a script tag in the query."]
  },
  "atk001-web-auth-bypass": {
    brief: "Escalate privileges by tampering with the client-side role cookie.",
    config: {
      web: {
        mode: "cookie",
        cookieHeader: "session=eyJ...; role=user",
        hint: "Change role=user to role=admin",
        successOutput: "Authentication bypass successful — admin panel JSON returned.",
        acceptPatterns: ["role=admin", "admin", "authentication bypass"]
      }
    },
    hints: ["The application trusts a client-controlled role value.", "Tamper the role cookie to admin."]
  },
  "atk001-web-idor": {
    brief: "Access another user's invoice by changing the object ID.",
    config: {
      web: {
        mode: "idor",
        hint: "Your ID is 1042 — try fetching invoice 1041.",
        successOutput: "GET /api/invoices/1041 → 200 OK — $48,500 invoice exposed (IDOR)."
      }
    },
    hints: ["Increment or decrement the invoice ID.", "No ownership check on the object reference."]
  },
  "atk001-web-bac": {
    brief: "Reach admin endpoints as a standard user.",
    config: {
      web: {
        mode: "admin",
        path: "admin/users",
        successOutput: "200 OK — full user list returned to standard_user_jwt (broken access control)."
      }
    },
    hints: ["Send a request to /admin/users with a standard user token.", "Missing function-level authorization is the flaw."]
  },
  "atk001-web-upload": {
    brief: "Upload a web shell via unrestricted file upload.",
    config: {
      web: {
        mode: "upload",
        path: "upload/avatar",
        hint: "Try uploading shell.php",
        successOutput: "Upload accepted — webshell stored at /uploads/shell.php"
      }
    },
    hints: ["The server accepts dangerous extensions.", "PHP files can execute on the server."]
  },
  "atk001-web-dir-enum": {
    brief: "Find the sensitive directory from gobuster output.",
    config: {
      web: {
        mode: "dirb",
        dirListing: `/admin          (Status: 403)
/backup         (Status: 200)
/.git/HEAD      (Status: 200)
/config.bak     (Status: 200)`,
        hint: "Which path returns 200 and likely holds archives?",
        acceptPatterns: ["backup"]
      }
    },
    hints: ["Look for Status 200 responses.", "Backup directories often leak sensitive data."]
  },
  "atk001-web-cookie": {
    brief: "Identify the missing security flag on the session cookie.",
    config: {
      web: {
        mode: "cookie",
        cookieHeader: "SESSIONID=a8f3b2; Path=/; HttpOnly=false; Secure=false; SameSite=none",
        hint: "Which flag prevents transmission over HTTP?",
        acceptPatterns: ["secure", "secure flag", "httponly"]
      }
    },
    hints: ["Review Set-Cookie flags.", "Missing Secure exposes cookies to MITM."]
  },
  "atk001-web-jwt": {
    brief: "Forge an admin JWT by setting alg to none.",
    config: {
      web: {
        mode: "jwt",
        jwtHeader: '{"alg":"HS256","typ":"JWT"}',
        jwtPayload: '{"role":"user"}',
        hint: 'Set header alg to "none" and role to admin',
        acceptPatterns: ["none", "alg:none", "admin", "jwt"]
      }
    },
    hints: ["Weak JWT validation accepts unsigned tokens.", "Change alg to none and escalate role."]
  },
  "atk001-web-csrf": {
    brief: "Craft a CSRF payload to change the victim's email.",
    config: {
      web: {
        mode: "csrf",
        path: "account/email",
        hint: "Auto-submit form POST to /account/email without CSRF token",
        acceptPatterns: ["csrf", "form", "attacker@evil.com", "submit", "account/email"]
      }
    },
    hints: ["State-changing POST lacks anti-CSRF token.", "A hidden auto-submit form exploits the victim's session."]
  },
  "atk001-exploit-cve": {
    brief: "Match observed JNDI callback behavior to the correct CVE.",
    config: {
      exploitMode: "cve",
      cve: {
        prompt: "Inject a User-Agent that triggers an outbound LDAP callback.",
        logSnippet: "javax.naming.CommunicationException: ldap://attacker.com\nFramework: Apache Log4j 2.14.1",
        acceptPatterns: ["log4shell", "log4j", "jndi", "44228"]
      }
    },
    hints: ["Look for JNDI LDAP lookup in the logs.", "Log4j 2.x remote code execution has a famous 2021 CVE name."]
  },
  "atk001-exploit-metasploit": {
    brief: "Exploit MS17-010 on 10.0.4.22 using Metasploit.",
    config: {
      exploitMode: "msf",
      msf: {
        searchTerm: "ms17-010",
        module: "exploit/windows/smb/ms17_010_eternalblue",
        payload: "windows/x64/meterpreter/reverse_tcp",
        rhost: "10.0.4.22",
        successOutput: "[+] Session 1 opened (meterpreter)"
      }
    },
    hints: ["search ms17-010", "use exploit/windows/smb/ms17_010_eternalblue", "set RHOSTS then run"]
  },
  "atk001-exploit-match": {
    brief: "Match OpenSSH 7.2p2 to the correct CVE for username enumeration.",
    config: {
      exploitMode: "match",
      exploitMatch: {
        service: "OpenSSH 7.2p2 Ubuntu 4ubuntu2.8",
        options: [
          { id: "cve-2016-6210", label: "CVE-2016-6210 — User enumeration (timing)" },
          { id: "cve-2018-15473", label: "CVE-2018-15473 — Username enumeration (AUTH)" },
          { id: "cve-2021-41617", label: "CVE-2021-41617 — Privilege escalation" }
        ],
        correctId: "cve-2018-15473"
      }
    },
    hints: ["OpenSSH before 7.7 is affected.", "Choose the CVE for malformed AUTH enumeration."]
  },
  "atk001-exploit-payload": {
    brief: "Select the payload for egress-only Windows x64 over HTTPS 443.",
    config: {
      exploitMode: "payload",
      payloadSelect: {
        scenario: "Target: Windows Server 2019 x64\nEgress: HTTPS 443 outbound only\nAV: Windows Defender active",
        options: [
          { id: "bind_tcp", label: "windows/shell_bind_tcp (port 4444 inbound)" },
          { id: "reverse_https", label: "windows/x64/meterpreter/reverse_https" },
          { id: "reverse_bash", label: "cmd/unix/reverse_bash" }
        ],
        correctId: "reverse_https"
      }
    },
    hints: ["Inbound connections are blocked.", "Reverse HTTPS uses allowed outbound 443."]
  },
  "atk001-exploit-vuln-analysis": {
    brief: "Identify the critical P1 finding in the pentest summary.",
    config: {
      exploitMode: "report",
      reportFindings: {
        items: [
          { severity: "P4", text: "Missing CSP header" },
          { severity: "P2", text: "Outdated jQuery 1.11" },
          { severity: "P1", text: "Unauthenticated RCE on /api/debug (POST cmd param)" },
          { severity: "P3", text: "SSL cert expires in 30 days" }
        ],
        criticalKeyword: "rce"
      }
    },
    hints: ["P1 is the highest severity in this list.", "Remote code execution without authentication is critical."]
  },
  "atk001-pass-hash-id": {
    brief: "Identify the hash algorithm from the /etc/shadow entry prefix.",
    config: {
      passwordTool: "john",
      defaultCommand: "john --show shadow.txt",
      hash: {
        type: "sha512crypt",
        value: "root:$6$rounds=656000$saltstring$hashedvalue...",
        answer: "sha512",
        identifyOutput: "Analyzing hash prefix...\n$6$ → sha512crypt (SHA-512)\nUse john --format=sha512crypt or hashcat -m 1800"
      }
    },
    hints: ["The $6$ prefix in shadow files has meaning.", "It maps to SHA-512 crypt."]
  },
  "atk001-pass-john": {
    brief: "Crack the MD5 hash with John the Ripper and rockyou.",
    config: {
      passwordTool: "john",
      defaultCommand: "john --format=raw-md5 --wordlist=rockyou.txt hash.txt",
      hash: {
        type: "md5",
        value: "5f4dcc3b5aa765d61d8327deb882cf99",
        answer: "password"
      }
    },
    hints: ["This is a raw MD5 hash.", "rockyou.txt's most common password is the answer."]
  },
  "atk001-pass-hashcat": {
    brief: "Select the correct hashcat mode for NTLM hashes from DC.",
    config: {
      passwordTool: "hashcat",
      defaultCommand: "hashcat -m 1000 -a 0 ntlm.txt rockyou.txt",
      hashcat: {
        mode: "1000",
        output: "hashcat (v6.2.6) starting...\nHash.Mode: 1000 (NTLM)\nRecovered........: 1/1 (100.00%) Digests"
      }
    },
    hints: ["Windows NTLM hashes use a specific hashcat mode number.", "Mode 1000 is the standard NTLM mode."]
  },
  "atk001-pass-hydra": {
    brief: "Brute force SSH on 10.10.1.50 and capture valid credentials.",
    config: {
      passwordTool: "hydra",
      defaultCommand: "hydra -l admin -P passwords.txt ssh://10.10.1.50",
      hydra: { service: "ssh", user: "admin", password: "admin123" }
    },
    hints: ["Run hydra against the SSH service.", "Read the cracked password from the output."]
  },
  "atk001-pass-spray": {
    brief: "Analyze password spray results against Azure AD.",
    config: {
      passwordTool: "hydra",
      defaultCommand: "spray --password Summer2026! --users users.txt",
      hydra: {
        service: "azuread",
        user: "jsmith@nexuscorp.com",
        password: "Summer2026!",
        sprayOutput: `Spray password: Summer2026!
498 accounts — failure
jsmith@nexuscorp.com — success (no MFA on legacy protocol)
2 accounts — locked out`
      }
    },
    hints: ["One password tested against many accounts.", "Name the technique, not just the password."]
  }
};

export function attackLabContent(slug: string, fallbackBrief: string): string {
  const entry = ATTACK_LAB_CONFIGS[slug];
  if (!entry) return fallbackBrief;
  return buildLabContent(entry.brief, entry.config);
}

export function attackLabHints(slug: string): string[] | undefined {
  return ATTACK_LAB_CONFIGS[slug]?.hints;
}
