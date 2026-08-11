// shared/components/base-component.js
// Base class for all Sara Ops Web Components.
// Provides: shadow DOM, attribute observation, and a simple render cycle.

export class SaraComponent extends HTMLElement {
  /** Subclasses declare which attributes trigger re-renders. */
  static observedAttributes = [];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  /** Re-renders when any observed attribute changes. */
  attributeChangedCallback(name, oldVal, newVal) {
    if (oldVal !== newVal) this.render();
  }

  /**
   * Returns the HTML string for the component's shadow DOM.
   * Subclasses must override this.
   * @returns {string}
   */
  template() {
    return '';
  }

  /**
   * Returns component-scoped CSS string.
   * Always import tokens.css first so design tokens are available.
   * @returns {string}
   */
  styles() {
    return '';
  }

  /** Writes styles + template into the shadow root. */
  render() {
    this.shadowRoot.innerHTML = `<style>${this.styles()}</style>${this.template()}`;
  }
}
