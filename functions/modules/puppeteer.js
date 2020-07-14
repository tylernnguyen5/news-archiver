const puppeteer = require("puppeteer");
const cheerio = require("cheerio");

module.exports.scrapeAndScreenshot = async function () {
	const url = "https://www.cnn.com/";

	const browser = await puppeteer.launch({
			args: ["--no-sandbox", "--disable-setupid-sandbox"]
	});

	const page = await browser.newPage();

	await page.setViewport({
		// Standard viewport size
		width: 1366,
		height: 768,
		isLandscape: true,
	});

	await page.goto(url);

	// Wait for the page finishing loading
	await page.evaluateHandle("document.fonts.ready");

	// Scraping
	const html = await page.content();
	const $ = cheerio.load(html);
	const headlines = [];

	$("section#intl_homepage1-zone-1 > div > div > div > ul > li > article > div > div > h3 > a > span.cd__headline-text")
	.each((index, element) => {
		headline = $(element).text();

		headlines.push(headline);
	});

	// Screenshot
	const datetime = new Date();

	const screenshot = await page.screenshot();
	const filename = `cnn-${datetime.toISOString()}.png`;

	await browser.close();

	return { headlines, screenshot, filename };
}