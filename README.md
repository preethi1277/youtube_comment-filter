# 🧹 YouTube Comment Filter - Chrome Extension

A lightweight and user-friendly **Chrome Extension** that allows users to filter out unwanted words or phrases from YouTube comments. It empowers users to curate a cleaner and more pleasant comment section experience.

---

## 📌 About

This browser extension enables users to:
- Add custom words to a filter list
- Hide or remove YouTube comments containing those words
- Manage the filter list in real-time from a popup interface

---

## ✨ Features

- ✅ Simple and minimal UI
- ✅ Add multiple filter keywords dynamically
- ✅ View and manage current filters
- ✅ Extension runs directly on YouTube pages
- ✅ No external dependencies or frameworks — pure HTML, CSS & JS

---

## ⚙️ Tech Stack

| Layer          | Tech Used        |
|----------------|------------------|
| **Frontend**   | HTML, CSS, JavaScript |
| **Platform**   | Chrome Extension |
| **Storage**    | Chrome `localStorage` API (or `chrome.storage` if extended) |
| **Browser**    | Google Chrome (or Chromium-based)

---

## 🧠 How It Works

1. Install the extension in your Chrome browser
2. Click the extension icon to open the popup
3. Enter words you want to filter from YouTube comments
4. These words will be stored and used to hide/filter any matching comments on YouTube

---

## 🧩 How to Install (for Developers)

```bash
1. Clone or download this repo:
   https://github.com/preethi1277/youtube_comment-filter.git

2. Go to Chrome → Extensions (chrome://extensions)

3. Enable "Developer mode" (top right)

4. Click on "Load unpacked" and select the project folder

5. The extension will now appear in your toolbar
