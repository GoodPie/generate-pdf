const puppeteer = require('puppeteer')
const express = require('express')

const app = express()
const port = 4000

const browserPool = [];
const browserPoolLimit = 5; // Adjust the pool size
const maxRequestsPerBrowser = 10; // Limit requests before replacement
const browserUsageCount = {}; // Track usage per browser instance

app.use(express.json({limit: '10mb'})); // Increased limit
app.use(express.urlencoded({extended: true, limit: '10mb'}));

const initializeBrowserPool = async () => {
    for (let i = 0; i < browserPoolLimit; i++) {
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        browserPool.push(browser);
    }
};

initializeBrowserPool(); // Create the pool at startup

app.post('/generate_pdf', async (req, res) => {

    // Get the details from the request
    const html = req.body.html;
    const title = req.body.title;

    console.log('Generating PDF for:', title);

    const browser = browserPool.shift();

    try {
        const page = await browser.newPage();
        await page.setContent(html, {waitUntil: 'load'});
        const pdf = await page.pdf({
            format: 'A4', printBackground: true,
            margin: {
                top: '0',
                right: '0',
                bottom: '0',
                left: '0'
            }
        }); // Added format for consistency

        // Add Content-Disposition header with suggested filename
        const filename = title + '.pdf'; // Construct the filename
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.contentType('application/pdf');

        res.send(pdf);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while generating the PDF.');
    } finally {
        browserUsageCount[browser] = (browserUsageCount[browser] || 0) + 1;
        if (browserUsageCount[browser] >= maxRequestsPerBrowser) {
            // Replace the browser if it has reached the limit
            await browser.close();
            browserPool.splice(browserPool.indexOf(browser), 1); // Remove
            const newBrowser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
            browserPool.push(newBrowser);
            browserUsageCount[newBrowser] = 0; // Reset count for new browser
        } else {
            browserPool.push(browser); // Return to pool if not replaced
        }
    }
});

app.listen(port, () => {
    console.log(`PDF Generation listening at http://localhost:${port}`);
});

process.on('SIGINT', async () => {
    for (const browser of browserPool) {
        await browser.close();
    }
    process.exit();
});