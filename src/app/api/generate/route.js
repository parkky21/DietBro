import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const profile = await req.json();

    const prompt = `You are an elite fitness nutrition coach with years of experience helping gym beginners transform their physique through strategic diet engineering. A user has come to you for help.

USER PROFILE:
- Name: ${profile.name}
- Age: ${profile.age} years
- Weight: ${profile.weight} kg
- Height: ${profile.height} cm
- Sex: ${profile.sex}
- Activity Level: ${profile.activity}
- Primary Goal: ${profile.goal}
- Dietary Preference: ${profile.dietType}
- Allergies/Intolerances: ${profile.allergies || 'None mentioned'}
- Bad habits to fix: ${profile.habits?.length > 0 ? profile.habits.join(', ') : 'None selected'}
- Preferred meals per day: ${profile.mealsPerDay || 'Not specified'}
- Monthly food budget: ${profile.budget || 'Not specified'}
- Current supplements: ${profile.supplements || 'None'}
- Additional notes: ${profile.notes || 'None'}

CURRENT DIET (what they eat now):
"${profile.currentDiet}"

Based on this, create a complete, optimised, realistic and practical Indian diet plan. The plan must be suitable for a gym beginner. 

Respond ONLY with a valid JSON object (no markdown, no backticks, no extra text) in this exact structure:
{
  "headline": "A powerful, personal 6-8 word tagline for their plan",
  "calories": <number>,
  "protein": <number>,
  "carbs": <number>,
  "fats": <number>,
  "meals": [
    {
      "time": "e.g. 7:00 AM",
      "label": "e.g. Pre-Workout",
      "name": "Meal name",
      "calories": <number>,
      "protein": <number>,
      "carbs": <number>,
      "fats": <number>,
      "foods": [
        { "item": "Food name", "portion": "e.g. 200g / 2 chapatis" }
      ]
    }
  ],
  "coachNotes": "2-3 sentences of personal, motivating advice addressing their specific habits and goals. Direct and real — like talking to a friend with a great physique."
}

Include ${profile.mealsPerDay || '4-5'} meals. Make food items Indian, affordable, accessible. Be specific with portions. Macros must add up correctly.`;

    const apiKey = process.env.ANTHROPIC_API_KEY;
    
    if (!apiKey) {
      // For local testing without API key, return a mock response
      console.warn("ANTHROPIC_API_KEY is missing. Returning mock data.");
      return NextResponse.json({
        headline: "Time to build that dream physique",
        calories: 2500,
        protein: 150,
        carbs: 300,
        fats: 75,
        meals: [
          {
            time: "8:00 AM",
            label: "Breakfast",
            name: "Protein Oats & Eggs",
            calories: 500,
            protein: 30,
            carbs: 50,
            fats: 15,
            foods: [
              { item: "Oats with milk", portion: "50g" },
              { item: "Whole Eggs", portion: "2 large" }
            ]
          }
        ],
        coachNotes: "Remember, consistency over perfection. Let's get these gains!"
      });
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1500,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Anthropic Error:', errorText);
      throw new Error('Failed to generate plan from AI');
    }

    const data = await response.json();
    const rawText = data.content.map(i => i.text || '').join('');
    
    // Attempt to parse JSON safely
    const clean = rawText.replace(/```json|```/g, '').trim();
    const plan = JSON.parse(clean);

    return NextResponse.json(plan);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
