const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const input = JSON.parse(fs.readFileSync('input.json', 'utf8'));
    const { sessionCookie, usernames, message, delayBetweenMessages } = input;

    const browser = await puppeteer.launch({
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    // Set session cookie
    await page.setCookie({
        name: 'sessionid',
        value: sessionCookie,
        domain: '.instagram.com',
        path: '/',
        httpOnly: true,
        secure: true
    });

    await page.goto('https://www.instagram.com/', { waitUntil: 'networkidle2' });
    await page.waitForTimeout(5000);

    if (await page.$('input[name="username"]')) {
        throw new Error('Invalid session. Please check your sessionCookie.');
    }

    for (const username of usernames) {
        try {
            console.log(`➡️ Sending message to ${username}...`);

            await page.goto(`https://www.instagram.com/${username}/`, { waitUntil: 'networkidle2' });
            await page.waitForTimeout(3000);

            // Try public profile "Message" button first
            const directMessageBtnXPath = "//div[@role='button' and text()='Message']";
            const [directMessageBtn] = await page.$x(directMessageBtnXPath);

            if (directMessageBtn) {
                await directMessageBtn.click();
                await page.waitForTimeout(3000);
                console.log(`💬 Opened message box for public profile: ${username}`);
            } else {
                // Fallback: private profile via 3-dots menu
                console.log(`🔐 Public message button not found, trying private profile flow for ${username}`);

                await page.waitForSelector('svg[aria-label="Options"]', { timeout: 10000 });
                const optionsSvg = await page.$('svg[aria-label="Options"]');
                if (!optionsSvg) {
                    console.log(`❌ Options button not found for ${username}`);
                    continue;
                }

                const optionsDiv = await optionsSvg.evaluateHandle(el => el.closest('div[role="button"]'));
                await optionsDiv.click();
                await page.waitForTimeout(1000);

                const sendMessageBtnXPath = "//button[contains(text(),'Send message')]";
                await page.waitForXPath(sendMessageBtnXPath, { timeout: 10000 });
                const [sendMessageBtn] = await page.$x(sendMessageBtnXPath);
                if (!sendMessageBtn) {
                    console.log(`❌ 'Send message' button not found for ${username}`);
                    continue;
                }

                await sendMessageBtn.click();
                await page.waitForTimeout(3000);
                console.log(`💬 Opened message box for private profile: ${username}`);
            }

            // Handle "Turn on Notifications" popup if it appears
            try {
                const notNowBtnXPath = "//button[contains(text(),'Not Now')]";
                await page.waitForXPath(notNowBtnXPath, { timeout: 5000 });
                const [notNowBtn] = await page.$x(notNowBtnXPath);
                if (notNowBtn) {
                    await notNowBtn.click();
                    await page.waitForTimeout(1000);
                    console.log("🔕 'Turn on Notifications' popup dismissed.");
                }
            } catch {
                // It's okay if it doesn't appear
            }

            // Type the message into the editable div
            await page.waitForSelector('div[role="textbox"]', { timeout: 10000 });
            await page.focus('div[role="textbox"]');
            await page.keyboard.type(message, { delay: 50 });

            // Click the "Send" button
            const sendBtnXPath = "//div[@role='button' and text()='Send']";
            const [sendButton] = await page.$x(sendBtnXPath);
            if (sendButton) {
                await sendButton.click();
                console.log(`✅ Message sent to ${username}`);
            } else {
                console.log(`❌ Send button not found for ${username}`);
            }

            // Wait based on the delay input
            const delayMs = delayBetweenMessages * 1000;
            console.log(`⏳ Waiting ${delayBetweenMessages} seconds before next DM...`);
            await page.waitForTimeout(delayMs);

        } catch (err) {
            console.log(`❌ Failed to message ${username}: ${err.message}`);
        }
    }

    await browser.close();
})();