# News Archiver

## Description

This is a **Vue.js** full-stack project I've been working on. I utilise the free tier for Google Cloud APIs and Services that are available on **Firebase**.

## Scenario 

Everyday news is kind of overwhelming sometimes. Each time you reload a page, there is a high chance that the headlines are completely different from what you have seen a few minutes ago. Moreovers, filtering the news that matters to you could be time-consuming. 

Therefore, I come up with an idea to develop an application that archives the news headlines, theirs URLs and a screenshot of the home page to a cloud storage/database every 15 minutes, so that you can view them all at one place at a time that you are free in the day.

The application involves an underlying **Scheduled Cloud Function** that is executed every 15 minutes and uses **Puppeteer** to scrape data from CNN News. In terms of data, the headlines and URLs are stored in **Firestore**, and the screenshots are stored in **Cloud Storage**. 

The source code also includes a client app to view data written in **Vue.js**. I also plan to scale the application with an iOS app when I start learning Swift and Flutter in the future.

---

## Problems while working on the project

### Puppeteer and Chromium on Google Cloud Function

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

- *Testing Puppeteer locally with simple examples works (puppeteer@v5.2.1)*
- *Some people said Puppeteer worked with Cloud Function with v2.1.0 / v1.14.0 / v3.0.4 / v1.9.0*
- *Function worked with puppeteer@5.2.1 + Nodejs Engine 12 + No incognito context, but failed when handling screenshot*
- *Puppeteer can be launched from Cloud Function, but no page content was retrieved*
- **RESOLVED:** *Downgraded to Nodejs Engine 10 + puppeteer@5.2.1 + No incognito context + Removing [--'no-sandbox', '--disable-setuid-sandbox'] from launch configuration*

### Saving screenshots

My initial approach was to create a `screenshots` directory, but after a few deployments, I found out that the only one directory that is writable by my code is the `/tmp` directory. 

Therefore, I decided to create the `screenshots` in `/tmp` to store my screenshot(s) and delete them after uploading to Cloud Storage to save memory usage in Cloud Functions runtime

### 


---

## My TODOS

- Write rmdir. If cannot, remove screenshots dir implementation altogether
- Implement Cloud Storage functions: Upload w/ admin.storage().bucket()
- Integrate Puppeteer with Cloud Storage function
- Implement client app (Vue.js)

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
