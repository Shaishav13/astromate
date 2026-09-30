import React from 'react';
import { ZodiacSign } from '@astromate/shared';

interface ConstellationProps {
  className?: string;
  size?: number;
}

export function AriesConstellation({ className = 'text-amber-400', size = 48 }: ConstellationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Aries constellation lines: Hamal, Sheratan, Mesarthim */}
      <path d="M 22 72 L 52 46 L 78 30 L 88 38" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.7" strokeDasharray="none" />
      {/* Stars */}
      <circle cx="22" cy="72" r="3" fill="currentColor" />
      <circle cx="52" cy="46" r="4.5" fill="currentColor" filter="drop-shadow(0 0 4px currentColor)" />
      <circle cx="78" cy="30" r="3" fill="currentColor" />
      <circle cx="88" cy="38" r="2.2" fill="currentColor" />
      {/* Background ambient stars */}
      <circle cx="36" cy="30" r="1.2" fill="currentColor" opacity="0.3" />
      <circle cx="68" cy="65" r="1" fill="currentColor" opacity="0.25" />
    </svg>
  );
}

export function TaurusConstellation({ className = 'text-emerald-400', size = 48 }: ConstellationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Aldebaran, Elnath, Pleiades fork */}
      <path d="M 18 32 L 48 58 L 78 50 L 86 28 M 48 58 L 42 78 M 78 50 L 84 72" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.7" />
      {/* Aldebaran (Alpha Tauri - red giant) */}
      <circle cx="48" cy="58" r="5" fill="currentColor" filter="drop-shadow(0 0 6px currentColor)" />
      <circle cx="18" cy="32" r="3.2" fill="currentColor" />
      <circle cx="78" cy="50" r="3.5" fill="currentColor" />
      <circle cx="86" cy="28" r="2.8" fill="currentColor" />
      <circle cx="42" cy="78" r="2.5" fill="currentColor" />
      <circle cx="84" cy="72" r="2.5" fill="currentColor" />
      {/* Pleiades cluster indicator */}
      <circle cx="28" cy="24" r="1.2" fill="currentColor" opacity="0.6" />
      <circle cx="32" cy="22" r="1" fill="currentColor" opacity="0.5" />
      <circle cx="30" cy="27" r="1.1" fill="currentColor" opacity="0.5" />
    </svg>
  );
}

export function GeminiConstellation({ className = 'text-yellow-400', size = 48 }: ConstellationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Twin pillars: Castor and Pollux */}
      <path d="M 32 24 L 30 52 L 24 80 M 68 28 L 66 54 L 72 82 M 30 52 L 66 54" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.7" />
      {/* Castor */}
      <circle cx="32" cy="24" r="4.2" fill="currentColor" filter="drop-shadow(0 0 5px currentColor)" />
      {/* Pollux */}
      <circle cx="68" cy="28" r="4.5" fill="currentColor" filter="drop-shadow(0 0 5px currentColor)" />
      <circle cx="30" cy="52" r="3" fill="currentColor" />
      <circle cx="66" cy="54" r="3" fill="currentColor" />
      <circle cx="24" cy="80" r="2.8" fill="currentColor" />
      <circle cx="72" cy="82" r="2.8" fill="currentColor" />
    </svg>
  );
}

export function CancerConstellation({ className = 'text-sky-400', size = 48 }: ConstellationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Inverted Y-shape */}
      <path d="M 28 30 L 50 50 L 74 36 M 50 50 L 52 78 M 52 78 L 38 88" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.7" />
      <circle cx="50" cy="50" r="4.5" fill="currentColor" filter="drop-shadow(0 0 5px currentColor)" />
      <circle cx="28" cy="30" r="3" fill="currentColor" />
      <circle cx="74" cy="36" r="3.2" fill="currentColor" />
      <circle cx="52" cy="78" r="3" fill="currentColor" />
      <circle cx="38" cy="88" r="2.5" fill="currentColor" />
      {/* Praesepe cluster */}
      <circle cx="48" cy="44" r="1.2" fill="currentColor" opacity="0.4" />
      <circle cx="54" cy="46" r="1.1" fill="currentColor" opacity="0.4" />
    </svg>
  );
}

