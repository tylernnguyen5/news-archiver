const puppeteer = require("puppeteer");
const cheerio = require("cheerio");

let browserPromise = puppeteer.launch({
	headless: true,
	args: ["--no-sandbox", "--disable-setupid-sandbox"]
}).catch(err => console.log("Error with launching Puppeteer browser: " + err));


module.exports.scrapeAndScreenshot = async function () {
	console.log("Starting Puppeteer");
	const url = "https://www.cnn.com";

	const browser =  await browserPromise;
	const context =  await browser.createIncognitoBrowserContext();

	const page = await context.newPage();

	await page.setViewport({
		// Standard viewport size
		width: 1366,
		height: 768,
		isLandscape: true,
	});

	// Navigate to url
	await page.goto(url, { waitUntil: 'networkidle2' });

	// Wait for the page finishing loading
	await page.evaluateHandle("document.fonts.ready");

	// Scraping

	// Headlines and URLs
	const html = await page.content();
	const $ = cheerio.load(html);
	const headlines = [];

	$("section#intl_homepage1-zone-1 > div > div > div > ul > li > article > div > div > h3 > a")
	.each((index, element) => {
		let href = $(element).attr("href");
		let headline = $(element).find("span.cd__headline-text").text();

		headlines.push({
			headline: headline,
			url: `${url}${href}`
		});
		console.log("Scrapped 1 headline");
	});

	// Screenshot and screenshot filename
	const datetime = new Date();

	const screenshot = await page.screenshot();
	const filename = `cnn-${datetime.toISOString()}.png`;

	const data = {
		headlines: headlines,
		screenshot: screenshot,
		filename: filename
	};

	await context.close();

	console.log("Ending Puppeteer");
	return Promise.resolve(data); 
}

// module.exports.screenshot = async () => {
// 	const url = "https://www.cnn.com";

// 	const browser = await browserPromise;
// 	const context = await browser.createIncognitoBrowserContext();

// 	const page = await context.newPage();

// 	await page.goto(url, { waitUntil: 'networkidle2' });

// 	// Screenshot and screenshot filename
// 	const screenshot = await page.screenshot();

// 	await context.close();

// 	return screenshot;
// }