import fs from "node:fs";
import path from "node:path";

const root = path.join(process.cwd(), "public", "sounds");

/** @type {Array<[string, number, number]>} */
const tones = [
  ["common/click", 520, 0.05],
  ["common/success", 880, 0.12],
  ["common/error", 180, 0.18],
  ["defender/alert", 760, 0.14],
  ["defender/scan", 640, 0.1],
  ["shadow/sudo", 120, 0.16],
  ["shadow/denied", 90, 0.22],
  ["shadow/unlock", 220, 0.2],
  ["medcore/scan", 700, 0.11],
  ["medcore/complete", 520, 0.15],
  ["vault/unlock", 440, 0.18],
  ["vault/denied", 140, 0.2]
];

function writeToneWavAsMp3Path(relativePath, frequency, durationSec) {
  const sampleRate = 22050;
  const sampleCount = Math.floor(sampleRate * durationSec);
  const buffer = Buffer.alloc(44 + sampleCount * 2);

  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + sampleCount * 2, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(sampleCount * 2, 40);

  for (let i = 0; i < sampleCount; i += 1) {
    const t = i / sampleRate;
    const envelope = Math.min(1, t * 40) * Math.max(0, 1 - t / durationSec);
    const sample = Math.sin(2 * Math.PI * frequency * t) * envelope * 0.35;
    buffer.writeInt16LE(Math.floor(sample * 32767), 44 + i * 2);
  }

  const targetDir = path.join(root, path.dirname(relativePath));
  fs.mkdirSync(targetDir, { recursive: true });
  const output = path.join(root, `${relativePath}.wav`);
  fs.writeFileSync(output, buffer);
}

for (const [relative, frequency, duration] of tones) {
  writeToneWavAsMp3Path(relative, frequency, duration);
}

console.log(`Generated ${tones.length} Nexus sound assets (.wav).`);
