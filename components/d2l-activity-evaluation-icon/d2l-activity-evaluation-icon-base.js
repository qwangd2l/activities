import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { ActivityEvaluationIconBaseLocalize } from './ActivityEvaluationIconBaseLocalize.js';
import 'd2l-polymer-siren-behaviors/store/entity-behavior.js';
import 'd2l-icons/d2l-icon.js';
import 'd2l-icons/tier1-icons.js';
import 'd2l-tooltip/d2l-tooltip.js';
import 'fastdom/fastdom.js';

/**
 * @customElement
 * @polymer
 */
class ActivityEvaluationIconBase extends ActivityEvaluationIconBaseLocalize(PolymerElement) {
	static get template() {
		return html`
			<style>
				:host {
					display: none;
				}

				:host([draft]) {
						display: inline-block;
				}
			</style>
			<template is="dom-if" if="[[draft]]">
				<d2l-icon id="d2l-draft-icon" icon="d2l-tier1:draft"></d2l-icon>
				<d2l-tooltip
					id="draft-icon-tooltip"
					for="d2l-draft-icon"
					position="bottom"
					offset="15"
					boundary="[[_boundary]]"
				>
					[[localize('draftInfo')]]
				</d2l-tooltip>
			</template>
		`;
	}

	static get is() { return 'd2l-activity-evaluation-icon-base'; }

	static get properties() {
		return {
			draft: {
				type: Boolean,
				value: false,
				reflectToAttribute: true
			},
			_boundary: {
				type: Object
			}
		};
	}

	attached() {
		this._measureLocation = this._measureLocation.bind(this);
		window.addEventListener('resize', this._measureLocation);
		this._measureLocation();
	}

	detached() {
		window.removeEventListener('resize', this._measureLocation);
	}

	_measureLocation() {
		fastdom.measure(function() {
			var leftPosition = this.getBoundingClientRect().left;
			fastdom.mutate(function() {
				this._boundary = {
					left: leftPosition - 25,
					right: 0
				};
			}.bind(this));
		}.bind(this));
	}
}

window.customElements.define('d2l-activity-evaluation-icon-base', ActivityEvaluationIconBase);
