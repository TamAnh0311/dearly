/**
 * LayoutThumbnail — a miniature, static rendering of a template's hero
 * layout (garden, arch, editorial, split, celestial, polaroid, curtain,
 * seal, daynight, stained) in its
 * colours, so gallery cards show what the invitation actually looks like.
 */

import Image from "next/image";
import { getInvitationStyle } from "./styles";
import { alpha, luminance, mix } from "./utils";

interface ThumbProps {
  slug: string;
  colors: { primary: string; secondary: string; accent: string };
  fonts: { display: string; body: string };
  photo: string;
  names?: [string, string];
}

export { LAYOUT_LABEL } from "./styles";

export default function LayoutThumbnail({ slug, colors, fonts, photo, names = ["Emma", "James"] }: ThumbProps) {
  const style = getInvitationStyle(slug);
  const { primary, secondary, accent } = colors;
  const dark = luminance(secondary) < 0.25;
  const ink = dark ? mix(secondary, "#ffffff", 0.88) : mix(secondary, "#1f1a17", 0.86);
  const display = `'${fonts.display}', serif`;
  const script = "'Great Vibes', cursive";
  const nameBlock = (size: string) => (
    <div className="text-center leading-none" style={{ fontFamily: display, color: ink }}>
      <p className={size}>{names[0]}</p>
      <p className="my-0.5 text-lg" style={{ fontFamily: script, color: primary }}>
        &amp;
      </p>
      <p className={size}>{names[1]}</p>
    </div>
  );

  switch (style.hero) {
    case "arch":
      return (
        <div className="relative flex h-full items-center justify-center" style={{ background: secondary }}>
          <div
            className="flex h-[82%] w-[46%] flex-col items-center justify-center border px-2"
            style={{ borderColor: primary, borderRadius: "999px 999px 0 0", background: alpha(primary, dark ? 0.12 : 0.06) }}
          >
            <p className="mb-2 text-[6px] uppercase tracking-[0.3em]" style={{ color: alpha(ink, 0.6) }}>
              The wedding of
            </p>
            {nameBlock(`text-base ${style.headingCase === "upper" ? "uppercase tracking-widest" : ""}`)}
          </div>
          {style.ornament === "deco" && (
            <svg viewBox="0 0 100 50" className="absolute top-[6%] w-[60%] opacity-40" aria-hidden>
              {Array.from({ length: 11 }, (_, i) => {
                const a = Math.PI + (i / 10) * Math.PI;
                return <line key={i} x1={50} y1={50} x2={50 + Math.cos(a) * 50} y2={50 + Math.sin(a) * 50} stroke={primary} strokeWidth={0.5} />;
              })}
            </svg>
          )}
        </div>
      );

    case "editorial":
      return (
        <div className="flex h-full flex-col justify-center px-5" style={{ background: secondary, fontFamily: display, color: ink }}>
          <div className="mb-2 h-px w-full" style={{ background: ink }} />
          <p className="text-4xl font-light leading-[0.9]">{names[0]}</p>
          <div className="flex items-center gap-2">
            <span className="text-2xl" style={{ fontFamily: script, color: primary }}>
              &amp;
            </span>
            <span className="h-px flex-1" style={{ background: primary }} />
          </div>
          <p className="text-right text-4xl font-light leading-[0.9]">{names[1]}</p>
          <div className="mt-3 border-y py-1 text-[7px] uppercase tracking-[0.4em]" style={{ borderColor: alpha(ink, 0.2) }}>
            Save the date · 15.06.2027 ·
          </div>
        </div>
      );

    case "split":
      return (
        <div className="grid h-full grid-cols-2" style={{ background: secondary }}>
          <div className="relative">
            <Image src={photo} alt="" fill sizes="160px" className="object-cover" />
          </div>
          <div className="flex flex-col justify-center px-3">
            <p className="mb-1 text-[6px] uppercase tracking-[0.3em]" style={{ color: alpha(ink, 0.6) }}>
              We&apos;re getting married
            </p>
            <div style={{ fontFamily: display, color: ink }} className="text-xl leading-none">
              <p>{names[0]}</p>
              <p className="text-base" style={{ fontFamily: script, color: primary }}>
                &amp;
              </p>
              <p>{names[1]}</p>
            </div>
            <div className="mt-2 border-l-2 pl-1.5 text-[7px]" style={{ borderColor: primary, color: alpha(ink, 0.7) }}>
              June 15, 2027
            </div>
          </div>
        </div>
      );

    case "celestial": {
      const sky = dark ? secondary : mix(primary, "#0b1030", 0.88);
      const star = mix(primary, "#ffffff", 0.55);
      const hasLanterns = style.ambient.includes("lanterns");
      return (
        <div className="relative flex h-full items-center justify-center overflow-hidden" style={{ background: hasLanterns ? `radial-gradient(ellipse at 50% 30%, ${mix(sky, "#2a1810", 0.35)}, ${sky} 55%)` : `radial-gradient(ellipse at 50% 30%, ${mix(sky, accent, 0.25)}, ${sky} 65%)` }}>
          {hasLanterns ? (
            <>
              {/* Mini lanterns for the thumbnail */}
              {Array.from({ length: 12 }, (_, i) => (
                <span key={i} className="absolute" style={{ left: `${8 + (i * 41) % 84}%`, top: `${10 + (i * 31) % 70}%` }}>
                  <svg width={6 + (i % 3) * 3} height={8 + (i % 3) * 4} viewBox="0 0 40 54">
                    <path d="M8 4 H32 L38 44 Q20 52 2 44 Z" fill={mix(primary, "#ffb347", 0.5)} />
                  </svg>
                </span>
              ))}
              {/* Warm horizon glow */}
              <div className="absolute inset-x-0 bottom-0 h-[35%]" style={{ background: `linear-gradient(0deg, ${alpha(mix(primary, "#ff8c00", 0.5), 0.2)}, transparent)` }} />
            </>
          ) : (
            <>
              {Array.from({ length: 30 }, (_, i) => (
                <span
                  key={i}
                  className="absolute rounded-full"
                  style={{ left: `${(i * 37) % 100}%`, top: `${(i * 53) % 100}%`, width: (i % 3) + 1, height: (i % 3) + 1, background: star, opacity: 0.4 + (i % 4) * 0.15 }}
                />
              ))}
              <span className="absolute right-[12%] top-[12%] h-8 w-8 rounded-full" style={{ boxShadow: `inset -7px 3px 0 0 ${star}` }} />
            </>
          )}
          <div className="relative text-center leading-none" style={{ fontFamily: display, color: "#f4f1ea", textShadow: `0 0 18px ${alpha(star, 0.5)}` }}>
            <p className="text-2xl">{names[0]}</p>
            <p className="my-0.5 text-xl" style={{ fontFamily: script, color: star }}>
              &amp;
            </p>
            <p className="text-2xl">{names[1]}</p>
          </div>
        </div>
      );
    }

    case "polaroid":
      return (
        <div className="relative flex h-full items-center justify-center overflow-hidden" style={{ background: secondary }}>
          {[
            { l: "6%", t: "10%", r: -10 },
            { l: "66%", t: "8%", r: 8 },
            { l: "62%", t: "58%", r: -6 },
          ].map((p, i) => (
            <div key={i} className="absolute w-[30%] bg-white p-1 pb-3 shadow-md" style={{ left: p.l, top: p.t, transform: `rotate(${p.r}deg)` }}>
              <div className="relative aspect-square w-full">
                <Image src={photo} alt="" fill sizes="80px" className="object-cover" style={{ objectPosition: `${i * 40}% 50%` }} />
              </div>
            </div>
          ))}
          <div className="relative -rotate-2 px-4 py-3 shadow" style={{ background: alpha(secondary, 0.92) }}>
            <p className="text-center text-sm" style={{ fontFamily: script, color: primary }}>
              We&apos;re getting married!
            </p>
            <p className="text-center text-lg leading-none" style={{ fontFamily: display, color: ink }}>
              {names[0]} &amp; {names[1]}
            </p>
          </div>
        </div>
      );

    case "curtain": {
      const ivy = style.curtain === "ivy";
      const drape = ivy ? mix("#8aa882", "#1e3a1e", 0.5) : mix(accent, "#3a0a12", 0.35);
      const panel = ivy
        ? `radial-gradient(ellipse 6px 4px at 30% 40%, ${mix(drape, "#ffffff", 0.25)} 60%, transparent 62%), radial-gradient(ellipse 5px 4px at 70% 70%, ${mix(drape, "#ffffff", 0.12)} 60%, transparent 62%), ${drape}`
        : `repeating-linear-gradient(90deg, ${mix(drape, "#000000", 0.4)} 0, ${drape} 6px, ${mix(drape, "#ffffff", 0.18)} 11px, ${drape} 16px, ${mix(drape, "#000000", 0.4)} 22px)`;
      return (
        <div className="relative flex h-full items-center justify-center overflow-hidden" style={{ background: `radial-gradient(ellipse at 50% 40%, ${alpha(dark ? primary : "#ffffff", dark ? 0.25 : 0.9)}, ${secondary} 70%)` }}>
          <div className="absolute inset-y-0 left-0 w-[24%]" style={{ background: panel, backgroundSize: ivy ? "16px 12px" : undefined, borderTopRightRadius: ivy ? 0 : "0 0 40% 0" }} />
          <div className="absolute inset-y-0 right-0 w-[24%]" style={{ background: panel, backgroundSize: ivy ? "16px 12px" : undefined }} />
          {!ivy && <div className="absolute inset-x-0 top-0 h-4" style={{ background: drape, borderBottom: `1px solid ${primary}` }} />}
          {nameBlock("text-2xl")}
        </div>
      );
    }

    case "seal": {
      const env = dark ? mix(secondary, "#ffffff", 0.14) : mix(secondary, accent, 0.35);
      return (
        <div className="relative flex h-full items-center justify-center" style={{ background: secondary }}>
          <div className="relative h-[58%] w-[68%]">
            <div className="absolute inset-0 rounded-sm shadow-md" style={{ background: env }} />
            <div className="absolute inset-x-[8%] -top-[38%] flex h-[80%] flex-col items-center justify-center rounded-sm shadow" style={{ background: mix(secondary, "#ffffff", 0.6), outline: `1px solid ${alpha(primary, 0.2)}`, outlineOffset: -4 }}>
              <p className="text-[6px] uppercase tracking-[0.3em]" style={{ color: alpha(ink, 0.6) }}>You are invited</p>
              <p className="text-base leading-tight" style={{ fontFamily: display, color: ink }}>
                {names[0]} <span style={{ fontFamily: script, color: primary }}>&amp;</span> {names[1]}
              </p>
            </div>
            <svg viewBox="0 0 145 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
              <path d="M0 100 L0 38 L72.5 72 L145 38 L145 100 Z" fill={mix(env, "#ffffff", 0.08)} />
            </svg>
            <span className="absolute left-1/2 top-[62%] h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: `radial-gradient(circle at 35% 30%, ${mix(primary, "#ffffff", 0.35)}, ${primary} 50%, ${mix(primary, "#000000", 0.35)})` }} />
          </div>
        </div>
      );
    }

    case "daynight": {
      const night = dark ? secondary : mix(accent, "#0b0e22", 0.82);
      const dusk = mix(primary, "#c56a8d", 0.45);
      return (
        <div className="relative flex h-full items-center justify-center overflow-hidden" style={{ background: `linear-gradient(180deg, ${night} 0%, ${mix(night, dusk, 0.5)} 55%, ${dusk} 100%)` }}>
          {Array.from({ length: 22 }, (_, i) => (
            <span key={i} className="absolute rounded-full bg-white" style={{ left: `${(i * 41) % 100}%`, top: `${(i * 29) % 55}%`, width: (i % 2) + 1, height: (i % 2) + 1, opacity: 0.7 }} />
          ))}
          <span className="absolute right-[14%] top-[12%] h-6 w-6 rounded-full" style={{ background: "#f4efe2", boxShadow: "inset -4px 2px 0 0 #d9d2bd" }} />
          <span className="absolute bottom-[14%] left-[18%] h-8 w-8 rounded-full" style={{ background: "radial-gradient(circle, #fff6d6, #ff9e5e)", boxShadow: "0 0 24px 8px rgba(255,170,90,0.5)" }} />
          <svg viewBox="0 0 400 60" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-10 w-full" aria-hidden>
            <path d="M0 40 C 80 10 160 50 240 30 C 310 12 360 40 400 26 L400 60 L0 60 Z" fill={mix(night, "#000000", 0.35)} />
          </svg>
          <div className="relative text-center leading-none" style={{ fontFamily: display, color: "#fffaf3" }}>
            <p className="text-2xl">{names[0]}</p>
            <p className="text-lg" style={{ fontFamily: script, color: mix(primary, "#ffffff", 0.3) }}>&amp;</p>
            <p className="text-2xl">{names[1]}</p>
          </div>
        </div>
      );
    }

    case "stained": {
      const jewels = [primary, accent, mix(primary, "#d4a017", 0.5), mix(accent, "#2e8b57", 0.45), mix(primary, "#7b3fa0", 0.5), mix(primary, "#ffffff", 0.35)];
      return (
        <div className="relative flex h-full items-center justify-center" style={{ background: `radial-gradient(circle at 50% 45%, ${alpha("#fff4d6", dark ? 0.15 : 0.7)}, ${secondary} 70%)` }}>
          <svg viewBox="-110 -110 220 220" className="h-[88%]" aria-hidden>
            <circle r={106} fill={mix(primary, "#ffffff", dark ? 0.55 : 0.78)} stroke="#2b2622" strokeWidth={5} />
            {Array.from({ length: 12 }, (_, i) => (
              <path key={i} transform={`rotate(${i * 30})`} d="M0 -36 C 19 -56, 20 -86, 0 -100 C -20 -86, -19 -56, 0 -36 Z" fill={jewels[i % jewels.length]} fillOpacity={0.88} stroke="#2b2622" strokeWidth={3} />
            ))}
            <circle r={46} fill={mix(secondary, "#ffffff", dark ? 0.06 : 0.4)} stroke="#2b2622" strokeWidth={3} />
          </svg>
          <div className="absolute text-center leading-none" style={{ fontFamily: display, color: ink }}>
            <p className="text-sm">{names[0]}</p>
            <p className="text-xs" style={{ fontFamily: script, color: primary }}>&amp;</p>
            <p className="text-sm">{names[1]}</p>
          </div>
        </div>
      );
    }

    case "doors": {
      const lacquer = dark ? mix(secondary, "#a3161c", 0.45) : mix(accent, "#9b1b1f", 0.7);
      return (
        <div className="relative flex h-full items-center justify-center overflow-hidden" style={{ background: `radial-gradient(ellipse at 50% 45%, ${alpha(primary, 0.3)}, ${secondary} 70%)` }}>
          {["left-[6%]", "right-[6%]"].map((pos) => (
            <span key={pos} className={`absolute top-0 ${pos} h-8 w-5 rounded-full`} style={{ background: lacquer, boxShadow: `0 0 12px ${alpha(lacquer, 0.7)}`, marginTop: 10 }} />
          ))}
          <div className="absolute inset-y-[8%] left-[4%] w-[22%]" style={{ background: lacquer, boxShadow: `inset 0 0 0 2px ${primary}` }} />
          <div className="absolute inset-y-[8%] right-[4%] w-[22%]" style={{ background: lacquer, boxShadow: `inset 0 0 0 2px ${primary}` }} />
          <div className="relative text-center">
            <p className="text-2xl leading-none" style={{ color: primary, fontFamily: "'Ma Shan Zheng', serif" }}>
              囍
            </p>
            {nameBlock("text-xl")}
          </div>
        </div>
      );
    }

    case "poster":
      return (
        <div className="relative h-full p-1.5" style={{ background: secondary }}>
          <div className="relative h-full overflow-hidden rounded-sm">
            <Image src={photo} alt="" fill sizes="240px" className="object-cover" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.35), transparent 35%, transparent 55%, rgba(0,0,0,0.65))" }} />
            <p className="absolute inset-x-0 top-2 text-center text-lg text-white" style={{ fontFamily: script }}>
              Save the date
            </p>
            <p className="absolute inset-x-0 bottom-2 text-center text-xl leading-none text-white" style={{ fontFamily: display }}>
              {names[0]} &amp; {names[1]}
            </p>
          </div>
        </div>
      );

    case "enso": {
      const sumi = dark ? mix(primary, "#ffffff", 0.2) : mix(ink, "#000000", 0.2);
      return (
        <div className="relative flex h-full items-center justify-center" style={{ background: secondary }}>
          <svg viewBox="0 0 290 290" className="absolute h-[88%]" aria-hidden>
            <path d="M 236 92 C 268 150, 250 236, 176 262 C 100 288, 30 238, 26 162 C 22 86, 84 30, 158 30 C 196 30, 222 44, 238 62" fill="none" stroke={sumi} strokeWidth={14} strokeLinecap="round" />
          </svg>
          {nameBlock("text-lg")}
          <span className="absolute bottom-[16%] right-[24%] h-5 w-5 rounded-sm" style={{ background: dark ? mix(accent, "#c0392b", 0.5) : primary }} />
          {style.ornament === "wave" && (
            <div className="absolute inset-x-0 bottom-0 h-6" style={{ background: `repeating-radial-gradient(circle at 10px 24px, transparent 0 4px, ${alpha(primary, 0.4)} 4px 5px)`, backgroundSize: "20px 12px" }} />
          )}
        </div>
      );
    }

    case "shoji": {
      const paper = dark ? mix(secondary, "#f4ede0", 0.82) : mix(secondary, "#ffffff", 0.75);
      const wood = dark ? mix(secondary, "#000000", 0.2) : mix(ink, primary, 0.25);
      const kumiko = `repeating-linear-gradient(0deg, transparent 0 14px, ${wood} 14px 15px), repeating-linear-gradient(90deg, transparent 0 11px, ${wood} 11px 12px), ${paper}`;
      return (
        <div className="relative flex h-full items-center justify-center overflow-hidden" style={{ background: secondary }}>
          <span className="absolute left-[30%] top-[14%] h-9 w-9 rounded-full" style={{ background: alpha(primary, 0.3) }} />
          {[[70, 20], [80, 34], [62, 30], [88, 18]].map(([x, y], i) => (
            <span key={i} className="absolute h-2.5 w-2.5 rounded-full" style={{ left: `${x}%`, top: `${y}%`, background: mix(primary, "#ffffff", 0.35) }} />
          ))}
          <div className="absolute inset-y-0 left-0 w-[16%]" style={{ background: kumiko, boxShadow: `inset 0 0 0 3px ${wood}` }} />
          <div className="absolute inset-y-0 right-0 w-[16%]" style={{ background: kumiko, boxShadow: `inset 0 0 0 3px ${wood}` }} />
          {nameBlock("text-2xl")}
        </div>
      );
    }

    case "bojagi": {
      const patch = [primary, accent, mix(primary, "#f2c94c", 0.55), mix(accent, "#ffffff", 0.45)];
      return (
        <div className="relative flex h-full items-center justify-center" style={{ background: secondary }}>
          <div className="relative aspect-square h-[46%]">
            {/* Unfolded flaps around the card */}
            {[
              { cls: "bottom-full left-0 h-1/2 w-full", clip: "polygon(0 100%, 100% 100%, 50% 0)" },
              { cls: "left-full top-0 h-full w-1/2", clip: "polygon(0 0, 0 100%, 100% 50%)" },
              { cls: "left-0 top-full h-1/2 w-full", clip: "polygon(0 0, 100% 0, 50% 100%)" },
              { cls: "right-full top-0 h-full w-1/2", clip: "polygon(100% 0, 100% 100%, 0 50%)" },
            ].map((f, i) => (
              <div key={i} className={`absolute ${f.cls}`} style={{ clipPath: f.clip, background: patch[i] }} />
            ))}
            <div className="absolute inset-0 flex items-center justify-center rounded-sm" style={{ background: mix(secondary, "#ffffff", dark ? 0.08 : 0.6), border: `1px solid ${alpha(primary, 0.3)}` }}>
              {nameBlock("text-base")}
            </div>
          </div>
        </div>
      );
    }

    default: {
      // garden
      const petals = [mix(primary, "#ffffff", 0.35), mix(accent, "#ffffff", 0.45), mix(primary, "#f6c6cf", 0.5)];
      return (
        <div className="relative flex h-full items-center justify-center overflow-hidden" style={{ background: `radial-gradient(ellipse at 50% 40%, ${alpha(primary, 0.14)}, ${secondary} 70%)` }}>
          {[
            { x: "4%", h: 70, c: petals[0] },
            { x: "16%", h: 48, c: petals[1] },
            { x: "78%", h: 52, c: petals[2] },
            { x: "88%", h: 74, c: petals[0] },
          ].map((f, i) => (
            <svg key={i} viewBox="0 0 20 80" className="absolute bottom-0" style={{ left: f.x, height: f.h }} aria-hidden>
              <path d="M10 80 C 8 55, 12 35, 10 18" stroke="#8aa882" strokeWidth={1.4} fill="none" />
              <path d="M10 50 C 16 44, 19 46, 20 40 C 16 50, 13 52, 10 50 Z" fill="#8aa882" />
              {[0, 72, 144, 216, 288].map((a) => (
                <ellipse key={a} cx={10} cy={12} rx={3.2} ry={6} fill={f.c} transform={`rotate(${a} 10 18)`} />
              ))}
              <circle cx={10} cy={18} r={2.2} fill="#f3d27a" />
            </svg>
          ))}
          {nameBlock("text-2xl")}
        </div>
      );
    }
  }
}
