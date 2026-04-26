'use client';

import { useEffect, useMemo } from 'react';

// ── CUSTOM ROAST LINES based on field + value ───────────────────────────────
function getRoast(field, value) {
  const num = parseFloat(value);

  if (field === 'age') {
    if (num < 10)  return pickRandom([
      "bro r u even old enough to use a phone rn 💀",
      "sir this is a diet app not a baby food generator 🍼",
      "u still got recess lunch bro, chill 😭",
    ]);
    if (num < 14) return pickRandom([
      "bestie ur still in ur character arc, come back in a few years 📚",
      "bro go eat whatever ur mom makes and be grateful 🙏",
      "nah fam u still unlocking ur stats, too early for this 🎮",
    ]);
    if (num > 90) return pickRandom([
      "bro are u typing this from the afterlife? 💀⚰️",
      "nah fam u planning meals for ur next reincarnation? 🔄",
      "grandpa legend but r u sure about this number? 👴",
    ]);
    if (num > 65) return pickRandom([
      "ayo OG respect but that age is giving... sus 🧐",
      "uncle energy is valid but double check that real quick 💪",
      "king u sure? we respect the grind at any age tho 👑",
    ]);
  }

  if (field === 'weight') {
    if (num < 20) return pickRandom([
      "bro are u a cat?? 🐱 that weight is unreal",
      "bestie that's literally a backpack not a human 🎒",
      "are u just vibes and no mass?? 💨",
    ]);
    if (num < 35) return pickRandom([
      "nah fam u sure u weighed urself and not ur pillow? 🛏️",
      "bro that's giving skeleton era fr 💀",
      "bestie even my gym bag weighs more, u good? 🏋️",
    ]);
    if (num > 250) return pickRandom([
      "bro u built like a whole squad 😭",
      "nah that's gotta be a typo right... RIGHT?? 📱",
      "king u sure? no judgment but double check that 👀",
    ]);
    if (num > 180) return pickRandom([
      "ayo heavyweight champion era? respect but confirm that 🥊",
      "bro that's some serious mass, u sure about that? 💪",
      "bestie u carrying the whole team's weight rn 🏈",
    ]);
  }

  if (field === 'height') {
    if (num < 100) return pickRandom([
      "bro that's like... a toddler height 💀 u good??",
      "bestie u measuring in inches by accident? 📏",
      "nah fam even minions are taller than that 🟡",
    ]);
    if (num < 130) return pickRandom([
      "short king energy but are u SURE about that? 👑",
      "bro did u measure from the knees down? 🦵",
      "bestie that height is giving garden gnome vibes 🍄",
    ]);
    if (num > 230) return pickRandom([
      "bro u in the NBA or what?? 🏀",
      "nah fam that's skyscraper not human height 🏗️",
      "bestie even Yao Ming would be jealous, confirm that 😳",
    ]);
    if (num > 220) return pickRandom([
      "absolute unit energy but double check that king 📐",
      "bro u sure u didn't add ur shoe height + heels? 👠",
      "that's giving final boss height, u sure? 🎮",
    ]);
  }

  // fallback (shouldn't really hit)
  return pickRandom([
    "bro that can't be right 💀",
    "nah fam, u sure bout that? 🤨",
    "ayo that's kinda sus bestie 👀",
  ]);
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function SusCheckModal({ field, value, unit, onConfirm, onRetry }) {
  const roast = useMemo(() => getRoast(field, value), [field, value]);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onRetry(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onRetry]);

  return (
    <div className="sus-overlay" onClick={onRetry}>
      <div className="sus-modal" onClick={(e) => e.stopPropagation()}>
        <div className="sus-emoji">🚨</div>
        <p className="sus-title">{roast}</p>
        <p className="sus-body">
          u entered <strong>{value} {unit}</strong> for ur <strong>{field}</strong>.<br />
        </p>
        <div className="sus-actions">
          <button className="sus-btn sus-btn-retry" onClick={onRetry}>
            😅 nah lemme fix that
          </button>
          <button className="sus-btn sus-btn-confirm" onClick={onConfirm}>
            💯 deadass, that&apos;s me fr
          </button>
        </div>
      </div>
    </div>
  );
}
