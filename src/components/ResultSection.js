import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function ResultSection({ plan, name, onRestart }) {
  const [animate, setAnimate] = useState(false);
  const [visibleCards, setVisibleCards] = useState(new Set());

  useEffect(() => {
    // Trigger initial animations
    setTimeout(() => setAnimate(true), 100);

    // Stagger meal cards visibility
    if (plan?.meals) {
      plan.meals.forEach((_, i) => {
        setTimeout(() => {
          setVisibleCards(prev => new Set(prev).add(i));
        }, 100 + i * 120);
      });
    }
  }, [plan]);

  if (!plan) return null;

  return (
    <div id="result-section" style={{ display: 'block' }}>
      <div className="result-header">
        <Image src="/logo.png" alt="Diet Bro Logo" width={56} height={56} style={{ marginBottom: '1.25rem', borderRadius: '10px' }} />
        <div className="result-tag">Your Personalised Blueprint</div>
        <div className="result-name">{name}&apos;s {plan.headline}</div>
      </div>

      <div className="macro-grid">
        <div className={`macro-card ${animate ? 'animate' : ''}`}>
          <div className="macro-value">{Math.round(plan.calories)}</div>
          <div className="macro-label">Calories/day</div>
        </div>
        <div className={`macro-card ${animate ? 'animate' : ''}`}>
          <div className="macro-value">{Math.round(plan.protein)}g</div>
          <div className="macro-label">Protein (g)</div>
        </div>
        <div className={`macro-card ${animate ? 'animate' : ''}`}>
          <div className="macro-value">{Math.round(plan.carbs)}g</div>
          <div className="macro-label">Carbs (g)</div>
        </div>
        <div className={`macro-card ${animate ? 'animate' : ''}`}>
          <div className="macro-value">{Math.round(plan.fats)}g</div>
          <div className="macro-label">Fats (g)</div>
        </div>
      </div>

      <div className="meals-section-title">Daily Meal Plan</div>
      <div>
        {(plan.meals || []).map((meal, i) => (
          <div key={i} className={`meal-card ${visibleCards.has(i) ? 'visible' : ''}`}>
            <div className="meal-card-header">
              <div>
                <div className="meal-time-badge">{meal.time} — {meal.label}</div>
                <div className="meal-name">{meal.name}</div>
                <div className="meal-cals">{Math.round(meal.calories)} kcal</div>
              </div>
            </div>
            <ul className="meal-foods">
              {(meal.foods || []).map((f, j) => (
                <li key={j}>
                  <span>{f.item}</span>
                  <span className="food-portion">{f.portion}</span>
                </li>
              ))}
            </ul>
            <div className="meal-macros">
              <div className="meal-macro-pill">P: {Math.round(meal.protein)}g</div>
              <div className="meal-macro-pill">C: {Math.round(meal.carbs)}g</div>
              <div className="meal-macro-pill">F: {Math.round(meal.fats)}g</div>
            </div>
          </div>
        ))}
      </div>

      {plan.coachNotes && (
        <div className="tips-section" style={{ display: 'block' }}>
          <div className="tips-title">Coach&apos;s Notes</div>
          <div className="tips-content">{plan.coachNotes}</div>
        </div>
      )}

      <div className="water-reminder">
        <div className="water-icon">💧</div>
        <div className="water-text">
          Drink minimum 3–4 litres of water daily<br />
          Hydration is the most underrated tool in your arsenal.
        </div>
      </div>

      <div className="restart-row">
        <button className="btn btn-ghost" onClick={onRestart}>← Start Over / Adjust Plan</button>
      </div>
    </div>
  );
}
