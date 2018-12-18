import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import {mixinBehaviors} from '@polymer/polymer/lib/legacy/class.js';
import 'd2l-fetch-siren-entity-behavior/d2l-fetch-siren-entity-behavior.js';
import 'd2l-typography/d2l-typography.js';
import 'd2l-button/d2l-button.js';

/**
 * @customElement
 * @polymer
 */
class D2lActivityListItemEnroll extends mixinBehaviors([D2L.PolymerBehaviors.FetchSirenEntityBehavior], PolymerElement) {
	static get template() {
		return html`
			<style include="d2l-typography">
				:host {
					display: block;
				}
			</style>
			<d2l-button id="d2l-activity-list-item-enroll" primary$=[[_hasActionBoolean(actionEnroll)]] disabled$=[[!_hasActionBoolean(actionEnroll)]]>Enroll</d2l-button>
		`;
	}

	static get properties() {
		return {
			actionEnroll: {
				type: String,
				value: '',
				observer: '_onActionEnrollChange'
			}
		};
	}

	ready() {
		super.ready();
		this._onEnrollKeyPress = this._enroll.bind(this);
		this._onEnrollMouseUp = this._enroll.bind(this);
	}

	detached() {
		this._removeEnrollAction();
	}
	_hasActionBoolean(actionEnroll) {
		return !!actionEnroll;
	}
	_enroll() {
		if (this.actionEnroll) {
			this._fetchEntity(this.actionEnroll)
				.then(() => {
					this.actionEnroll = '';
				});
		}
	}
	_onActionEnrollChange(actionEnroll) {
		if (!actionEnroll) {
			this._removeEnrollAction();
		}

		this._addEnrollAction();
	}
	_addEnrollAction() {
		const enrollButton = this.shadowRoot.querySelector('d2l-button');
		if (enrollButton) {
			enrollButton.addEventListener('keypress', this._onEnrollKeyPress);
			enrollButton.addEventListener('mouseup', this._onEnrollKeyPress);
		}
	}

	_removeEnrollAction() {
		const enrollButton = this.shadowRoot.querySelector('d2l-button');
		if (enrollButton) {
			enrollButton.removeEventListener('keypress', this._onEnrollKeyPress);
			enrollButton.removeEventListener('mouseup', this._onEnrollMouseUp);
		}
	}
}

window.customElements.define('d2l-activity-list-item-enroll', D2lActivityListItemEnroll);
