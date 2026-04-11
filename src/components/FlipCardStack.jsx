import { useState, useEffect } from 'react';

const defaultColors = ['#FF8C42', '#F47528', '#E8621E'];

export default function FlipCardStack({ cards = [], interval = 4000, className = '', colors = defaultColors, activeIndex, onIndexChange }) {
  const [internalActive, setInternalActive] = useState(0);
  const isControlled = activeIndex !== undefined;
  const active = isControlled ? activeIndex : internalActive;
  const count = cards.length;

  useEffect(() => {
    if (count < 2 || !interval || isControlled) return;
    const timer = setInterval(() => {
      setInternalActive(prev => (prev + 1) % count);
    }, interval);
    return () => clearInterval(timer);
  }, [count, interval, isControlled]);

  if (!count) return null;

  const handleClick = () => {
    if (count < 2) return;
    const next = (active + 1) % count;
    if (isControlled) {
      onIndexChange?.(next);
    } else {
      setInternalActive(next);
    }
  };

  return (
    <div className={`flip-stack ${className}`}>
      <div className="flip-stack-deck" onClick={handleClick} style={{ cursor: count > 1 ? 'pointer' : 'default' }}>
        {cards.map((card, i) => {
          const pos = (i - active + count) % count;
          const clamped = Math.min(pos, 2);
          const bg = colors[i % colors.length];
          return (
            <div
              key={i}
              className={`flip-stack-card flip-stack-pos-${clamped}${card.className ? ' ' + card.className : ''}`}
              style={{ backgroundColor: bg }}
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
