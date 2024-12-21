import { getUserData } from "@/utils/api";
import { calculateTotalScore } from "@/utils/calculations";

const isChromeExtension =
  typeof chrome !== "undefined" && typeof chrome.runtime !== "undefined";

if (isChromeExtension) {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "fetchUserData") {
      getUserData(request.userId).then((data) => {
        sendResponse({ data: data });
      });
      return true; // Keep the message channel open for async response
    }
  });
} else {
  // For local development, we expose the functions to the global scope for testing
  (globalThis as any).getUserData = getUserData;
  (globalThis as any).calculateTotalScore = calculateTotalScore;
}
