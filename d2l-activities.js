import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

/**
 * `<d2l-activities>`
 * Contains Hypermedia components that display informations about activites
 * @customElement
 * @polymer
 * @demo demo/index.hmtl
 */
class Activities extends PolymerElement {
	static get is() { return 'd2l-activities'; }
	static get properties() {
		return {
			/* Property1 description for documentation */
			prop1: {
				type: String,
				value: 'd2l-activities'
			}
		};
	}
	// Define the element's template
	static get template() {
		return html`
			<style>
				:host {
					display: inline-block;
				}
				:host([hidden]) {
					display: none;
				}
			</style>
			<h2>Hello [[prop1]]!</h2>
		`;
	}
	constructor() {
		super();
	}
}
customElements.define(Activities.is, Activities);
