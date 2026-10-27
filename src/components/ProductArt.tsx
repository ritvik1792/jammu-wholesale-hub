import type { Motif, Tone } from "@/lib/types";
import {
  Brush,
  Circle,
  CircleDot,
  Crown,
  Gem,
  Handbag,
  Palette,
  Ribbon,
  Scissors,
  Shirt,
  Sparkle,
  Wallet,
  type LucideIcon,
} from "lucide-react";

const TONES: Record<Tone, { from: string; to: string }> = {
  gold: { from: "#6d4c1d", to: "#e4c78a" },
  rose: { from: "#6e2434", to: "#f0c2c4" },
  plum: { from: "#3d2450", to: "#d7c4ea" },
  ink: { from: "#1d2733", to: "#b7c3d1" },
  saffron: { from: "#7a3b12", to: "#f3c892" },
  emerald: { from: "#16382f", to: "#b7dccb" },
  navy: { from: "#11223b", to: "#7f9dbf" },
};

const ICONS: Record<Motif, LucideIcon> = {
  payal: CircleDot,
  necklace: Gem,
  earrings: Sparkle,
  lipstick: Brush,
  makeup: Palette,
  clutch: Wallet,
  handbag: Handbag,
  hair: Scissors,
  clips: Sparkle,
  bangles: Circle,
  kada: Gem,
  rakhi: Ribbon,
  bridal: Crown,
  clothing: Shirt,
  shirt: Shirt,
};

export function ProductArt({
  tone,
  motif,
}: {
  tone: Tone;
  motif: Motif;
}) {
  const Icon = ICONS[motif];
  const colors = TONES[tone];
  return (
    <div
      className="relative h-full w-full"
      style={{
        background: `linear-gradient(150deg, ${colors.from} 0%, ${colors.to} 100%)`,
      }}
      aria-hidden
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(255,255,255,0.38),transparent_42%)]" />
      <div className="absolute -right-8 -top-10 h-36 w-36 rounded-full border border-white/30" />
      <div className="absolute -bottom-8 -left-8 h-28 w-28 rounded-full border border-white/25" />
      <Icon
        className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 text-white"
        strokeWidth={1.25}
      />
    </div>
  );
}
