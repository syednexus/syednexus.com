import { prisma } from "../../lib/prisma";

async function main() {
  await prisma.mission.createMany({
    skipDuplicates: true,
    data: [
      {
        title: "Linux Permission Puzzle",
        slug: "game-linux-permissions",
        type: "LINUX_GAME",
        category: "Linux Training",
        difficulty: "Beginner",
        description: "Fix broken file permissions to restore SSH access.",
        scenario: "A trainee locked themselves out of a lab VM by chmod 000 on ~/.ssh.",
        content: "Inspect permissions and restore authorized_keys readability.",
        answer: "chmod 600",
        explanation: "SSH private keys and authorized_keys require owner read/write (600).",
        xp: 100
      },
      {
        title: "Port Hunter Challenge",
        slug: "game-port-hunter",
        type: "PORT_HUNTER",
        category: "Network Training",
        difficulty: "Beginner",
        description: "Identify the open service flagged as vulnerable on the target.",
        scenario: "Scan results show one unexpected high port exposing a admin panel.",
        content: "Review the scan output and name the exposed service type.",
        answer: "ssh",
        explanation: "Port 22 SSH was misconfigured with weak credentials on the target.",
        xp: 100
      },
      {
        title: "Command Line Blitz",
        slug: "game-command-blitz",
        type: "COMMAND_CHALLENGE",
        category: "Training",
        difficulty: "Intermediate",
        description: "Use shell commands to find the hidden flag in /var/log.",
        scenario: "A CTF flag was appended to a rotated log file.",
        content: "grep -r FLAG /var/log",
        answer: "flag",
        explanation: "Recursive grep across /var/log reveals the flag in auth.log.1.",
        xp: 250
      },
      {
        title: "Cybersecurity Basics Quiz",
        slug: "game-cyber-quiz",
        type: "QUIZ",
        category: "Quiz",
        difficulty: "Beginner",
        description: "Answer a fundamentals question about the CIA triad.",
        scenario: "Training module checkpoint before advancing to SOC missions.",
        content: "Which pillar ensures data is accessible only to authorized users?",
        answer: "confidentiality",
        explanation: "Confidentiality limits access to authorized parties — core CIA triad concept.",
        xp: 100
      }
    ]
  });

  console.log("Game missions seeded");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
