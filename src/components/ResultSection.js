'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';

export default function ResultSection({ plan, name, profile, onRestart, onPlanUpdate }) {
  const [animate, setAnimate] = useState(false);
  const [visibleCards, setVisibleCards] = useState(new Set());
  const [editingMeal, setEditingMeal] = useState(null);   // index of meal being edited
  const [editText, setEditText] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState(null);
  const [justEdited, setJustEdited] = useState(null);     // index that just got updated (for flash)

  useEffect(() => {
    setTimeout(() => setAnimate(true), 100);
    if (plan?.meals) {
      plan.meals.forEach((_, i) => {
        setTimeout(() => {
          setVisibleCards(prev => new Set(prev).add(i));
        }, 100 + i * 120);
      });
    }
  }, [plan]);

  const handleEditToggle = useCallback((index) => {
    if (editingMeal === index) {
      setEditingMeal(null);
      setEditText('');
      setEditError(null);
    } else {
      setEditingMeal(index);
      setEditText('');
      setEditError(null);
    }
  }, [editingMeal]);

  const handleEditSubmit = useCallback(async (index) => {
    if (!editText.trim()) return;

    setEditLoading(true);
    setEditError(null);

    try {
      const response = await fetch('/api/edit-meal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mealIndex: index,
          meal: plan.meals[index],
          editRequest: editText.trim(),
          profile: {
            goal: profile?.goal || '',
            dietType: profile?.dietType || '',
            allergies: profile?.allergies || '',
          }
        }),
      });

      if (!response.ok) throw new Error('AI couldn\'t cook that edit rn');

      const updatedMeal = await response.json();
      if (updatedMeal.error) throw new Error(updatedMeal.error);

      // Update the plan with the new meal
      const newMeals = [...plan.meals];
      newMeals[index] = updatedMeal;

      // Recalculate totals
      const totals = newMeals.reduce((acc, m) => ({
        calories: acc.calories + (m.calories || 0),
        protein: acc.protein + (m.protein || 0),
        carbs: acc.carbs + (m.carbs || 0),
        fats: acc.fats + (m.fats || 0),
      }), { calories: 0, protein: 0, carbs: 0, fats: 0 });

      const updatedPlan = {
        ...plan,
        meals: newMeals,
        calories: totals.calories,
        protein: totals.protein,
        carbs: totals.carbs,
        fats: totals.fats,
      };

      onPlanUpdate(updatedPlan);
      setEditingMeal(null);
      setEditText('');
      setJustEdited(index);
      setTimeout(() => setJustEdited(null), 2000);
    } catch (err) {
      console.error(err);
      setEditError(err.message || 'couldn\'t update that meal rn 😭');
    } finally {
      setEditLoading(false);
    }
  }, [editText, plan, profile, onPlanUpdate]);

  const handleEditKeyDown = useCallback((e, index) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleEditSubmit(index);
    }
    if (e.key === 'Escape') {
      setEditingMeal(null);
      setEditText('');
      setEditError(null);
    }
  }, [handleEditSubmit]);

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
      <div className="meals-edit-hint">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        tap any meal to tweak it — tell us what u wanna change in plain english, we&apos;ll recook it 🍳
      </div>

      <div>
        {(plan.meals || []).map((meal, i) => (
          <div 
            key={i} 
            className={`meal-card ${visibleCards.has(i) ? 'visible' : ''} ${editingMeal === i ? 'editing' : ''} ${justEdited === i ? 'just-edited' : ''}`}
          >
            <div className="meal-card-header">
              <div>
                <div className="meal-time-badge">{meal.time} — {meal.label}</div>
                <div className="meal-name">{meal.name}</div>
                <div className="meal-cals">{Math.round(meal.calories)} kcal</div>
              </div>
              <button 
                className={`meal-edit-btn ${editingMeal === i ? 'active' : ''}`}
                onClick={() => handleEditToggle(i)}
                title="Edit this meal"
              >
                {editingMeal === i ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                )}
              </button>
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

            {/* ── INLINE EDIT PANEL ── */}
            {editingMeal === i && (
              <div className="meal-edit-panel">
                <div className="meal-edit-label">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  tell us what to change, bestie
                </div>
                <textarea
                  className="meal-edit-input"
                  placeholder="e.g. i can't eat almonds, switch to peanuts... or replace milk with curd... or make it vegan..."
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={(e) => handleEditKeyDown(e, i)}
                  rows={2}
                  autoFocus
                  disabled={editLoading}
                />
                {editError && (
                  <div className="meal-edit-error">{editError}</div>
                )}
                <div className="meal-edit-actions">
                  <button 
                    className="meal-edit-cancel" 
                    onClick={() => handleEditToggle(i)}
                    disabled={editLoading}
                  >
                    nvm
                  </button>
                  <button 
                    className="meal-edit-submit" 
                    onClick={() => handleEditSubmit(i)}
                    disabled={editLoading || !editText.trim()}
                  >
                    {editLoading ? (
                      <>
                        <span className="meal-edit-spinner"></span>
                        recooking...
                      </>
                    ) : (
                      <>🍳 fix it bro</>
                    )}
                  </button>
                </div>
              </div>
            )}
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
