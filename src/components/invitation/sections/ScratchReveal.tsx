"use client";

/**
 * ScratchReveal — a foil card guests scratch with a finger or mouse to
 * uncover the wedding date. Once ~50% is cleared the foil dissolves and a
 * celebration burst plays. Keyboard / reduced-motion users get a
 * "Reveal" button, so the date is never trapped behind the interaction.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CelebrationBurst } from "../effects/Particles";
import { alpha, mix, type InvitationPalette } from "../utils";

const CLEAR_THRESHOLD = 0.5;
const BRUSH = 26;

export default function ScratchReveal({
  palette,
  children,
  label = "Scratch to reveal",
}: {
  palette: InvitationPalette;
  children: React.ReactNode;
  label?: string;
}) {
  const reduce = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const moves = useRef(0);
  const [revealed, setRevealed] = useState(false);

  /** Paints the foil layer sized to the card (device-pixel aware). */
  const paintFoil = useCallback(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const { width, height } = wrap.getBoundingClientRect();
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    const g = ctx.createLinearGradient(0, 0, width, height);
    g.addColorStop(0, mix(palette.primary, "#ffffff", 0.35));
    g.addColorStop(0.5, palette.primary);
    g.addColorStop(1, mix(palette.primary, "#ffffff", 0.25));
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, width, height);
    // Fine brushed-metal lines
    ctx.globalAlpha = 0.12;
    ctx.strokeStyle = "#ffffff";
    for (let y = 0; y < height; y += 3) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y + 6);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    ctx.fillStyle = alpha("#ffffff", 0.92);
    ctx.font = `600 13px ${palette.bodyFont}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label.toUpperCase().split("").join(" "), width / 2, height / 2);
  }, [palette, label]);

  useEffect(() => {
    if (reduce) return;
    paintFoil();
    const onResize = () => !revealed && paintFoil();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [paintFoil, reduce, revealed]);

  /** Fraction of foil pixels already scratched away (sampled for speed). */
  function clearedRatio(): number {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return 0;
    const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let clear = 0;
    let total = 0;
    for (let i = 3; i < data.length; i += 4 * 24) {
      total++;
      if (data[i] === 0) clear++;
    }
    return total ? clear / total : 0;
  }

  /** Erases a stroke from the previous pointer position to (x, y). */
  function scratch(x: number, y: number) {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = BRUSH;
    ctx.beginPath();
    const from = last.current ?? { x, y };
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(x, y);
    ctx.stroke();
    last.current = { x, y };
    if (++moves.current % 12 === 0 && clearedRatio() > CLEAR_THRESHOLD) setRevealed(true);
  }

  /** Converts a pointer event to canvas-local CSS pixels. */
  function local(e: React.PointerEvent<HTMLCanvasElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  return (
    <div className="relative mx-auto w-full max-w-md">
      {revealed && <CelebrationBurst colors={[palette.primary, ...palette.petals]} />}
      <div
        ref={wrapRef}
        className="relative overflow-hidden border px-6 py-8 text-center"
        style={{ borderRadius: palette.radius.card, borderColor: alpha(palette.primary, 0.35), background: alpha("#ffffff", palette.isDark ? 0.04 : 0.7) }}
      >
        {children}
        <AnimatePresence>
          {!revealed && !reduce && (
            <motion.canvas
              key="foil"
              ref={canvasRef}
              aria-hidden
              className="absolute inset-0 h-full w-full cursor-grab touch-none active:cursor-grabbing"
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.6 }}
              onPointerDown={(e) => {
                drawing.current = true;
                last.current = null;
                e.currentTarget.setPointerCapture(e.pointerId);
                const p = local(e);
                scratch(p.x, p.y);
              }}
              onPointerMove={(e) => {
                if (!drawing.current) return;
                const p = local(e);
                scratch(p.x, p.y);
              }}
              onPointerUp={() => {
                drawing.current = false;
                last.current = null;
                if (clearedRatio() > CLEAR_THRESHOLD) setRevealed(true);
              }}
            />
          )}
        </AnimatePresence>
      </div>
      {!revealed && !reduce && (
        <button
          type="button"
          onClick={() => setRevealed(true)}
          className="mx-auto mt-3 block text-[11px] uppercase tracking-[0.25em] underline-offset-4 hover:underline"
          style={{ color: palette.inkMuted }}
        >
          Or tap here to reveal
        </button>
      )}
    </div>
  );
}
