/**
 * Seed script: populates the database with sample stores and deals for development/demo.
 * Run with: npm run seed
 */
require('dotenv').config();
const { initialize, getDb } = require('./database');

// Initialize DB
initialize();
const db = getDb();

console.log('Seeding database...');

// --- Stores (NYC area for demo) ---
const stores = [
  { name: 'FreshMart Downtown', lat: 40.7128, lng: -74.0060, address: '123 Broadway, New York, NY 10006', method: 'manual' },
  { name: 'GreenGrocer Chelsea', lat: 40.7465, lng: -74.0014, address: '456 W 23rd St, New York, NY 10011', method: 'manual' },
  { name: 'BudgetFoods Midtown', lat: 40.7549, lng: -73.9840, address: '789 6th Ave, New York, NY 10019', method: 'manual' },
  { name: 'Organic Harvest UWS', lat: 40.7831, lng: -73.9712, address: '234 Amsterdam Ave, New York, NY 10024', method: 'manual' },
  { name: 'QuickStop Deli Brooklyn', lat: 40.6892, lng: -73.9857, address: '567 Atlantic Ave, Brooklyn, NY 11217', method: 'manual' },
];

const insertStore = db.prepare(`
  INSERT OR IGNORE INTO stores (name, location_lat, location_lng, location_address, data_method, status)
  VALUES (?, ?, ?, ?, ?, 'active')
`);

const storeIds = [];
for (const s of stores) {
  const result = insertStore.run(s.name, s.lat, s.lng, s.address, s.method);
  storeIds.push(result.lastInsertRowid || db.prepare('SELECT id FROM stores WHERE name = ?').get(s.name).id);
}

console.log(`Inserted ${stores.length} stores`);

