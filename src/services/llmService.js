const memoryService = require('./memoryService');
const recipeService = require('./recipeService');

// Provider-agnostic LLM interface
// Supports: openai, anthropic, or a built-in fallback for demo purposes

async function callLLM(messages, provider) {
  const p = provider || process.env.LLM_PROVIDER || 'demo';

  if (p === 'openai') {
    return callOpenAI(messages);
  } else if (p === 'anthropic') {
    return callAnthropic(messages);
  } else {
    return callDemo(messages);
  }
}

async function callOpenAI(messages) {
  const apiKey = process.env.LLM_API_KEY;
  const model = process.env.LLM_MODEL || 'gpt-4o-mini';

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({ model, messages, temperature: 0.7, max_tokens: 1000 })
  });

  const data = await response.json();
  if (data.error) throw new Error(data.error.message);
  return data.choices[0].message.content;
}

async function callAnthropic(messages) {
  const apiKey = process.env.LLM_API_KEY;
  const model = process.env.LLM_MODEL || 'claude-sonnet-4-5-20250929';

  // Convert messages to Anthropic format
  const system = messages.find(m => m.role === 'system')?.content || '';
  const userMessages = messages.filter(m => m.role !== 'system');

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model,
      max_tokens: 1000,
      system,
      messages: userMessages
    })
  });

  const data = await response.json();
  if (data.error) throw new Error(data.error.message);
  return data.content[0].text;
}

// Demo mode recipe cache (avoid loading 1000 recipes per chat message)
let _demoRecipeCache = null;
let _demoCacheTime = 0;
const DEMO_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getDemoRecipes() {
  const now = Date.now();
  if (!_demoRecipeCache || now - _demoCacheTime > DEMO_CACHE_TTL) {
    _demoRecipeCache = recipeService.getAllRecipes();
    _demoCacheTime = now;
  }
  return _demoRecipeCache;
}

// Demo mode - smart keyword-based responses using recipe database
async function callDemo(messages) {
  const lastMsg = messages[messages.length - 1]?.content?.toLowerCase() || '';
  const systemMsg = messages.find(m => m.role === 'system')?.content || '';
  const allRecipes = getDemoRecipes();

  // Extract user context from system message
  const hasAllergies = systemMsg.includes('Allergies:');
  const hasDietary = systemMsg.includes('Dietary:');

  // Parse what the user is asking for
  if (lastMsg.includes('what should i') || lastMsg.includes('suggest') || lastMsg.includes('recommend') || lastMsg.includes('what can i')) {
    return suggestMeals(lastMsg, systemMsg, allRecipes);
  }

  if (lastMsg.includes('quick') || lastMsg.includes('fast') || lastMsg.includes('under') || lastMsg.includes('minute')) {
    return suggestQuickMeals(lastMsg, allRecipes);
  }

  if (lastMsg.includes('cheap') || lastMsg.includes('budget') || lastMsg.includes('affordable')) {
    return suggestBudgetMeals(lastMsg, allRecipes);
  }

  if (lastMsg.includes('i have') || lastMsg.includes('ingredients')) {
    return suggestByIngredients(lastMsg, allRecipes);
  }

  if (lastMsg.includes('allerg') || lastMsg.includes('don\'t like') || lastMsg.includes('hate') || lastMsg.includes('can\'t eat')) {
    return `I've noted your dietary preference. I'll remember this for future suggestions! Is there anything specific you'd like me to recommend based on your preferences?

[MEMORY: ${lastMsg}]`;
  }

  // Default - suggest random meals
  const sample = allRecipes.slice(0, Math.min(3, allRecipes.length));
  if (sample.length === 0) {
    return "I'd love to help you find a meal! It looks like the recipe database is still loading. Please check back soon, or tell me about your dietary preferences so I can remember them for later!";
  }

  return `Here are some ideas for you:\n\n${sample.map((r, i) =>
    `**${i + 1}. ${r.name}** (${r.origin})\n   ${r.dietary?.join(', ') || 'No specific diet'} | Prep: ${r.prep_time_minutes}min | Cook: ${r.cook_time_minutes}min`
  ).join('\n\n')}\n\nWould you like the full recipe for any of these? Or tell me more about what you're in the mood for!`;
}

