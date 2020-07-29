# Problems while working on the project

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
- **RESOLVED:** *Downgraded to Nodejs Engine 10 + puppeteer@5.2.1 + No incognito context + Removing `[--'no-sandbox', '--disable-setuid-sandbox']` from launch configuration*

### Saving screenshots

My initial approach was to create a `screenshots` directory in Google Cloud Functions runtime, but after a few deployments, I found out that the only one directory that is writable by my code is the `/tmp` directory. 

Therefore, I decided to create the `screenshots` in `/tmp` to store my screenshot(s). The `/tmp` would be emptied after the excecution is finalized.

### 