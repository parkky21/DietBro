'use client';

import { useState } from 'react';
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import ProcessStrip from '@/components/ProcessStrip';
import StepIndicator from '@/components/StepIndicator';
import Step1Profile from '@/components/Step1Profile';
import Step2Diet from '@/components/Step2Diet';
import Step3Loading from '@/components/Step3Loading';
import ResultSection from '@/components/ResultSection';

export default function Home() {
  const [currentStep, setCurrentStep] = useState(1);
  const [planResult, setPlanResult] = useState(null);
  const [loadingError, setLoadingError] = useState(null);

  // Global state for Step 1
  const [profile, setProfile] = useState({
    name: '',
    age: '',
    weight: '',
    height: '',
    sex: '',
    activity: '',
    goal: '',
    dietType: '',
    allergies: '',
    habits: [],
    budget: '',
    supplements: '',
    notes: '',
  });

  // Global state for Step 2
  const [dietMeals, setDietMeals] = useState({});
  const [skippedMeals, setSkippedMeals] = useState(new Set());

  const handleNextToStep2 = () => {
    setCurrentStep(2);
    document.getElementById('app').scrollIntoView({ behavior: 'smooth' });
  };

  const handleBackToStep1 = () => {
    setCurrentStep(1);
    document.getElementById('app').scrollIntoView({ behavior: 'smooth' });
  };

  const generatePlan = async () => {
    setCurrentStep(3);
    setLoadingError(null);
    document.getElementById('app').scrollIntoView({ behavior: 'smooth' });

    // Format current diet
    const mealSlots = [
      { id: 'wakeup', label: 'Wake-up Drink', time: '~6:30 AM' },
      { id: 'breakfast', label: 'Breakfast', time: '~8:00 AM' },
      { id: 'midMorning', label: 'Mid-Morning', time: '~10:30 AM' },
      { id: 'lunch', label: 'Lunch', time: '~1:00 PM' },
      { id: 'preWorkout', label: 'Pre-Workout', time: '~5:00 PM' },
      { id: 'postWorkout', label: 'Post-Workout', time: 'After gym' },
      { id: 'eveningSnack', label: 'Evening Snack', time: '~6:30 PM' },
      { id: 'dinner', label: 'Dinner', time: '~9:00 PM' },
      { id: 'bedtime', label: 'Before Bed', time: '~10:30 PM' },
    ];

    const filledMeals = mealSlots
      .map(slot => {
        const val = dietMeals[slot.id]?.trim();
        const skipped = skippedMeals.has(slot.id);
        if (skipped || !val) return null;
        return `${slot.label} (${slot.time}): ${val}`;
      })
      .filter(Boolean);

    const completeProfile = {
      ...profile,
      currentDiet: filledMeals.join('\\n'),
      mealsPerDay: filledMeals.length,
    };

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(completeProfile),
      });

      if (!response.ok) {
        throw new Error('Failed to generate plan. Please try again.');
      }

      const plan = await response.json();
      
      if (plan.error) {
        throw new Error(plan.error);
      }

      setPlanResult(plan);
      setCurrentStep(4); // Result view
    } catch (err) {
      console.error(err);
      setLoadingError(err.message || 'Could not connect to the AI engine. Please try again.');
    }
  };

  const handleRestart = () => {
    setPlanResult(null);
    setProfile({
      name: '', age: '', weight: '', height: '', sex: '', activity: '',
      goal: '', dietType: '', allergies: '', habits: [], budget: '', supplements: '', notes: '',
    });
    setDietMeals({});
    setSkippedMeals(new Set());
    setCurrentStep(1);
    document.getElementById('app').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Nav />
      <Hero />
      <ProcessStrip />

      <section id="app">
        {currentStep < 4 && (
          <StepIndicator currentStep={currentStep} />
        )}

        {currentStep === 1 && (
          <Step1Profile profile={profile} setProfile={setProfile} onNext={handleNextToStep2} />
        )}

        {currentStep === 2 && (
          <Step2Diet 
            profile={profile} 
            setProfile={setProfile}
            dietMeals={dietMeals}
            setDietMeals={setDietMeals}
            skippedMeals={skippedMeals}
            setSkippedMeals={setSkippedMeals}
            onBack={handleBackToStep1}
            onGenerate={generatePlan}
          />
        )}

        {currentStep === 3 && (
          <Step3Loading isError={loadingError} onRestart={handleRestart} />
        )}

        {currentStep === 4 && (
          <ResultSection plan={planResult} name={profile.name} onRestart={handleRestart} />
        )}
      </section>
    </>
  );
}