function suggestMeals(msg, systemMsg, recipes) {
  let filtered = [...recipes];

  // Check for cuisine preferences
  const cuisines = ['indian', 'italian', 'mexican', 'french', 'chinese', 'japanese', 'thai', 'korean', 'mediterranean', 'american'];
  for (const c of cuisines) {
    if (msg.includes(c)) {
      filtered = filtered.filter(r => r.origin.toLowerCase() === c);
      break;
    }
  }

  // Check dietary in message
  const diets = ['vegan', 'vegetarian', 'keto', 'gluten-free', 'gluten free', 'dairy-free', 'dairy free'];
  for (const d of diets) {
    if (msg.includes(d)) {
      filtered = filtered.filter(r => r.dietary?.some(dt => dt.toLowerCase().includes(d.replace('-', ''))));
    }
  }

  // Shuffle and pick top 3
  filtered.sort(() => Math.random() - 0.5);
  const picks = filtered.slice(0, 3);

  if (picks.length === 0) {
    return "I couldn't find recipes matching those criteria. Try broadening your search, or tell me what ingredients you have on hand!";
  }

  return `Based on your preferences, here are my suggestions:\n\n${picks.map((r, i) =>
    `**${i + 1}. ${r.name}** (${r.origin})\n   ${r.dietary?.join(', ') || ''} | Prep: ${r.prep_time_minutes}min | Cook: ${r.cook_time_minutes}min\n   ${r.description || ''}`
  ).join('\n\n')}\n\nWant the full recipe or shopping list for any of these?`;
}

function suggestQuickMeals(msg, recipes) {
  let maxTime = 30;
  const match = msg.match(/(\d+)\s*min/);
  if (match) maxTime = parseInt(match[1]);

  const quick = recipes
    .filter(r => (r.prep_time_minutes + r.cook_time_minutes) <= maxTime)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  if (quick.length === 0) {
    return `I couldn't find recipes under ${maxTime} minutes. Try increasing the time limit!`;
  }

  return `Here are some quick meals (under ${maxTime} minutes total):\n\n${quick.map((r, i) =>
    `**${i + 1}. ${r.name}** (${r.origin})\n   Total time: ${r.prep_time_minutes + r.cook_time_minutes}min | ${r.dietary?.join(', ') || ''}`
  ).join('\n\n')}\n\nWant me to pull up the recipe details?`;
}

function suggestBudgetMeals(msg, recipes) {
  // Suggest recipes with fewer ingredients (proxy for budget)
  const budget = [...recipes]
    .sort((a, b) => a.ingredients.length - b.ingredients.length)
    .slice(0, 5)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  if (budget.length === 0) {
    return "I don't have enough recipes loaded yet. Check back soon!";
  }

  return `Here are some budget-friendly options (fewer ingredients = less to buy):\n\n${budget.map((r, i) =>
    `**${i + 1}. ${r.name}** (${r.origin})\n   ${r.ingredients.length} ingredients | ${r.dietary?.join(', ') || ''}`
  ).join('\n\n')}\n\nWant me to find the best deals on ingredients for any of these?`;
}

function suggestByIngredients(msg, recipes) {
  // Extract ingredients from message
  const words = msg.replace(/i have|and|some|a|the|with|,/gi, ' ').trim().split(/\s+/).filter(w => w.length > 2);

  const scored = recipes.map(r => {
    const matchCount = words.filter(w =>
      r.ingredients.some(ing => ing.name.toLowerCase().includes(w.toLowerCase()))
    ).length;
    return { ...r, matchCount };
  }).filter(r => r.matchCount > 0)
    .sort((a, b) => b.matchCount - a.matchCount)
    .slice(0, 3);

  if (scored.length === 0) {
    return "I couldn't find recipes matching those ingredients. Could you tell me more about what you have?";
  }

  return `Based on what you have, here are some options:\n\n${scored.map((r, i) =>
    `**${i + 1}. ${r.name}** (${r.origin})\n   Uses ${r.matchCount} of your ingredients | ${r.dietary?.join(', ') || ''}`
  ).join('\n\n')}\n\nShall I show you the full recipe and what else you'd need to buy?`;
}

