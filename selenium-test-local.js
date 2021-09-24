const browserstack = require('browserstack-local');
const webdriver = require('selenium-webdriver');


// Creates an instance of Local
const bs_local = new browserstack.Local();

// You can also set an environment variable - "BROWSERSTACK_ACCESS_KEY".
const bs_local_args = { user: '', key: '' };

// Starts the Local instance with the required arguments
bs_local.start(bs_local_args, function () {
	console.log('Started BrowserStackLocal');

	// Check if BrowserStack local instance is running
	console.log('BrowserStackLocal running:', bs_local.isRunning());

	// Your test code goes here, from creating the driver instance till the end, i.e. driver.quit

	// Input capabilities
	const capabilities = {
		'os': 'windows',
		'os_version': '10',
		'browserName': 'IE',
		'browser_version': '11.0',
		'resolution': '1280x800',
		'browserstack.local': 'true',
		'browserstack.console': 'verbose',
		'browserstack.networkLogs': 'true',
		'build': process.env.BROWSERSTACK_BUILD_NAME || "BStack build 1",
		'project': process.env.BROWSERSTACK_PROJECT_NAME || "Selenium Webchat Test",
		'browserstack.localIdentifier': process.env.BROWSERSTACK_LOCAL_IDENTIFIER || "bstack-local",
		'browserstack.user': process.env.BROWSERSTACK_USERNAME,
		'browserstack.key': process.env.BROWSERSTACK_ACCESS_KEY
	}

	// var driver = new webdriver.Builder()
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

	// Stop the Local instance after your test run is completed, i.e after driver.quit
	bs_local.stop(function () {
		console.log('Stopped BrowserStackLocal');
	});
});

// // Input capabilities
// const capabilities = {
// 	'os': 'windows',
// 	'os_version': '10',
// 	'browserName': 'IE',
// 	'browser_version': '11.0',
// 	'resolution': '1280x800',
// 	'browserstack.local': 'true',
// 	'browserstack.console': 'verbose',
// 	'browserstack.networkLogs': 'true',
// 	'build': process.env.BROWSERSTACK_BUILD_NAME || "BStack build 1",
// 	'project': process.env.BROWSERSTACK_PROJECT_NAME || "Selenium Webchat Test",
// 	'browserstack.localIdentifier': process.env.BROWSERSTACK_LOCAL_IDENTIFIER || "bstack-local",
// 	'browserstack.user': process.env.BROWSERSTACK_USERNAME,
// 	'browserstack.key': process.env.BROWSERSTACK_ACCESS_KEY
// }

// // var driver = new webdriver.Builder()
// // 	.usingServer('http://hub-cloud.browserstack.com/wd/hub')
// // 	.withCapabilities(capabilities)
// // 	.build();

// // driver.get('http://localhost:8787').then(function () {
// // 	driver.getTitle().then(function (title) {
// // 		console.log(title);
// // 		driver.quit();
// // 	});
// // });

// // HTTP Server should be running on 8787 port of GitHub runner
// async function runTestWithCaps() {
// 	let driver = new webdriver.Builder()
// 		.usingServer('http://hub-cloud.browserstack.com/wd/hub')
// 		.withCapabilities(capabilities)
// 		.build();

// 	await driver.get("http://localhost:8787");

// 	// const inputField = await driver.findElement(webdriver.By.name("q"));

// 	// await inputField.sendKeys("BrowserStack", webdriver.Key.ENTER); // this submits on desktop browsers
// 	// try {
// 	// 	await driver.wait(webdriver.until.titleMatches(/BrowserStack/i), 5000);
// 	// } catch (e) {
// 	// 	await inputField.submit(); // this helps in mobile browsers
// 	// }
// 	try {
// 		// await driver.wait(webdriver.until.titleMatches(/BrowserStack/i), 5000);
// 		console.log(await driver.getTitle());
// 		await driver.executeScript(
// 			'browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"passed","reason": "Title found!"}}'
// 		);
// 	} catch (e) {
// 		await driver.executeScript(
// 			'browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"failed","reason": "Page could not load in time"}}'
// 		);
// 	}
// 	await driver.quit();
// }
// runTestWithCaps();