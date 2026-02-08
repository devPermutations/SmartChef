// ============================================================
// SmartChef - Frontend Application
// ============================================================

const API = '';
let currentUser = null;
let recipes = [];
let metadata = null;
let recipeOffset = 0;
const RECIPE_LIMIT = 12;
let chatHistory = [];
let searchTimeout = null;
let currentShoppingRecipeId = null;

// ============================================================
// API Helpers
// ============================================================

async function api(path, options = {}) {
  const headers = { 'Content-Type': 'application/json' };

  const res = await fetch(`${API}${path}`, {
    ...options,
    headers,
    credentials: 'include',
  });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data;
}

// ============================================================
// Auth
// ============================================================

function showLogin() {
  document.getElementById('login-form').classList.remove('hidden');
  document.getElementById('register-form').classList.add('hidden');
}

function showRegister() {
  document.getElementById('login-form').classList.add('hidden');
  document.getElementById('register-form').classList.remove('hidden');
}

let pendingOtpSession = null;

async function handleLogin() {
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  const errEl = document.getElementById('login-error');
  errEl.classList.add('hidden');

  try {
    const data = await api('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });

    if (data.requires_otp) {
      pendingOtpSession = data.otp_session;
      showOtpForm(data._dev_otp);
    } else {
      currentUser = data.user;
      enterApp();
    }
  } catch (e) {
    errEl.textContent = e.message;
    errEl.classList.remove('hidden');
  }
}

function showOtpForm(devOtp) {
  document.getElementById('login-form').classList.add('hidden');
  document.getElementById('register-form').classList.add('hidden');
  document.getElementById('otp-form').classList.remove('hidden');
  document.getElementById('otp-error').classList.add('hidden');
  document.getElementById('otp-code').value = '';
  document.getElementById('otp-code').focus();
  if (devOtp) {
    document.getElementById('otp-dev-hint').textContent = `Dev code: ${devOtp}`;
    document.getElementById('otp-dev-hint').classList.remove('hidden');
  } else {
    document.getElementById('otp-dev-hint').classList.add('hidden');
  }
}

async function handleVerifyOtp() {
  const code = document.getElementById('otp-code').value.trim();
  const errEl = document.getElementById('otp-error');
  errEl.classList.add('hidden');

  if (!code || !pendingOtpSession) {
    errEl.textContent = 'Please enter the verification code';
    errEl.classList.remove('hidden');
    return;
  }

  try {
    const data = await api('/api/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ otp_session: pendingOtpSession, code })
    });
    pendingOtpSession = null;
    currentUser = data.user;
    document.getElementById('otp-form').classList.add('hidden');
    enterApp();
  } catch (e) {
    errEl.textContent = e.message;
    errEl.classList.remove('hidden');
  }
}

function backToLogin() {
  pendingOtpSession = null;
  document.getElementById('otp-form').classList.add('hidden');
  showLogin();
}

