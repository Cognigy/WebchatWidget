var webdriver = require('selenium-webdriver');

// Input capabilities
var capabilities = {
	'os': 'windows',
	'os_version': '10',
	'browserName': 'chrome',
	'browser_version': 'latest',
	'browserstack.local': 'true',
	'build': process.env.BROWSERSTACK_BUILD_NAME,
	'project': process.env.BROWSERSTACK_PROJECT_NAME,
	'browserstack.localIdentifier': process.env.BROWSERSTACK_LOCAL_IDENTIFIER,
	'browserstack.user': process.env.BROWSERSTACK_USERNAME,
	'browserstack.key': process.env.BROWSERSTACK_ACCESS_KEY
}

var driver = new webdriver.Builder()
	.usingServer('http://hub-cloud.browserstack.com/wd/hub')
	.withCapabilities(capabilities)
	.build();

// HTTP Server should be running on 8787 port of GitHub runner
driver.get('http://localhost:8787').then(function () {
	driver.getTitle().then(function (title) {
		console.log(title);
		driver.quit();
	});
});