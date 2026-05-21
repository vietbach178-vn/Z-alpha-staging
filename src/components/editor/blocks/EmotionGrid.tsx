interface Card {
  emoji: string;
  label: string;
  sub?: string;
  tone?: 'red' | 'blue' | 'teal' | 'orange';
}

interface Props {
  title?: string;
  titleAccent?: 'red';
  cards: Card[];
  caption?: string;
}

export default function EmotionGrid({ title, titleAccent, cards, caption }: Props) {
  return (
    <section className="chart-block">
      {title && (
        <h3 className={`chart-block__title${titleAccent === 'red' ? ' chart-block__title--red' : ''}`}>
          {title}
        </h3>
      )}
      <div className="emotion-grid">
        {cards.map((card, idx) => (
          <div key={idx} className={`emotion-card emotion-card--${card.tone ?? 'blue'}`}>
            <div className="emotion-card__emoji">{card.emoji}</div>
            <p className="emotion-card__label">{card.label}</p>
            {card.sub && <p className="emotion-card__sub">{card.sub}</p>}
          </div>
        ))}
      </div>
      {caption && <p className="chart-block__caption">{caption}</p>}
    </section>
  );
}