async function handleRegister() {
  const name = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const password = document.getElementById('reg-password').value;
  const errEl = document.getElementById('register-error');
  errEl.classList.add('hidden');

  try {
    const data = await api('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    });
    currentUser = data.user;
    enterApp();
  } catch (e) {
    errEl.textContent = e.message;
    errEl.classList.remove('hidden');
  }
}

async function logout() {
  try { await api('/api/auth/logout', { method: 'POST' }); } catch { /* ignore */ }
  currentUser = null;
  document.getElementById('auth-screen').classList.remove('hidden');
  document.getElementById('app-screen').classList.add('hidden');
  showLogin();
}

// ============================================================
// App Init
// ============================================================

async function enterApp() {
  document.getElementById('auth-screen').classList.add('hidden');
  document.getElementById('app-screen').classList.remove('hidden');

  // Load user profile
  try {
    const profile = await api('/api/auth/profile');
    currentUser = profile;
    document.getElementById('user-name').textContent = profile.name;
    document.getElementById('avatar-btn').textContent = profile.name.charAt(0).toUpperCase();
  } catch { /* ignore */ }

  // Load metadata and populate filters
  try {
    metadata = await api('/api/recipes/metadata');
    populateFilters();
  } catch { /* ignore */ }

  // Load recipes
  loadRecipes();
}

function populateFilters() {
  if (!metadata) return;

  const cuisineSelect = document.getElementById('filter-cuisine');
  cuisineSelect.innerHTML = '<option value="">All Cuisines</option>';
  (metadata.cuisines || []).forEach(c => {
    const opt = document.createElement('option');
    opt.value = c;
    opt.textContent = c;
    cuisineSelect.appendChild(opt);
  });

  const dietarySelect = document.getElementById('filter-dietary');
  dietarySelect.innerHTML = '<option value="">All Diets</option>';
  (metadata.dietary_categories || []).forEach(d => {
    const opt = document.createElement('option');
    opt.value = d;
    opt.textContent = d;
    dietarySelect.appendChild(opt);
  });
}

// ============================================================
// Tab Navigation
// ============================================================

function switchTab(tabName) {
  // Hide all tabs
  document.querySelectorAll('[id^="tab-"]').forEach(el => el.classList.add('hidden'));
  // Show selected
  document.getElementById(`tab-${tabName}`).classList.remove('hidden');

  // Update nav styles
  document.querySelectorAll('[data-tab]').forEach(btn => {
    if (btn.dataset.tab === tabName) {
      btn.classList.add('tab-active');
      btn.classList.remove('text-gray-500');
    } else {
      btn.classList.remove('tab-active');
      btn.classList.add('text-gray-500');
    }
  });

  // Load tab data if needed
  if (tabName === 'stores') loadStores();
}

// ============================================================
// Recipes
// ============================================================

async function loadRecipes(reset = true) {
  if (reset) {
    recipeOffset = 0;
    recipes = [];
  }

  const q = document.getElementById('recipe-search').value.trim();
  const cuisine = document.getElementById('filter-cuisine').value;
  const dietary = document.getElementById('filter-dietary').value;
  const difficulty = document.getElementById('filter-difficulty').value;

  const params = new URLSearchParams();
  if (q) params.set('q', q);
  if (cuisine) params.set('cuisine', cuisine);
  if (dietary) params.set('dietary', dietary);
  if (difficulty) params.set('difficulty', difficulty);
  params.set('limit', RECIPE_LIMIT);
  params.set('offset', recipeOffset);

  try {
    const data = await api(`/api/recipes/search?${params}`);
    if (reset) {
      recipes = data.recipes;
    } else {
      recipes = [...recipes, ...data.recipes];
    }
    renderRecipes(data.total);
  } catch (e) {
    document.getElementById('recipe-grid').innerHTML = `<p class="text-center text-gray-400 py-8 col-span-full">Failed to load recipes</p>`;
  }
}

function loadMoreRecipes() {
  recipeOffset += RECIPE_LIMIT;
  loadRecipes(false);
}

function debounceSearch() {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => loadRecipes(), 300);
}

function applyFilters() {
  loadRecipes();
}

function renderRecipes(total) {
  const grid = document.getElementById('recipe-grid');

  if (recipes.length === 0) {
    grid.innerHTML = `
      <div class="text-center py-12 col-span-full">
        <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 20a8 8 0 100-16 8 8 0 000 16z"/></svg>
        <h3 class="text-lg font-medium text-gray-500">No recipes found</h3>
        <p class="text-gray-400 mt-1">Try different search terms or filters</p>
      </div>`;
    document.getElementById('load-more-container').classList.add('hidden');
    return;
  }

  grid.innerHTML = recipes.map(r => `
    <div class="bg-white rounded-xl shadow-sm border overflow-hidden cursor-pointer card-hover transition-all duration-200" onclick="showRecipe(${r.id})">
      <div class="bg-gradient-to-br from-brand-100 to-brand-50 p-6 text-center">
        <span class="text-3xl">${getCuisineEmoji(r.origin)}</span>
      </div>
      <div class="p-4">
        <h3 class="font-semibold text-gray-800 mb-1 line-clamp-1">${escHtml(r.name)}</h3>
        <p class="text-xs text-brand-600 font-medium mb-2">${escHtml(r.origin)}</p>
        <div class="flex flex-wrap gap-1 mb-3">
          ${(r.dietary || []).slice(0, 3).map(d => `<span class="bg-brand-50 text-brand-700 text-xs px-2 py-0.5 rounded-full">${escHtml(d)}</span>`).join('')}
        </div>
        <div class="flex items-center text-xs text-gray-400 gap-3">
          <span>Prep ${r.prep_time_minutes}m</span>
          <span>Cook ${r.cook_time_minutes}m</span>
          ${r.difficulty ? `<span class="ml-auto capitalize">${r.difficulty}</span>` : ''}
        </div>
      </div>
    </div>
  `).join('');

  // Show/hide load more
  const loadMoreEl = document.getElementById('load-more-container');
  if (recipes.length < total) {
    loadMoreEl.classList.remove('hidden');
  } else {
    loadMoreEl.classList.add('hidden');
  }
}

