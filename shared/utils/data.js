// shared/utils/data.js
// Utilities for loading and querying JSON data files.
// All modules import from here — never fetch() data directly.

const BASE = './data';

// Cache to avoid redundant fetches within a session
const _cache = {};

/**
 * Loads a JSON file from /data/. Returns parsed array or object.
 * @param {string} name - filename without .json (e.g. 'tasks')
 * @returns {Promise<any>}
 */
export async function loadJSON(name) {
  if (_cache[name]) return _cache[name];
  const res = await fetch(`${BASE}/${name}.json`);
  if (!res.ok) throw new Error(`Failed to load ${name}.json: ${res.status}`);
  const data = await res.json();
  _cache[name] = data;
  return data;
}

/**
 * Clears the cache for a given file (after a local edit).
 * @param {string} name
 */
export function clearCache(name) {
  delete _cache[name];
}

/**
 * Filters an array by one or more key/value conditions.
 * Pass null or 'all' as value to skip that filter.
 * @param {Array} items
 * @param {Object} conditions - e.g. { status: 'active', category: 'film' }
 * @returns {Array}
 */
export function filterBy(items, conditions) {
  return items.filter(item =>
    Object.entries(conditions).every(([key, val]) =>
      !val || val === 'all' || item[key] === val
    )
  );
}

/**
 * Groups an array by a key. Returns { [keyValue]: items[] }.
 * @param {Array} items
 * @param {string} key
 * @returns {Object}
 */
export function groupBy(items, key) {
  return items.reduce((acc, item) => {
    const k = item[key] ?? 'uncategorized';
    if (!acc[k]) acc[k] = [];
    acc[k].push(item);
    return acc;
  }, {});
}

/**
 * Sorts an array by a key. direction: 'asc' | 'desc'.
 * @param {Array} items
 * @param {string} key
 * @param {'asc'|'desc'} direction
 * @returns {Array}
 */
export function sortBy(items, key, direction = 'asc') {
  return [...items].sort((a, b) => {
    const va = a[key] ?? '';
    const vb = b[key] ?? '';
    const cmp = va < vb ? -1 : va > vb ? 1 : 0;
    return direction === 'asc' ? cmp : -cmp;
  });
}

/**
 * Returns all unique values for a given key in an array.
 * Useful for populating filter dropdowns.
 * @param {Array} items
 * @param {string} key
 * @returns {string[]}
 */
export function uniqueValues(items, key) {
  return [...new Set(items.map(i => i[key]).filter(Boolean))];
}

/**
 * Finds a single item by id.
 * @param {Array} items
 * @param {string} id
 * @returns {Object|undefined}
 */
export function findById(items, id) {
  return items.find(i => i.id === id);
}
