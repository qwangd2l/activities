(function() {
	suite('d2l-activity-evaluation-icon-base as draft', function() {
		let draftEvaluation;
		let invalidEvaluation;

		setup(function() {
			invalidEvaluation = fixture('invalid');
			draftEvaluation = fixture('draft');
		});

		test('instantiating the element works', function() {
			assert.equal(draftEvaluation.tagName.toLowerCase(), 'd2l-activity-evaluation-icon-base');
		});

		test('activity evaluation without any attribute does not display an icon', function(done) {
			flush(function() {

				var icon = invalidEvaluation.shadowRoot.querySelector('d2l-icon');
				assert.equal(null, icon);

				done();
			});
		});

		test('activity evaluation with draft attribute displayed draft icon', function(done) {
			flush(function() {

				var draftIcon = draftEvaluation.shadowRoot.querySelector('#d2l-draft-icon');
				var draftIconName = draftIcon.getAttribute('icon');
				assert.equal('d2l-tier1:draft', draftIconName);

				done();
			});
		});

	});
})();
