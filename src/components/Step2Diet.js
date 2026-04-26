import { useState, useRef, useEffect, useCallback } from 'react';
import { formatTime } from '@/app/page';

const PRE_OFFSET = 90;
const POST_OFFSET = 90;
const TIMELINE_START = 6 * 60;   // 6 AM
const TIMELINE_END   = 23 * 60;  // 11 PM
const GYM_DURATION   = 90;       // 1.5 hours

const MEAL_SLOTS = [
  { id: 'wakeup', icon: '🌅', name: 'Wake-up sip', staticTime: '6:00 – 7:00 AM', placeholder: 'chai? black coffee? just vibes?' },
  { id: 'breakfast', icon: '🍳', name: 'Breakfast', staticTime: '7:00 – 9:00 AM', placeholder: 'eggs? paratha? or do u lowkey skip this 😬' },
  { id: 'midMorning', icon: '🍌', name: 'mid-morning snack', staticTime: '10:00 – 11:30 AM', placeholder: 'banana? biscuits? samosa? straight up nothing?' },
  { id: 'lunch', icon: '🍱', name: 'lunch (the real one)', staticTime: '12:00 – 2:00 PM', placeholder: 'rice + dal + sabzi? tiffin from mum? hotel food?' },
  { id: 'preWorkout', icon: '💪', name: 'pre-workout fuel', isDynamicPre: true, placeholder: 'banana? peanut butter toast? or u just go in fasted 😤' },
  { id: 'postWorkout', icon: '🥤', name: 'post-workout W meal', isDynamicPost: true, placeholder: 'whey shake? eggs? or nothing bc ur cooked after sets?' },
  { id: 'eveningSnack', icon: '🫖', name: 'evening snack attack', staticTime: '5:00 – 7:00 PM', placeholder: 'chai + biscuits? maggi? fruits? random chakna?' },
  { id: 'dinner', icon: '🍽️', name: 'dinner (the big one)', staticTime: '8:00 – 10:00 PM', placeholder: 'whatever mum made? roti + dal? chicken curry?' },
  { id: 'bedtime', icon: '🌙', name: 'late night munchies', staticTime: '10:00 PM+', placeholder: 'milk? random snacking? straight to bed?' },
];

