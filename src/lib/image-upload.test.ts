/**
 * Unit tests for the upload sizing helpers.
 */

import { describe, expect, it } from "vitest";
import { fitDimensions, preparePhoto } from "./image-upload";

describe("fitDimensions", () => {
  it("scales the long edge down and preserves the aspect ratio", () => {
    expect(fitDimensions(4000, 3000, 2400)).toEqual({ width: 2400, height: 1800 });
    expect(fitDimensions(3000, 4000, 2400)).toEqual({ width: 1800, height: 2400 });
  });

  it("never upscales or returns zero dimensions", () => {
    expect(fitDimensions(800, 600, 2400)).toEqual({ width: 800, height: 600 });
    expect(fitDimensions(0, 600, 2400)).toEqual({ width: 0, height: 0 });
  });
});

describe("preparePhoto", () => {
  it("passes small images and non-compressible formats through untouched", async () => {
    const jpeg = new File([new Uint8Array(8)], "small.jpg", { type: "image/jpeg" });
    const heic = new File([new Uint8Array(8)], "phone.heic", { type: "image/heic" });
    await expect(preparePhoto(jpeg)).resolves.toBe(jpeg);
    await expect(preparePhoto(heic)).resolves.toBe(heic);
  });
});
