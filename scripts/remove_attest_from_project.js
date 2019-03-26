/* global require */
const fs = require('fs');
//read in the package file
const file_contents = JSON.parse(fs.readFileSync('package.json'));
if ('dependencies' in file_contents) {
	if ('attest' in file_contents.dependencies) {
		delete file_contents.dependencies.attest;
	}
}
fs.writeFileSync('package.json', JSON.stringify(file_contents, null, '\t'));
