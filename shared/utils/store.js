// shared/utils/store.js
// Reactive Proxy-based data store. Modules subscribe to named datasets.
// Use store.on() for reactive updates; use store.update() to mutate data.

class Store {
  #subscribers = new Map();  // name -> Set<callback>
  #data = {};                // name -> array|object
  #pending = {};             // name -> modified data (localStorage write buffer)

  constructor() {
    this.#loadPending();
  }

  /** Loads pending local edits from localStorage into the pending buffer. */
  #loadPending() {
    try {
      const raw = localStorage.getItem('sara-ops:pending');
      if (raw) this.#pending = JSON.parse(raw);
    } catch (_) {}
  }

  /** Persists the pending write buffer to localStorage. */
  #savePending() {
    try {
      localStorage.setItem('sara-ops:pending', JSON.stringify(this.#pending));
    } catch (_) {}
  }

  /**
   * Loads a named JSON dataset from /data/ (or localStorage buffer if pending).
   * Returns the loaded data array or object.
   * @param {string} name - filename without .json (e.g. 'tasks')
   * @returns {Promise<any>}
   */
  async load(name) {
    if (this.#data[name]) return this.#data[name];

    // Use pending local edit if available
    if (this.#pending[name]) {
      this.#data[name] = this.#pending[name];
      this.#notify(name);
      return this.#data[name];
    }

    const res = await fetch(`/data/${name}.json`);
    if (!res.ok) throw new Error(`Failed to load ${name}.json: ${res.status}`);
    this.#data[name] = await res.json();
    this.#notify(name);
    return this.#data[name];
  }

  /**
   * Returns the current value of a named dataset (synchronous).
   * @param {string} name
   * @returns {any}
   */
  get(name) {
    return this.#data[name];
  }

  /**
   * Subscribes a callback to changes on a named dataset.
   * Calls callback immediately if data is already loaded.
   * @param {string} name
   * @param {Function} callback - receives the data as argument
   * @returns {Function} unsubscribe function
   */
  on(name, callback) {
    if (!this.#subscribers.has(name)) this.#subscribers.set(name, new Set());
    this.#subscribers.get(name).add(callback);
    if (this.#data[name]) callback(this.#data[name]);
    return () => this.#subscribers.get(name)?.delete(callback);
  }

  /**
   * Mutates a named dataset and notifies subscribers. Buffers to localStorage.
   * @param {string} name
   * @param {Function} mutator - receives data, modifies it in place
   */
  update(name, mutator) {
    if (!this.#data[name]) throw new Error(`Dataset "${name}" not loaded`);
    mutator(this.#data[name]);
    this.#pending[name] = this.#data[name];
    this.#savePending();
    this.#notify(name);
  }

  /**
   * Clears the localStorage write buffer for a named dataset.
   * Call after the user has committed their JSON changes.
   * @param {string} name
   */
  clearPending(name) {
    delete this.#pending[name];
    this.#savePending();
  }

  /** Notifies all subscribers for a named dataset. */
  #notify(name) {
    this.#subscribers.get(name)?.forEach(cb => cb(this.#data[name]));
  }
}

export const store = new Store();
