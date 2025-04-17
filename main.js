const puppeteer = require('puppeteer');

const credentials = {
  username: process.env.INSTAGRAM_USERNAME,
  password: process.env.INSTAGRAM_PASSWORD,
};

const recipients = ['username1', 'username2']; // Replace or use input file if preferred
const message = 'Hey! This is an automated message. ✨';

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--single-process',
    ],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  console.log('🌐 Opening Instagram...');
  await page.goto('https://www.instagram.com/accounts/login/', { waitUntil: 'networkidle2' });

  // Login
  await page.waitForSelector('input[name="username"]');
  await page.type('input[name="username"]', credentials.username, { delay: 50 });
  await page.type('input[name="password"]', credentials.password, { delay: 50 });
  await page.click('button[type="submit"]');

  console.log('🔐 Logging in...');
  await page.waitForNavigation({ waitUntil: 'networkidle2' });

  // Dismiss "Save Your Login Info?" popup
  try {
    await page.waitForXPath("//button[contains(text(),'Not Now')]", { timeout: 10000 });
    const [notNowBtn] = await page.$x("//button[contains(text(),'Not Now')]");
    if (notNowBtn) await notNowBtn.click();
  } catch (err) {
    console.log('✅ No "Save Your Login Info?" popup.');
  }

  // Dismiss "Turn on Notifications" popup
  try {
    await page.waitForXPath("//button[contains(text(),'Not Now')]", { timeout: 10000 });
    const [notifBtn] = await page.$x("//button[contains(text(),'Not Now')]");
    if (notifBtn) {
      await notifBtn.click();
      console.log("🔕 'Turn on Notifications' popup dismissed.");
    }
  } catch (err) {
    console.log('✅ No notification popup.');
  }

  // Send DM to each recipient
  for (const user of recipients) {
    console.log(`✉️ Sending message to @${user}`);
    await page.goto(`https://www.instagram.com/direct/new/`, { waitUntil: 'networkidle2' });

    // Search for user
    await page.waitForSelector('input[name="queryBox"]');
    await page.type('input[name="queryBox"]', user, { delay: 1000 });
    await page.waitForTimeout(2000);

    // Select the user from search results
    const userSelector = 'div[role="dialog"] div[role="button"]';
    await page.waitForSelector(userSelector);
    await page.click(userSelector);

    // Next button
    const nextButton = 'div[role="dialog"] div div:nth-child(1) div:nth-child(3) button';
    await page.waitForSelector(nextButton);
    await page.click(nextButton);

    // Type and send the message
    await page.waitForSelector('textarea');
    await page.type('textarea', message, { delay: 50 });
    await page.keyboard.press('Enter');

    console.log(`✅ Message sent to @${user}`);
    await page.waitForTimeout(2000);
  }

  await browser.close();
  console.log('🎉 All messages sent. Browser closed.');
})();
