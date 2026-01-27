// Content script for Universal Submitter
console.log("Universal Submitter: Content script active.");

// Style IDs for injected CSS
const MEDIA_HIDE_STYLE_ID = "universal-submitter-hide-media";
const BW_MODE_STYLE_ID = "universal-submitter-bw-mode";

// CSS for hiding media - NUCLEAR OPTION
const HIDE_MEDIA_CSS = `
  /* Hide all image/video tags */
  img, video, audio, source, track,
  iframe, embed, object, param,
  picture, canvas, map, area,
  svg, figure, figcaption,
  [role="img"], [aria-label*="image"], 
  .image, .img, .photo, .pic, .thumbnail, .logo, .banner, .cover, .icon,
  
  /* Hide elements with background images */
  [style*="background-image"],
  [style*="url("] {
    display: none !important;
    visibility: hidden !important;
    opacity: 0 !important;
    width: 0 !important;
    height: 0 !important;
    pointer-events: none !important;
  }

  /* Global nuke for background images */
  * {
    background-image: none !important;
    background: none !important; /* Riskier but effectively removes abbreviated backgrounds */
  }

  /* Restore background colors if needed, but 'background: none' might kill colors. 
     Let's be safer with background-image only for the global rule, 
     but specific elements get the nuke. */
`;

// Stronger Global Nuke for background images only
const BACKGROUND_NUKE_CSS = `
  * {
    background-image: none !important;
    --background-image: none !important; /* CSS variables */
  }
`;

// CSS for black and white mode
const BW_MODE_CSS = `
  html {
    filter: grayscale(100%) !important;
    -webkit-filter: grayscale(100%) !important;
  }
`;

// State
let isMediaHidden = false;

// Function to inject or remove style
function toggleStyle(styleId, css, enable) {
  let styleEl = document.getElementById(styleId);

  if (enable) {
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = styleId;
      styleEl.textContent = css + BACKGROUND_NUKE_CSS;
      document.documentElement.appendChild(styleEl); // Append to HTML to be super early/top
      console.log(`Universal Submitter: Injected style ${styleId}`);
    }
  } else {
    if (styleEl) {
      styleEl.remove();
      console.log(`Universal Submitter: Removed style ${styleId}`);
    }
  }
}

// Aggressive JS-based hiding for stubborn elements
function aggressiveHide() {
  if (!isMediaHidden) return;

  const selectors = [
    "img",
    "video",
    "iframe",
    "svg",
    "canvas",
    "[style*='background-image']",
    "[style*='url(']",
  ];

  const elements = document.querySelectorAll(selectors.join(","));
  elements.forEach((el) => {
    el.style.setProperty("display", "none", "important");
    el.style.setProperty("visibility", "hidden", "important");
    el.style.setProperty("opacity", "0", "important");
  });
}

// Observer to handle lazy-loaded content
const observer = new MutationObserver((mutations) => {
  if (isMediaHidden) {
    aggressiveHide();
  }
});

// Start observing
observer.observe(document.documentElement, {
  childList: true,
  subtree: true,
  attributes: true,
  attributeFilter: ["style", "class", "src"],
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Universal Submitter: Received message", request);

  if (request.action === "ping") {
    sendResponse({ status: "alive" });
  } else if (request.action === "toggleMedia") {
    isMediaHidden = request.hide;
    toggleStyle(MEDIA_HIDE_STYLE_ID, HIDE_MEDIA_CSS, request.hide);
    if (request.hide) aggressiveHide();
    sendResponse({ success: true, mediaHidden: request.hide });
  } else if (request.action === "toggleBW") {
    toggleStyle(BW_MODE_STYLE_ID, BW_MODE_CSS, request.enable);
    sendResponse({ success: true, bwMode: request.enable });
  }
  return true;
});

// Apply saved preferences on page load
chrome.storage.local.get(["hideMedia", "bwMode"], (result) => {
  console.log("Universal Submitter: Loading preferences", result);

  if (result.hideMedia) {
    isMediaHidden = true;
    toggleStyle(MEDIA_HIDE_STYLE_ID, HIDE_MEDIA_CSS, true);
    aggressiveHide();
  }
  if (result.bwMode) {
    toggleStyle(BW_MODE_STYLE_ID, BW_MODE_CSS, true);
  }
});
