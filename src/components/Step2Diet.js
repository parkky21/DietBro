import { useState } from 'react';

const MEAL_SLOTS = [
  { id: 'wakeup', icon: '🌅', name: 'Wake-up sip', time: '6:00 – 7:00 AM', placeholder: 'chai? black coffee? just vibes?' },
  { id: 'breakfast', icon: '🍳', name: 'Breakfast', time: '7:00 – 9:00 AM', placeholder: 'eggs? paratha? or do u lowkey skip this 😬' },
  { id: 'midMorning', icon: '🍌', name: 'mid-morning snack', time: '10:00 – 11:30 AM', placeholder: 'banana? biscuits? samosa? straight up nothing?' },
  { id: 'lunch', icon: '🍱', name: 'lunch (the real one)', time: '12:00 – 2:00 PM', placeholder: 'rice + dal + sabzi? tiffin from mum? hotel food?' },
  { id: 'preWorkout', icon: '💪', name: 'pre-workout fuel', time: '4:00 – 6:00 PM', placeholder: 'banana? peanut butter toast? or u just go in fasted 😤' },
  { id: 'postWorkout', icon: '🥤', name: 'post-workout W meal', time: 'after the gym session', placeholder: 'whey shake? eggs? or nothing bc ur cooked after sets?' },
  { id: 'eveningSnack', icon: '🫖', name: 'evening snack attack', time: '5:00 – 7:00 PM', placeholder: 'chai + biscuits? maggi? fruits? random chakna?' },
  { id: 'dinner', icon: '🍽️', name: 'dinner (the big one)', time: '8:00 – 10:00 PM', placeholder: 'whatever mum made? roti + dal? chicken curry?' },
  { id: 'bedtime', icon: '🌙', name: 'late night munchies', time: '10:00 PM+', placeholder: 'milk? random snacking? straight to bed?' },
];

