# News Archiver

## Description

This is a full-stack project I've been working on. I utilise the free tier for Google Cloud APIs and Services that are available on **Firebase**.

## Scenario 

Everyday news is kind of overwhelming sometimes. Each time you reload a page, there is a high chance that the headlines are completely different from what you have seen a few minutes ago. Moreovers, filtering the news that matters to you could be time-consuming. 

Therefore, I come up with an idea to develop an application that archives the news headlines, theirs URLs and a screenshot of the home page to a cloud storage/database every 15 minutes, so that you can view them all at one place at a time that you are free in the day.

The application involves an underlying **Scheduled Cloud Function** that is executed every 15 minutes and uses **Puppeteer** to scrape data from CNN News. In terms of data, the headlines and URLs are stored in **Firestore**, and the screenshots are stored in **Cloud Storage**. 

The source code also includes a client to view data written in **Vue.js**

## Problems

While working on the project, I encountered a problem where the Puppeteer cannot be correctly executed when running on Google Cloud Function due to the incompatibility betweenn the version of Puppeteer and Chromium on the Google Cloud Platform.

*Notes: Read through some threads and decide to wait on the next release from Google*

**Solution:** *Downgrading Puppeteer to v2.1.1 and run with Nodejs 10 engine for Google Cloud Function*

## Tech Stacks

- Node.js
- Firebase
- Puppeteer
- Vue.js
- GCP