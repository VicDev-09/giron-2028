/**
 * Bus rouge à impériale, vue de profil (SVG inline). Les couleurs viennent
 * des tokens (rouge de marque, or pour les lumières).
 */
export function DoubleDecker({ className }: { className?: string }) {
  const upper = [34, 62, 90, 118, 146, 174];
  const lower = [46, 78, 110, 142];
  return (
    <svg aria-hidden viewBox="0 0 230 124" className={className}>
      {/* Ombre au sol */}
      <ellipse cx="116" cy="118" rx="104" ry="4" className="fill-black/35" />
      {/* Carrosserie */}
      <path
        d="M14 108 V22 Q14 8 30 8 H200 Q214 8 216 24 L220 70 Q222 80 222 90 V108 Z"
        style={{ fill: "var(--brand-scarlet)" }}
      />
      <path d="M14 64 H222 V68 H14 Z" className="fill-black/25" />
      {/* Fenêtres éclairées (étage et bas) */}
      <g style={{ fill: "#ffe7b0" }} fillOpacity="0.82">
        {upper.map((x) => (
          <rect key={x} x={x} y="18" width="22" height="22" rx="3" />
        ))}
        {lower.map((x) => (
          <rect key={x} x={x} y="74" width="26" height="18" rx="3" />
        ))}
        <path d="M186 74 h24 l4 18 h-28 Z" />
      </g>
      {/* Girouette « GIRON 28 » */}
      <rect
        x="168"
        y="44"
        width="46"
        height="14"
        rx="2"
        className="fill-deep"
      />
      <text
        x="191"
        y="54.5"
        textAnchor="middle"
        className="fill-gold font-sans text-[8px] font-bold tracking-wider"
      >
        GIRON 28
      </text>
      {/* Phares et roues */}
      <rect
        x="216"
        y="94"
        width="6"
        height="6"
        rx="1.5"
        className="fill-gold"
      />
      <g>
        <circle cx="58" cy="108" r="13" className="fill-deep" />
        <circle cx="58" cy="108" r="5" className="fill-white/40" />
        <circle cx="180" cy="108" r="13" className="fill-deep" />
        <circle cx="180" cy="108" r="5" className="fill-white/40" />
      </g>
    </svg>
  );
}