export default function Step2Diet({ profile, setProfile, dietMeals, setDietMeals, skippedMeals, setSkippedMeals, onBack, onGenerate }) {
  const [error, setError] = useState(false);

  const handleMealChange = (id, value) => {
    setDietMeals(prev => ({ ...prev, [id]: value }));
  };

  const toggleSkip = (id) => {
    setSkippedMeals(prev => {
      const newSkipped = new Set(prev);
      if (newSkipped.has(id)) {
        newSkipped.delete(id);
      } else {
        newSkipped.add(id);
      }
      return newSkipped;
    });
  };

  const toggleHabit = (habit) => {
    setProfile(prev => {
      const newHabits = prev.habits.includes(habit) 
        ? prev.habits.filter(h => h !== habit)
        : [...prev.habits, habit];
      return { ...prev, habits: newHabits };
    });
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setProfile(prev => ({ ...prev, [id]: value }));
  };

  const validateAndGenerate = () => {
    let filledCount = 0;
    MEAL_SLOTS.forEach(slot => {
      if (!skippedMeals.has(slot.id) && dietMeals[slot.id]?.trim()) {
        filledCount++;
      }
    });

    if (filledCount < 2) {
      setError(true);
      return;
    }
    setError(false);
    onGenerate();
  };

  const renderMealSlot = (slot) => {
    const isSkipped = skippedMeals.has(slot.id);
    return (
      <div key={slot.id} className={`meal-input-row ${isSkipped ? 'skipped' : ''}`}>
        <div className="meal-label-block">
          <span className="meal-icon">{slot.icon}</span>
          <div className="meal-label-text">
            <span className="meal-label-name">{slot.name}</span>
            <span className="meal-label-time">{slot.time}</span>
          </div>
        </div>
        <input 
          className="meal-input-field" 
          value={dietMeals[slot.id] || ''} 
          onChange={(e) => handleMealChange(slot.id, e.target.value)}
          placeholder={slot.placeholder} 
        />
        <button className={`meal-skip-btn ${isSkipped ? 'skipped-active' : ''}`} onClick={() => toggleSkip(slot.id)}>
          {isSkipped ? 'Undo' : 'nah skip'}
        </button>
      </div>
    );
  };

  return (
    <div className="step active">
      <div className="card">
        <div className="card-title">ok fr, what are u actually eating rn? 👀</div>
        <div className="card-subtitle">no judging bestie, just be honest — the more real u keep it, the harder we go on ur plan. be the main character.</div>

        <div className="diet-section-label" style={{marginTop: '0.25rem'}}>morning grind 🌅</div>
        <div className="meal-inputs-grid">
          {MEAL_SLOTS.slice(0, 2).map(renderMealSlot)}
        </div>

        <div className="diet-section-label">midday munch 🍱</div>
        <div className="meal-inputs-grid">
          {MEAL_SLOTS.slice(2, 4).map(renderMealSlot)}
        </div>

        <div className="diet-section-label">beast mode hours 💪</div>
        <div className="meal-inputs-grid">
          {MEAL_SLOTS.slice(4, 7).map(renderMealSlot)}
        </div>

        <div className="diet-section-label">night owl stuff 🌙</div>
        <div className="meal-inputs-grid">
          {MEAL_SLOTS.slice(7, 9).map(renderMealSlot)}
        </div>

        <div className="form-grid" style={{marginTop: '0.5rem'}}>
          <div className="form-group full">
            <label>bad habits? we don&apos;t judge 💀 (select all that apply)</label>
            <div className="goal-pills">
              <button className={`goal-pill ${profile.habits.includes('skip breakfast') ? 'selected' : ''}`} onClick={() => toggleHabit('skip breakfast')}>⛔ skips breakfast like a clown</button>
              <button className={`goal-pill ${profile.habits.includes('late night eating') ? 'selected' : ''}`} onClick={() => toggleHabit('late night eating')}>🌙 midnight fridge raider</button>
              <button className={`goal-pill ${profile.habits.includes('irregular meals') ? 'selected' : ''}`} onClick={() => toggleHabit('irregular meals')}>⏱ eats at random hours</button>
              <button className={`goal-pill ${profile.habits.includes('eat too fast') ? 'selected' : ''}`} onClick={() => toggleHabit('eat too fast')}>⚡ eats faster than usain bolt</button>
              <button className={`goal-pill ${profile.habits.includes('emotional eating') ? 'selected' : ''}`} onClick={() => toggleHabit('emotional eating')}>💭 stress eating bestie</button>
              <button className={`goal-pill ${profile.habits.includes('good hydration') ? 'selected' : ''}`} onClick={() => toggleHabit('good hydration')}>💧 actually hydrated king</button>
            </div>
          </div>
          <div className="form-group">
            <label>monthly food budget 💸</label>
            <select id="budget" value={profile.budget} onChange={handleInputChange}>
              <option value="">be real…</option>
              <option value="under 3000">broke era (under ₹3k)</option>
              <option value="3000-6000">mid budget (₹3k–₹6k)</option>
              <option value="6000-10000">eating good (₹6k–₹10k)</option>
              <option value="unlimited">no cap no limit 💰</option>
            </select>
          </div>
          <div className="form-group">
            <label>supplements u already take 💊</label>
            <input type="text" id="supplements" value={profile.supplements} onChange={handleInputChange} placeholder="whey, creatine, nothing yet…" />
          </div>
          <div className="form-group full">
            <label>anything else we should know? (spill fr) 🗣️</label>
            <input type="text" id="notes" value={profile.notes} onChange={handleInputChange} placeholder="night shift grind? cook own food? hostel life? tell us everything…" />
          </div>
        </div>

        {error && <div className="error-msg" style={{display: 'block'}}>bro fill in at least 2 meal slots 😭 we can&apos;t cook with nothing.</div>}

        <div className="btn-row">
          <button className="btn btn-ghost" onClick={onBack}>← go back</button>
          <button className="btn btn-primary" onClick={validateAndGenerate}>
            cook my plan, AI go brr 🧠
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
