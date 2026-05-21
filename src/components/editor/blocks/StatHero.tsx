interface Cell {
  value: string;
  labelStrong: string;
  labelSpan?: string;
  unit?: string;
}

interface Props {
  badge?: string;
  cells: Cell[];
}

/** Visual stat hero block — matches the "72h không Facebook" header layout. */
export default function StatHero({ badge, cells }: Props) {
  return (
    <section className="stat-hero" aria-label={badge ?? 'Số liệu chính'}>
      {badge && <div className="stat-hero__badge">{badge}</div>}
      <div className="stat-hero__grid">
        {cells.map((cell, idx) => (
          <div key={idx} className="stat-hero__cell">
            <div className="stat-hero__value">
              {cell.value}
              {cell.unit && <span className="unit">{cell.unit}</span>}
            </div>
            <div className="stat-hero__label">
              <strong>{cell.labelStrong}</strong>
              {cell.labelSpan && <span>{cell.labelSpan}</span>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
