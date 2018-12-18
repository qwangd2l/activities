import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';

/**
 * @customElement
 * @polymer
 */
class D2lEvaluationHub extends PolymerElement {
	static get template() {
		return html`
			<style>
				:host {
					display: block;
				}
			</style>
			<div>Evaluation Hub</div>
			<div>[[href]]</div>
		`;
	}
	static get properties() {
		return { // Should get this from the d2l-polymer-siren-behaviors once that has been converted to Polymer 3
			href: String,
			token: String
		};
	}
}

window.customElements.define('d2l-evaluation-hub', D2lEvaluationHub);
