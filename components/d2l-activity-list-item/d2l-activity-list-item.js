import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import {mixinBehaviors} from '@polymer/polymer/lib/legacy/class.js';
import {beforeNextRender, afterNextRender} from '@polymer/polymer/lib/utils/render-status.js';
import {IronResizableBehavior} from '@polymer/iron-resizable-behavior/iron-resizable-behavior.js';
import 'fastdom/fastdom.min.js';
import '../../../d2l-offscreen/d2l-offscreen-shared-styles.js';
import '../../../d2l-icons/d2l-icon.js';
import '../../../d2l-icons/tier1-icons.js';

/**
 * @customElement
 * @polymer
 */
class D2lActivityListItem extends mixinBehaviors([IronResizableBehavior], PolymerElement) {
	static get template() {
		return html`
			<style include="d2l-offscreen-shared-styles">
				:host {
					display: block;
				}
				:host([active]) {
					border-color: rgba(0, 111, 191, 0.4);
					box-shadow: 0 0 0 4px rgba(0, 111, 191, 0.3);
				}
				.d2l-activity-list-item-container:hover,
				.d2l-activity-list-item-container:focus {
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
				.d2l-activity-list-item-description p {
					margin: 0;
					padding: 0;
					@apply --d2l-body-compact-text;
					color: var(--d2l-color-ferrite);
				}
				.d2l-activity-list-item-footer,
				.d2l-activity-list-item-footer span d2l-icon {
					flex-shrink: 0;
					color: var(--d2l-color-tungsten);
					@apply --d2l-body-small-text;
				}
				.d2l-activity-list-item-footer {
					height: 1rem;
					overflow: hidden;
				}
				.d2l-activity-list-item-footer span d2l-icon {
					--d2l-icon-width: 18px;
					--d2l-icon-height: 18px;
				}
				.d2l-activity-list-item-footer span:first-child d2l-icon{
					display: none;
				}
				.d2l-activity-list-item-footer span {
					white-space: nowrap;
				}
				.d2l-activity-list-item-content {
					flex-grow: 1;
					margin: 0.5rem 0 0 0;
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
						<div class="d2l-activity-list-item-description" hidden$="[[!_descriptionMaxLines]]"><p>[[_description]]</p></div>
						<div class="d2l-activity-list-item-footer" hidden$="[[!_tags]]">
							<template is="dom-repeat" items="[[_tags]]">
								<span>
									<d2l-icon icon="d2l-tier1:bullet"></d2l-icon>
									[[item]]
								</span>
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
			_description: {
				type: String,
				observe: '_onDescriptionChange'
			},
			_tags: String,
			_descriptionMaxLines: Number,
			_responsiveMinWidth: Number
		};
	}

	ready() {
		super.ready();
		this._onLinkBlur = this._onLinkBlur.bind(this);
		this._onLinkFocus = this._onLinkFocus.bind(this);
	}
	attached() {
		super.attached();
		afterNextRender(this, () => {
			var link = this.shadowRoot.querySelector('a');
			link.addEventListener('blur', this._onLinkBlur);
			link.addEventListener('focus', this._onLinkFocus);
			this.addEventListener('iron-resize', () => this._setResponsiveSizes(this.offsetWidth));
			this._setResponsiveSizes(this.offsetWidth);
		});
	}

	get _responsiveSizes() {
		return [
			{
				minWidth: 0,
				imageSize: {
					width: 89,
					height: 50
				},
				descriptionMaxLines: 0
			},
			{
				minWidth: 400,
				imageSize: {
					width: 135,
					height: 75
				},
				descriptionMaxLines: 0
			},
			{
				minWidth: 500,
				imageSize: {
					width: 183,
					height: 102
				},
				descriptionMaxLines: 2
			},
			{
				minWidth: 600,
				imageSize: {
					width: 212,
					height: 125
				},
				descriptionMaxLines: 2
			},
			{
				minWidth: 700,
				imageSize: {
					width: 273,
					height: 161
				},
				descriptionMaxLines: 3
			},
			{
				minWidth: 900,
				imageSize: {
					width: 273,
					height: 161
				},
				descriptionMaxLines: 4
			}
		];
	}

	_onLinkBlur() {
		window.fastdom.mutate(function() {
			this.removeAttribute('active', 'active');
		}.bind(this));
	}

	_onLinkFocus() {
		window.fastdom.mutate(function() {
			this.setAttribute('active', 'active');
		}.bind(this));
	}

	_setResponsiveSizes(currentWidth) {
		let currentSize = this._responsiveSizes[0];
		for (var nextSize of this._responsiveSizes) {
			if (nextSize.minWidth > currentWidth) {
				break;
			}
			currentSize = nextSize;
		}

		if (this._responsiveMinWidth === currentSize.minWidth) {
			return;
		}

		this._descriptionMaxLines = currentSize.descriptionMaxLines;
		this._responsiveMinWidth = currentSize.minWidth;

		window.fastdom.mutate(() => {
			const image = this.shadowRoot.querySelector('.d2l-activity-list-item-image');
			image.style.width = currentSize.imageSize.width + 'px';
			image.style.height = currentSize.imageSize.height + 'px';
		});

		this._clampDescription(this._description);
	}
	_onDescriptionChange(description) {
		this._clampDescription(description);
	}
	_clampDescription(description) {
		const p = this.shadowRoot.querySelector('.d2l-activity-list-item-description p');
		const lineHeight = window.getComputedStyle(p).getPropertyValue('line-height').match(/\d+/)[0];

		if (this._descriptionMaxLines === 0 || p.offsetHeight === this._descriptionMaxLines * lineHeight) {
			return;
		}

		beforeNextRender(this, () => {
			window.fastdom.mutate(() => {
				p.textContent = description;
				while (p.offsetHeight > this._descriptionMaxLines * lineHeight || p.textContent === '...')  {
					p.textContent = p.textContent.replace(/\W*\s(\S)*$/, '...');
				}
			});
		});
	}
}

window.customElements.define('d2l-activity-list-item', D2lActivityListItem);
