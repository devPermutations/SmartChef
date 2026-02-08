# SmartChef MVP State

> Snapshot: 2026-02-08 | Commit: `6bb5894` on `master`
> Repo: https://github.com/devPermutations/SmartChef.git

## What Is SmartChef

LLM-powered meal planning and grocery shopping optimizer. Users search 1000 recipes across 34 cuisines, get AI meal suggestions via chat, and optimize grocery runs across nearby stores by cost or convenience.

## Tech Stack

- **Backend**: Node.js + Express 5.2.1 + better-sqlite3
- **Frontend**: Single-page app — plain HTML/JS + Tailwind CSS (CDN)
- **Auth**: JWT (7-day expiry, bcryptjs passwords)
- **LLM**: OpenAI (GPT-4o-mini), Anthropic (Claude Sonnet 4.5), or demo fallback
- **Database**: SQLite with WAL mode, foreign keys ON
- **No build step** — static files served directly

## File Tree

```
src/
  server.js                  - Express entry point (PORT from .env, default 3000)
  db/database.js             - SQLite init, schema (9 tables), indexes
  db/seed.js                 - Seeds stores, deals, recipes from recipes.json
  middleware/auth.js          - JWT generateToken + authMiddleware
  routes/
    auth.js                  - Register, login, profile CRUD
    recipes.js               - Search, metadata, detail, meal history, rating
    stores.js                - Nearby stores, store deals
    shopping.js              - Shopping list generation, cost/convenience optimization
    preferences.js           - User prefs (allergy/dietary/cuisine/dislike) + memory
    chat.js                  - LLM chat endpoint
  services/
    recipeService.js         - SQLite queries for recipes (was JSON, migrated to DB)
    storeService.js          - Haversine distance, store/deal lookups
    shoppingService.js       - Ingredient matching, cost/convenience optimizer
    memoryService.js         - Preferences CRUD, memory CRUD, buildUserContext()
    llmService.js            - Multi-provider LLM (OpenAI/Anthropic/demo), memory extraction
public/
  index.html                 - SPA shell with Tailwind
  js/app.js                  - ~870 lines, all frontend logic
recipes.json                 - 1000 recipes (source data for seeding)
recipes/                     - Python cuisine files + generate_recipes.py
data/                        - smartchef.db (gitignored, created by seed)
```

## Database Schema (9 tables)

```sql
users (id PK, email UNIQUE, password_hash, name,
       location_lat, location_lng, location_address,
       search_radius_km DEFAULT 10, created_at)

user_preferences (id PK, user_id FK, preference_type, preference_value,
                  source DEFAULT 'user_input', created_at)
  -- types: allergy, dietary, cuisine, dislike
  -- source: user_input, llm_inferred

user_memory (id PK, user_id FK, memory_text,
             category DEFAULT 'context', importance DEFAULT 5, created_at)
  -- categories: context, preference

stores (id PK, name, location_lat, location_lng, location_address,
        data_method DEFAULT 'manual', data_config, status DEFAULT 'active',
        last_synced_at, created_at)

store_deals (id PK, store_id FK, item_name, item_category, price, sale_price,
             unit DEFAULT 'each', valid_from, valid_until, last_updated)

meal_selections (id PK, user_id FK, recipe_id, selected_at, rating,
                 fulfillment_type DEFAULT 'in_store')

recipes (id PK, name, description, origin, prep_time_minutes, cook_time_minutes,
         servings, difficulty, instructions TEXT/JSON, created_at)

recipe_ingredients (id PK, recipe_id FK, name, quantity REAL, unit, category)

recipe_dietary (id PK, recipe_id FK, tag)
```

**Indexes**: user_preferences(user_id), user_memory(user_id), store_deals(store_id), store_deals(item_name), meal_selections(user_id), recipes(origin), recipes(difficulty), recipe_dietary(tag), recipe_ingredients(recipe_id)

## API Endpoints

### Auth (`/api/auth`)
| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| POST | /register | No | Create account (email, password 6+, name) |
| POST | /login | No | Returns JWT token |
| GET | /profile | Yes | User + preferences |
| PUT | /profile | Yes | Update name, location, radius |

### Recipes (`/api/recipes`)
| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | /metadata | No | Cuisines list, dietary tags, total count |
| GET | /search | No | Filter: q, cuisine, dietary, ingredients, maxPrepTime, maxCookTime, difficulty, limit, offset |
| GET | /history/mine | Yes | Last 50 meal selections with recipe data |
| GET | /:id | No | Full recipe detail |
| POST | /:id/select | Yes | Record meal selection + fulfillment type |
| PUT | /selections/:id/rate | Yes | Rate 1-5 |

