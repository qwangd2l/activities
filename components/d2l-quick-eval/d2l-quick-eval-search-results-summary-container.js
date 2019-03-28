import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import {QuickEvalLocalize} from './QuickEvalLocalize.js';
import 'd2l-link/d2l-link.js';

class D2LQuickEvalSearchResultsSummaryContainer extends QuickEvalLocalize(PolymerElement) {
	static get is() { return 'd2l-quick-eval-search-results-summary-container'; }
	static get template() {
		return html `
		<style>
			.d2l-msg-container {
				border-radius: 8px;
				background-color: var(--d2l-color-regolith);
				border: 1px solid var(--d2l-color-gypsum);
				color: var(--d2l-color-ferrite);
			}
			.d2l-msg-container-inner {
				padding: 0;
			}
			.d2l-msg-container-text {
				padding: 10px 20px;
			}
			span {
				margin-right: 2.3em;
			}
			:host(:dir(rtl)) span {
				margin-right: 0;
				margin-left: 2.3em;
			}
		</style>
		<div class="d2l-msg-container">
			<div class="d2l-msg-container-inner">
				<div class="d2l-msg-container-text">
					<span class="d2l-quick-eval-search-results-summary">[[_getSummaryString(searchResultsCount)]]</span>
					<d2l-link on-click="_linkClicked">[[localize('clearSearch')]]</d2l-link>
				</div>
			</div>
		</div>
		`;
	}
	static get properties() {
		return {
			searchResultsCount: {
				type: Number,
				value: 0
			}
		};
	}

	_getSummaryString(num) {
		if (num === 1) {
			return this.localize('searchResultsSingle');
		}
		return this.localize('searchResultsMultiple', 'num', num);
	}

	_linkClicked() {
		this.dispatchEvent(
			new CustomEvent(
				'd2l-quick-eval-search-results-summary-container-clear-search',
				{
					composed: true,
					bubbles: true
				}
			)
		);
	}
}

window.customElements.define(D2LQuickEvalSearchResultsSummaryContainer.is, D2LQuickEvalSearchResultsSummaryContainer);
