/**
 * Ambient wedding music, generated in the browser with the Web Audio API.
 *
 * Why generative? The app ships no audio files, and autoplaying third-party
 * tracks raises licensing questions. Each preset composes a gentle, endless
 * piece from a chord progression: bass, pads and an arpeggio/melody voice,
 * through a soft reverb. Nothing loads over the network.
 *
 * Browsers require a user gesture before audio can start — call `start()`
 * from a click/tap/keydown handler.
 */

export type MusicPreset = "piano" | "acoustic" | "orchestral" | "ambient" | "romantic" | "musicbox";

export const MUSIC_PRESETS: { value: MusicPreset; label: string }[] = [
  { value: "piano", label: "Soft piano" },
  { value: "acoustic", label: "Acoustic guitar" },
  { value: "orchestral", label: "Strings" },
  { value: "ambient", label: "Dreamy ambient" },
  { value: "romantic", label: "Romantic piano & strings" },
  { value: "musicbox", label: "Music box" },
];

/** Maps any genre string (e.g. from music_tracks.genre) to a preset; unknown → piano. */
export function toMusicPreset(value: string | null | undefined): MusicPreset {
  return (MUSIC_PRESETS.find((p) => p.value === value)?.value ?? "piano") as MusicPreset;
}

/** MIDI note number → frequency in Hz (A4 = 69 = 440 Hz). */
export function midiToFreq(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

interface PresetSpec {
  bpm: number;
  /** Chord roots + quality, one per bar (4 beats). MIDI of the root in octave 3. */
  progression: { root: number; minor: boolean }[];
  pad: boolean;
  arp: "none" | "piano" | "pluck" | "bell";
  bass: boolean;
  sparkle: boolean;
  /** Overall loudness multiplier. */
  level: number;
}

const C = 48, D = 50, E = 52, F = 53, G = 55, A = 57;

/** Presets: tempo, progression and which voices play. */
export const PRESET_SPECS: Record<MusicPreset, PresetSpec> = {
  piano: { bpm: 68, progression: [{ root: C, minor: false }, { root: A, minor: true }, { root: F, minor: false }, { root: G, minor: false }], pad: false, arp: "piano", bass: true, sparkle: false, level: 0.9 },
  acoustic: { bpm: 84, progression: [{ root: G, minor: false }, { root: D, minor: false }, { root: E, minor: true }, { root: C, minor: false }], pad: false, arp: "pluck", bass: true, sparkle: false, level: 0.85 },
  orchestral: { bpm: 60, progression: [{ root: D, minor: false }, { root: A, minor: false }, { root: 47, minor: true }, { root: G, minor: false }], pad: true, arp: "none", bass: true, sparkle: false, level: 0.8 },
  ambient: { bpm: 56, progression: [{ root: F, minor: false }, { root: C, minor: false }, { root: D, minor: true }, { root: A - 12, minor: false }], pad: true, arp: "bell", bass: false, sparkle: true, level: 0.75 },
  romantic: { bpm: 64, progression: [{ root: F, minor: false }, { root: G, minor: false }, { root: E, minor: true }, { root: A, minor: true }], pad: true, arp: "piano", bass: true, sparkle: false, level: 0.8 },
  musicbox: { bpm: 92, progression: [{ root: C, minor: false }, { root: G, minor: false }, { root: A, minor: true }, { root: F, minor: false }], pad: false, arp: "bell", bass: false, sparkle: true, level: 0.7 },
};

/** Chord tones (root, third, fifth, octave) for a root + quality. */
export function chordTones(root: number, minor: boolean): number[] {
  return [root, root + (minor ? 3 : 4), root + 7, root + 12];
}

/** Arpeggio note for a 16th-step within a bar: up-down pattern across two octaves. */
export function arpNote(root: number, minor: boolean, step: number): number {
  const t = chordTones(root + 12, minor);
  const pattern = [0, 1, 2, 3, 2, 1, 2, 3];
  return t[pattern[step % pattern.length]];
}

export interface AmbientMusic {
  start(): Promise<void>;
  stop(fadeMs?: number): void;
  readonly playing: boolean;
}

/** Creates a generative music player for a preset (no audio context until start()). */
export function createAmbientMusic(preset: MusicPreset, volume = 0.5): AmbientMusic {
  const spec = PRESET_SPECS[preset];
  let ctx: AudioContext | null = null;
  let master: GainNode | null = null;
  let timer: ReturnType<typeof setInterval> | null = null;
  let nextTime = 0;
  let step = 0; // 8th-note steps
  let playing = false;
  const stepDur = 60 / spec.bpm / 2;

  /** Builds a short synthetic reverb impulse response. */
  function impulse(c: AudioContext, seconds = 2.8): AudioBuffer {
    const len = Math.floor(c.sampleRate * seconds);
    const buf = c.createBuffer(2, len, c.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const data = buf.getChannelData(ch);
      for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6);
    }
    return buf;
  }

  /** Schedules one enveloped oscillator voice. */
  function voice(
    c: AudioContext,
    out: AudioNode,
    midi: number,
    when: number,
    { type, attack, decay, gain, cutoff, detune = 0 }: { type: OscillatorType; attack: number; decay: number; gain: number; cutoff?: number; detune?: number }
  ) {
    const osc = c.createOscillator();
    osc.type = type;
    osc.frequency.value = midiToFreq(midi);
    osc.detune.value = detune;
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, when);
    g.gain.exponentialRampToValueAtTime(gain * spec.level, when + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, when + attack + decay);
    let node: AudioNode = osc;
    if (cutoff) {
      const f = c.createBiquadFilter();
      f.type = "lowpass";
      f.frequency.value = cutoff;
      osc.connect(f);
      node = f;
    }
    node.connect(g);
    g.connect(out);
    osc.start(when);
    osc.stop(when + attack + decay + 0.05);
  }

  /** Schedules all voices for one 8th-note step. */
  function schedule(c: AudioContext, out: AudioNode, when: number, s: number) {
    const bar = Math.floor(s / 8) % spec.progression.length;
    const beatInBar = s % 8;
    const { root, minor } = spec.progression[bar];

    if (beatInBar === 0) {
      if (spec.bass) voice(c, out, root - 12, when, { type: "sine", attack: 0.02, decay: stepDur * 7, gain: 0.22 });
      if (spec.pad) {
        for (const n of chordTones(root, minor).slice(0, 3)) {
          voice(c, out, n + 12, when, { type: "sawtooth", attack: 1.2, decay: stepDur * 9, gain: 0.025, cutoff: 900, detune: -6 });
          voice(c, out, n + 12, when, { type: "triangle", attack: 1.4, decay: stepDur * 9, gain: 0.035, cutoff: 1400, detune: 6 });
        }
      }
    }

    const n = arpNote(root, minor, beatInBar);
    if (spec.arp === "piano") {
      voice(c, out, n, when, { type: "triangle", attack: 0.008, decay: 1.6, gain: 0.12, cutoff: 2600 });
      voice(c, out, n + 12, when, { type: "sine", attack: 0.008, decay: 0.9, gain: 0.03 });
    } else if (spec.arp === "pluck") {
      voice(c, out, n, when, { type: "sawtooth", attack: 0.005, decay: 0.7, gain: 0.07, cutoff: 1800, detune: (s % 3) - 1 });
    } else if (spec.arp === "bell" && beatInBar % 2 === 0) {
      voice(c, out, n + 12, when, { type: "sine", attack: 0.004, decay: 2.2, gain: 0.08 });
      voice(c, out, n + 31, when, { type: "sine", attack: 0.004, decay: 0.8, gain: 0.015 });
    }

    if (spec.sparkle && beatInBar === 5 && bar % 2 === 1) {
      voice(c, out, root + 36 + [0, 2, 4, 7, 9][s % 5], when, { type: "sine", attack: 0.01, decay: 2.5, gain: 0.04 });
    }
  }

  return {
    get playing() {
      return playing;
    },

    async start() {
      if (playing) return;
      if (typeof window === "undefined") return;
      const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) throw new Error("Web Audio is not supported in this browser.");
      ctx = ctx ?? new Ctor();
      await ctx.resume();

      master = ctx.createGain();
      master.gain.setValueAtTime(0.0001, ctx.currentTime);
      master.gain.exponentialRampToValueAtTime(volume, ctx.currentTime + 2.5);
      const comp = ctx.createDynamicsCompressor();
      const dry = ctx.createGain();
      dry.gain.value = 0.7;
      const wet = ctx.createGain();
      wet.gain.value = 0.45;
      const reverb = ctx.createConvolver();
      reverb.buffer = impulse(ctx);
      const bus = ctx.createGain();
      bus.connect(dry);
      bus.connect(reverb);
      reverb.connect(wet);
      dry.connect(master);
      wet.connect(master);
      master.connect(comp);
      comp.connect(ctx.destination);

      playing = true;
      nextTime = ctx.currentTime + 0.1;
      const c = ctx;
      timer = setInterval(() => {
        while (nextTime < c.currentTime + 0.4) {
          schedule(c, bus, nextTime, step);
          nextTime += stepDur;
          step++;
        }
      }, 100);
    },

    stop(fadeMs = 800) {
      if (!playing || !ctx || !master) return;
      playing = false;
      const c = ctx;
      const m = master;
      m.gain.cancelScheduledValues(c.currentTime);
      m.gain.setValueAtTime(Math.max(m.gain.value, 0.0001), c.currentTime);
      m.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + fadeMs / 1000);
      setTimeout(() => {
        if (timer) clearInterval(timer);
        timer = null;
        m.disconnect();
      }, fadeMs + 50);
    },
  };
}
