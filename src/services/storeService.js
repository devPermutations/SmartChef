const { getDb } = require('../db/database');

// Haversine distance in km
function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const toRad = d => d * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function findStoresNearby(lat, lng, radiusKm) {
  const db = getDb();
  const stores = db.prepare("SELECT * FROM stores WHERE status = 'active'").all();

  return stores
    .map(store => ({
      ...store,
      distance_km: haversine(lat, lng, store.location_lat, store.location_lng)
    }))
    .filter(s => s.distance_km <= radiusKm)
    .sort((a, b) => a.distance_km - b.distance_km);
}

function getStoreById(id) {
  const db = getDb();
  return db.prepare('SELECT * FROM stores WHERE id = ?').get(id);
}

function getStoreDeals(storeId) {
  const db = getDb();
  return db.prepare(
    "SELECT * FROM store_deals WHERE store_id = ? AND (valid_until IS NULL OR valid_until >= datetime('now')) ORDER BY item_category, item_name"
  ).all(storeId);
}

function searchDeals(itemName, storeIds) {
  const db = getDb();
  const placeholders = storeIds.map(() => '?').join(',');
  return db.prepare(`
    SELECT sd.*, s.name as store_name, s.location_address as store_address
    FROM store_deals sd
    JOIN stores s ON sd.store_id = s.id
    WHERE sd.item_name LIKE ?
    AND sd.store_id IN (${placeholders})
    AND (sd.valid_until IS NULL OR sd.valid_until >= datetime('now'))
    ORDER BY COALESCE(sd.sale_price, sd.price) ASC
  `).all(`%${itemName}%`, ...storeIds);
}

function addStore(store) {
  const db = getDb();
  const result = db.prepare(`
    INSERT INTO stores (name, location_lat, location_lng, location_address, data_method, data_config, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    store.name, store.location_lat, store.location_lng,
    store.location_address, store.data_method || 'manual',
    store.data_config ? JSON.stringify(store.data_config) : null,
    store.status || 'active'
  );
  return { id: result.lastInsertRowid, ...store };
}

function addDeal(deal) {
  const db = getDb();
  const result = db.prepare(`
    INSERT INTO store_deals (store_id, item_name, item_category, price, sale_price, unit, valid_from, valid_until)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    deal.store_id, deal.item_name, deal.item_category,
    deal.price, deal.sale_price || null, deal.unit || 'each',
    deal.valid_from || null, deal.valid_until || null
  );
  return { id: result.lastInsertRowid, ...deal };
}

module.exports = { findStoresNearby, getStoreById, getStoreDeals, searchDeals, addStore, addDeal, haversine };
