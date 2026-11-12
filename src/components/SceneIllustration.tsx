import { useId, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * Generated flat illustrations used wherever a genuine BVF photo is not available.
 * They show places, objects and documents only (never people), so they cannot be mistaken for real students or staff.
 */
export type SceneName =
  | 'campus'
  | 'city'
  | 'journey'
  | 'study'
  | 'documents'
  | 'home'
  | 'language'
  | 'finance'
  | 'graduation'
  | 'support';

export const sceneNames: SceneName[] = ['campus', 'city', 'journey', 'study', 'documents', 'home', 'language', 'finance', 'graduation', 'support'];

const NAVY = '#132033';
const NAVY_2 = '#1e3a5f';
const GOLD = '#f2c94c';
const GOLD_DEEP = '#d4a017';
const RED = '#d22b2b';
const CREAM = '#fff7e6';
const WHITE = '#ffffff';
const GREEN = '#15803d';
const SAFFRON = '#f59e0b';

const keywordScenes: Array<[RegExp, SceneName]> = [
  [/loan|fund|financ|account|bank|money|price|pay|cost|fee|budget|resource|shop|store|bundle/i, 'finance'],
  [/visa|document|aps|passport|checklist|insurance|legal|policy|sop|cv|lor|application/i, 'documents'],
  [/hous|accommodation|home|room|flat|wg|settle|arriv/i, 'home'],
  // "german(?!y)" so that "Germany" alone does not count as a language topic.
  // English and admission tests get a study desk, not the German-language scene.
  [/ielts|toefl|\bgre\b|gmat|dmat|test|exam/i, 'study'],
  [/german(?!y)|language|a1|a2|b1|b2|class|course/i, 'language'],
  [/flight|travel|journey|fly|airport|india to|abroad|visit/i, 'journey'],
  [/team|mentor|support|people|community|counsel|expert|contact|whatsapp|talk|consult/i, 'support'],
  [/success|admit|graduat|achiev|story|result|outcome/i, 'graduation'],
  [/blog|guide|study|learn|read|tool|webinar|plan/i, 'study'],
  [/city|berlin|munich|germany|country/i, 'city'],
  [/universit|campus|bachelor|master|ms\b|mba|engineering|program/i, 'campus'],
];

/** Picks a scene that matches the text, or a stable one based on it. */
export function sceneFor(text = ''): SceneName {
  for (const [pattern, scene] of keywordScenes) {
    if (pattern.test(text)) return scene;
  }
  let hash = 0;
  for (const char of text) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return sceneNames[hash % sceneNames.length];
}

function Sky({ id, top = '#dbeafe', bottom = '#fef3c7' }: { id: string; top?: string; bottom?: string }) {
  return (
    <>
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={top} />
          <stop offset="1" stopColor={bottom} />
        </linearGradient>
      </defs>
      <rect width="480" height="300" fill={`url(#${id}-sky)`} />
    </>
  );
}

const Cloud = ({ x, y, s = 1 }: { x: number; y: number; s?: number }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill={WHITE} opacity="0.9">
    <ellipse cx="0" cy="0" rx="26" ry="12" />
    <ellipse cx="20" cy="-8" rx="18" ry="12" />
    <ellipse cx="-18" cy="-4" rx="14" ry="9" />
  </g>
);

const Tree = ({ x, y, s = 1 }: { x: number; y: number; s?: number }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x="-3" y="0" width="6" height="22" fill="#7c4a1e" />
    <circle cx="0" cy="-6" r="18" fill={GREEN} />
    <circle cx="-9" cy="2" r="12" fill="#166534" />
    <circle cx="10" cy="0" r="12" fill="#22a05a" />
  </g>
);

const scenes: Record<SceneName, (id: string) => ReactNode> = {
  campus: (id) => (
    <>
      <Sky id={id} />
      <circle cx="400" cy="62" r="26" fill={GOLD} opacity="0.9" />
      <Cloud x={90} y={60} />
      <Cloud x={300} y={44} s={0.8} />
      <path d="M0 230 Q120 200 240 220 T480 210 V300 H0Z" fill="#bbf7d0" />
      <rect x="140" y="120" width="200" height="110" fill={CREAM} stroke={NAVY} strokeWidth="3" />
      <polygon points="130,122 240,70 350,122" fill={NAVY} />
      <polygon points="160,116 240,80 320,116" fill={NAVY_2} />
      <circle cx="240" cy="102" r="9" fill={GOLD} />
      {[160, 192, 224, 256, 288, 320].map((x) => (
        <rect key={x} x={x - 6} y="132" width="12" height="88" fill={WHITE} stroke={NAVY} strokeWidth="2" />
      ))}
      <rect x="225" y="186" width="30" height="44" rx="14" fill={NAVY} />
      <rect x="126" y="226" width="228" height="10" fill={NAVY} />
      <line x1="240" y1="70" x2="240" y2="40" stroke={NAVY} strokeWidth="3" />
      <rect x="240" y="40" width="30" height="6" fill="#1f2937" />
      <rect x="240" y="46" width="30" height="6" fill={RED} />
      <rect x="240" y="52" width="30" height="6" fill="#ffce00" />
      <path d="M240 236 L220 300 H260Z" fill="#fde68a" />
      <Tree x={80} y={210} />
      <Tree x={400} y={206} s={1.1} />
      <Tree x={110} y={222} s={0.7} />
    </>
  ),
  city: (id) => (
    <>
      <Sky id={id} top="#bfdbfe" bottom="#fde68a" />
      <circle cx="90" cy="70" r="24" fill={GOLD} />
      <Cloud x={330} y={60} />
      <g fill="#94a3b8" opacity="0.7">
        <rect x="20" y="150" width="50" height="120" />
        <rect x="380" y="140" width="60" height="130" />
        <rect x="300" y="170" width="40" height="100" />
      </g>
      <line x1="350" y1="40" x2="350" y2="270" stroke={NAVY_2} strokeWidth="6" />
      <circle cx="350" cy="112" r="16" fill={NAVY_2} />
      <rect x="342" y="128" width="16" height="10" fill={NAVY_2} />
      <line x1="350" y1="20" x2="350" y2="40" stroke={RED} strokeWidth="3" />
      <g fill={NAVY}>
        <rect x="120" y="160" width="190" height="16" />
        <rect x="128" y="150" width="174" height="12" />
        {[130, 162, 194, 226, 258, 290].map((x) => (
          <rect key={x} x={x} y="176" width="12" height="94" />
        ))}
        <rect x="200" y="132" width="30" height="20" />
        <polygon points="198,132 215,118 232,132" />
      </g>
      <rect x="0" y="270" width="480" height="30" fill={NAVY_2} />
      <g fill={GOLD} opacity="0.85">
        {[30, 48, 392, 410, 428, 310, 324].map((x, index) => (
          <rect key={x} x={x} y={170 + (index % 3) * 26} width="8" height="10" />
        ))}
      </g>
    </>
  ),
  journey: (id) => (
    <>
      <Sky id={id} top="#e0f2fe" bottom="#fff7e6" />
      <Cloud x={120} y={80} s={1.2} />
      <Cloud x={360} y={200} />
      <Cloud x={260} y={60} s={0.7} />
      <path d="M70 230 C160 120 300 120 410 90" fill="none" stroke={NAVY} strokeWidth="3" strokeDasharray="8 8" />
      <g transform="translate(70 230)">
        <path d="M0 0 C-14 -18 -14 -34 0 -40 C14 -34 14 -18 0 0Z" fill={SAFFRON} />
        <circle cx="0" cy="-26" r="6" fill={WHITE} />
        <text x="0" y="22" textAnchor="middle" fontSize="16" fontWeight="700" fill={NAVY}>India</text>
      </g>
      <g transform="translate(410 90)">
        <path d="M0 0 C-14 -18 -14 -34 0 -40 C14 -34 14 -18 0 0Z" fill={RED} />
        <circle cx="0" cy="-26" r="6" fill={WHITE} />
        <text x="0" y="22" textAnchor="middle" fontSize="16" fontWeight="700" fill={NAVY}>Germany</text>
      </g>
      <g transform="translate(250 128) rotate(-18)">
        <ellipse cx="0" cy="0" rx="46" ry="9" fill={WHITE} stroke={NAVY} strokeWidth="2.5" />
        <polygon points="-6,-4 -26,-34 -14,-34 14,-4" fill={NAVY_2} />
        <polygon points="-6,4 -26,34 -14,34 14,4" fill={NAVY_2} />
        <polygon points="-40,-3 -50,-18 -42,-18 -32,-3" fill={NAVY_2} />
        <circle cx="30" cy="-1" r="3" fill={NAVY} />
        <circle cx="18" cy="-1" r="3" fill={NAVY} />
        <circle cx="6" cy="-1" r="3" fill={NAVY} />
      </g>
    </>
  ),
  study: (id) => (
    <>
      <Sky id={id} top="#fef3c7" bottom="#fde68a" />
      <rect x="0" y="210" width="480" height="90" fill="#b45309" />
      <rect x="0" y="206" width="480" height="8" fill="#92400e" />
      <rect x="150" y="104" width="170" height="104" rx="8" fill={NAVY} />
      <rect x="160" y="114" width="150" height="84" rx="4" fill="#e0f2fe" />
      <rect x="172" y="128" width="90" height="8" rx="4" fill={NAVY_2} />
      <rect x="172" y="146" width="120" height="6" rx="3" fill="#94a3b8" />
      <rect x="172" y="160" width="104" height="6" rx="3" fill="#94a3b8" />
      <rect x="172" y="174" width="70" height="12" rx="6" fill={GOLD} />
      <rect x="130" y="206" width="210" height="10" rx="4" fill="#334155" />
      <g transform="translate(360 170)">
        <rect x="0" y="0" width="70" height="14" fill={RED} />
        <rect x="6" y="-14" width="62" height="14" fill={NAVY_2} />
        <rect x="-2" y="-28" width="66" height="14" fill={GOLD_DEEP} />
      </g>
      <g transform="translate(60 120)">
        <line x1="20" y1="0" x2="20" y2="86" stroke={NAVY} strokeWidth="5" />
        <polygon points="0,0 40,0 30,-28 10,-28" fill={GOLD} />
        <ellipse cx="20" cy="88" rx="22" ry="6" fill={NAVY} />
      </g>
      <g transform="translate(330 196)">
        <path d="M0 0 h26 v-26 h-26z" fill={WHITE} stroke={NAVY} strokeWidth="2" />
        <path d="M26 -20 q12 0 12 8 q0 8 -12 8" fill="none" stroke={NAVY} strokeWidth="2" />
      </g>
    </>
  ),
  documents: (id) => (
    <>
      <Sky id={id} top="#e0e7ff" bottom="#fff7e6" />
      <g transform="translate(70 70) rotate(-8)">
        <rect width="120" height="164" rx="10" fill={NAVY} />
        <circle cx="60" cy="70" r="26" fill="none" stroke={GOLD} strokeWidth="4" />
        <path d="M44 70 h32 M60 54 v32" stroke={GOLD} strokeWidth="3" />
        <text x="60" y="130" textAnchor="middle" fontSize="13" fontWeight="700" letterSpacing="2" fill={GOLD}>PASSPORT</text>
      </g>
      <g transform="translate(200 54)">
        <rect width="170" height="200" rx="8" fill={WHITE} stroke={NAVY} strokeWidth="3" />
        <rect x="20" y="24" width="130" height="10" rx="5" fill={NAVY_2} />
        {[52, 70, 88, 106, 124].map((y) => (
          <rect key={y} x="20" y={y} width={y === 124 ? 80 : 130} height="6" rx="3" fill="#cbd5e1" />
        ))}
        <circle cx="128" cy="160" r="22" fill={GOLD} />
        <circle cx="128" cy="160" r="14" fill={GOLD_DEEP} />
        <polygon points="116,176 110,200 124,192 128,206 132,180" fill={RED} />
        <polygon points="140,176 146,200 132,192 128,206 124,180" fill={RED} opacity="0.85" />
      </g>
      <g transform="translate(380 120)">
        <rect width="70" height="96" rx="6" fill={CREAM} stroke={NAVY} strokeWidth="2.5" />
        <rect x="22" y="-8" width="26" height="14" rx="4" fill={NAVY} />
        {[22, 46, 70].map((y) => (
          <g key={y}>
            <path d={`M10 ${y} l6 6 l10 -12`} fill="none" stroke={GREEN} strokeWidth="3" />
            <rect x="32" y={y - 2} width="28" height="5" rx="2.5" fill="#94a3b8" />
          </g>
        ))}
      </g>
    </>
  ),
  home: (id) => (
    <>
      <Sky id={id} top="#dbeafe" bottom="#fef9c3" />
      <circle cx="410" cy="60" r="22" fill={GOLD} />
      <Cloud x={120} y={56} />
      {[
        { x: 40, w: 100, h: 120, roof: RED, wall: CREAM },
        { x: 140, w: 90, h: 140, roof: NAVY_2, wall: '#fde68a' },
        { x: 230, w: 110, h: 115, roof: '#b45309', wall: WHITE },
        { x: 340, w: 100, h: 135, roof: RED, wall: '#e0f2fe' },
      ].map((house) => (
        <g key={house.x}>
          <rect x={house.x} y={270 - house.h} width={house.w} height={house.h} fill={house.wall} stroke={NAVY} strokeWidth="2.5" />
          <polygon points={`${house.x - 6},${272 - house.h} ${house.x + house.w / 2},${220 - house.h} ${house.x + house.w + 6},${272 - house.h}`} fill={house.roof} stroke={NAVY} strokeWidth="2.5" />
          <line x1={house.x} y1={270 - house.h * 0.55} x2={house.x + house.w} y2={270 - house.h * 0.55} stroke="#7c4a1e" strokeWidth="3" />
          <line x1={house.x + house.w / 2} y1={270 - house.h} x2={house.x + house.w / 2} y2={270 - house.h * 0.55} stroke="#7c4a1e" strokeWidth="3" />
          <rect x={house.x + 14} y={285 - house.h} width="18" height="18" fill="#bfdbfe" stroke={NAVY} strokeWidth="2" />
          <rect x={house.x + house.w - 32} y={285 - house.h} width="18" height="18" fill="#bfdbfe" stroke={NAVY} strokeWidth="2" />
          <rect x={house.x + house.w / 2 - 10} y="238" width="20" height="32" fill={NAVY} />
        </g>
      ))}
      <rect x="0" y="270" width="480" height="30" fill="#cbd5e1" />
      {[20, 70, 120, 170, 220, 270, 320, 370, 420].map((x) => (
        <rect key={x} x={x} y="280" width="30" height="8" rx="4" fill="#94a3b8" />
      ))}
    </>
  ),
  language: (id) => (
    <>
      <Sky id={id} top="#fff7e6" bottom="#fde68a" />
      <g transform="translate(40 50)">
        <rect width="190" height="80" rx="22" fill={NAVY} />
        <polygon points="40,78 30,104 70,78" fill={NAVY} />
        <text x="95" y="52" textAnchor="middle" fontSize="34" fontWeight="800" fill={GOLD}>Hallo!</text>
      </g>
      <g transform="translate(250 100)">
        <rect width="190" height="76" rx="22" fill={WHITE} stroke={NAVY} strokeWidth="3" />
        <polygon points="150,74 166,100 130,74" fill={WHITE} stroke={NAVY} strokeWidth="3" />
        <text x="95" y="49" textAnchor="middle" fontSize="28" fontWeight="800" fill={NAVY}>Guten Tag</text>
      </g>
      <g transform="translate(70 180)">
        <rect width="150" height="90" rx="6" fill={RED} />
        <rect x="8" y="8" width="134" height="74" rx="4" fill={CREAM} />
        <text x="75" y="54" textAnchor="middle" fontSize="26" fontWeight="800" fill={NAVY}>A1 → C1</text>
      </g>
      <g transform="translate(280 214)">
        <rect width="150" height="16" fill="#1f2937" />
        <rect y="16" width="150" height="16" fill={RED} />
        <rect y="32" width="150" height="16" fill="#ffce00" />
      </g>
    </>
  ),
  finance: (id) => (
    <>
      <Sky id={id} top="#dcfce7" bottom="#fff7e6" />
      <g transform="translate(60 80)">
        <polygon points="0,40 100,0 200,40" fill={NAVY} />
        <rect x="10" y="40" width="180" height="12" fill={NAVY_2} />
        {[24, 64, 104, 144].map((x) => (
          <rect key={x} x={x} y="56" width="24" height="96" fill={WHITE} stroke={NAVY} strokeWidth="2.5" />
        ))}
        <rect x="0" y="152" width="200" height="14" fill={NAVY} />
        <circle cx="100" cy="26" r="9" fill={GOLD} />
      </g>
      <g transform="translate(320 120)">
        {[0, 1, 2, 3, 4].map((index) => (
          <ellipse key={index} cx="40" cy={120 - index * 14} rx="40" ry="11" fill={index % 2 ? GOLD : GOLD_DEEP} stroke="#a16207" strokeWidth="2" />
        ))}
        <circle cx="110" cy="40" r="34" fill={GOLD} stroke="#a16207" strokeWidth="3" />
        <text x="110" y="54" textAnchor="middle" fontSize="40" fontWeight="800" fill="#7c2d12">€</text>
      </g>
      <g transform="translate(250 60)">
        <path d="M30 0 L60 12 V40 C60 60 46 72 30 80 C14 72 0 60 0 40 V12Z" fill={GREEN} />
        <path d="M16 40 l10 10 l18 -20" fill="none" stroke={WHITE} strokeWidth="5" />
      </g>
    </>
  ),
  graduation: (id) => (
    <>
      <Sky id={id} top="#e0e7ff" bottom="#fef3c7" />
      {[
        [60, 60, RED],
        [420, 50, GOLD],
        [380, 230, NAVY_2],
        [90, 220, GOLD],
        [250, 40, GREEN],
        [150, 120, SAFFRON],
        [330, 130, RED],
      ].map(([x, y, color], index) => (
        <rect key={index} x={x as number} y={y as number} width="12" height="6" rx="2" fill={color as string} transform={`rotate(${index * 37} ${x} ${y})`} />
      ))}
      <g transform="translate(240 120)">
        <polygon points="-110,0 0,-46 110,0 0,46" fill={NAVY} />
        <path d="M-64 20 V70 C-64 94 64 94 64 70 V20 L0 46Z" fill={NAVY_2} />
        <line x1="96" y1="6" x2="96" y2="70" stroke={GOLD} strokeWidth="4" />
        <circle cx="96" cy="74" r="8" fill={GOLD} />
        <circle cx="0" cy="0" r="7" fill={GOLD} />
      </g>
      <g transform="translate(150 220) rotate(-6)">
        <rect width="180" height="40" rx="20" fill={CREAM} stroke={NAVY} strokeWidth="3" />
        <rect x="80" y="-4" width="20" height="48" fill={RED} />
      </g>
    </>
  ),
  support: (id) => (
    <>
      <Sky id={id} top="#e0f2fe" bottom="#fff7e6" />
      <path d="M90 200 C180 110 300 110 390 200" fill="none" stroke={NAVY} strokeWidth="3" strokeDasharray="6 8" />
      <g transform="translate(90 200)">
        <circle r="34" fill={SAFFRON} />
        <circle r="24" fill={WHITE} />
        <circle r="10" fill={GREEN} />
      </g>
      <g transform="translate(390 200)">
        <circle r="34" fill="#1f2937" />
        <circle r="24" fill={RED} />
        <circle r="10" fill="#ffce00" />
      </g>
      <g transform="translate(150 40)">
        <rect width="120" height="64" rx="18" fill={NAVY} />
        <polygon points="24,62 18,86 50,62" fill={NAVY} />
        {[34, 60, 86].map((x) => (
          <circle key={x} cx={x} cy="32" r="7" fill={GOLD} />
        ))}
      </g>
      <g transform="translate(250 84)">
        <rect width="110" height="58" rx="18" fill={WHITE} stroke={NAVY} strokeWidth="3" />
        <polygon points="86,56 94,80 66,56" fill={WHITE} stroke={NAVY} strokeWidth="3" />
        <rect x="20" y="20" width="70" height="7" rx="3.5" fill={NAVY_2} />
        <rect x="20" y="34" width="46" height="7" rx="3.5" fill="#94a3b8" />
      </g>
      <rect x="0" y="262" width="480" height="38" fill="#bfdbfe" opacity="0.6" />
    </>
  ),
};

type SceneIllustrationProps = {
  scene: SceneName;
  className?: string;
  /** Accessible description; leave empty when the illustration is decorative. */
  label?: string;
};

export default function SceneIllustration({ scene, className, label }: SceneIllustrationProps) {
  const id = `scene-${useId().replace(/:/g, '')}`;
  return (
    <svg
      viewBox="0 0 480 300"
      preserveAspectRatio="xMidYMid slice"
      className={cn('block h-full w-full', className)}
      role={label ? 'img' : undefined}
      aria-label={label || undefined}
      aria-hidden={label ? undefined : true}
      fontFamily="system-ui, sans-serif"
    >
      {scenes[scene](id)}
    </svg>
  );
}