function getCuisineEmoji(cuisine) {
  const map = {
    'Indian': '\u{1F35B}', 'Italian': '\u{1F35D}', 'Mexican': '\u{1F32E}',
    'French': '\u{1F950}', 'Chinese': '\u{1F962}', 'Japanese': '\u{1F363}',
    'Thai': '\u{1F35C}', 'Korean': '\u{1F372}', 'Mediterranean': '\u{1F957}',
    'American': '\u{1F354}', 'Greek': '\u{1F96A}', 'Spanish': '\u{1F958}',
    'Vietnamese': '\u{1F35C}', 'Middle Eastern': '\u{1F9C6}', 'Ethiopian': '\u{1F35B}',
    'Caribbean': '\u{1F34C}', 'Brazilian': '\u{1F356}', 'British': '\u{1F967}',
    'German': '\u{1F956}', 'Turkish': '\u{1F9C6}'
  };
  return map[cuisine] || '\u{1F37D}';
}

async function showRecipe(id) {
  const recipe = recipes.find(r => r.id === id);
  if (!recipe) return;

  const modal = document.getElementById('recipe-modal');
  const content = document.getElementById('recipe-modal-content');

  content.innerHTML = `
    <div class="bg-gradient-to-br from-brand-100 to-brand-50 p-8 text-center relative">
      <button onclick="closeRecipeModal()" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
      <span class="text-5xl block mb-2">${getCuisineEmoji(recipe.origin)}</span>
      <h2 class="text-2xl font-bold text-gray-800">${escHtml(recipe.name)}</h2>
      <p class="text-brand-600 font-medium mt-1">${escHtml(recipe.origin)}</p>
    </div>
    <div class="p-6">
      <!-- Tags -->
      <div class="flex flex-wrap gap-2 mb-4">
        ${(recipe.dietary || []).map(d => `<span class="bg-brand-50 text-brand-700 text-xs px-3 py-1 rounded-full">${escHtml(d)}</span>`).join('')}
      </div>

      <!-- Quick Info -->
      <div class="grid grid-cols-3 gap-3 mb-6">
        <div class="text-center bg-gray-50 rounded-lg p-3">
          <p class="text-xs text-gray-400">Prep</p>
          <p class="font-bold text-gray-700">${recipe.prep_time_minutes}m</p>
        </div>
        <div class="text-center bg-gray-50 rounded-lg p-3">
          <p class="text-xs text-gray-400">Cook</p>
          <p class="font-bold text-gray-700">${recipe.cook_time_minutes}m</p>
        </div>
        <div class="text-center bg-gray-50 rounded-lg p-3">
          <p class="text-xs text-gray-400">Difficulty</p>
          <p class="font-bold text-gray-700 capitalize">${recipe.difficulty || 'N/A'}</p>
        </div>
      </div>

      ${recipe.description ? `<p class="text-gray-600 mb-6">${escHtml(recipe.description)}</p>` : ''}

      <!-- Ingredients -->
      <h3 class="font-bold text-gray-800 mb-3">Ingredients</h3>
      <ul class="space-y-2 mb-6">
        ${recipe.ingredients.map(ing => `
          <li class="flex items-start gap-2 text-sm">
            <span class="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5 flex-shrink-0"></span>
            <span>${escHtml(ing.quantity || '')} ${escHtml(ing.unit || '')} ${escHtml(ing.name)}</span>
          </li>
        `).join('')}
      </ul>

      <!-- Instructions -->
      <h3 class="font-bold text-gray-800 mb-3">Instructions</h3>
      <ol class="space-y-3 mb-6">
        ${(recipe.instructions || []).map((step, i) => `
          <li class="flex gap-3 text-sm">
            <span class="w-6 h-6 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center flex-shrink-0 text-xs font-bold">${i + 1}</span>
            <span class="text-gray-600">${escHtml(step)}</span>
          </li>
        `).join('')}
      </ol>

      <!-- Actions -->
      <div class="flex gap-3">
        <button onclick="selectRecipe(${recipe.id})" class="flex-1 bg-brand-600 text-white rounded-xl py-3 font-semibold hover:bg-brand-700 transition">
          Select This Meal
        </button>
        <button onclick="viewShoppingList(${recipe.id})" class="flex-1 border-2 border-brand-600 text-brand-600 rounded-xl py-3 font-semibold hover:bg-brand-50 transition">
          Shopping List
        </button>
      </div>
    </div>
  `;

  modal.classList.remove('hidden');
}

