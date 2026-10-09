/**
 * Brume et pluie fine de Londres, en surcouche légère (transform/opacity).
 * Mobile : une seule nappe de brume, pas de pluie. Mouvement réduit : brume
 * figée, pluie masquée (globals.css).
 */
export function LondonWeather() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div className="fog-layer fog-layer-1 absolute -inset-x-[20%] bottom-[-6%] h-[58%]" />
      <div className="fog-layer fog-layer-2 absolute -inset-x-[20%] bottom-[10%] hidden h-[40%] sm:block" />
      <div className="rain absolute -inset-[200px] hidden sm:block" />
    </div>
  );
}
