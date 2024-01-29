const { chromium } = require('playwright')
const {expect} = require("expect");
const cp = require('child_process');
const playwrightClientVersion = cp.execSync('npx playwright --version').toString().trim().split(' ')[1];

(async () => {
  const capabilities = {
    'browserName': 'Chrome', // Browsers allowed: `Chrome`, `MicrosoftEdge`, `pw-chromium`, `pw-firefox` and `pw-webkit`
    'browserVersion': 'latest',
    'LT:Options': {
      'platform': 'Windows 10',
      'build': 'Playwright Single Build',
      'name': 'Playwright Sample Test',
      'user':'shubhamr',
      'accessKey':'dl8Y8as59i1YyGZZUeLF897aCFvIDmaKkUU1e6RgBmlgMLIIhh',
      'network': true,
      'video': true,
      'console': true,
      'tunnel': false, // Add tunnel configuration if testing locally hosted webpage
      'tunnelName': '', // Optional
      'geoLocation': '', // country code can be fetched from https://www.lambdatest.com/capabilities-generator/
      'playwrightClientVersion': playwrightClientVersion
    }
  }

  const browser = await chromium.connect({
    wsEndpoint: `wss://cdp.lambdatest.com/playwright?capabilities=${encodeURIComponent(JSON.stringify(capabilities))}`
  })

  const page = await browser.newPage();

  await page.goto('https://demo.playwright.dev/api-mocking');
  await page.waitForTimeout(22000);
  console.log("Before Calling The Api");


  // Mock the API call before navigating
  await page.route('*/**/api/v1/fruits', async route => {
    const response = await route.fetch();
    const json = await response.json();
    json.push({ name: 'Playwright', id: 100 });
    // Fulfill using the original response, while patching the response body
    // with the given JSON object.
    await route.fulfill({ response, json });
  });  
  await page.goto('https://demo.playwright.dev/api-mocking');

  await page.evaluate(() => {
    const element = document.documentElement; // Get the HTML element
    element.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'end' });
  });

  await page.waitForTimeout(12000);
  console.log("Adding up the items");
  

  // Assert that the Strawberry fruit is visible
  await page.waitForSelector('text=Strawberry', { state: 'visible' });
  await page.close();
  await browser.close();
  } )();