function closeRecipeModal() {
  document.getElementById('recipe-modal').classList.add('hidden');
}

async function selectRecipe(recipeId) {
  try {
    await api(`/api/recipes/${recipeId}/select`, {
      method: 'POST',
      body: JSON.stringify({ fulfillment_type: 'in_store' })
    });
    closeRecipeModal();
    viewShoppingList(recipeId);
  } catch (e) {
    alert('Error selecting recipe: ' + e.message);
  }
}

// ============================================================
// Shopping List
// ============================================================

async function viewShoppingList(recipeId) {
  closeRecipeModal();
  switchTab('shopping');
  currentShoppingRecipeId = recipeId;

  const emptyEl = document.getElementById('shopping-empty');
  const contentEl = document.getElementById('shopping-content');

  try {
    const list = await api(`/api/shopping/list/${recipeId}`);

    emptyEl.classList.add('hidden');
    contentEl.classList.remove('hidden');

    contentEl.innerHTML = `
      <div class="mb-4">
        <h2 class="text-xl font-bold text-gray-800">${escHtml(list.recipe_name)}</h2>
        <p class="text-sm text-gray-500">${list.items.length} ingredients needed</p>
      </div>

      <div class="bg-white rounded-xl border divide-y mb-4">
        ${list.items.map(item => `
          <div class="p-3 flex items-center gap-3">
            <input type="checkbox" class="w-5 h-5 rounded border-gray-300 text-brand-600 focus:ring-brand-500">
            <div class="flex-1">
              <p class="font-medium text-gray-800">${escHtml(item.name)}</p>
              <p class="text-xs text-gray-400">${escHtml(item.quantity)} ${escHtml(item.unit)}</p>
            </div>
          </div>
        `).join('')}
      </div>

      <div class="flex gap-3">
        <button onclick="optimizeShopping(${recipeId}, 'cost')" class="flex-1 bg-brand-600 text-white rounded-xl py-3 font-semibold hover:bg-brand-700 transition text-sm">
          Optimize for Cost
        </button>
        <button onclick="optimizeShopping(${recipeId}, 'convenience')" class="flex-1 border-2 border-brand-600 text-brand-600 rounded-xl py-3 font-semibold hover:bg-brand-50 transition text-sm">
          Optimize for Convenience
        </button>
      </div>
    `;
  } catch (e) {
    contentEl.innerHTML = `<p class="text-red-500 text-center py-8">${e.message}</p>`;
    contentEl.classList.remove('hidden');
    emptyEl.classList.add('hidden');
  }
}

