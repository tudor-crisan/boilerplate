// Content script for Universal Submitter
console.log("Universal Request Submitter active on this page.");

// Style IDs for injected CSS
const MEDIA_HIDE_STYLE_ID = "universal-submitter-hide-media";
const BW_MODE_STYLE_ID = "universal-submitter-bw-mode";

// CSS for hiding media
const HIDE_MEDIA_CSS = `
  img, video, iframe[src*="youtube"], iframe[src*="vimeo"], 
  iframe[src*="player"], embed, object,
  picture, svg[class*="image"], [class*="video-"],
  [style*="background-image"] {
    display: none !important;
    visibility: hidden !important;
  }
`;

// CSS for black and white mode
const BW_MODE_CSS = `
  html {
    filter: grayscale(100%) !important;
    -webkit-filter: grayscale(100%) !important;
  }
`;

// Function to inject or remove style
function toggleStyle(styleId, css, enable) {
  let styleEl = document.getElementById(styleId);

  if (enable) {
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = styleId;
      styleEl.textContent = css;
      document.head.appendChild(styleEl);
    }
  } else {
    if (styleEl) {
      styleEl.remove();
    }
  }
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "ping") {
    sendResponse({ status: "alive" });
  } else if (request.action === "toggleMedia") {
    toggleStyle(MEDIA_HIDE_STYLE_ID, HIDE_MEDIA_CSS, request.hide);
    sendResponse({ success: true, mediaHidden: request.hide });
  } else if (request.action === "toggleBW") {
    toggleStyle(BW_MODE_STYLE_ID, BW_MODE_CSS, request.enable);
    sendResponse({ success: true, bwMode: request.enable });
  }
  return true; // Keep message channel open for async response
});

// Apply saved preferences on page load
chrome.storage.local.get(["hideMedia", "bwMode"], (result) => {
  if (result.hideMedia) {
    toggleStyle(MEDIA_HIDE_STYLE_ID, HIDE_MEDIA_CSS, true);
  }
  if (result.bwMode) {
    toggleStyle(BW_MODE_STYLE_ID, BW_MODE_CSS, true);
  }
});
