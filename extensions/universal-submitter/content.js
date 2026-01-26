// Content script
console.log("Universal Request Submitter active on this page.");

// Listen for specific messages if we want to move logic here later.
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "ping") {
    sendResponse({ status: "alive" });
  }
});
