interface Bar {
  labelStrong: string;
  labelSpan?: string;
  value: number; // percentage 0-100
  color?: 'blue' | 'red' | 'orange' | 'teal';
}

interface Props {
  title: string;
  sub?: string;
  titleAccent?: 'red';
  bars: Bar[];
}

export default function BarChart({ title, sub, titleAccent, bars }: Props) {
  return (
    <section className="chart-block">
      <h3 className={`chart-block__title${titleAccent === 'red' ? ' chart-block__title--red' : ''}`}>{title}</h3>
      {sub && <p className="chart-block__sub">{sub}</p>}

      <div className={`bar-chart bar-chart--${bars.length === 2 ? 'two' : 'multi'}`}>
        {bars.map((bar, idx) => (
          <div key={idx} className="bar-chart__item">
            <div className="bar-chart__bar-wrap" aria-hidden="true">
              <div
                className={`bar-chart__bar bar-chart__bar--${bar.color ?? 'blue'}`}
                style={{ ['--h' as string]: `${bar.value}%` }}
              />
              <span className="bar-chart__value">{bar.value}%</span>
            </div>
            <p className="bar-chart__label">
              <strong>{bar.labelStrong}</strong>
              {bar.labelSpan && <span>{bar.labelSpan}</span>}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
