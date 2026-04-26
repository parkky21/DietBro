import { useState, useEffect } from 'react';

const LOADING_MESSAGES = [
  ['Analysing your profile…', 'Calculating metabolic rate'],
  ['Evaluating your eating habits…', 'Identifying gaps & deficiencies'],
  ['Engineering your meal structure…', 'Optimising macro split'],
  ['Crafting your food list…', 'Finalising your blueprint'],
];

export default function Step3Loading({ isError, onRestart }) {
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    if (isError) return;
    const interval = setInterval(() => {
      setMsgIdx(prev => Math.min(prev + 1, LOADING_MESSAGES.length - 1));
    }, 1800);
    return () => clearInterval(interval);
  }, [isError]);

  if (isError) {
    return (
      <div className="step active">
        <div className="card">
          <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <div style={{ color: 'var(--red)', fontFamily: 'var(--font-cormorant), serif', fontSize: '1.6rem', marginBottom: '1rem' }}>Something went wrong</div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>{isError}</p>
            <button className="btn btn-ghost" onClick={onRestart}>← Start Over</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="step active">
      <div className="card">
        <div className="loading-state">
          <div className="loader-ring"></div>
          <div className="loading-text">{LOADING_MESSAGES[msgIdx][0]}</div>
          <div className="loading-sub">{LOADING_MESSAGES[msgIdx][1]}</div>
        </div>
      </div>
    </div>
  );
}