async function optimizeShopping(recipeId, mode) {
  const modal = document.getElementById('optimize-modal');
  const content = document.getElementById('optimize-content');

  content.innerHTML = `<div class="flex justify-center py-8"><div class="loader"></div></div>`;
  modal.classList.remove('hidden');

  try {
    const result = await api(`/api/shopping/optimize/${recipeId}?mode=${mode}`);

    if (result.plan.length === 0) {
      content.innerHTML = `
        <div class="text-center py-8">
          <p class="text-gray-500">${result.message || 'No store data available for optimization.'}</p>
          <p class="text-sm text-gray-400 mt-2">Make sure your location is set and there are stores nearby.</p>
        </div>
      `;
      return;
    }

    content.innerHTML = `
      <div class="mb-4">
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium text-brand-600 uppercase">${mode === 'cost' ? 'Cost Optimized' : 'Convenience Optimized'}</span>
          ${result.total_cost !== null ? `<span class="text-xl font-bold text-gray-800">$${result.total_cost.toFixed(2)}</span>` : ''}
        </div>
        <p class="text-sm text-gray-400">${result.store_stops} store${result.store_stops !== 1 ? 's' : ''} to visit</p>
      </div>

      ${result.plan.map(stop => `
        <div class="bg-gray-50 rounded-xl p-4 mb-3">
          <div class="flex items-center justify-between mb-2">
            <h4 class="font-bold text-gray-800">${escHtml(stop.store_name)}</h4>
            ${stop.distance_km !== null ? `<span class="text-xs text-gray-400">${stop.distance_km.toFixed(1)} km</span>` : ''}
          </div>
          ${stop.store_address ? `<p class="text-xs text-gray-400 mb-2">${escHtml(stop.store_address)}</p>` : ''}
          <div class="space-y-1">
            ${stop.items.map(item => `
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-700">${escHtml(item.name)}</span>
                <span class="${item.on_sale ? 'text-brand-600 font-medium' : 'text-gray-500'}">$${item.price.toFixed(2)}${item.on_sale ? ' (sale!)' : ''}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `).join('')}

      ${result.unmatched_items && result.unmatched_items.length > 0 ? `
        <div class="bg-yellow-50 rounded-xl p-4 mt-3">
          <p class="text-sm font-medium text-yellow-700 mb-1">Not found in nearby stores:</p>
          <p class="text-sm text-yellow-600">${result.unmatched_items.join(', ')}</p>
        </div>
      ` : ''}

      <!-- Fulfillment Options -->
      <div class="mt-4 border-t pt-4">
        <h4 class="font-semibold text-gray-700 mb-3">How would you like to get your groceries?</h4>
        <div class="grid grid-cols-3 gap-2">
          <button onclick="selectFulfillment('pickup')" class="border-2 rounded-xl p-3 text-center hover:border-brand-600 hover:bg-brand-50 transition">
            <span class="text-2xl block mb-1">\u{1F3EA}</span>
            <span class="text-xs font-medium">Pickup</span>
          </button>
          <button onclick="selectFulfillment('delivery')" class="border-2 rounded-xl p-3 text-center hover:border-brand-600 hover:bg-brand-50 transition">
            <span class="text-2xl block mb-1">\u{1F69A}</span>
            <span class="text-xs font-medium">Delivery</span>
          </button>
          <button onclick="selectFulfillment('in_store')" class="border-2 rounded-xl p-3 text-center hover:border-brand-600 hover:bg-brand-50 transition">
            <span class="text-2xl block mb-1">\u{1F6D2}</span>
            <span class="text-xs font-medium">In-Store</span>
          </button>
        </div>
      </div>
    `;
  } catch (e) {
    content.innerHTML = `<p class="text-red-500 text-center py-8">${e.message}</p>`;
  }
}

async function selectFulfillment(type) {
  if (currentShoppingRecipeId) {
    try {
      await api(`/api/recipes/${currentShoppingRecipeId}/select`, {
        method: 'POST',
        body: JSON.stringify({ fulfillment_type: type })
      });
    } catch { /* ignore */ }
  }
  closeOptimize();
  alert(`Great! Your ${type.replace('_', '-')} order is noted. In a future update, we'll connect you with the store directly!`);
}

function closeOptimize() {
  document.getElementById('optimize-modal').classList.add('hidden');
}

// ============================================================
// Stores
// ============================================================

async function loadStores() {
  const container = document.getElementById('stores-list');

  if (!currentUser?.location_lat) {
    container.innerHTML = `
      <div class="text-center py-16">
        <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
        <h3 class="text-lg font-medium text-gray-500">Set your location first</h3>
        <p class="text-gray-400 mt-1 mb-4">We need your location to find nearby stores</p>
        <button onclick="showProfile()" class="bg-brand-600 text-white rounded-xl px-6 py-2 font-medium hover:bg-brand-700 transition">Update Profile</button>
      </div>`;
    return;
  }

  container.innerHTML = `<div class="flex justify-center py-8"><div class="loader"></div></div>`;

  try {
    const stores = await api('/api/stores/nearby');

    if (stores.length === 0) {
      container.innerHTML = `
        <div class="text-center py-16">
          <h3 class="text-lg font-medium text-gray-500">No stores found nearby</h3>
          <p class="text-gray-400 mt-1">Try increasing your search radius in your profile</p>
        </div>`;
      return;
    }

    container.innerHTML = `
      <h2 class="text-lg font-bold mb-4">Nearby Stores (${stores.length})</h2>
      <div class="space-y-3">
        ${stores.map(s => `
          <div class="bg-white rounded-xl border p-4 cursor-pointer card-hover transition-all" onclick="viewStoreDeals(${s.id})">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-semibold text-gray-800">${escHtml(s.name)}</h3>
                ${s.location_address ? `<p class="text-sm text-gray-400">${escHtml(s.location_address)}</p>` : ''}
              </div>
              <div class="text-right">
                <p class="text-sm font-medium text-brand-600">${s.distance_km.toFixed(1)} km</p>
                <p class="text-xs text-gray-400">${s.data_method}</p>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  } catch (e) {
    container.innerHTML = `<p class="text-red-500 text-center py-8">${e.message}</p>`;
  }
}

async function viewStoreDeals(storeId) {
  const container = document.getElementById('stores-list');
  container.innerHTML = `<div class="flex justify-center py-8"><div class="loader"></div></div>`;

  try {
    const data = await api(`/api/stores/${storeId}/deals`);

    container.innerHTML = `
      <button onclick="loadStores()" class="text-brand-600 text-sm font-medium mb-4 inline-block">&larr; Back to stores</button>
      <h2 class="text-lg font-bold mb-1">${escHtml(data.store.name)}</h2>
      ${data.store.location_address ? `<p class="text-sm text-gray-400 mb-4">${escHtml(data.store.location_address)}</p>` : ''}

      ${data.deals.length === 0
        ? '<p class="text-gray-400 text-center py-8">No deals currently available</p>'
        : `<div class="bg-white rounded-xl border divide-y">
            ${data.deals.map(d => `
              <div class="p-3 flex items-center justify-between">
                <div>
                  <p class="font-medium text-gray-800">${escHtml(d.item_name)}</p>
                  <p class="text-xs text-gray-400">${escHtml(d.item_category || '')} | ${escHtml(d.unit)}</p>
                </div>
                <div class="text-right">
                  ${d.sale_price ? `
                    <p class="text-brand-600 font-bold">$${d.sale_price.toFixed(2)}</p>
                    <p class="text-xs text-gray-400 line-through">$${d.price.toFixed(2)}</p>
                  ` : `
                    <p class="font-bold text-gray-700">$${d.price.toFixed(2)}</p>
                  `}
                </div>
              </div>
            `).join('')}
          </div>`
      }
    `;
  } catch (e) {
    container.innerHTML = `<p class="text-red-500 text-center py-8">${e.message}</p>`;
  }
}

// ============================================================
// Chat
// ============================================================

async function sendChat() {
  const input = document.getElementById('chat-input');
  const msg = input.value.trim();
  if (!msg) return;

  input.value = '';
  const msgContainer = document.getElementById('chat-messages');

  // Add user bubble
  msgContainer.innerHTML += `
    <div class="flex justify-end">
      <div class="chat-bubble-user p-3 max-w-[85%]">
        <p class="text-sm">${escHtml(msg)}</p>
      </div>
    </div>`;

  // Add loading bubble
  msgContainer.innerHTML += `
    <div id="chat-loading" class="flex">
      <div class="chat-bubble-ai p-3">
        <div class="flex items-center gap-2">
          <div class="loader" style="width:16px;height:16px;border-width:2px;"></div>
          <span class="text-sm text-gray-400">Thinking...</span>
        </div>
      </div>
    </div>`;

  msgContainer.scrollTop = msgContainer.scrollHeight;

  try {
    const result = await api('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message: msg, history: chatHistory })
    });

    chatHistory.push({ role: 'user', content: msg });
    chatHistory.push({ role: 'assistant', content: result.response });

    // Remove loading
    document.getElementById('chat-loading')?.remove();

    // Add AI response
    msgContainer.innerHTML += `
      <div class="flex">
        <div class="chat-bubble-ai p-4 max-w-[85%]">
          <div class="text-sm prose prose-sm">${formatMarkdown(result.response)}</div>
          ${result.memories_captured?.length > 0
            ? `<p class="text-xs text-brand-600 mt-2 italic">Remembered: ${result.memories_captured.map(m => escHtml(m)).join(', ')}</p>`
            : ''}
        </div>
      </div>`;

    msgContainer.scrollTop = msgContainer.scrollHeight;
  } catch (e) {
    document.getElementById('chat-loading')?.remove();
    msgContainer.innerHTML += `
      <div class="flex">
        <div class="chat-bubble-ai p-3 bg-red-50">
          <p class="text-sm text-red-600">Sorry, something went wrong. Please try again.</p>
        </div>
      </div>`;
  }
}

