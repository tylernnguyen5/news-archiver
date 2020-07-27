# News Archiver

## Description

This is a **Vue.js** full-stack project I've been working on. I utilise the free tier for Google Cloud APIs and Services that are available on **Firebase**.

## Scenario 

Everyday news is kind of overwhelming sometimes. Each time you reload a page, there is a high chance that the headlines are completely different from what you have seen a few minutes ago. Moreovers, filtering the news that matters to you could be time-consuming. 

Therefore, I come up with an idea to develop an application that archives the news headlines, theirs URLs and a screenshot of the home page to a cloud storage/database every 15 minutes, so that you can view them all at one place at a time that you are free in the day.

The application involves an underlying **Scheduled Cloud Function** that is executed every 15 minutes and uses **Puppeteer** to scrape data from CNN News. In terms of data, the headlines and URLs are stored in **Firestore**, and the screenshots are stored in **Cloud Storage**. 

The source code also includes a client to view data written in **Vue.js**

---

## Problems

While working on the project, I encountered a problem where the Puppeteer cannot be correctly executed when running on Google Cloud Function due to **the incompatibility between the version of Puppeteer and Chromium on the Google Cloud Platform**.

After researching through multiple threads and package release notes, Google Team acknowlegdes this problem and apparently planned to fix this issue in the next few releases. 

```
Error with launching Puppeteer browser: TimeoutError: Timed out after 30000 ms while trying to connect to the browser! Only Chrome at revision r782078 is guaranteed to work.
```

**Solutions that I tried:** 
- *Downgrading Puppeteer to v2.1.1 / v3.1.1 and run with Nodejs 10 engine*
- *Installing separated Chromium dependency*
- *Upgrading Nodejs engine to v12*
- *Removing incognito context for Puppeteer browser*
- *Rewrite browser promise*
- *Running Puppeteer with v5.2.1 locally (successfully)*

**Progress:**

- *27th Jul 20: Testing Puppeteer locally with simple examples works (puppeteer@v5.2.1)*


## My Plan

The issue may take a few weeks to be address if I want to use the Scheduled Cloud Function for Puppeteer implementation.

Therefore, I will focus on implementing the client app with Vue.js on a different branch with dummy data in Firestore and Cloud Storage.

By the time I complete the client app and I couldn't address the Scheduled Cloud Function problem, I would try implementing with a regular HTTP request Cloud Function

## Data Structure

**For Firestore**

```
data: {
    headline: String,
    timestamp: Timestamp,
    url: String
}
```

**For Cloud Storage**

Data are screenshots of the news website with the following naming convention: `cnn-2020-07-27--08-12-42.png`

---

## Tech Stacks

- Node.js
- Firebase (Hosting, Functions, Firestore, Cloud Storage)
- Puppeteer
- Cheerio
- Vue.js
- GCP (App Engine, Cloud Scheduler, Pub/Sub)