"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect
} from "react";

type SoundContextType = {
  enabled: boolean;
  toggleSound: () => void;
  play: (type?: "click" | "success" | "alert" | "specialist" | "achievement") => void;
  volume: number;
  setVolume: (vol: number) => void;
};

const SoundContext = createContext<SoundContextType | null>(null);

export function NexusSoundProvider({
  children
}: {
  children: React.ReactNode
}) {
  const [enabled, setEnabled] = useState(false);
  const [volume, setVolumeState] = useState(0.05);

  useEffect(() => {
    const saved = localStorage.getItem("nexus_sound");
    const savedVolume = localStorage.getItem("nexus_sound_volume");

    if (saved === "true") {
      setEnabled(true);
    }
    if (savedVolume) {
      setVolumeState(parseFloat(savedVolume));
    }
  }, []);

  function toggleSound() {
    const next = !enabled;
    setEnabled(next);
    localStorage.setItem("nexus_sound", String(next));
  }

  function setVolume(vol: number) {
    const clamped = Math.max(0, Math.min(1, vol));
    setVolumeState(clamped);
    localStorage.setItem("nexus_sound_volume", String(clamped));
  }

  function play(type: "click" | "success" | "alert" | "specialist" | "achievement" = "click") {
    if (!enabled) {
      return;
    }

    const audioContext = new (window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext!)();

    if (type === "achievement") {
      const notes = [392, 523.25, 659.25];
      notes.forEach((frequency, index) => {
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();

        oscillator.type = "triangle";
        oscillator.frequency.value = frequency;
        oscillator.connect(gain);
        gain.connect(audioContext.destination);

        const start = audioContext.currentTime + index * 0.09;
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(volume * 0.22, start + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.16);

        oscillator.start(start);
        oscillator.stop(start + 0.18);
      });
      return;
    }

    if (type === "specialist") {
      const now = audioContext.currentTime;

      const rumble = audioContext.createOscillator();
      const rumbleGain = audioContext.createGain();
      rumble.type = "sawtooth";
      rumble.frequency.setValueAtTime(62, now);
      rumble.frequency.exponentialRampToValueAtTime(42, now + 0.85);
      rumble.connect(rumbleGain);
      rumbleGain.connect(audioContext.destination);
      rumbleGain.gain.setValueAtTime(0, now);
      rumbleGain.gain.linearRampToValueAtTime(volume * 0.38, now + 0.04);
      rumbleGain.gain.exponentialRampToValueAtTime(0.001, now + 1);
      rumble.start(now);
      rumble.stop(now + 1.05);

      const alert = audioContext.createOscillator();
      const alertGain = audioContext.createGain();
      alert.type = "square";
      alert.frequency.setValueAtTime(176, now + 0.1);
      alert.frequency.setValueAtTime(110, now + 0.3);
      alert.frequency.setValueAtTime(140, now + 0.5);
      alert.connect(alertGain);
      alertGain.connect(audioContext.destination);
      alertGain.gain.setValueAtTime(0, now + 0.1);
      alertGain.gain.linearRampToValueAtTime(volume * 0.16, now + 0.12);
      alertGain.gain.exponentialRampToValueAtTime(0.001, now + 0.72);
      alert.start(now + 0.1);
      alert.stop(now + 0.75);

      const bufferSize = Math.floor(audioContext.sampleRate * 0.1);
      const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i += 1) {
        data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
      }
      const noise = audioContext.createBufferSource();
      const noiseGain = audioContext.createGain();
      noise.buffer = buffer;
      noise.connect(noiseGain);
      noiseGain.connect(audioContext.destination);
      noiseGain.gain.setValueAtTime(volume * 0.06, now + 0.06);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
      noise.start(now + 0.06);
      noise.stop(now + 0.18);

      return;
    }

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    let frequency = 420;
    let duration = 0.08;

    switch (type) {
      case "success":
        frequency = 700;
        duration = 0.1;
        break;
      case "alert":
        frequency = 200;
        duration = 0.15;
        break;
      case "click":
        frequency = 420;
        duration = 0.08;
        break;
    }

    oscillator.frequency.value = frequency;
    gain.gain.value = volume;
    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
  }

  return (
    <SoundContext.Provider
      value={{
        enabled,
        toggleSound,
        play,
        volume,
        setVolume
      }}
    >
      {children}
    </SoundContext.Provider>
  );
}

export function useNexusSound() {
  const ctx = useContext(SoundContext);

  if (!ctx) {
    throw new Error("NexusSoundProvider missing");
  }

  return ctx;
}
