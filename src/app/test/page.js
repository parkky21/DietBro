'use client';

import { useState } from 'react';
import ResultSection from '@/components/ResultSection';

/**
 * TEST PAGE — /test
 * 
 * Renders the ResultSection directly with mock data so you can
 * test the inline meal editing without filling out the entire form.
 * 
 * Visit http://localhost:3000/test to use it.
 */

const MOCK_PROFILE = {
  name: 'Test Bro',
  age: '22',
  weight: '70',
  height: '175',
  sex: 'male',
  activity: 'moderate',
  goal: 'muscle gain',
  dietType: 'non-vegetarian',
  allergies: '',
};

const MOCK_PLAN = {
  headline: "Lean Gains Engine 🔥",
  calories: 2650,
  protein: 175,
  carbs: 310,
  fats: 72,
  meals: [
    {
      time: "6:30 AM",
      label: "Wake-up Drink",
      name: "Golden Boost Shake",
      calories: 180,
      protein: 8,
      carbs: 20,
      fats: 6,
      foods: [
        { item: "Warm water with honey & lemon", portion: "1 glass" },
        { item: "Soaked almonds", portion: "8-10 pcs" },
        { item: "Whey protein (half scoop)", portion: "15g" },
      ]
    },
    {
      time: "8:00 AM",
      label: "Breakfast",
      name: "Protein Oat Bowl",
      calories: 520,
      protein: 35,
      carbs: 55,
      fats: 16,
      foods: [
        { item: "Oats cooked in milk", portion: "50g oats + 200ml milk" },
        { item: "Whole eggs", portion: "3 large" },
        { item: "Banana", portion: "1 medium" },
        { item: "Peanut butter", portion: "1 tbsp" },
      ]
    },
    {
      time: "1:00 PM",
      label: "Lunch",
      name: "Chicken Rice Power Bowl",
      calories: 680,
      protein: 48,
      carbs: 72,
      fats: 18,
      foods: [
        { item: "Grilled chicken breast", portion: "200g" },
        { item: "Brown rice", portion: "1.5 cups cooked" },
        { item: "Dal (moong/toor)", portion: "1 bowl" },
        { item: "Mixed sabzi", portion: "1 bowl" },
        { item: "Curd", portion: "100g" },
      ]
    },
    {
      time: "3:30 PM",
      label: "Pre-Workout",
      name: "Energy Loader",
      calories: 280,
      protein: 12,
      carbs: 45,
      fats: 5,
      foods: [
        { item: "Banana", portion: "1 large" },
        { item: "White bread with jam", portion: "2 slices" },
        { item: "Black coffee", portion: "1 cup" },
      ]
    },
    {
      time: "6:30 PM",
      label: "Post-Workout",
      name: "Recovery Shake + Snack",
      calories: 350,
      protein: 38,
      carbs: 40,
      fats: 4,
      foods: [
        { item: "Whey protein shake", portion: "1 scoop + water" },
        { item: "Boiled sweet potato", portion: "150g" },
      ]
    },
    {
      time: "9:00 PM",
      label: "Dinner",
      name: "Egg Chapati Plate",
      calories: 540,
      protein: 32,
      carbs: 58,
      fats: 18,
      foods: [
        { item: "Whole wheat chapati", portion: "3 medium" },
        { item: "Egg bhurji (4 eggs)", portion: "1 plate" },
        { item: "Onion-tomato salad", portion: "1 bowl" },
        { item: "Glass of milk", portion: "200ml" },
      ]
    },
    {
      time: "10:30 PM",
      label: "Before Bed",
      name: "Casein Chill",
      calories: 100,
      protein: 12,
      carbs: 10,
      fats: 5,
      foods: [
        { item: "Paneer cubes", portion: "50g" },
        { item: "Handful of walnuts", portion: "5 pcs" },
      ]
    },
  ],
  coachNotes: "Bro you're on the right track. Just stay consistent with your protein intake — aim for at least 150g daily. Don't skip the post-workout shake, that window matters. And hydrate like your gains depend on it, because they do 💪"
};

export default function TestPage() {
  const [plan, setPlan] = useState(MOCK_PLAN);
  const [editLog, setEditLog] = useState([]);

  const handlePlanUpdate = (newPlan) => {
    setPlan(newPlan);
    // Log the change for debugging
    setEditLog(prev => [
      ...prev,
      {
        time: new Date().toLocaleTimeString(),
        totalCals: Math.round(newPlan.calories),
        totalProtein: Math.round(newPlan.protein),
        meals: newPlan.meals.map(m => m.name),
      }
    ]);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <div style={{ 
        background: 'var(--bg-3)', 
        border: '1px solid var(--border)', 
        padding: '1.25rem 1.5rem', 
        marginBottom: '2rem' 
      }}>
        <div style={{ 
          fontFamily: 'var(--font-space-mono), monospace', 
          fontSize: '0.65rem', 
          letterSpacing: '0.2em', 
          color: 'var(--gold)', 
          textTransform: 'uppercase',
          marginBottom: '0.5rem'
        }}>
          🧪 TEST MODE — Meal Edit Testing
        </div>
        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 300, lineHeight: 1.6 }}>
          This page renders the result section with mock data. Try clicking the ✏️ edit button on any meal card, type what you want to change, and hit &quot;fix it bro&quot;.
        </div>
      </div>

      <ResultSection 
        plan={plan} 
        name="Test Bro" 
        profile={MOCK_PROFILE}
        onRestart={() => { setPlan(MOCK_PLAN); setEditLog([]); }}
        onPlanUpdate={handlePlanUpdate}
      />

      {editLog.length > 0 && (
        <div style={{ 
          marginTop: '2rem', 
          background: 'var(--bg-3)', 
          border: '1px solid var(--border)', 
          padding: '1.25rem' 
        }}>
          <div style={{ 
            fontFamily: 'var(--font-space-mono), monospace', 
            fontSize: '0.62rem', 
            letterSpacing: '0.18em', 
            color: 'var(--gold)', 
            textTransform: 'uppercase',
            marginBottom: '0.75rem'
          }}>
            📋 Edit Log ({editLog.length} edits)
          </div>
          {editLog.map((log, i) => (
            <div key={i} style={{ 
              fontSize: '0.78rem', 
              color: 'var(--text-muted)', 
              fontWeight: 300,
              padding: '0.5rem 0',
              borderBottom: '1px solid var(--border)',
            }}>
              <strong style={{ color: 'var(--text)' }}>[{log.time}]</strong>{' '}
              Cals: {log.totalCals} | Protein: {log.totalProtein}g | 
              Meals: {log.meals.join(', ')}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
