import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import 'd2l-polymer-siren-behaviors/store/entity-behavior.js';
import {mixinBehaviors} from '@polymer/polymer/lib/legacy/class.js';
import './d2l-activity-name-icon.js';

/**
 * @customElement
 * @polymer
 */
class D2LActivityName extends mixinBehaviors([D2L.PolymerBehaviors.Siren.EntityBehavior], PolymerElement) {
	static get template() {
		return html`
			<style>
				:host {
					display: block;
				}
			</style>
			<d2l-activity-name-icon href="[[href]]" token="[[token]]"></d2l-activity-name-icon>
		`;
	}
	static get is() { return 'd2l-activity-name'; }

}

window.customElements.define('d2l-activity-name', D2LActivityName);
