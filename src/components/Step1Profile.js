export default function Step1Profile({ profile, setProfile, onNext }) {
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

  const validateAndNext = () => {
    const { name, age, weight, height, sex, activity, goal, dietType } = profile;
    if (!name || !age || !weight || !height || !sex || !activity || !goal || !dietType) {
      alert('Please fill in all required fields and select your goal & dietary preference.');
      return;
    }
    onNext();
  };

  return (
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
            <input type="number" id="weight" value={profile.weight} onChange={handleInputChange} placeholder="e.g. 68 — be honest" min="30" max="200" />
          </div>
          <div className="form-group">
            <label>height (cm) 📏</label>
            <input type="number" id="height" value={profile.height} onChange={handleInputChange} placeholder="e.g. 175" min="100" max="250" />
          </div>
          <div className="form-group">
            <label>ur gender bestie</label>
            <select id="sex" value={profile.sex} onChange={handleInputChange}>
              <option value="">pick one…</option>
              <option value="male">male 💪</option>
              <option value="female">female 💅</option>
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
              <button className={`goal-pill ${profile.goal === 'muscle gain' ? 'selected' : ''}`} onClick={() => handleGoalSelect('muscle gain')}>💪 get swole no cap</button>
              <button className={`goal-pill ${profile.goal === 'fat loss' ? 'selected' : ''}`} onClick={() => handleGoalSelect('fat loss')}>🔥 burn it all down</button>
              <button className={`goal-pill ${profile.goal === 'lean bulk' ? 'selected' : ''}`} onClick={() => handleGoalSelect('lean bulk')}>⚡ lean bulk szn</button>
              <button className={`goal-pill ${profile.goal === 'body recomposition' ? 'selected' : ''}`} onClick={() => handleGoalSelect('body recomposition')}>🎯 full body reco arc</button>
              <button className={`goal-pill ${profile.goal === 'maintain and tone' ? 'selected' : ''}`} onClick={() => handleGoalSelect('maintain and tone')}>✨ stay snatched</button>
            </div>
          </div>
          <div className="form-group full">
            <label>what u eat (food preference) 🍽️</label>
            <div className="goal-pills">
              <button className={`goal-pill ${profile.dietType === 'non-vegetarian' ? 'selected' : ''}`} onClick={() => handleDietSelect('non-vegetarian')}>🥩 full send non-veg</button>
              <button className={`goal-pill ${profile.dietType === 'vegetarian' ? 'selected' : ''}`} onClick={() => handleDietSelect('vegetarian')}>🥦 veg gang</button>
              <button className={`goal-pill ${profile.dietType === 'vegan' ? 'selected' : ''}`} onClick={() => handleDietSelect('vegan')}>🌱 vegan era</button>
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
  );
}
