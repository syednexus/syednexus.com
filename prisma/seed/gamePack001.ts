import { prisma } from "../../lib/prisma";
import { runSeedIfMain } from "./lib/runIfMain";

export async function seedGamePack001() {
  await prisma.mission.deleteMany({
    where: { slug: { startsWith: "game001-" } }
  });

  await prisma.mission.createMany({
    skipDuplicates: true,
    data: [
      // ── Linux (6) ──────────────────────────────────────────────────
      {
        title: "Terminal Escape Room",
        slug: "game001-linux-escape",
        type: "LINUX_GAME",
        category: "Terminal Escape Room",
        difficulty: "Easy",
        description: "Navigate the filesystem and submit the hidden passphrase.",
        scenario: "You are locked in a training VM. Find the hidden flag file.",
        content: '{"trigger":"cat lab/.hidden_flag","triggerMatch":"includes"}',
        answer: "hidden_in_plain_sight",
        explanation: "Hidden dotfiles in ~/lab contain the escape passphrase.",
        xp: 100
      },
      {
        title: "Hidden File Hunter",
        slug: "game001-linux-hidden",
        type: "LINUX_GAME",
        category: "Hidden File Hunter",
        difficulty: "Easy",
        description: "Use find to locate the concealed flag file.",
        scenario: "Intel says a dotfile in ~/lab holds the flag.",
        content: '{"trigger":"find","triggerMatch":"includes"}',
        answer: "hidden_in_plain_sight",
        explanation: "find reveals ./lab/.hidden_flag — classic hidden file hunt.",
        xp: 100
      },
      {
        title: "Permission Fix",
        slug: "game001-linux-chmod",
        type: "COMMAND_CHALLENGE",
        category: "Permission Fix",
        difficulty: "Medium",
        description: "Restore read access to secret.key using chmod.",
        scenario: "secret.key is mode 000 — fix permissions to read it.",
        content: '{"trigger":"chmod 600 secret.key"}',
        answer: "600",
        explanation: "chmod 600 restores owner read/write on the key file.",
        xp: 250
      },
      {
        title: "Grep Detective",
        slug: "game001-linux-grep",
        type: "COMMAND_CHALLENGE",
        category: "Grep Detective",
        difficulty: "Medium",
        description: "Grep auth.log for the attacker IP.",
        scenario: "Identify the brute force source in /var/log/auth.log.",
        content: '{"trigger":"grep Failed /var/log/auth.log"}',
        answer: "45.33.21.10",
        explanation: "grep isolates failed SSH attempts from 45.33.21.10.",
        xp: 250
      },
      {
        title: "Process Killer",
        slug: "game001-linux-kill",
        type: "LINUX_GAME",
        category: "Process Killer",
        difficulty: "Medium",
        description: "Terminate the malicious miner process.",
        scenario: "ps shows PID 882 running .miner from /tmp.",
        content: '{"trigger":"kill 882"}',
        answer: "882",
        explanation: "Kill PID 882 to stop the cryptominer process.",
        xp: 250
      },
      {
        title: "Cron Investigation",
        slug: "game001-linux-cron",
        type: "LINUX_GAME",
        category: "Cron Investigation",
        difficulty: "Hard",
        description: "Inspect cron configuration for persistence.",
        scenario: "Suspicious scheduled task references /tmp/.update.sh",
        content: '{"trigger":"cat /var/log/cron.log","triggerMatch":"includes"}',
        answer: "update.sh",
        explanation: "Cron.log reveals /tmp/.update.sh scheduled every 5 minutes.",
        xp: 500
      },

      // ── Networking (6) ─────────────────────────────────────────────
      {
        title: "Port Hunter",
        slug: "game001-net-port-hunter",
        type: "PORT_HUNTER",
        category: "Port Hunter",
        difficulty: "Easy",
        description: "Scan the host and identify the exposed database port.",
        scenario: "Target: 192.168.1.10 — find the risky open service.",
        content: JSON.stringify({
          scanTarget: "192.168.1.10",
          ports: [
            { port: 22, service: "SSH", state: "open" },
            { port: 80, service: "HTTP", state: "open" },
            { port: 443, service: "HTTPS", state: "open" },
            { port: 3306, service: "MYSQL", state: "open", note: "external DB" }
          ]
        }),
        answer: "3306",
        explanation: "MySQL 3306 should not be exposed to the lab network perimeter.",
        xp: 100
      },
      {
        title: "Protocol Match",
        slug: "game001-net-protocol",
        type: "NETWORK_GAME",
        category: "Protocol Match",
        difficulty: "Easy",
        description: "HTTPS uses which transport protocol?",
        scenario: "Match the protocol to the correct OSI layer.",
        content: "Which transport protocol carries HTTPS traffic?",
        answer: "tcp",
        explanation: "HTTPS runs over TCP port 443 — connection-oriented transport.",
        xp: 100
      },
      {
        title: "OSI Challenge",
        slug: "game001-net-osi",
        type: "NETWORK_GAME",
        category: "OSI Challenge",
        difficulty: "Medium",
        description: "Identify the OSI layer for IP routing.",
        scenario: "Packet routing happens at which OSI layer?",
        content: "Submit the layer name (one word).",
        answer: "network",
        explanation: "Layer 3 Network handles IP routing between subnets.",
        xp: 250
      },
      {
        title: "DNS Detective",
        slug: "game001-net-dns",
        type: "NETWORK_GAME",
        category: "DNS Detective",
        difficulty: "Medium",
        description: "Identify the protocol used for domain resolution.",
        scenario: "Users cannot resolve internal hostnames — which protocol?",
        content: JSON.stringify({
          scanTarget: "10.0.0.53",
          ports: [
            { port: 53, service: "DNS", state: "open", note: "BIND 9.18" },
            { port: 853, service: "DNS-TLS", state: "closed" }
          ]
        }),
        answer: "dns",
        explanation: "Port 53 DNS is the resolution service under investigation.",
        xp: 250
      },
      {
        title: "Firewall Builder",
        slug: "game001-net-firewall",
        type: "NETWORK_GAME",
        category: "Firewall Builder",
        difficulty: "Medium",
        description: "Find the filtered admin port on the scan.",
        scenario: "Only one admin service is blocked by the firewall.",
        content: JSON.stringify({
          scanTarget: "192.168.1.10",
          ports: [
            { port: 22, service: "SSH", state: "open" },
            { port: 8080, service: "HTTP-ALT", state: "filtered", note: "admin panel" },
            { port: 8443, service: "HTTPS-ALT", state: "open" }
          ]
        }),
        answer: "8080",
        explanation: "8080/admin is filtered — likely intentional ACL on management port.",
        xp: 250
      },
      {
        title: "Subnet Challenge",
        slug: "game001-net-subnet",
        type: "NETWORK_GAME",
        category: "Subnet Challenge",
        difficulty: "Hard",
        description: "How many hosts in a /24 network?",
        scenario: "Calculate usable host count for 192.168.1.0/24.",
        content: "Submit the CIDR prefix length that defines a class C subnet.",
        answer: "/24",
        explanation: "A /24 subnet contains 256 addresses (254 usable hosts).",
        xp: 500
      },

      // ── Packet (5) ─────────────────────────────────────────────────
      {
        title: "Credential Leak Hunt",
        slug: "game001-packet-credential",
        type: "PACKET_ANALYSIS",
        category: "Credential Leak Hunt",
        difficulty: "Easy",
        description: "Find the packet leaking HTTP Basic credentials.",
        scenario: "Analyst capture shows cleartext credential exfiltration.",
        content: JSON.stringify({
          packets: [
            { id: "1", time: "0.0", src: "10.0.1.55", dst: "8.8.8.8", proto: "DNS", info: "query google.com", flag: false },
            { id: "2", time: "0.04", src: "10.0.1.55", dst: "185.234.88.19", proto: "HTTP", info: "POST /upload Authorization: Basic YWRtaW46cGFzc3dvcmQ=", flag: true },
            { id: "3", time: "0.09", src: "10.0.1.55", dst: "10.0.1.1", proto: "ICMP", info: "echo request", flag: false }
          ]
        }),
        answer: "2",
        explanation: "Packet 2 contains Base64 Basic auth credentials in HTTP POST.",
        xp: 100
      },
      {
        title: "HTTP Investigation",
        slug: "game001-packet-http",
        type: "PACKET_ANALYSIS",
        category: "HTTP Investigation",
        difficulty: "Medium",
        description: "Identify the suspicious HTTP POST exfiltration.",
        scenario: "Large POST to unknown external IP detected.",
        content: JSON.stringify({
          packets: [
            { id: "1", time: "1.1", src: "10.0.4.22", dst: "203.0.113.10", proto: "HTTPS", info: "TLS application data", flag: false },
            { id: "2", time: "1.2", src: "10.0.4.22", dst: "194.26.27.82", proto: "HTTP", info: "POST /exfil chunk 4.2GB", flag: true },
            { id: "3", time: "1.3", src: "10.0.4.22", dst: "10.0.2.1", proto: "SMB", info: "Read file", flag: false }
          ]
        }),
        answer: "2",
        explanation: "Unencrypted HTTP POST with 4.2GB payload to external IP is exfiltration.",
        xp: 250
      },
      {
        title: "DNS Attack",
        slug: "game001-packet-dns",
        type: "PACKET_ANALYSIS",
        category: "DNS Attack",
        difficulty: "Medium",
        description: "Spot DNS tunneling in the capture.",
        scenario: "High-volume TXT queries to one domain.",
        content: JSON.stringify({
          packets: [
            { id: "1", time: "0.5", src: "10.0.12.88", dst: "10.0.0.53", proto: "DNS", info: "TXT query a7f3.data-sync.evil.net", flag: true },
            { id: "2", time: "0.6", src: "10.0.12.88", dst: "10.0.0.53", proto: "DNS", info: "TXT query b2c9.data-sync.evil.net", flag: true },
            { id: "3", time: "0.7", src: "10.0.12.88", dst: "8.8.8.8", proto: "DNS", info: "A query google.com", flag: false }
          ]
        }),
        answer: "1",
        explanation: "High-entropy TXT queries to data-sync.evil.net indicate DNS tunneling.",
        xp: 250
      },
      {
        title: "Suspicious IP",
        slug: "game001-packet-ip",
        type: "PACKET_ANALYSIS",
        category: "Suspicious IP",
        difficulty: "Hard",
        description: "Select the packet destined for a known C2 IP.",
        scenario: "Threat intel flagged 185.234.88.19 as AsyncRAT infrastructure.",
        content: JSON.stringify({
          packets: [
            { id: "1", time: "2.0", src: "10.0.6.50", dst: "203.0.113.44", proto: "HTTPS", info: "TLS to vendor CDN", flag: false },
            { id: "2", time: "2.1", src: "10.0.6.50", dst: "185.234.88.19", proto: "HTTPS", info: "Beacon 64 bytes every 60s", flag: true },
            { id: "3", time: "2.2", src: "10.0.6.50", dst: "10.0.0.1", proto: "DNS", info: "Standard query", flag: false }
          ]
        }),
        answer: "185.234.88.19",
        explanation: "Periodic 64-byte HTTPS beacons to known C2 IP 185.234.88.19.",
        xp: 500
      },
      {
        title: "PCAP Challenge",
        slug: "game001-packet-pcap",
        type: "PACKET_ANALYSIS",
        category: "PCAP Challenge",
        difficulty: "Hard",
        description: "Identify the malicious packet in a mixed capture.",
        scenario: "Full PCAP triage — one packet is the attacker callback.",
        content: JSON.stringify({
          packets: [
            { id: "1", time: "0.0", src: "192.168.1.10", dst: "192.168.1.1", proto: "ARP", info: "Who has 192.168.1.1?", flag: false },
            { id: "2", time: "0.1", src: "192.168.1.10", dst: "89.47.112.33", proto: "TCP", info: "SYN port 4444", flag: true },
            { id: "3", time: "0.2", src: "192.168.1.10", dst: "192.168.1.5", proto: "SMB", info: "Session setup", flag: false }
          ]
        }),
        answer: "2",
        explanation: "Outbound SYN to 89.47.112.33:4444 is a reverse shell callback.",
        xp: 500
      },

      // ── Quiz (4) ───────────────────────────────────────────────────
      {
        title: "Cyber Basics",
        slug: "game001-quiz-basics",
        type: "QUIZ",
        category: "Cyber Basics",
        difficulty: "Easy",
        description: "Test foundational cybersecurity knowledge.",
        scenario: "Checkpoint quiz before advanced modules.",
        content: JSON.stringify({
          quiz: {
            kind: "mc",
            question: "Which CIA triad pillar ensures data is accessible only to authorized users?",
            options: ["Integrity", "Confidentiality", "Availability", "Authentication"],
            correct: "Confidentiality"
          }
        }),
        answer: "Confidentiality",
        explanation: "Confidentiality restricts access to authorized parties only.",
        xp: 100
      },
      {
        title: "Linux Commands",
        slug: "game001-quiz-linux",
        type: "QUIZ",
        category: "Linux Commands",
        difficulty: "Easy",
        description: "Identify the correct Linux command.",
        scenario: "Quick fire command knowledge check.",
        content: JSON.stringify({
          quiz: {
            kind: "mc",
            question: "Which command lists directory contents?",
            options: ["cd", "ls", "pwd", "cat"],
            correct: "ls"
          }
        }),
        answer: "ls",
        explanation: "ls lists files and directories in the current path.",
        xp: 100
      },
      {
        title: "Networking",
        slug: "game001-quiz-network",
        type: "QUIZ",
        category: "Networking",
        difficulty: "Medium",
        description: "Networking fundamentals quiz.",
        scenario: "Verify OSI and protocol knowledge.",
        content: JSON.stringify({
          quiz: {
            kind: "mc",
            question: "What port does HTTPS use by default?",
            options: ["80", "443", "22", "53"],
            correct: "443"
          }
        }),
        answer: "443",
        explanation: "HTTPS defaults to TCP port 443.",
        xp: 250
      },
      {
        title: "Security Concepts",
        slug: "game001-quiz-security",
        type: "QUIZ",
        category: "Security Concepts",
        difficulty: "Medium",
        description: "True/false security concept check.",
        scenario: "Validate your blue team fundamentals.",
        content: JSON.stringify({
          quiz: {
            kind: "tf",
            question: "A firewall alone is sufficient protection against all web application attacks.",
            correct: "false"
          }
        }),
        answer: "false",
        explanation: "WAF/firewall cannot replace secure coding — SQLi/XSS need app-layer controls.",
        xp: 250
      },

      // ── Bonus games to reach 30 ────────────────────────────────────
      {
        title: "PATH Navigator",
        slug: "game001-linux-path",
        type: "COMMAND_CHALLENGE",
        category: "Linux Commands",
        difficulty: "Easy",
        description: "Use pwd to confirm your location.",
        scenario: "Confirm the absolute path of your home directory.",
        content: '{"trigger":"pwd"}',
        answer: "/home/operator",
        explanation: "pwd prints the current working directory path.",
        xp: 100
      },
      {
        title: "Log Tail Master",
        slug: "game001-linux-logs",
        type: "LINUX_GAME",
        category: "Grep Detective",
        difficulty: "Hard",
        description: "Find the suspicious cron entry in logs.",
        scenario: "Analyze /var/log/cron.log for persistence.",
        content: '{"trigger":"cat /var/log/cron.log","triggerMatch":"includes"}',
        answer: "update.sh",
        explanation: "Cron.log reveals /tmp/.update.sh scheduled every 5 minutes.",
        xp: 500
      },
      {
        title: "Traceroute Trace",
        slug: "game001-net-trace",
        type: "NETWORK_GAME",
        category: "Protocol Match",
        difficulty: "Hard",
        description: "Which ICMP-based tool maps hop path?",
        scenario: "Network path discovery tool name.",
        content: "One word answer — tool that uses TTL increments.",
        answer: "traceroute",
        explanation: "Traceroute uses ICMP TTL expiry to map each hop to destination.",
        xp: 500
      },
      {
        title: "TLS Inspection",
        slug: "game001-packet-tls",
        type: "PACKET_ANALYSIS",
        category: "HTTP Investigation",
        difficulty: "Medium",
        description: "Find unencrypted traffic in the capture.",
        scenario: "One packet is cleartext HTTP — select it.",
        content: JSON.stringify({
          packets: [
            { id: "1", time: "0.3", src: "10.1.1.5", dst: "10.1.1.1", proto: "TLS", info: "Client Hello", flag: false },
            { id: "2", time: "0.4", src: "10.1.1.5", dst: "198.51.100.1", proto: "HTTP", info: "GET /login?user=admin&pass=secret", flag: true },
            { id: "3", time: "0.5", src: "10.1.1.5", dst: "10.1.1.1", proto: "DNS", info: "query internal.local", flag: false }
          ]
        }),
        answer: "2",
        explanation: "Cleartext HTTP with credentials in query string — no TLS protection.",
        xp: 250
      },
      {
        title: "ARP Spoof Spot",
        slug: "game001-packet-arp",
        type: "PACKET_ANALYSIS",
        category: "Suspicious IP",
        difficulty: "Easy",
        description: "Detect gratuitous ARP in the capture.",
        scenario: "Possible ARP spoofing attack in LAN capture.",
        content: JSON.stringify({
          packets: [
            { id: "1", time: "0.0", src: "192.168.1.50", dst: "192.168.1.255", proto: "ARP", info: "Who has 192.168.1.1? Tell 192.168.1.50", flag: false },
            { id: "2", time: "0.1", src: "192.168.1.99", dst: "192.168.1.255", proto: "ARP", info: "192.168.1.1 is at 00:11:22:33:44:55 (gratuitous)", flag: true },
            { id: "3", time: "0.2", src: "192.168.1.10", dst: "192.168.1.1", proto: "ICMP", info: "echo", flag: false }
          ]
        }),
        answer: "2",
        explanation: "Gratuitous ARP from 192.168.1.99 claiming to be the gateway is ARP spoofing.",
        xp: 100
      },
      {
        title: "OWASP Top 10 Quiz",
        slug: "game001-quiz-owasp",
        type: "QUIZ",
        category: "Security Concepts",
        difficulty: "Hard",
        description: "Identify the OWASP category for SQL injection.",
        scenario: "Map vulnerability to OWASP Top 10:2021.",
        content: JSON.stringify({
          quiz: {
            kind: "mc",
            question: "SQL injection maps to which OWASP Top 10 category?",
            options: ["A01 Broken Access Control", "A03 Injection", "A05 Security Misconfiguration", "A07 Identification Failures"],
            correct: "A03 Injection"
          }
        }),
        answer: "A03 Injection",
        explanation: "SQL injection is the canonical example of OWASP A03 Injection.",
        xp: 500
      },
      {
        title: "Incident Response Quiz",
        slug: "game001-quiz-ir",
        type: "QUIZ",
        category: "Security Concepts",
        difficulty: "Hard",
        description: "First step in incident response lifecycle.",
        scenario: "NIST IR lifecycle knowledge check.",
        content: JSON.stringify({
          quiz: {
            kind: "mc",
            question: "What is the FIRST phase of incident response?",
            options: ["Containment", "Preparation", "Eradication", "Recovery"],
            correct: "Preparation"
          }
        }),
        answer: "Preparation",
        explanation: "NIST IR starts with Preparation — policies, tools, and playbooks before incidents.",
        xp: 500
      },
      {
        title: "SUID Hunt",
        slug: "game001-linux-suid",
        type: "LINUX_GAME",
        category: "Hidden File Hunter",
        difficulty: "Medium",
        description: "Find the SUID binary mentioned in readme.",
        scenario: "Check readme.txt for the suspicious binary name.",
        content: '{"trigger":"cat lab/notes.txt","triggerMatch":"includes"}',
        answer: "dot",
        explanation: "notes.txt hints that the flag file starts with a dot — use find or ls -a.",
        xp: 250
      },
      {
        title: "VLAN Challenge",
        slug: "game001-net-vlan",
        type: "NETWORK_GAME",
        category: "Subnet Challenge",
        difficulty: "Medium",
        description: "What layer-2 segmentation technology isolates broadcast domains?",
        scenario: "Network segmentation quiz for junior analysts.",
        content: "Submit the acronym for Virtual LAN.",
        answer: "vlan",
        explanation: "VLANs segment broadcast domains at Layer 2.",
        xp: 250
      },
      {
        title: "Command Blitz",
        slug: "game001-cmd-blitz",
        type: "COMMAND_CHALLENGE",
        category: "Terminal Escape Room",
        difficulty: "Easy",
        description: "Confirm your identity on the lab VM.",
        scenario: "Run whoami to verify your operator account.",
        content: '{"trigger":"whoami"}',
        answer: "operator",
        explanation: "whoami confirms the current user context before privilege escalation attempts.",
        xp: 100
      }
    ]
  });

  console.log("Nexus Cyber Games Pack 001 seeded (30 games)");
}

async function main() {
  await seedGamePack001();
}

runSeedIfMain("gamePack001", main);
