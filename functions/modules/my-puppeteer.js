const puppeteer = require("puppeteer");
const cheerio = require("cheerio");

module.exports.scrapeAndScreenshot = async function () {
	console.log("Starting Puppeteer");
	const url = "https://edition.cnn.com/";

	const browser = await puppeteer.launch();

	const page = await browser.newPage();

	await page.setViewport({
		// Standard viewport size
		width: 1366,
		height: 768,
		isLandscape: true,
	});

	// Navigate to url
	await page.goto(url, { waitUntil: "networkidle2" });

	// Scraping

	// Headlines and URLs
	const html = await page.content();
	const $ = cheerio.load(html);
	const headlines = [];

	$(
		"section#intl_homepage1-zone-1 > div > div > div > ul > li > article > div > div > h3 > a"
	).each((index, element) => {
		let href = $(element).attr("href");
		let headline = $(element).find("span.cd__headline-text").text();

		headlines.push({
			headline,
			url: `${url}${href}`,
		});
		console.log("Scrapped 1 headline");
	});

	// FIXME: Screenshot and screenshot filename
	// const datetime = new Date()
	// 	.toISOString()
	// 	.replace("T", "--")
	// 	.replace(/:/g, "-")
	// 	.slice(0, -5);

	// const filename = `cnn-${datetime}.png`;

	// const screenshot = await page.screenshot({
	// 	path: `./${filename}`,
	// });

	// FIXME: Return data
	// const data = {
	// 	headlines: headlines,
	// 	screenshot: screenshot,
	// 	filename: filename,
	// };
	const data = {
		headlines,
	};

	await browser.close();

	console.log("Ending Puppeteer");

	return data;
};
