const storeService = require('./storeService');
const recipeService = require('./recipeService');

function generateShoppingList(recipeId) {
  const recipe = recipeService.getRecipeById(recipeId);
  if (!recipe) return null;

  return {
    recipe_id: recipe.id,
    recipe_name: recipe.name,
    items: recipe.ingredients.map(ing => ({
      name: ing.name,
      quantity: ing.quantity || '',
      unit: ing.unit || '',
      category: ing.category || 'other'
    }))
  };
}

function optimizeShopping(recipeId, userLat, userLng, radiusKm, mode = 'cost') {
  const shoppingList = generateShoppingList(recipeId);
  if (!shoppingList) return null;

  const nearbyStores = storeService.findStoresNearby(userLat, userLng, radiusKm);
  if (nearbyStores.length === 0) {
    return {
      ...shoppingList,
      mode,
      stores: [],
      plan: [],
      total_cost: null,
      message: 'No stores found within your search radius'
    };
  }

  const storeIds = nearbyStores.map(s => s.id);

  // Find deals for each ingredient
  const itemResults = shoppingList.items.map(item => {
    const deals = storeService.searchDeals(item.name, storeIds);
    return {
      ...item,
      deals: deals.map(d => ({
        store_id: d.store_id,
        store_name: d.store_name,
        store_address: d.store_address,
        price: d.price,
        sale_price: d.sale_price,
        effective_price: d.sale_price || d.price,
        unit: d.unit
      }))
    };
  });

  if (mode === 'cost') {
    return optimizeForCost(shoppingList, itemResults, nearbyStores);
  } else {
    return optimizeForConvenience(shoppingList, itemResults, nearbyStores);
  }
}

function optimizeForCost(shoppingList, itemResults, nearbyStores) {
  const plan = {};
  let totalCost = 0;
  const unmatched = [];

  for (const item of itemResults) {
    if (item.deals.length === 0) {
      unmatched.push(item.name);
      continue;
    }

    // Pick cheapest deal
    const best = item.deals.reduce((a, b) =>
      a.effective_price < b.effective_price ? a : b
    );

    if (!plan[best.store_id]) {
      const store = nearbyStores.find(s => s.id === best.store_id);
      plan[best.store_id] = {
        store_id: best.store_id,
        store_name: best.store_name,
        store_address: best.store_address,
        distance_km: store ? store.distance_km : null,
        items: []
      };
    }

    plan[best.store_id].items.push({
      name: item.name,
      quantity: item.quantity,
      unit: item.unit,
      price: best.effective_price,
      original_price: best.price,
      on_sale: best.sale_price !== null && best.sale_price !== undefined
    });

    totalCost += best.effective_price;
  }

  return {
    ...shoppingList,
    mode: 'cost',
    total_cost: Math.round(totalCost * 100) / 100,
    store_stops: Object.keys(plan).length,
    plan: Object.values(plan),
    unmatched_items: unmatched
  };
}

function optimizeForConvenience(shoppingList, itemResults, nearbyStores) {
  // For each store, count how many items it can fulfill and at what cost
  const storeScores = nearbyStores.map(store => {
    let itemCount = 0;
    let totalCost = 0;
    const items = [];

    for (const item of itemResults) {
      const deal = item.deals.find(d => d.store_id === store.id);
      if (deal) {
        itemCount++;
        totalCost += deal.effective_price;
        items.push({
          name: item.name,
          quantity: item.quantity,
          unit: item.unit,
          price: deal.effective_price,
          original_price: deal.price,
          on_sale: deal.sale_price !== null && deal.sale_price !== undefined
        });
      }
    }

    return {
      store_id: store.id,
      store_name: store.name,
      store_address: store.location_address,
      distance_km: store.distance_km,
      items_available: itemCount,
      total_items: itemResults.length,
      coverage: itemResults.length > 0 ? itemCount / itemResults.length : 0,
      total_cost: Math.round(totalCost * 100) / 100,
      items
    };
  });

  // Sort by coverage (descending), then distance (ascending)
  storeScores.sort((a, b) => {
    if (b.coverage !== a.coverage) return b.coverage - a.coverage;
    return a.distance_km - b.distance_km;
  });

  const best = storeScores[0] || null;
  const unmatched = best
    ? itemResults.filter(item => !item.deals.some(d => d.store_id === best.store_id)).map(i => i.name)
    : itemResults.map(i => i.name);

  return {
    ...shoppingList,
    mode: 'convenience',
    recommended_store: best,
    total_cost: best ? best.total_cost : null,
    store_stops: best ? 1 : 0,
    plan: best ? [{ store_id: best.store_id, store_name: best.store_name, store_address: best.store_address, distance_km: best.distance_km, items: best.items }] : [],
    alternatives: storeScores.slice(1, 4),
    unmatched_items: unmatched
  };
}

module.exports = { generateShoppingList, optimizeShopping };
