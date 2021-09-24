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

// HTTP Server should be running on 8787 port of GitHub runner
async function runTestWithCaps() {
	let driver = new webdriver.Builder()
		.usingServer('http://hub-cloud.browserstack.com/wd/hub')
		.withCapabilities(capabilities)
		.build();

	await driver.manage().setTimeouts({ implicit: 5000 });

	await driver.get("http://localhost:8787");

	const webchatToggle = await driver.findElement(webdriver.By.className("webchat-toggle-button"));

	await webchatToggle.click();

	const chatHistory = await driver.findElement(webdriver.By.className("webchat-chat-history"));

	const chatMessageSum = await chatHistory.findElements(webdriver.By.className("webchat-message-row")).length;

	const chatInput = await driver.findElement(webdriver.By.id("webchatInputMessageInputInTextMode"));

	await chatInput.sendKeys("Browser Test", webdriver.Key.ENTER); // this submits on desktop browsers

	await driver.sleep(8000);

	try {
		const nextChatMessageSum = await chatHistory.findElements(webdriver.By.className("webchat-message-row")).length;

		if (chatMessageSum + 2 !== nextChatMessageSum) throw new Error("send & receive Message failed.")

		await driver.executeScript(
			'browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"passed","reason": "Received response!"}}'
		);
	} catch (e) {
		await driver.executeScript(
			'browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"failed","reason": "No response received."}}'
		);
	}
	await driver.quit();
}
runTestWithCaps();