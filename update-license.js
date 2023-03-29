const checker = require('license-checker');

const result = new Map();
let processing = 0;

checker.init({
	start: "./",
	json: true,
	development: false,
	production: true,
}, function (err, packages) {
	processing++;
	if (err) {
		processing--;
	} else {
		const keys = Object.keys(packages);
		for (let i = 0, il = keys.length; i < il; i++) {
			if (packages[keys[i]].publisher === "Cognigy GmbH") {
				continue;
			}
			let name = keys[i].split("@");
			name.pop();
			name = name.join("@");
			const data = {
				license: packages[keys[i]].licenses,
				websiteUrl: packages[keys[i]].url || packages[keys[i]].repository,
				authors: packages[keys[i]].publisher,
			}
			result.set(name, data);
		}
		processing--;
		if (processing === 0) {
			console.dir(Array.from(result, ([name, value]) => ({ name, ...value })), { 'maxArrayLength': null });
		}
	}
});