function formatMarkdown(text) {
  // Sanitize HTML first to prevent XSS, then apply markdown formatting
  const safe = escHtml(text);
  return safe
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>');
}

// ============================================================
// Profile
// ============================================================

async function showProfile() {
  const modal = document.getElementById('profile-modal');
  const content = document.getElementById('profile-content');

  // Load full profile with preferences
  let profile, preferences;
  try {
    profile = await api('/api/auth/profile');
    preferences = profile.preferences || [];
  } catch {
    profile = currentUser;
    preferences = [];
  }

  const allergies = preferences.filter(p => p.preference_type === 'allergy');
  const dietary = preferences.filter(p => p.preference_type === 'dietary');
  const cuisinePref = preferences.filter(p => p.preference_type === 'cuisine');
  const dislikes = preferences.filter(p => p.preference_type === 'dislike');

  content.innerHTML = `
    <div class="space-y-5">
      <!-- Basic Info -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
        <input id="profile-name" value="${escHtml(profile.name || '')}" class="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-brand-500 focus:outline-none">
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Address</label>
        <input id="profile-address" value="${escHtml(profile.location_address || '')}" placeholder="Enter your address or zip code" class="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-brand-500 focus:outline-none">
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
          <input id="profile-lat" type="number" step="any" value="${profile.location_lat || ''}" placeholder="e.g. 40.7128" class="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-brand-500 focus:outline-none">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
          <input id="profile-lng" type="number" step="any" value="${profile.location_lng || ''}" placeholder="e.g. -74.0060" class="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-brand-500 focus:outline-none">
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Search Radius (km)</label>
        <input id="profile-radius" type="number" value="${profile.search_radius_km || 10}" min="1" max="100" class="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-brand-500 focus:outline-none">
      </div>

      <button onclick="saveProfile()" class="w-full bg-brand-600 text-white rounded-lg py-2.5 font-semibold hover:bg-brand-700 transition">Save Profile</button>

      <hr class="my-4">

      <!-- Preferences -->
      <h3 class="font-bold text-gray-800">Preferences & Restrictions</h3>

      <!-- Allergies -->
      <div>
        <label class="text-sm font-medium text-gray-700">Allergies</label>
        <div class="flex flex-wrap gap-2 mt-1" id="pref-allergies">
          ${allergies.map(a => `<span class="bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm flex items-center gap-1">${escHtml(a.preference_value)} <button onclick="removePref(${a.id})" class="ml-1 text-red-400 hover:text-red-600">&times;</button></span>`).join('')}
        </div>
        <div class="flex gap-2 mt-2">
          <input id="new-allergy" placeholder="e.g. peanuts" class="flex-1 border rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none">
          <button onclick="addPref('allergy', 'new-allergy')" class="text-sm bg-red-100 text-red-700 px-4 rounded-lg hover:bg-red-200 transition">Add</button>
        </div>
      </div>

      <!-- Dietary -->
      <div>
        <label class="text-sm font-medium text-gray-700">Dietary Preferences</label>
        <div class="flex flex-wrap gap-2 mt-1" id="pref-dietary">
          ${dietary.map(d => `<span class="bg-brand-50 text-brand-700 px-3 py-1 rounded-full text-sm flex items-center gap-1">${escHtml(d.preference_value)} <button onclick="removePref(${d.id})" class="ml-1 text-brand-400 hover:text-brand-600">&times;</button></span>`).join('')}
        </div>
        <div class="flex gap-2 mt-2">
          <input id="new-dietary" placeholder="e.g. vegan, keto" class="flex-1 border rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none">
          <button onclick="addPref('dietary', 'new-dietary')" class="text-sm bg-brand-100 text-brand-700 px-4 rounded-lg hover:bg-brand-200 transition">Add</button>
        </div>
      </div>

      <!-- Cuisine Prefs -->
      <div>
        <label class="text-sm font-medium text-gray-700">Favorite Cuisines</label>
        <div class="flex flex-wrap gap-2 mt-1" id="pref-cuisine">
          ${cuisinePref.map(c => `<span class="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-1">${escHtml(c.preference_value)} <button onclick="removePref(${c.id})" class="ml-1 text-blue-400 hover:text-blue-600">&times;</button></span>`).join('')}
        </div>
        <div class="flex gap-2 mt-2">
          <input id="new-cuisine" placeholder="e.g. Italian" class="flex-1 border rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none">
          <button onclick="addPref('cuisine', 'new-cuisine')" class="text-sm bg-blue-100 text-blue-700 px-4 rounded-lg hover:bg-blue-200 transition">Add</button>
        </div>
      </div>

      <!-- Dislikes -->
      <div>
        <label class="text-sm font-medium text-gray-700">Dislikes</label>
        <div class="flex flex-wrap gap-2 mt-1" id="pref-dislikes">
          ${dislikes.map(d => `<span class="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm flex items-center gap-1">${escHtml(d.preference_value)} <button onclick="removePref(${d.id})" class="ml-1 text-gray-400 hover:text-gray-600">&times;</button></span>`).join('')}
        </div>
        <div class="flex gap-2 mt-2">
          <input id="new-dislike" placeholder="e.g. cilantro" class="flex-1 border rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none">
          <button onclick="addPref('dislike', 'new-dislike')" class="text-sm bg-gray-200 text-gray-700 px-4 rounded-lg hover:bg-gray-300 transition">Add</button>
        </div>
      </div>

      <hr class="my-4">
      <button onclick="logout()" class="w-full border-2 border-red-300 text-red-600 rounded-lg py-2.5 font-semibold hover:bg-red-50 transition">Sign Out</button>
    </div>
  `;

  modal.classList.remove('hidden');
}