export function LeoConstellation({ className = 'text-amber-500', size = 48 }: ConstellationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Sickle / question mark + triangle body to Regulus */}
      <path d="M 78 28 L 68 20 L 54 26 L 56 42 L 44 58 L 22 56 L 18 76 L 46 72 L 74 64 L 78 28" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.7" />
      {/* Regulus */}
      <circle cx="74" cy="64" r="5" fill="currentColor" filter="drop-shadow(0 0 6px currentColor)" />
      {/* Denebola */}
      <circle cx="18" cy="76" r="3.8" fill="currentColor" />
      {/* Algieba */}
      <circle cx="56" cy="42" r="3.4" fill="currentColor" />
      <circle cx="78" cy="28" r="3" fill="currentColor" />
      <circle cx="68" cy="20" r="2.5" fill="currentColor" />
      <circle cx="54" cy="26" r="2.6" fill="currentColor" />
      <circle cx="44" cy="58" r="2.8" fill="currentColor" />
      <circle cx="22" cy="56" r="2.5" fill="currentColor" />
      <circle cx="46" cy="72" r="2.6" fill="currentColor" />
    </svg>
  );
}

export function VirgoConstellation({ className = 'text-teal-400', size = 48 }: ConstellationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Spica + branched body */}
      <path d="M 24 32 L 46 26 L 68 40 L 80 62 M 46 26 L 44 54 L 32 76 M 44 54 L 70 70" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.7" />
      {/* Spica */}
      <circle cx="32" cy="76" r="5" fill="currentColor" filter="drop-shadow(0 0 6px currentColor)" />
      {/* Zavijava, Porrima */}
      <circle cx="24" cy="32" r="3" fill="currentColor" />
      <circle cx="46" cy="26" r="3.2" fill="currentColor" />
      <circle cx="68" cy="40" r="3" fill="currentColor" />
      <circle cx="80" cy="62" r="2.8" fill="currentColor" />
      <circle cx="44" cy="54" r="3.5" fill="currentColor" />
      <circle cx="70" cy="70" r="3" fill="currentColor" />
    </svg>
  );
}

export function LibraConstellation({ className = 'text-rose-400', size = 48 }: ConstellationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Balance scales quad */}
      <path d="M 50 24 L 26 52 L 34 78 M 50 24 L 74 50 L 68 76 M 26 52 L 74 50" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.7" />
      {/* Zubeneschamali */}
      <circle cx="50" cy="24" r="4.2" fill="currentColor" filter="drop-shadow(0 0 5px currentColor)" />
      {/* Zubenelgenubi */}
      <circle cx="26" cy="52" r="4.2" fill="currentColor" filter="drop-shadow(0 0 5px currentColor)" />
      <circle cx="74" cy="50" r="3.5" fill="currentColor" />
      <circle cx="34" cy="78" r="3" fill="currentColor" />
      <circle cx="68" cy="76" r="3" fill="currentColor" />
    </svg>
  );
}

export function ScorpioConstellation({ className = 'text-purple-400', size = 48 }: ConstellationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Claws, Antares heart, curved tail to Shaula stinger */}
      <path d="M 22 26 L 36 34 L 52 44 L 54 62 L 66 74 L 78 72 L 84 58 L 80 50" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.7" />
      <path d="M 36 34 L 38 20 M 36 34 L 24 46" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.6" />
      {/* Antares (The Heart) */}
      <circle cx="52" cy="44" r="5" fill="currentColor" filter="drop-shadow(0 0 6px currentColor)" />
      {/* Shaula (The Stinger) */}
      <circle cx="80" cy="50" r="4" fill="currentColor" filter="drop-shadow(0 0 4px currentColor)" />
      <circle cx="22" cy="26" r="3" fill="currentColor" />
      <circle cx="38" cy="20" r="2.8" fill="currentColor" />
      <circle cx="24" cy="46" r="2.8" fill="currentColor" />
      <circle cx="36" cy="34" r="3.4" fill="currentColor" />
      <circle cx="54" cy="62" r="3" fill="currentColor" />
      <circle cx="66" cy="74" r="3.2" fill="currentColor" />
      <circle cx="78" cy="72" r="3" fill="currentColor" />
      <circle cx="84" cy="58" r="2.8" fill="currentColor" />
    </svg>
  );
}

