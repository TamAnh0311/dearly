/**
 * Unit tests for the generative music helpers (pure functions only — the
 * Web Audio engine itself needs a browser).
 */

import { describe, expect, it } from "vitest";
import { MUSIC_PRESETS, PRESET_SPECS, arpNote, chordTones, createAmbientMusic, midiToFreq, toMusicPreset } from "./ambient-music";

describe("music theory helpers", () => {
  it("converts MIDI to frequency", () => {
    expect(midiToFreq(69)).toBeCloseTo(440);
    expect(midiToFreq(81)).toBeCloseTo(880);
    expect(midiToFreq(60)).toBeCloseTo(261.63, 1);
  });

  it("builds major and minor triads with an octave", () => {
    expect(chordTones(48, false)).toEqual([48, 52, 55, 60]);
    expect(chordTones(57, true)).toEqual([57, 60, 64, 69]);
  });

  it("arpeggiates only chord tones, an octave up", () => {
    const tones = chordTones(60, false);
    for (let s = 0; s < 16; s++) expect(tones).toContain(arpNote(48, false, s));
  });
});

describe("presets", () => {
  it("maps genres to presets with a piano fallback", () => {
    expect(toMusicPreset("orchestral")).toBe("orchestral");
    expect(toMusicPreset("ambient")).toBe("ambient");
    expect(toMusicPreset("heavy-metal")).toBe("piano");
    expect(toMusicPreset(null)).toBe("piano");
  });

  it("defines a playable spec for every preset", () => {
    for (const { value } of MUSIC_PRESETS) {
      const spec = PRESET_SPECS[value];
      expect(spec.bpm).toBeGreaterThan(40);
      expect(spec.bpm).toBeLessThan(120);
      expect(spec.progression.length).toBeGreaterThan(0);
    }
  });

  it("creates an idle engine without touching Web Audio until start()", () => {
    const m = createAmbientMusic("piano");
    expect(m.playing).toBe(false);
    expect(() => m.stop()).not.toThrow();
  });
});