export default function Step2Diet({ 
  profile, setProfile, 
  dietMeals, setDietMeals, 
  skippedMeals, setSkippedMeals, 
  gymStartMin, setGymStartMin,
  onBack, onGenerate 
}) {
  const [error, setError] = useState(false);
  const trackRef = useRef(null);
  const blockRef = useRef(null);
  
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffsetPx, setDragOffsetPx] = useState(0);

  const getMinFromPointerX = useCallback((clientX) => {
    if (!trackRef.current) return gymStartMin;
    const rect = trackRef.current.getBoundingClientRect();
    const relX = clientX - rect.left;
    const pct = Math.max(0, Math.min(1, relX / rect.width));
    const raw = TIMELINE_START + pct * (TIMELINE_END - TIMELINE_START);
    const snapped = Math.round(raw / 15) * 15;
    return Math.max(TIMELINE_START, Math.min(TIMELINE_END - GYM_DURATION, snapped));
  }, [gymStartMin]);

  useEffect(() => {
    const handlePointerMove = (e) => {
      if (!isDragging) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const blockWidth = blockRef.current ? blockRef.current.offsetWidth : 60;
      const adjustedX = clientX - dragOffsetPx + (blockWidth / 2);
      setGymStartMin(getMinFromPointerX(adjustedX));
    };
    const handlePointerUp = () => setIsDragging(false);

    if (isDragging) {
      document.addEventListener('mousemove', handlePointerMove);
      document.addEventListener('touchmove', handlePointerMove, { passive: false });
      document.addEventListener('mouseup', handlePointerUp);
      document.addEventListener('touchend', handlePointerUp);
    }
    return () => {
      document.removeEventListener('mousemove', handlePointerMove);
      document.removeEventListener('touchmove', handlePointerMove);
      document.removeEventListener('mouseup', handlePointerUp);
      document.removeEventListener('touchend', handlePointerUp);
    };
  }, [isDragging, dragOffsetPx, getMinFromPointerX, setGymStartMin]);

  const handleBlockPointerDown = (e) => {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const rect = blockRef.current.getBoundingClientRect();
    setDragOffsetPx(clientX - rect.left);
    setIsDragging(true);
  };

  const handleTrackClick = (e) => {
    if (blockRef.current && blockRef.current.contains(e.target)) return;
    setGymStartMin(getMinFromPointerX(e.clientX));
  };

  const handleMealChange = (id, value) => setDietMeals(prev => ({ ...prev, [id]: value }));
  const toggleSkip = (id) => {
    setSkippedMeals(prev => {
      const newSkipped = new Set(prev);
      if (newSkipped.has(id)) newSkipped.delete(id);
      else newSkipped.add(id);
      return newSkipped;
    });
  };

  const toggleHabit = (habit) => {
    setProfile(prev => {
      const newHabits = prev.habits.includes(habit) 
        ? prev.habits.filter(h => h !== habit) : [...prev.habits, habit];
      return { ...prev, habits: newHabits };
    });
  };

  const handleInputChange = (e) => setProfile(prev => ({ ...prev, [e.target.id]: e.target.value }));

  const validateAndGenerate = () => {
    let filledCount = 0;
    MEAL_SLOTS.forEach(slot => {
      if (!skippedMeals.has(slot.id)) filledCount++;
    });
    if (filledCount < 2) {
      setError(true);
      return;
    }
    setError(false);
    onGenerate();
  };

  const totalRange = TIMELINE_END - TIMELINE_START;
  const blockPct   = ((gymStartMin - TIMELINE_START) / totalRange) * 100;
  const widthPct   = (GYM_DURATION / totalRange) * 100;
  const prePct     = Math.max(0, ((gymStartMin - PRE_OFFSET - TIMELINE_START) / totalRange) * 100);
  const postEndPct = Math.min(100, ((gymStartMin + GYM_DURATION + POST_OFFSET - TIMELINE_START) / totalRange) * 100);

  const renderMealSlot = (slot) => {
    const isSkipped = skippedMeals.has(slot.id);
    let timeLabel = slot.staticTime;
    if (slot.isDynamicPre) timeLabel = `~${formatTime(gymStartMin - PRE_OFFSET)}`;
    if (slot.isDynamicPost) timeLabel = `~${formatTime(gymStartMin + POST_OFFSET)}`;

    return (
      <div key={slot.id} className={`meal-input-row ${isSkipped ? 'skipped' : ''}`}>
        <div className="meal-label-block">
          <span className="meal-icon">{slot.icon}</span>
          <div className="meal-label-text">
            <span className="meal-label-name">{slot.name}</span>
            <span className="meal-label-time">{timeLabel}</span>
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

  const hourLabels = [6, 8, 10, 12, 14, 16, 18, 20, 22];

  return (
    <div className="step active">
      <div className="card">
        <div className="card-title">ok fr, what are u actually eating rn? 👀</div>
        <div className="card-subtitle">
          no judging bestie — type what u eat, type &quot;none&quot; if u skip that slot (we&apos;ll suggest something), or hit <strong style={{color:'var(--gold)'}}>nah skip</strong> to fully ignore a meal slot.
        </div>

        <div className="gym-scheduler-wrap">
          <div className="gym-scheduler-header">
            <div className="gym-scheduler-title">🏋️ drag ur gym time on the timeline</div>
          </div>

          <div className="gym-hour-labels">
            {hourLabels.map(h => {
              const pct = ((h * 60 - TIMELINE_START) / totalRange) * 100;
              return (
                <div key={h} className="gym-hour-label" style={{ left: `${pct}%` }}>
                  {h <= 12 ? `${h === 12 ? 12 : h}${h < 12 ? 'AM' : 'PM'}` : `${h-12}PM`}
                </div>
              );
            })}
          </div>

          <div className="gym-timeline-outer">
            <div className="gym-track-bg" ref={trackRef} onClick={handleTrackClick}>
              <div className="gym-pre-zone" style={{ left: `${prePct}%`, width: `${blockPct - prePct}%` }}></div>
              <div className="gym-post-zone" style={{ left: `${blockPct + widthPct}%`, width: `${postEndPct - (blockPct + widthPct)}%` }}></div>
              <div 
                className="gym-block" 
                ref={blockRef}
                style={{ left: `${blockPct}%`, width: `${widthPct}%` }}
                onMouseDown={handleBlockPointerDown}
                onTouchStart={handleBlockPointerDown}
              >
                <span className="gym-block-icon">🏋️</span>
                <span className="gym-block-label">Gym</span>
                <span className="gym-block-time">{formatTime(gymStartMin)}</span>
              </div>
            </div>
          </div>

          <div className="gym-adj-info">
            <span>Pre-workout meal: <strong>{formatTime(gymStartMin - PRE_OFFSET)}</strong></span>
            <span>Gym start: <strong>{formatTime(gymStartMin)}</strong></span>
            <span>Post-workout meal: <strong>{formatTime(gymStartMin + POST_OFFSET)}</strong></span>
          </div>
        </div>

        <div className="diet-section-label" style={{marginTop:'0.25rem'}}>morning grind 🌅</div>
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