export function SagittariusConstellation({ className = 'text-cyan-400', size = 48 }: ConstellationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Teapot asterism */}
      <path d="M 28 42 L 48 32 L 68 44 L 62 70 L 36 68 L 28 42 M 48 32 L 62 70 M 68 44 L 84 36 L 82 56 L 62 70 M 28 42 L 16 54" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.7" />
      {/* Kaus Australis */}
      <circle cx="62" cy="70" r="4.6" fill="currentColor" filter="drop-shadow(0 0 5px currentColor)" />
      {/* Nunki */}
      <circle cx="84" cy="36" r="4" fill="currentColor" filter="drop-shadow(0 0 5px currentColor)" />
      <circle cx="28" cy="42" r="3" fill="currentColor" />
      <circle cx="48" cy="32" r="3.5" fill="currentColor" />
      <circle cx="68" cy="44" r="3.2" fill="currentColor" />
      <circle cx="36" cy="68" r="3" fill="currentColor" />
      <circle cx="82" cy="56" r="2.8" fill="currentColor" />
      <circle cx="16" cy="54" r="2.6" fill="currentColor" />
    </svg>
  );
}

export function CapricornConstellation({ className = 'text-indigo-400', size = 48 }: ConstellationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Sea-goat triangle loop */}
      <path d="M 22 36 L 48 32 L 78 44 L 72 70 L 46 76 L 22 36 M 48 32 L 46 76" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.7" />
      {/* Deneb Algedi */}
      <circle cx="78" cy="44" r="4.4" fill="currentColor" filter="drop-shadow(0 0 5px currentColor)" />
      {/* Algedi */}
      <circle cx="22" cy="36" r="4" fill="currentColor" filter="drop-shadow(0 0 5px currentColor)" />
      <circle cx="48" cy="32" r="3.2" fill="currentColor" />
      <circle cx="72" cy="70" r="3" fill="currentColor" />
      <circle cx="46" cy="76" r="3" fill="currentColor" />
    </svg>
  );
}

export function AquariusConstellation({ className = 'text-blue-400', size = 48 }: ConstellationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Water flow waves */}
      <path d="M 20 38 L 38 28 L 56 36 L 76 26 M 22 56 L 40 46 L 58 54 L 80 44 M 26 74 L 44 64 L 62 72 L 82 62" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.7" />
      {/* Sadalsuud */}
      <circle cx="38" cy="28" r="4.2" fill="currentColor" filter="drop-shadow(0 0 5px currentColor)" />
      {/* Sadalmelik */}
      <circle cx="56" cy="36" r="4" fill="currentColor" filter="drop-shadow(0 0 5px currentColor)" />
      <circle cx="20" cy="38" r="2.8" fill="currentColor" />
      <circle cx="76" cy="26" r="3" fill="currentColor" />
      <circle cx="40" cy="46" r="3" fill="currentColor" />
      <circle cx="58" cy="54" r="2.8" fill="currentColor" />
      <circle cx="44" cy="64" r="2.5" fill="currentColor" />
      <circle cx="62" cy="72" r="2.5" fill="currentColor" />
    </svg>
  );
}

export function PiscesConstellation({ className = 'text-violet-400', size = 48 }: ConstellationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Two fish tied by a cord at Alrescha */}
      <path d="M 22 28 L 32 38 L 44 54 L 74 74 M 74 74 L 78 52 L 82 34 M 74 74 L 56 80 L 44 78" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.7" />
      {/* Alrescha knot */}
      <circle cx="74" cy="74" r="4.6" fill="currentColor" filter="drop-shadow(0 0 6px currentColor)" />
      <circle cx="22" cy="28" r="3.2" fill="currentColor" />
      <circle cx="32" cy="38" r="3" fill="currentColor" />
      <circle cx="44" cy="54" r="3" fill="currentColor" />
      <circle cx="78" cy="52" r="3" fill="currentColor" />
      <circle cx="82" cy="34" r="3.4" fill="currentColor" />
      <circle cx="56" cy="80" r="2.6" fill="currentColor" />
      <circle cx="44" cy="78" r="2.8" fill="currentColor" />
    </svg>
  );
}

