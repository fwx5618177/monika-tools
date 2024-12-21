console.log("Background script running");

let requestCount = 0;
let errorCount = 0;
const requestLog: Record<string, any> = {};

chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed");
});

chrome.webRequest.onCompleted.addListener(
  (details) => {
    const tabId = details.tabId;

    if (!requestLog[tabId]) {
      requestLog[tabId] = [];
    }

    console.log({
      details,
    });

    requestLog[tabId].push({
      url: details.url,
      statusCode: details.statusCode,
      timeStamp: details.timeStamp,
    });

    requestCount++;
    chrome.storage.local.set({ requestLog, requestCount });
  },
  { urls: ["<all_urls>"] }
);

chrome.webRequest.onErrorOccurred.addListener(
  (details) => {
    errorCount++;
    chrome.storage.local.set({ errorCount });
  },
  { urls: ["<all_urls>"] }
);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "getLog") {
    const tabId = request.tabId;
    chrome.storage.local.get(
      ["requestLog", "requestCount", "errorCount"],
      (data) => {
        sendResponse({
          log: data.requestLog[tabId] || [],
          requestCount: data.requestCount,
          errorCount: data.errorCount,
        });
      }
    );
    return true;
  }
});
