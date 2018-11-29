import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import '../../../d2l-offscreen/d2l-offscreen-shared-styles.js';
import '../../../d2l-icons/d2l-icon.js';
import '../../../d2l-icons/tier1-icons.js';

/**
 * @customElement
 * @polymer
 */
class D2lActivityListItem extends PolymerElement {
	static get template() {
		return html`
			<style include="d2l-offscreen-shared-styles">
				:host {
					display: block;
				}
				.d2l-activity-list-item-container:hover {
					background-color: #FAFBFC; /* Pending Colin */
				}
				.d2l-activity-list-item-container {
					position: relative;
					height: 100%;
				}
				.d2l-activity-list-item-link-container {
					overflow: hidden;
					display: flex;
					flex-direction: row;
					flex-grow: 1;
					flex-shrink: 1;
					flex-basis: 0;
				}
				.d2l-activity-list-item-link-text {
					display: inline-block;
					@apply --d2l-offscreen;
				}
				a.d2l-focusable {
					display: block;
					position: absolute;
					height: 100%;
					outline: none;
					width: 100%;
					z-index: 1;
				}
				/* P2-shadow */
				:host-context([dir="rtl"]) .d2l-activity-list-item-link-text {
					@apply --d2l-offscreen-rtl
				}
				/* P1-shady, P2-shady */
				:host(:dir(rtl)) .d2l-activity-list-item-link-text {
					@apply --d2l-offscreen-rtl
				}
				.d2l-activity-list-item-image {
					flex-shrink: 0;
					margin: 0.5rem;
					border: 1px solid;
					width: 273px;
					height: 161px;
					display: flex;
					align-items: center;
					justify-content: center;
				}
				.d2l-activity-list-item-title {
					flex-shrink: 0;
					@apply --d2l-heading-3;
					color: var(--d2l-color-ferrite);
				}
				.d2l-activity-list-item-description {
					@apply --d2l-body-compact-text;
					color: var(--d2l-color-ferrite);
					overflow: hidden;
				}
				.d2l-activity-list-item-description p {
					margin: 0;
					padding: 0;
				}
				.d2l-activity-list-item-footer,
				.d2l-activity-list-item-footer d2l-icon {
					flex-shrink: 0;
					color: var(--d2l-color-tungsten);
					@apply --d2l-body-small-text;
				}
				.d2l-activity-list-item-footer d2l-icon {
					--d2l-icon-width: 18px;
					--d2l-icon-height: 18px;
				}
				.d2l-activity-list-item-footer d2l-icon:first-child {
					display: none;
				}
				.d2l-activity-list-item-content {
					flex-grow: 1;
					margin: 0.5rem 0 0 0;
					max-height: 161px;
					display: flex;
					flex-direction: column;
				}
				.d2l-activity-list-item-content > * {
					margin: 0.5rem 0.5rem 0 0.5rem;
				}
			</style>
			<div class="d2l-activity-list-item-container">
				<a class="d2l-focusable" href$="[[href]]" hreflang="[[hreflang]]">
					<span class="d2l-activity-list-item-link-text">[[_text]]</span>
				</a>
				<div class="d2l-activity-list-item-link-container">
					<div class="d2l-activity-list-item-image">[[_imageUrl]]</div>
					<div class="d2l-activity-list-item-content">
						<div class="d2l-activity-list-item-title">[[_title]]</div>
						<div class="d2l-activity-list-item-description"><p>[[_description]]</p></div>
						<div class="d2l-activity-list-item-footer" hidden$="[[!_tags]]">
							<template is="dom-repeat" items="[[_tags]]">
								<d2l-icon icon="d2l-tier1:bullet"></d2l-icon>
								<span>[[item]]</span>
							</template>
						</div>
					</div>
				</div>
			</div>
		`;
	}
	static get properties() {
		return {
			href: String,
			_text: String,
			_imageUrl: String,
			_title: String,
			_description: String,
			_tags: String
		};
	}
}

window.customElements.define('d2l-activity-list-item', D2lActivityListItem);