async function saveProfile() {
  const data = {
    name: document.getElementById('profile-name').value.trim(),
    location_address: document.getElementById('profile-address').value.trim(),
    location_lat: parseFloat(document.getElementById('profile-lat').value) || null,
    location_lng: parseFloat(document.getElementById('profile-lng').value) || null,
    search_radius_km: parseFloat(document.getElementById('profile-radius').value) || 10
  };

  try {
    currentUser = await api('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    document.getElementById('user-name').textContent = currentUser.name;
    document.getElementById('avatar-btn').textContent = currentUser.name.charAt(0).toUpperCase();
    closeProfile();
  } catch (e) {
    alert('Error saving profile: ' + e.message);
  }
}

async function addPref(type, inputId) {
  const input = document.getElementById(inputId);
  const value = input.value.trim();
  if (!value) return;

  try {
    await api('/api/preferences', {
      method: 'POST',
      body: JSON.stringify({ type, value })
    });
    input.value = '';
    showProfile(); // Refresh
  } catch (e) {
    alert(e.message);
  }
}

async function removePref(id) {
  try {
    await api(`/api/preferences/${id}`, { method: 'DELETE' });
    showProfile(); // Refresh
  } catch (e) {
    alert(e.message);
  }
}

function closeProfile() {
  document.getElementById('profile-modal').classList.add('hidden');
}

// ============================================================
// Utilities
// ============================================================

function escHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ============================================================
// Initialize
// ============================================================

// Check for existing session on page load (cookie-based)
(async () => {
  try {
    const profile = await api('/api/auth/profile');
    currentUser = profile;
    enterApp();
  } catch {
    document.getElementById('auth-screen').classList.remove('hidden');
  }
})();

// Click outside modals to close
document.getElementById('recipe-modal').addEventListener('click', e => {
  if (e.target === e.currentTarget) closeRecipeModal();
});
document.getElementById('profile-modal').addEventListener('click', e => {
  if (e.target === e.currentTarget) closeProfile();
});
document.getElementById('optimize-modal').addEventListener('click', e => {
  if (e.target === e.currentTarget) closeOptimize();
});
