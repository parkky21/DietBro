'use client';

export default function Hero() {
  const scrollToApp = () => {
    document.getElementById('app').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="hero">
      <div className="hero-bg-text">GAINS</div>
      <div className="hero-tag">no cap. built different. fr fr.</div>
      <h1>bro your diet is<br />actually <em>cooked.</em></h1>
      <p className="hero-sub">stop eating like a NPC and start fueling like a main character. drop what you eat, we fix it. no gatekeeping, just W gains.</p>
      <button className="hero-cta" onClick={scrollToApp}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
        fix my diet 🥑
      </button>
      <div className="hero-stats">
        <div className="hero-stat">
          <div className="hero-stat-num">100%</div>
          <div className="hero-stat-label">no cap</div>
        </div>
        <div className="hero-divider"></div>
        <div className="hero-stat">
          <div className="hero-stat-num">W</div>
          <div className="hero-stat-label">vibes only</div>
        </div>
        <div className="hero-divider"></div>
        <div className="hero-stat">
          <div className="hero-stat-num">free</div>
          <div className="hero-stat-label">lowkey bussin</div>
        </div>
      </div>
    </section>
  );
}
