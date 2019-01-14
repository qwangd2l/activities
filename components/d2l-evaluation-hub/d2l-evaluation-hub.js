import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import 'd2l-polymer-siren-behaviors/store/entity-behavior.js';
import {mixinBehaviors} from '@polymer/polymer/lib/legacy/class.js';
import './d2l-evaluation-hub-activities-list.js';

/**
 * @customElement
 * @polymer
 */
class D2LEvaluationHub extends mixinBehaviors([D2L.PolymerBehaviors.Siren.EntityBehavior], PolymerElement) {
	static get template() {
		return html`
			<style>
				:host {
					display: block;
				}
			</style>
			<d2l-evaluation-hub-activities-list href="[[href]]" token="[[token]]"></d2l-evaluation-hub-activities-list>
		`;
	}
	static get is() { return 'd2l-evaluation-hub'; }

}

window.customElements.define('d2l-evaluation-hub', D2LEvaluationHub);
