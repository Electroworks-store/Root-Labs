import { useState, useEffect } from 'react';

const defaultColors = ['#FF8C42', '#F47528', '#E8621E'];

export default function FlipCardStack({ cards = [], interval = 4000, className = '', colors = defaultColors }) {
  const [active, setActive] = useState(0);
  const count = cards.length;

  useEffect(() => {
    if (count < 2) return;
    const timer = setInterval(() => {
      setActive(prev => (prev + 1) % count);
    }, interval);
    return () => clearInterval(timer);
  }, [count, interval]);

  if (!count) return null;

  return (
    <div className={`flip-stack ${className}`}>
      <div className="flip-stack-deck">
        {cards.map((card, i) => {
          const pos = (i - active + count) % count;
          const clamped = Math.min(pos, 2);
          const bg = colors[i % colors.length];
          return (
            <div
              key={i}
              className={`flip-stack-card flip-stack-pos-${clamped}`}
              style={{ background: bg }}
              aria-hidden={pos !== 0}
            >
              {card.title && <h3 className="flip-stack-title">{card.title}</h3>}
              {card.text && <p className="flip-stack-text">{card.text}</p>}
              {card.icon && <div className="flip-stack-icon">{card.icon}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
