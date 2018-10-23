import { Element, html } from '@polymer/polymer/polymer-element.js';
const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = html`<dom-module id="d2l-activities">
	<template strip-whitespace="">
		<style>
			:host {
				display: inline-block;
			}
			:host([hidden]) {
				display: none;
			}
		</style>
		<h2>Hello [[prop1]]!</h2>
	</template>

</dom-module>`;

document.head.appendChild($_documentContainer.content);
/**
 * `<d2l-activities>`
 * Contains Hypermedia components that display informations about activites
 * @customElement
 * @polymer
 * @demo demo/index.hmtl
 */
class Activities extends Element {
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
	constructor() {
		super();
	}
}
customElements.define(Activities.is, Activities);