export const CONSTELLATION_MAP: Record<ZodiacSign, React.ComponentType<ConstellationProps>> = {
  aries: AriesConstellation,
  taurus: TaurusConstellation,
  gemini: GeminiConstellation,
  cancer: CancerConstellation,
  leo: LeoConstellation,
  virgo: VirgoConstellation,
  libra: LibraConstellation,
  scorpio: ScorpioConstellation,
  sagittarius: SagittariusConstellation,
  capricorn: CapricornConstellation,
  aquarius: AquariusConstellation,
  pisces: PiscesConstellation,
};

// Geometric Astronomical Vector Glyph (Mathematical symbols, NO emojis)
export function ZodiacSigil({ sign, className = 'text-white', size = 24 }: { sign: ZodiacSign; className?: string; size?: number }) {
  switch (sign) {
    case 'aries':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M12 21V9" />
          <path d="M12 9C9 9 6 6 6 3" />
          <path d="M12 9C15 9 18 6 18 3" />
        </svg>
      );
    case 'taurus':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <circle cx="12" cy="14" r="6" />
          <path d="M6 5C6 9 18 9 18 5" />
        </svg>
      );
    case 'gemini':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M4 4C10 7 14 7 20 4" />
          <path d="M4 20C10 17 14 17 20 20" />
          <line x1="8" y1="5.5" x2="8" y2="18.5" />
          <line x1="16" y1="5.5" x2="16" y2="18.5" />
        </svg>
      );
    case 'cancer':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <circle cx="7" cy="9" r="3" />
          <circle cx="17" cy="15" r="3" />
          <path d="M10 9C14 9 18 6 18 3" />
          <path d="M14 15C10 15 6 18 6 21" />
        </svg>
      );
    case 'leo':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <circle cx="7" cy="15" r="3" />
          <path d="M10 15C10 8 16 5 18 9C19 12 18 19 21 19" />
        </svg>
      );
    case 'virgo':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M4 4V17C4 18.5 5 19 6 19C7 19 8 18 8 16V4" />
          <path d="M8 8V17C8 18.5 9 19 10 19C11 19 12 18 12 16V4" />
          <path d="M12 8V17C12 18.5 13 19 14 19C16 19 18 17 18 13" />
          <path d="M15 14L20 20" />
        </svg>
      );
    case 'libra':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <line x1="4" y1="19" x2="20" y2="19" />
          <path d="M4 14H8C8.5 10 15.5 10 16 14H20" />
        </svg>
      );
    case 'scorpio':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M4 4V16C4 17.5 5 18 6 18C7 18 8 17 8 15V4" />
          <path d="M8 8V16C8 17.5 9 18 10 18C11 18 12 17 12 15V4" />
          <path d="M12 8V16C12 18 14 19 17 19H19" />
          <path d="M17 17L19 19L17 21" />
        </svg>
      );
    case 'sagittarius':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <line x1="5" y1="19" x2="19" y2="5" />
          <path d="M13 5H19V11" />
          <line x1="8" y1="16" x2="14" y2="10" />
        </svg>
      );
    case 'capricorn':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M5 5V15C5 18 8 18 9 15V9" />
          <path d="M9 13C12 10 15 10 16 13C17 16 15 19 12 19" />
          <circle cx="12" cy="19" r="1.5" />
        </svg>
      );
    case 'aquarius':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M3 9L6 6L9 9L12 6L15 9L18 6L21 9" />
          <path d="M3 15L6 12L9 15L12 12L15 15L18 12L21 15" />
        </svg>
      );
    case 'pisces':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M5 4C8 9 8 15 5 20" />
          <path d="M19 4C16 9 16 15 19 20" />
          <line x1="4" y1="12" x2="20" y2="12" />
        </svg>
      );
    default:
      return null;
  }
}
