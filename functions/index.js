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

// const puppeteer = require("./modules/puppeteer.js");

// ======================================================================================

// Schedule cloud function (PubSub)
exports.scheduledFunction = functions
	.runWith({
		timeoutSeconds: 300,
		memory: '1GB'
	}).pubsub
	.schedule("*/15 * * * *") 	// Crontab: every 15mins
  	.onRun( (context) => {
		console.log("This function will be run every 15 minutes!");

		// Get data from cnn collection in Firestore
		getCNNData();

		let headlines = [], screenshot, filename;

		// TRYME: Uncomment to add data with websrapping
		// try {
		//     headlines, screenshot = getHeadlines();
		// } catch (err) {
		//     console.log("Error when scrapping");
		// }
		// console.log("Headlines are being scraped");

		// TRYME: Uncomment the variable below to test the scheduled function
		headlines = [{
			headline: "US carries out first federal execution in years",
			url: "https://www.cnn.com/2020/07/14/politics/daniel-lewis-lee-supreme-court-rule-execution/index.html"
		}];

		headlines.forEach( value => addCNNData(value)); // Adding data to Firestore
	});


// ======================================================================================

// Firestore Implementation

// Get data
// CHECKME: This function can be used for front-end for retrieving data from 'cnn' collection in Firestore
function getCNNData() {
    db.collection('cnn').get()
        .then( (snapshot) => {
            snapshot.docs.forEach( doc => {
                console.log(doc.id); 
                console.log(doc.data().headline);
                console.log(doc.data().url);
                console.log(doc.data().timestamp);
            })
        })
        .catch(error => console.log('Error getting documents from Firestore', error));
}

// Add data
// CHECKME: This function is for adding new documents into 'cnn' collections in Firestore 
function addCNNData(value) {
    const data = {
        headline: value.headline,
        url: value.url,
        timestamp: admin.firestore.Timestamp.fromDate(new Date())
    };

    db.collection('cnn').add(data);
}

// ======================================================================================

// Cloud Storage Implementation


// Upload screenshot


// Get screenshot