// --- Deals / Inventory ---
const items = [
  // Produce
  { name: 'Chicken Breast', category: 'Meat', price: 8.99, sale: 6.49, unit: 'lb' },
  { name: 'Ground Beef', category: 'Meat', price: 7.99, sale: 5.99, unit: 'lb' },
  { name: 'Salmon Fillet', category: 'Seafood', price: 12.99, sale: 9.99, unit: 'lb' },
  { name: 'Shrimp', category: 'Seafood', price: 11.99, sale: null, unit: 'lb' },
  { name: 'Tofu', category: 'Protein', price: 3.49, sale: 2.49, unit: 'each' },
  { name: 'Rice', category: 'Grains', price: 4.99, sale: 3.99, unit: '5lb bag' },
  { name: 'Basmati Rice', category: 'Grains', price: 6.99, sale: 5.49, unit: '5lb bag' },
  { name: 'Pasta', category: 'Grains', price: 2.49, sale: 1.79, unit: 'box' },
  { name: 'Spaghetti', category: 'Grains', price: 2.49, sale: 1.49, unit: 'box' },
  { name: 'Flour', category: 'Baking', price: 4.49, sale: null, unit: '5lb bag' },
  { name: 'Olive Oil', category: 'Oils', price: 8.99, sale: 6.99, unit: 'bottle' },
  { name: 'Vegetable Oil', category: 'Oils', price: 4.99, sale: null, unit: 'bottle' },
  { name: 'Butter', category: 'Dairy', price: 5.49, sale: 3.99, unit: 'each' },
  { name: 'Milk', category: 'Dairy', price: 4.29, sale: 3.49, unit: 'gallon' },
  { name: 'Eggs', category: 'Dairy', price: 4.99, sale: 3.99, unit: 'dozen' },
  { name: 'Cheese', category: 'Dairy', price: 5.99, sale: 4.49, unit: 'block' },
  { name: 'Mozzarella', category: 'Dairy', price: 4.99, sale: 3.99, unit: 'each' },
  { name: 'Parmesan', category: 'Dairy', price: 6.99, sale: null, unit: 'each' },
  { name: 'Heavy Cream', category: 'Dairy', price: 4.49, sale: null, unit: 'pint' },
  { name: 'Yogurt', category: 'Dairy', price: 5.99, sale: 4.49, unit: 'each' },
  { name: 'Onion', category: 'Produce', price: 1.49, sale: 0.99, unit: 'lb' },
  { name: 'Garlic', category: 'Produce', price: 0.99, sale: null, unit: 'head' },
  { name: 'Tomato', category: 'Produce', price: 2.99, sale: 1.99, unit: 'lb' },
  { name: 'Tomatoes', category: 'Produce', price: 2.99, sale: 1.99, unit: 'lb' },
  { name: 'Potato', category: 'Produce', price: 1.99, sale: null, unit: 'lb' },
  { name: 'Carrot', category: 'Produce', price: 1.79, sale: null, unit: 'lb' },
  { name: 'Bell Pepper', category: 'Produce', price: 1.49, sale: 0.99, unit: 'each' },
  { name: 'Spinach', category: 'Produce', price: 3.49, sale: 2.99, unit: 'bunch' },
  { name: 'Broccoli', category: 'Produce', price: 2.49, sale: null, unit: 'bunch' },
  { name: 'Lemon', category: 'Produce', price: 0.79, sale: 0.49, unit: 'each' },
  { name: 'Lime', category: 'Produce', price: 0.69, sale: null, unit: 'each' },
  { name: 'Ginger', category: 'Produce', price: 3.99, sale: null, unit: 'lb' },
  { name: 'Cilantro', category: 'Produce', price: 1.29, sale: null, unit: 'bunch' },
  { name: 'Basil', category: 'Produce', price: 2.49, sale: null, unit: 'bunch' },
  { name: 'Avocado', category: 'Produce', price: 1.99, sale: 1.49, unit: 'each' },
  { name: 'Coconut Milk', category: 'Canned', price: 2.99, sale: 1.99, unit: 'can' },
  { name: 'Canned Tomatoes', category: 'Canned', price: 1.99, sale: 1.49, unit: 'can' },
  { name: 'Soy Sauce', category: 'Condiments', price: 3.99, sale: null, unit: 'bottle' },
  { name: 'Cumin', category: 'Spices', price: 4.99, sale: null, unit: 'jar' },
  { name: 'Turmeric', category: 'Spices', price: 4.99, sale: null, unit: 'jar' },
  { name: 'Paprika', category: 'Spices', price: 4.49, sale: null, unit: 'jar' },
  { name: 'Chili Powder', category: 'Spices', price: 3.99, sale: null, unit: 'jar' },
  { name: 'Black Pepper', category: 'Spices', price: 5.99, sale: null, unit: 'jar' },
  { name: 'Salt', category: 'Spices', price: 1.99, sale: null, unit: 'container' },
  { name: 'Sugar', category: 'Baking', price: 3.99, sale: 2.99, unit: '5lb bag' },
  { name: 'Tortillas', category: 'Bread', price: 3.49, sale: 2.49, unit: 'pack' },
  { name: 'Bread', category: 'Bread', price: 3.99, sale: null, unit: 'loaf' },
  { name: 'Naan', category: 'Bread', price: 4.49, sale: 3.49, unit: 'pack' },
];

const insertDeal = db.prepare(`
  INSERT INTO store_deals (store_id, item_name, item_category, price, sale_price, unit, valid_from, valid_until)
  VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now', '+14 days'))
`);

let dealCount = 0;
const insertMany = db.transaction(() => {
  for (const storeId of storeIds) {
    // Each store carries a random subset of items with slightly varying prices
    const storeItems = items.filter(() => Math.random() > 0.2); // 80% availability
    for (const item of storeItems) {
      const priceVariance = 0.8 + Math.random() * 0.4; // +/- 20%
      const price = Math.round(item.price * priceVariance * 100) / 100;
      const salePrice = item.sale ? Math.round(item.sale * priceVariance * 100) / 100 : null;

      insertDeal.run(storeId, item.name, item.category, price, salePrice, item.unit);
      dealCount++;
    }
  }
});

insertMany();
console.log(`Inserted ${dealCount} deals across ${storeIds.length} stores`);
console.log('Seed complete!');
