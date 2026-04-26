import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { mealIndex, meal, editRequest, profile } = await req.json();

    const prompt = `You are an elite fitness nutrition coach. The user has a meal in their diet plan that they want to modify.

USER PROFILE:
- Goal: ${profile.goal}
- Dietary Preference: ${profile.dietType}
- Allergies/Intolerances: ${profile.allergies || 'None'}

CURRENT MEAL (${meal.label} at ${meal.time}):
- Name: ${meal.name}
- Calories: ${meal.calories} kcal
- Foods: ${meal.foods.map(f => `${f.item} (${f.portion})`).join(', ')}
- Macros: P: ${meal.protein}g, C: ${meal.carbs}g, F: ${meal.fats}g

USER'S EDIT REQUEST:
"${editRequest}"

Modify ONLY this meal based on the user's request. Keep the overall calorie and macro targets similar (within ±15%). Respect their dietary preferences and allergies. Keep it practical and Indian-friendly.

Respond ONLY with a valid JSON object (no markdown, no backticks) in this exact structure:
{
  "time": "${meal.time}",
  "label": "${meal.label}",
  "name": "Updated meal name",
  "calories": <number>,
  "protein": <number>,
  "carbs": <number>,
  "fats": <number>,
  "foods": [
    { "item": "Food name", "portion": "e.g. 200g / 2 chapatis" }
  ]
}`;

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Mock response for testing
      return NextResponse.json({
        time: meal.time,
        label: meal.label,
        name: "Updated " + meal.name,
        calories: meal.calories,
        protein: meal.protein,
        carbs: meal.carbs,
        fats: meal.fats,
        foods: [
          { item: "Oats porridge", portion: "50g" },
          { item: "Banana", portion: "1 medium" }
        ]
      });
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json"
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini Edit Error:', errorText);
      throw new Error('Failed to regenerate meal');
    }

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const clean = rawText.replace(/```json|```/g, '').trim();
    const updatedMeal = JSON.parse(clean);

    return NextResponse.json(updatedMeal);
  } catch (error) {
    console.error('Edit API Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to edit meal' }, { status: 500 });
  }
}
