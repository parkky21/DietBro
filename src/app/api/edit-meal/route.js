import { NextResponse } from 'next/server';
import { generateContentWithFallback } from '../../../lib/llm';

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

    if (!process.env.GEMINI_API_KEY && !process.env.GROQ_API_KEY && !process.env.OPENROUTER_API_KEY) {
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

    const rawText = await generateContentWithFallback(prompt);
    const clean = rawText.replace(/```json|```/g, '').trim();
    const updatedMeal = JSON.parse(clean);

    return NextResponse.json(updatedMeal);
  } catch (error) {
    console.error('Edit API Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to edit meal' }, { status: 500 });
  }
}
