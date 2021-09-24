const webdriver = require('selenium-webdriver');

// Input capabilities
const capabilities = {
	'os': 'windows',
	'os_version': '10',
	'browserName': 'IE',
	'browser_version': '11.0',
	'resolution': '1280x800',
	'browserstack.local': 'true',
	'build': process.env.BROWSERSTACK_BUILD_NAME,
	'project': process.env.BROWSERSTACK_PROJECT_NAME,
	'browserstack.localIdentifier': process.env.BROWSERSTACK_LOCAL_IDENTIFIER,
	'browserstack.user': process.env.BROWSERSTACK_USERNAME,
	'browserstack.key': process.env.BROWSERSTACK_ACCESS_KEY
}

// const driver = new webdriver.Builder()
// 	.usingServer('http://hub-cloud.browserstack.com/wd/hub')
// 	.withCapabilities(capabilities)
// 	.build();

// driver.get('http://localhost:8787').then(function () {
// 	driver.getTitle().then(function (title) {
// 		console.log(title);
// 		driver.quit();
// 	});
// });

// HTTP Server should be running on 8787 port of GitHub runner
async function runTestWithCaps() {
	let driver = new webdriver.Builder()
		.usingServer('http://hub-cloud.browserstack.com/wd/hub')
		.withCapabilities(capabilities)
		.build();

	await driver.get("http://localhost:8787");

	// const inputField = await driver.findElement(webdriver.By.name("q"));

	// await inputField.sendKeys("BrowserStack", webdriver.Key.ENTER); // this submits on desktop browsers
	// try {
	// 	await driver.wait(webdriver.until.titleMatches(/BrowserStack/i), 5000);
	// } catch (e) {
	// 	await inputField.submit(); // this helps in mobile browsers
	// }
	try {
		// await driver.wait(webdriver.until.titleMatches(/BrowserStack/i), 5000);
		console.log(await driver.getTitle());
		await driver.executeScript(
			'browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"passed","reason": "Title found!"}}'
		);
	} catch (e) {
		await driver.executeScript(
			'browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"failed","reason": "Page could not load in time"}}'
		);
	}
	await driver.quit();
}
runTestWithCaps();