// Extract memory-worthy information from conversation
function extractMemories(userMessage) {
  const msg = userMessage.toLowerCase();
  const memories = [];

  // Allergy detection
  const allergyPatterns = [
    /(?:i'm|i am|i'm)\s+allergic\s+to\s+(.+)/i,
    /(?:allergy|allergies)\s+(?:to|:)\s*(.+)/i,
    /can'?t\s+eat\s+(.+)/i
  ];
  for (const pattern of allergyPatterns) {
    const match = userMessage.match(pattern);
    if (match) {
      memories.push({ text: `Allergic to: ${match[1].trim()}`, category: 'preference', importance: 9, prefType: 'allergy', prefValue: match[1].trim() });
    }
  }

  // Dislike detection
  const dislikePatterns = [
    /(?:i\s+)?(?:don'?t|do not)\s+like\s+(.+)/i,
    /(?:i\s+)?hate\s+(.+)/i
  ];
  for (const pattern of dislikePatterns) {
    const match = userMessage.match(pattern);
    if (match) {
      memories.push({ text: `Dislikes: ${match[1].trim()}`, category: 'preference', importance: 7, prefType: 'dislike', prefValue: match[1].trim() });
    }
  }

  // Dietary preference detection
  const dietaryKeywords = ['vegan', 'vegetarian', 'keto', 'gluten-free', 'gluten free', 'dairy-free', 'dairy free', 'paleo', 'halal', 'kosher'];
  for (const diet of dietaryKeywords) {
    if (msg.includes(diet) && (msg.includes('i am') || msg.includes("i'm") || msg.includes('i eat') || msg.includes('i follow') || msg.includes('i\'m'))) {
      memories.push({ text: `Follows ${diet} diet`, category: 'preference', importance: 8, prefType: 'dietary', prefValue: diet });
    }
  }

  // Household size
  const householdMatch = userMessage.match(/(?:cooking|cook|feed|family|people)\s+(?:for\s+)?(\d+)/i);
  if (householdMatch) {
    memories.push({ text: `Cooking for ${householdMatch[1]} people`, category: 'context', importance: 6 });
  }

  return memories;
}

async function chat(userId, userMessage, conversationHistory = []) {
  const userContext = memoryService.buildUserContext(userId);
  const recipeData = recipeService.getMetadata();

  // Build system prompt
  const systemPrompt = `You are SmartChef, a friendly and knowledgeable personal chef assistant. You help users decide what to cook and optimize their grocery shopping.

Available cuisines: ${recipeData.cuisines?.join(', ') || 'Various'}
Available dietary categories: ${recipeData.dietary_categories?.join(', ') || 'Various'}
Total recipes: ${recipeData.total_recipes || 0}

User Profile:
- Allergies: ${userContext.allergies.length > 0 ? userContext.allergies.join(', ') : 'None noted'}
- Dietary preferences: ${userContext.dietary.length > 0 ? userContext.dietary.join(', ') : 'None noted'}
- Cuisine preferences: ${userContext.cuisine_preferences.length > 0 ? userContext.cuisine_preferences.join(', ') : 'Open to all'}
- Dislikes: ${userContext.dislikes.length > 0 ? userContext.dislikes.join(', ') : 'None noted'}
- Memories: ${userContext.memories.length > 0 ? userContext.memories.join('; ') : 'No prior context'}

Recent meals: ${userContext.recent_meals.length > 0 ? userContext.recent_meals.map(m => `Recipe #${m.recipe_id} (rated ${m.rating || 'unrated'})`).join(', ') : 'None yet'}

Guidelines:
- Be warm, concise, and helpful
- Consider allergies and dietary preferences in ALL suggestions
- Suggest specific recipes from the database when possible
- If the user mentions preferences or restrictions, acknowledge you'll remember them
- Keep responses focused and actionable`;

  // Build messages
  const messages = [
    { role: 'system', content: systemPrompt },
    ...conversationHistory.slice(-10),
    { role: 'user', content: userMessage }
  ];

  // Extract and save memories
  const newMemories = extractMemories(userMessage);
  for (const mem of newMemories) {
    memoryService.addMemory(userId, mem.text, mem.category, mem.importance);
    if (mem.prefType) {
      memoryService.addPreference(userId, mem.prefType, mem.prefValue, 'llm_inferred');
    }
  }

  // Call LLM
  const response = await callLLM(messages);

  // Check if response contains memory markers
  const memoryMatch = response.match(/\[MEMORY:\s*(.+?)\]/);
  if (memoryMatch) {
    memoryService.addMemory(userId, memoryMatch[1], 'preference', 7);
  }

  // Clean response of memory markers
  const cleanResponse = response.replace(/\[MEMORY:.*?\]/g, '').trim();

  return {
    response: cleanResponse,
    memories_captured: newMemories.map(m => m.text)
  };
}

module.exports = { chat, callLLM, extractMemories };
