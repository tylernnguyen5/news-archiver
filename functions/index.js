const functions = require('firebase-functions');

// Initializing
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

// ======================================================================================

// Puppeteer (custom module)

const puppeteer = require('./modules/puppeteer');

// ======================================================================================

// Schedule cloud function (PubSub)



// ======================================================================================

// Firestore Implementation

const db = admin.firestore()

// Get data
function getCNNData() {
    // CHECKME: This function can be used for front-end for retrieving data from 'cnn' collection in Firestore
    db.collection('cnn').get()
        .then((snapshot) => {
            snapshot.docs.forEach(doc => {
                console.log(doc.id); 
                console.log(doc.data().headline);
                console.log(doc.data().timestamp);
            })
        })
        .catch(error => console.log('Error getting documents from Firestore', error));
}

// Add data
function addCNNData(headline) {
    // CHECKME: This function is for adding new documents into 'cnn' collections in Firestore 
    const data = {
        headline: headline,
        timestamp: admin.firestore.Timestamp.fromDate(new Date())
    };

    db.collection('cnn').add(data);
}

// ======================================================================================

// Cloud Storage Implementation


// Upload screenshot


// Get screenshot