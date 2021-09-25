const webdriver = require('selenium-webdriver');

// Input capabilities
const capabilities = {
	'os': 'windows',
	'os_version': '10',
	// 'browserName': 'IE',
	// 'browser_version': '11.0',
	// 'resolution': '1280x800',
	'resolution': '1920x1080',
	'browserName': 'Chrome',
	'browser_version': 'latest',
	'browserstack.local': 'true',
	"browserstack.idleTimeout": 20,
	'build': process.env.BROWSERSTACK_BUILD_NAME,
	'project': process.env.BROWSERSTACK_PROJECT_NAME,
	'browserstack.localIdentifier': process.env.BROWSERSTACK_LOCAL_IDENTIFIER,
	'browserstack.user': process.env.BROWSERSTACK_USERNAME,
	'browserstack.key': process.env.BROWSERSTACK_ACCESS_KEY
}

// HTTP Server should be running on 8787 port of GitHub runner
async function runTestWithCaps() {
	let driver = new webdriver.Builder()
		.usingServer('http://hub-cloud.browserstack.com/wd/hub')
		.withCapabilities(capabilities)
		.build();

	try {
		await driver.manage().setTimeouts({ implicit: 5000 });

		await driver.get("http://localhost:8787");

		const webchatToggle = await driver.findElement(webdriver.By.className("webchat-toggle-button"));

		await driver.wait(webdriver.until.elementIsVisible(webchatToggle));
		await webchatToggle.click();

		const getStartedButton = await driver.findElement(webdriver.By.id("webchatGetStartedButton"));
		await getStartedButton.click();

		await driver.sleep(5000);

		const chatInput = await driver.findElement(webdriver.By.id("webchatInputMessageInputInTextMode"));
		await chatInput.sendKeys("Browser Test", webdriver.Key.ENTER); // this submits on desktop browsers

		await driver.sleep(8000);

		const nextChatMessages = await driver.findElements(webdriver.By.className("webchat-message-row"));
		const sentMessageIndex = nextChatMessages.findIndex(elem => elem.innerText === "Browser Test");

		if (sentMessageIndex === -1) throw new Error("Send Message failed")

		if (sentMessageIndex === nextChatMesages.length - 1) throw new Error("Receive Message failed")

		await driver.executeScript(
			'browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"passed","reason": "Received response!"}}'
		);

	} catch (e) {
		console.error(e);
		await driver.executeScript(
			'browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"failed","reason": "No response received."}}'
		);

	} finally {
		await driver.quit();
	}
}
runTestWithCaps();