### Stores (`/api/stores`)
| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | /nearby | Yes | Stores within user radius (haversine) |
| GET | /:id | No | Store details |
| GET | /:id/deals | No | Current valid deals |

### Shopping (`/api/shopping`)
| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | /list/:recipeId | No | Ingredient checklist |
| GET | /optimize/:recipeId | Yes | Cost or convenience optimization across stores |

### Preferences (`/api/preferences`)
| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | / | Yes | All preferences |
| POST | / | Yes | Add preference (type, value, source) |
| DELETE | /:id | Yes | Remove preference |
| GET | /memory | Yes | Memories by category |
| POST | /memory | Yes | Save memory (text, category, importance) |
| DELETE | /memory/:id | Yes | Remove memory |
| GET | /context | Yes | Full user context for LLM |

### Chat (`/api/chat`)
| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| POST | / | Yes | Send message + history, returns response + memories_captured |

## Recipe Object Shape (API response)

```json
{
  "id": 1,
  "name": "Doro Wot",
  "description": "Ethiopia's iconic spicy chicken stew...",
  "origin": "Ethiopian",
  "dietary": ["halal", "dairy-free", "gluten-free", "nut-free"],
  "prep_time_minutes": 30,
  "cook_time_minutes": 90,
  "servings": 6,
  "difficulty": "hard",
  "ingredients": [
    { "name": "chicken legs and thighs", "quantity": 1200, "unit": "g", "category": "meat" }
  ],
  "instructions": ["Step 1...", "Step 2..."]
}
```

## Frontend (SPA)

**Screens**: Auth (login/register) -> Main app (4 tabs)

**Tabs**:
1. **Recipes** — Search bar + cuisine/dietary/difficulty filters, paginated grid, recipe detail modal with "Select Meal" and "Shopping List" buttons
2. **Shopping** — Ingredient checklist, cost vs convenience optimization modal showing store plan with prices/distances/sale badges
3. **Stores** — Nearby stores sorted by distance (requires user location), click to view inventory/deals
4. **Chef AI** — Chat interface with message bubbles, markdown rendering, memory capture notifications

**Key behaviors**:
- Token stored in `localStorage` as `smartchef_token`
- 300ms debounced search
- Lazy store loading (only on tab switch)
- Cuisine emoji mapping for visual flair
- Click-outside-to-close modals
- XSS prevention via `escHtml()`

## Data Flow Highlights

**Shopping optimization (cost mode)**: Pick cheapest deal for each ingredient across all nearby stores, group by store, show total cost + store stops.

**Shopping optimization (convenience mode)**: Score stores by coverage % then distance, recommend single best store, show top 3 alternatives.

**LLM chat**: Builds system prompt with user allergies, dietary prefs, dislikes, recent meals, memories + recipe metadata. Extracts new preferences/memories from user messages via regex. Supports OpenAI, Anthropic, or keyword-based demo fallback.

**Memory extraction patterns**: Detects allergies ("I'm allergic to..."), dislikes ("I don't like..."), dietary labels (vegan, keto, etc.), household size ("cooking for X people").

## Seed Data

- **5 NYC-area stores** with ~49 grocery items each (80% random availability, +/-20% price variance)
- **1000 recipes** from `recipes.json` across 34 cuisines, 9 dietary tags
- Deals valid 14 days from seed date

## Scripts

```
npm start        - node src/server.js
npm run dev      - node --watch src/server.js
npm run seed     - node src/db/seed.js (creates DB + seeds all data)
```

## Environment (.env)

```
PORT=3456
JWT_SECRET=change-me-to-a-secure-random-string
LLM_PROVIDER=openai          # openai | anthropic | demo
LLM_API_KEY=your-api-key-here
LLM_MODEL=gpt-4o-mini
```

## Dev Notes

- **Express 5**: Wildcard routes use `/{*path}`, not `*`. Specific routes before parameterized (e.g., `/history/mine` before `/:id`).
- **SQLite**: Use `datetime('now')` with single quotes. Double quotes = column identifiers.
- **Windows**: Use `taskkill //F //IM node.exe` to kill Node. Use `py` not `python`.
- **No tests yet** — `src/tests/` referenced in package.json but directory doesn't exist.
- **recipes.json stays** — used as seed source, not loaded at runtime anymore.
