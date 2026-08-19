export function SafetyWorkerIllustration({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 480 480" className={className} role="img" aria-label="Colaborador utilizando EPIs">
      <defs>
        <radialGradient id="sw-bg" cx="50%" cy="42%" r="60%">
          <stop offset="0%" stopColor="#e6f0fb" />
          <stop offset="100%" stopColor="#cfe1f7" />
        </radialGradient>
        <linearGradient id="sw-vest" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffcc33" />
          <stop offset="100%" stopColor="#f5a623" />
        </linearGradient>
        <linearGradient id="sw-hat" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffd84d" />
          <stop offset="100%" stopColor="#ffb703" />
        </linearGradient>
      </defs>

      <circle cx="240" cy="240" r="220" fill="url(#sw-bg)" />

      <g className="origin-center animate-spin-slow opacity-40">
        <circle
          cx="240"
          cy="240"
          r="196"
          fill="none"
          stroke="#0063ba"
          strokeWidth="2"
          strokeDasharray="2 14"
          strokeLinecap="round"
        />
      </g>

      {/* Shoulders / vest */}
      <path d="M120 420 C120 320 165 268 240 268 C315 268 360 320 360 420 Z" fill="#1e293b" />
      <path
        d="M140 420 C140 330 180 282 240 282 C300 282 340 330 340 420 Z"
        fill="url(#sw-vest)"
      />
      {/* Reflective stripes */}
      <path d="M172 300 L206 420" stroke="#fff7e6" strokeWidth="10" strokeLinecap="round" opacity="0.85" />
      <path d="M308 300 L274 420" stroke="#fff7e6" strokeWidth="10" strokeLinecap="round" opacity="0.85" />
      <rect x="216" y="352" width="48" height="12" rx="6" fill="#fff7e6" opacity="0.85" />

      {/* Neck */}
      <rect x="216" y="228" width="48" height="46" rx="18" fill="#334155" />

      {/* Head */}
      <circle cx="240" cy="196" r="66" fill="#334155" />

      {/* Goggles */}
      <rect x="188" y="188" width="104" height="30" rx="15" fill="#0063ba" />
      <circle cx="215" cy="203" r="9" fill="#bfe0ff" opacity="0.8" />
      <circle cx="265" cy="203" r="9" fill="#bfe0ff" opacity="0.8" />

      {/* Hard hat */}
      <path
        d="M174 150 C174 106 203 76 240 76 C277 76 306 106 306 150 L306 158 L174 158 Z"
        fill="url(#sw-hat)"
      />
      <rect x="160" y="152" width="160" height="18" rx="9" fill="#f5a623" />
      <rect x="230" y="86" width="20" height="10" rx="5" fill="#f5a623" />

      {/* Tablet in hand, tying back to digital monitoring */}
      <g transform="translate(316 330) rotate(-8)">
        <rect x="0" y="0" width="70" height="92" rx="12" fill="#ffffff" stroke="#dbe7f5" strokeWidth="3" />
        <rect x="12" y="14" width="46" height="8" rx="4" fill="#dbe7f5" />
        <rect x="12" y="30" width="30" height="8" rx="4" fill="#dbe7f5" />
        <circle cx="35" cy="64" r="18" fill="#e8f3ff" />
        <path
          d="M27 64 L33 70 L45 56"
          fill="none"
          stroke="#0063ba"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      {/* Brand badge, floating */}
      <g className="animate-float" style={{ transformOrigin: "398px 300px" }}>
        <circle cx="398" cy="300" r="34" fill="#0063ba" stroke="#e6f0fb" strokeWidth="6" />
        <path
          d="M398 284c0 12-6 18-15 22a1 1 0 0 1-2 0c-9-4-15-10-15-22v-8a2 2 0 0 1 2-2c5 0 9-3 13-6a3 3 0 0 1 4 0c4 3 8 6 13 6a2 2 0 0 1 2 2z"
          fill="none"
          stroke="#ffffff"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          transform="translate(0 -4) scale(0.95)"
        />
        <path
          d="M390 300l5 5 10-10"
          fill="none"
          stroke="#ffffff"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          transform="translate(0 -4)"
        />
      </g>
    </svg>
  );
}
