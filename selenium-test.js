const webdriver = require('selenium-webdriver');

// HTTP Server should be running on 8787 port of GitHub runner
async function runTestWithCaps(capabilities) {
	let driver = new webdriver.Builder()
		.usingServer('http://hub-cloud.browserstack.com/wd/hub')
		.withCapabilities(capabilities)
		.build();

	try {
		await driver.manage().setTimeouts({ implicit: 8000 });

		// if (capabilities.browserName === "Safari") {
		// 	await driver.get("http://127.0.0.1:8080");
		// } else {
			await driver.get("http://localhost:8080");
		// }

		const webchatToggle = await driver.findElement(webdriver.By.className("webchat-toggle-button"));

		await driver.wait(webdriver.until.elementIsVisible(webchatToggle));
		await webchatToggle.click();

		const getStartedButton = await driver.wait(webdriver.until.elementLocated(webdriver.By.id("webchatGetStartedButton")));
		await getStartedButton.click();

		const chatInput = await driver.findElement(webdriver.By.id("webchatInputMessageInputInTextMode"));
		await chatInput.sendKeys("Browser Test", webdriver.Key.ENTER); // this submits on desktop browsers

		const sentMessage = await driver.wait(webdriver.until.elementLocated(webdriver.By.className("webchat-message-row user")), 8000);
		await driver.wait(webdriver.until.elementTextIs(sentMessage, "Browser Test"), 3000);

		await driver.executeScript(
			'browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"passed","reason": "Message sent!"}}'
		);

	} catch (e) {
		console.log(e);
		await driver.executeScript(
			'browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"failed","reason": "Message send failed."}}'
		);

	} finally {
		await driver.quit();
	}
}

// Input capabilities 
// Chrome win 10
const capabilitiesChrome = {
	'os': 'windows',
	'os_version': '10',
	'resolution': '1920x1080',
	'browserName': 'Chrome',
	'browser_version': 'latest',
	'browserstack.local': 'true',
	"browserstack.idleTimeout": 20,
	'build': process.env.BROWSERSTACK_BUILD_NAME,
	'name': "Chrome Win10 test",
	'project': process.env.BROWSERSTACK_PROJECT_NAME,
	'browserstack.localIdentifier': process.env.BROWSERSTACK_LOCAL_IDENTIFIER,
	'browserstack.user': process.env.BROWSERSTACK_USERNAME,
	'browserstack.key': process.env.BROWSERSTACK_ACCESS_KEY
}

// IE11 win 10
const capabilitiesIE11 = {
	'os': 'windows',
	'os_version': '10',
	'browserName': 'IE',
	'browser_version': '11.0',
	// 'resolution': '1280x800',
	'resolution': '1920x1080',
	'browserstack.local': 'true',
	"browserstack.idleTimeout": 20,
	'build': process.env.BROWSERSTACK_BUILD_NAME,
	'name': "IE11 Win10 test",
	'project': process.env.BROWSERSTACK_PROJECT_NAME,
	'browserstack.localIdentifier': process.env.BROWSERSTACK_LOCAL_IDENTIFIER,
	'browserstack.user': process.env.BROWSERSTACK_USERNAME,
	'browserstack.key': process.env.BROWSERSTACK_ACCESS_KEY
}

// Safari OS X
const capabilitiesSafari = {
	'browserName': 'Safari',
	'browser_version': '14.1',
	'os': 'OS X',
	'os_version': 'Big Sur',
	'resolution': '1920x1080',
	'browserstack.local': 'true',
	"browserstack.idleTimeout": 20,
	'build': process.env.BROWSERSTACK_BUILD_NAME,
	'name': "Safari OS X test",
	'project': process.env.BROWSERSTACK_PROJECT_NAME,
	'browserstack.localIdentifier': process.env.BROWSERSTACK_LOCAL_IDENTIFIER,
	'browserstack.user': process.env.BROWSERSTACK_USERNAME,
	'browserstack.key': process.env.BROWSERSTACK_ACCESS_KEY
}

// Firefox win 10
const capabilitiesFirefox = {
	'os': 'windows',
	'os_version': '10',
	'resolution': '1920x1080',
	'browserName': 'firefox',
	'browser_version': 'latest',
	'browserstack.local': 'true',
	"browserstack.idleTimeout": 20,
	'build': process.env.BROWSERSTACK_BUILD_NAME,
	'name': "Firefox Win10 test",
	'project': process.env.BROWSERSTACK_PROJECT_NAME,
	'browserstack.localIdentifier': process.env.BROWSERSTACK_LOCAL_IDENTIFIER,
	'browserstack.user': process.env.BROWSERSTACK_USERNAME,
	'browserstack.key': process.env.BROWSERSTACK_ACCESS_KEY
}

runTestWithCaps(capabilitiesChrome);
runTestWithCaps(capabilitiesIE11);
// runTestWithCaps(capabilitiesSafari);
runTestWithCaps(capabilitiesFirefox);