const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const fs = require("fs")


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

    $("section#intl_homepage1-zone-1 > div > div > div > ul > li > article > div > div > h3 > a")
        .each((index, element) => {
            let href = $(element).attr("href");
            let headline = $(element).find("span.cd__headline-text").text();

            headlines.push({
                headline,
                url: `${url}${href}`,
            });
        });
    

	// Screenshot and screenshot filename
	
	// Create screenshots dir
	fs.mkdir("/tmp/screenshots", (err) => {
		if (err) return console.error(err);
		console.log('Directory created successfully!');
	}); 

	// Take screenshot(s)
	const datetime = new Date()
		.toISOString()
		.replace("T", "--")
		.replace(/:/g, "-")
		.slice(0, -5);

	const filename = `cnn-${datetime}.png`;

    await page.screenshot({
		path: `/tmp/screenshots/${filename}`
	}).catch(err => console.log(err));
	console.log('Took screenshot(s)')	// FIXME: remove logging

    // FIXME: Return data
	// const data = {
	// 	headlines,
	// 	screenshot,
	// 	filename,
	// };
	const data = {
		headlines
	};

	await browser.close();

	console.log("Ending Puppeteer");

	return data;
};
