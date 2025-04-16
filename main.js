const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const input = JSON.parse(fs.readFileSync('input.json', 'utf8'));
    const { sessionCookie, usernames, message } = input;

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
            console.log(`Sending message to ${username}...`);
            await page.goto(`https://www.instagram.com/${username}/`, { waitUntil: 'networkidle2' });
            await page.waitForSelector('header a[href$="/direct/new/"]', { timeout: 10000 });

            await page.click('header a[href$="/direct/new/"]');
            await page.waitForTimeout(2000);
            await page.waitForSelector('textarea');
            await page.type('textarea', message, { delay: 100 });

            const sendButton = await page.$x("//button[contains(text(),'Send')]");
            if (sendButton.length > 0) await sendButton[0].click();

            console.log(`✅ Message sent to ${username}`);
            await page.waitForTimeout(5000 + Math.random() * 5000);
        } catch (err) {
            console.log(`❌ Failed to message ${username}: ${err.message}`);
        }
    }

    await browser.close();
})();