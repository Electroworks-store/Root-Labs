export default function Carousel3D({ count = 10, renderCard, className = '' }) {
  return (
    <div className={`cylinder-wrap ${className}`}>
      <div className="cylinder-scene">
        <div className="cylinder-ring">
          {Array.from({ length: count }, (_, idx) => (
            <div key={idx} className="cylinder-card" style={{ '--i': idx }}>
              {renderCard ? renderCard(idx) : <div className="cf-square" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
