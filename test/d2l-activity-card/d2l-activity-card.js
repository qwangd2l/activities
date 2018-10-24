describe('d2l-activity-card', () => {
	var component;
	var fetchStub;

	function SetupFetchStub(url, entity) {
		fetchStub.withArgs(sinon.match.has('url', sinon.match(url)))
			.returns(Promise.resolve({
				ok: true,
				json: () => { return Promise.resolve(entity); }
			}));
	}

	beforeEach(() => {
		component = fixture('d2l-activity-card-fixture');
		Polymer.dom.flush();
	});

	it('loads element', () => {
		expect(component).to.exist;
	});

	// it('default duration unit is Minutes', () => {
	// 	assert.equal(component.$$('.durationLabel').innerHTML, '2.5 Minutes');
	// });

	// it('provided duration unit is displayed', () => {
	// 	component = fixture('specified-duration-unit');
	// 	assert.equal(component.$$('.durationLabel').innerHTML, '2.5 Hours');
	// });

	// describe('given that the status is provided', () => {
	// 	it('should not have a status indicator if the status is not valid', () => {
	// 		component = fixture('invalid-status');
	// 		expect(component.$$('d2l-status-indicator')).to.not.exist;
	// 	});

	// 	it('should have a status indicator if the status is valid', () => {
	// 		expect(component.$$('d2l-status-indicator')).to.exist;
	// 	});
	// });
});
