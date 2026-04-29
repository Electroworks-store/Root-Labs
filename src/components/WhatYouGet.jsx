import './WhatYouGet.css';

/**
 * WhatYouGet
 * --------------------------------------------------------------------
 * "What do you get?" floating feature gallery.
 * 6 image tiles scattered organically; hovering a tile scales it slightly
 * and reveals an associated heading + body next to it.
 */

const ITEMS = [
  {
    id: 1,
    src: 'https://picsum.photos/seed/wyg-1/600/800',
    size: 'md',
    pos: { top: '7%', left: '20%' },
    heading: 'Custom design',
    body: 'No templates. Every layout starts from your brand and your story.',
    textSide: 'left',
  },
  {
    id: 2,
    src: 'https://picsum.photos/seed/wyg-2/600/800',
    size: 'sm',
    pos: { top: '4%', left: '66%' },
    heading: 'Pixel-perfect detail',
    body: 'Type, colour and motion tuned obsessively across every screen.',
    textSide: 'right',
  },
  {
    id: 3,
    src: 'https://picsum.photos/seed/wyg-3/500/700',
    size: 'sm',
    pos: { top: '40%', left: '4%' },
    heading: 'Built to be visited',
    body: 'Fast, smooth and structured so visitors actually enjoy your site.',
    textSide: 'right',
  },
  {
    id: 4,
    src: 'https://picsum.photos/seed/wyg-4/500/700',
    size: 'sm',
    pos: { top: '38%', left: '82%' },
    heading: 'Real performance',
    body: 'Optimised for speed, SEO, and accessibility from day one.',
    textSide: 'left',
  },
  {
    id: 5,
    src: 'https://picsum.photos/seed/wyg-5/600/800',
    size: 'md',
    pos: { top: '70%', left: '22%' },
    heading: 'Yours to keep',
    body: 'Clean code, full ownership. No page-builder lock-in.',
    textSide: 'left',
  },
  {
    id: 6,
    src: 'https://picsum.photos/seed/wyg-6/600/800',
    size: 'lg',
    pos: { top: '72%', left: '60%' },
    heading: 'Built to scale',
    body: 'A foundation that grows with your business, not against it.',
    textSide: 'right',
  },
];

export default function WhatYouGet() {
  return (
    <section className="wyg" aria-label="What do you get">
      <div className="wyg__inner">
        <div className="wyg__stage">
          <h2 className="wyg__title">What do you get?</h2>
          {ITEMS.map((item) => (
            <div
              key={item.id}
              className={`wyg__item wyg__item--${item.size} wyg__item--text-${item.textSide}`}
              style={item.pos}
            >
              <div className="wyg__media">
                <img src={item.src} alt="" loading="lazy" />
              </div>
              <div className="wyg__copy">
                <h3 className="wyg__heading">{item.heading}</h3>
                <p className="wyg__body">{item.body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile fallback list — only shown on small screens */}
        <h2 className="wyg__title-mobile">What do you get?</h2>
        <ul className="wyg__list" aria-hidden="false">
          {ITEMS.map((item) => (
            <li key={`m-${item.id}`} className="wyg__list-item">
              <img src={item.src} alt="" loading="lazy" />
              <div>
                <h3 className="wyg__heading">{item.heading}</h3>
                <p className="wyg__body">{item.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
