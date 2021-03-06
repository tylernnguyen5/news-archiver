// TODO: remove credential
// Initializing variables
const firebaseConfig = {
  apiKey: "AIzaSyB6MmX9-y2Qrw3Y7x_ADWAgOkbBNHTA1ac",
  authDomain: "newsarchive.firebaseapp.com",
  databaseURL: "https://newsarchive.firebaseio.com",
  projectId: "newsarchive",
  storageBucket: "newsarchive.appspot.com",
  messagingSenderId: "595990768689",
  appId: "1:595990768689:web:150fa4c437006d8969b910",
  measurementId: "G-KXDVTXCSN4",
};

const admin = require("firebase-admin");
admin.initializeApp(firebaseConfig);

const functions = require("firebase-functions");
const db = admin.firestore();
const bucket = admin.storage().bucket();

const fs = require("fs");

// ======================================================================================

// Puppeteer (custom module)

// const myPuppeteer = require("./modules/my-puppeteer.js");
const myPuppeteer = require("./modules/test-puppeteer.js"); // FIXME: delete old modules

// ======================================================================================

// Schedule Cloud Function (PubSub)
exports.scheduledFunction = functions
	.runWith({ 
		timeoutSeconds: 540,
		memory: '2GB' 
	}).pubsub.schedule("*/15 * * * *") 	// Crontab: every 15mins
  	.onRun(async (context) => {
		console.log("This function will be run every 15 minutes!");

		// Scrape with Puppeteer
		const data = await myPuppeteer.scrapeAndScreenshot();	

		// FIXME: const { headlines, screenshot, filename } = data;
		const { headlines, filename } = data;

		// Adding data to Firestore
        console.log("Adding data to Firestore");
		// headlines.forEach(value => addHeadlinesData(value));  // FIXME: uncomment me

		// TODO: Adding data to Cloud Storage
        console.log("Adding data to Cloud Storage");
        addScreenshotData(filename);

	});

// ======================================================================================

// Firestore Implementation

// Get data
// TODO: This function can be used for front-end for retrieving data from 'cnn' collection in Firestore
function getCNNData() {
    db.collection('cnn')
		.get()
        .then((snapshot) => {
            snapshot.docs.forEach( doc => {
                console.log(doc.id); 
                console.log(doc.data().headline);
                console.log(doc.data().url);
                console.log(doc.data().timestamp);
            })
        })
        .catch(err => console.log('Error getting documents from Firestore', err));
}

// Add data 
// This function is for adding new documents into 'cnn' collections in Firestore 
function addHeadlinesData(value) {
    const data = {
        headline: value.headline,
        url: value.url,
        timestamp: admin.firestore.Timestamp.fromDate(new Date())
    };

    db.collection("cnn")
		.add(data)
		.then(console.log("New data added"))
		.catch(err => console.log("Error adding documents from Firestore", err));
}

// ======================================================================================

// Cloud Storage Implementation

// Upload screenshot
async function addScreenshotData(filename) {
    await bucket.upload(`/tmp/screenshots/${filename}`, 
        { destination: `screenshots/cnn/${filename}`}, 
        (err, file) => {
            if (err) throw err;
            else {
                console.log(`New file uploaded: ${file.name}`);

                // Remove file
                fs.unlink(`/tmp/screenshots/${filename}`, () => console.log(`File removed: ${filename}`));
            }    
        });

    // FIXME: remove 
    // Function to get current filenames 
    // in directory 
    function getCurrentFilenames() {
        console.log("\nCurrent filenames:");
        fs.readdirSync('/tmp/screenshots').forEach(file => {
            console.log(file);
        });
    } 
}

// TODO: Get screenshot
function getScreenshotData() {
    return null;
}
