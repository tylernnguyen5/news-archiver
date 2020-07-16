const functions = require('firebase-functions');

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

const db = admin.firestore();

// ======================================================================================

// Puppeteer (custom module)

// const myPuppeteer = require("./modules/my-puppeteer.js");
const myPuppeteer = require("./modules/puppeteer-no-incognito.js");

// ======================================================================================

// Schedule Cloud Function (PubSub)
exports.scheduledFunction = functions
	.runWith({ 
		timeoutSeconds: 540,
		memory: '2GB' 
	}).pubsub.schedule("*/15 * * * *") 	// Crontab: every 15mins
  	.onRun( async (context) => {
		console.log("This function will be run every 15 minutes!");

		// Get data from cnn collection in Firestore
		// getCNNData();

		// Scrape with Puppeteer
		// const data = {};
		// myPuppeteer.scrapeAndScreenshot()
		// 	.then(val => data = val)
		// 	.catch(err => console.log('Error scraping data with Puppeteer'));
		const data = await myPuppeteer.scrapeAndScreenshot();	

		const { headlines, screenshot, filename } = data;

		// Adding data to Firestore
		headlines.forEach( value => addCNNData(value)); 

		// Adding data to Cloud Storage


	});

// HTTP Cloud Function
// exports.screenshotHTTP = functions.https.onRequest((req, res) => {
// 	let screenshot;

// 	try {
// 		screenshot = myPuppeteer.screenshot();
// 	}
// 	catch (err) {
// 		console.log("Error when screenshot-ing");
// 	}
	
// 	res.send(screenshot);
// });

// ======================================================================================

// Firestore Implementation

// Get data
// CHECKME: This function can be used for front-end for retrieving data from 'cnn' collection in Firestore
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
// CHECKME: This function is for adding new documents into 'cnn' collections in Firestore 
function addCNNData(value) {
    const data = {
        headline: value.headline,
        url: value.url,
        timestamp: admin.firestore.Timestamp.fromDate(new Date())
    };

    db.collection("cnn")
		.add(data)
		.then(console.log("New data added"))
		.catch((err) => console.log("Error getting documents from Firestore", err));
}

// ======================================================================================

// Cloud Storage Implementation


// Upload screenshot


// Get screenshot

