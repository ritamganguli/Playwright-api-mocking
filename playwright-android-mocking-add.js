const {_android} = require("playwright");
const {expect} = require("expect");

(async () => {
  const capabilities = {
    "LT:Options": {
      "platformName": "android",
      "deviceName": "Galaxy S21 5G",
      "platformVersion": "12",
      "isRealMobile": true,
      "build": "Playwright Android Build",
      "name": "Playwright android test",
      "user":"shubhamr",
      "accessKey":"dl8Y8as59i1YyGZZUeLF897aCFvIDmaKkUU1e6RgBmlgMLIIhh",
      "network": true,
      "video": true,
      "console": true,
      "projectName": "New UI",
    },
  };

  let device = await _android.connect(
      `wss://cdp.lambdatest.com/playwright?capabilities=${encodeURIComponent(
          JSON.stringify(capabilities))}`,
  );

//   console.log(`Model:: ${device.model()}, serial:: ${device.serial()}`);

  await device.shell("am force-stop com.android.chrome");

  let context = await device.launchBrowser();
  let page = await context.newPage();

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
  await page.close();
  await context.close();
  await device.close();
  } )();


