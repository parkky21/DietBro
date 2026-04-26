'use client';

import { useState } from 'react';
import SusCheckModal from './SusCheckModal';

// Thresholds — outside these = sus prompt
const AGE_WARN    = { min: 14, max: 65 };   // years
const WEIGHT_WARN = { min: 35, max: 180 };  // kg
const HEIGHT_WARN = { min: 130, max: 220 }; // cm

export default function Step1Profile({ profile, setProfile, onNext }) {
  const [susModal, setSusModal] = useState(null); // { field, value, unit, pendingCb }

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setProfile(prev => ({ ...prev, [id]: value }));
  };

  const handleGoalSelect = (goal) => {
    setProfile(prev => ({ ...prev, goal }));
  };

  const handleDietSelect = (dietType) => {
    setProfile(prev => ({ ...prev, dietType }));
  };

  // ── sus check helper ──────────────────────────────────────────────────────
  // Returns a Promise that resolves to true (proceed) or false (retry)
  const checkSus = (field, value, unit, min, max) => {
    const num = parseFloat(value);
    if (!isNaN(num) && (num < min || num > max)) {
      return new Promise((resolve) => {
        setSusModal({
          field,
          value,
          unit,
          onConfirm: () => { setSusModal(null); resolve(true); },
          onRetry:   () => { setSusModal(null); resolve(false); },
        });
      });
    }
    return Promise.resolve(true);
  };

  // ── validate & advance ────────────────────────────────────────────────────
  const validateAndNext = async () => {
    const { name, age, weight, height, sex, activity, goal, dietType } = profile;
    if (!name || !age || !weight || !height || !sex || !activity || !goal || !dietType) {
      alert('Please fill in all required fields and select your goal & dietary preference.');
      return;
    }

    // Age sus-check
    const ageOk = await checkSus('age', age, 'years', AGE_WARN.min, AGE_WARN.max);
    if (!ageOk) return;

    // Weight sus-check
    const weightOk = await checkSus('weight', weight, 'kg', WEIGHT_WARN.min, WEIGHT_WARN.max);
    if (!weightOk) return;

    // Height sus-check
    const heightOk = await checkSus('height', height, 'cm', HEIGHT_WARN.min, HEIGHT_WARN.max);
    if (!heightOk) return;

    onNext();
  };

  return (
    <>
      {susModal && (
        <SusCheckModal
          field={susModal.field}
          value={susModal.value}
          unit={susModal.unit}
          onConfirm={susModal.onConfirm}
          onRetry={susModal.onRetry}
        />
      )}

      <div className="step active" id="step-1">
        <div className="card">
          <div className="card-title">ok bestie, spill ur stats 👀</div>
          <div className="card-subtitle">ngl we need the deets to cook something actually bussin for u — no copy-paste BS here fr.</div>

          <div className="form-grid">
            <div className="form-group">
              <label>what do they call u 🏷️</label>
              <input type="text" id="name" value={profile.name} onChange={handleInputChange} placeholder="e.g. Rahul, bro, king…" />
            </div>
            <div className="form-group">
              <label>age (no cap)</label>
              <input type="number" id="age" value={profile.age} onChange={handleInputChange} placeholder="e.g. 22" min="14" max="70" />
            </div>
            <div className="form-group">
              <label>current weight (kg) ⚖️</label>
              <input type="number" id="weight" value={profile.weight} onChange={handleInputChange} placeholder="e.g. 68 — be honest" min="20" max="300" />
            </div>
            <div className="form-group">
              <label>height (cm) 📏</label>
              <input type="number" id="height" value={profile.height} onChange={handleInputChange} placeholder="e.g. 175" min="80" max="280" />
            </div>
            <div className="form-group">
              <label>ur biological gender</label>
              <select id="sex" value={profile.sex} onChange={handleInputChange}>
                <option value="">pick one…</option>
                <option value="male">male</option>
                <option value="female">female</option>
              </select>
            </div>
            <div className="form-group">
              <label>how much u actually move 🏃</label>
              <select id="activity" value={profile.activity} onChange={handleInputChange}>
                <option value="">be real…</option>
                <option value="sedentary">couch era (no gym rn)</option>
                <option value="light">gym newbie (1–2×/week)</option>
                <option value="moderate">getting consistent (3–4×/week)</option>
                <option value="active">absolute beast (5–6×/week)</option>
              </select>
            </div>
            <div className="form-group full">
              <label>what&apos;s the vibe / goal 🎯</label>
              <div className="goal-pills">
                <button className={`goal-pill ${profile.goal === 'muscle gain' ? 'selected' : ''}`} onClick={() => handleGoalSelect('muscle gain')}>💪 muscle gain</button>
                <button className={`goal-pill ${profile.goal === 'fat loss' ? 'selected' : ''}`} onClick={() => handleGoalSelect('fat loss')}>🔥 fat loss</button>
                <button className={`goal-pill ${profile.goal === 'lean bulk' ? 'selected' : ''}`} onClick={() => handleGoalSelect('lean bulk')}>⚡ lean bulk</button>
                <button className={`goal-pill ${profile.goal === 'body recomposition' ? 'selected' : ''}`} onClick={() => handleGoalSelect('body recomposition')}>🎯 body recomposition</button>
                <button className={`goal-pill ${profile.goal === 'maintain and tone' ? 'selected' : ''}`} onClick={() => handleGoalSelect('maintain and tone')}>✨ maintain and tone</button>
              </div>
            </div>
            <div className="form-group full">
              <label>what u eat (food preference) 🍽️</label>
              <div className="goal-pills">
                <button className={`goal-pill ${profile.dietType === 'non-vegetarian' ? 'selected' : ''}`} onClick={() => handleDietSelect('non-vegetarian')}>🥩 non-veg</button>
                <button className={`goal-pill ${profile.dietType === 'vegetarian' ? 'selected' : ''}`} onClick={() => handleDietSelect('vegetarian')}>🥦 veg</button>
                <button className={`goal-pill ${profile.dietType === 'vegan' ? 'selected' : ''}`} onClick={() => handleDietSelect('vegan')}>🌱 vegan</button>
                <button className={`goal-pill ${profile.dietType === 'eggetarian' ? 'selected' : ''}`} onClick={() => handleDietSelect('eggetarian')}>🥚 eggs only bro</button>
              </div>
            </div>
            <div className="form-group full">
              <label>any allergies / things that hit wrong 🚫 (optional)</label>
              <input type="text" id="allergies" value={profile.allergies} onChange={handleInputChange} placeholder="e.g. dairy makes me cooked, peanuts are a no-go…" />
            </div>
          </div>

          <div className="btn-row">
            <span></span>
            <button className="btn btn-primary" onClick={validateAndNext}>
              yep that&apos;s me, next →
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
