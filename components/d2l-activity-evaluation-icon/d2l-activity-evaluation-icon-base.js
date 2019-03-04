import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import 'd2l-polymer-siren-behaviors/store/entity-behavior.js';
import 'd2l-icons/d2l-icon.js';
import 'd2l-icons/tier1-icons.js';

/**
 * @customElement
 * @polymer
 */

class ActivityEvaluationIconBase extends PolymerElement {
	static get template() {
		return html`
			<style>
				:host(:not([draft])) {
					display: none;
				}
				:host {
					display: inline-block;
				}
			</style>
			<template is="dom-if" if="[[draft]]">
				<d2l-icon id="d2l-draft-icon" icon="d2l-tier1:draft"></d2l-icon>
			</template>
		`;
	}

	static get is() { return 'd2l-activity-evaluation-icon-base'; }

	static get properties() {
		return {
			draft: {
				type: Boolean,
				value: false
			}
		};
	}
}

window.customElements.define('d2l-activity-evaluation-icon-base', ActivityEvaluationIconBase);
