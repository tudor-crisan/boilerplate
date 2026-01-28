// Content script for Universal Submitter
console.log("Universal Submitter: Content script active.");

// Style IDs for injected CSS
const MEDIA_HIDE_STYLE_ID = "universal-submitter-hide-media";
const BW_MODE_STYLE_ID = "universal-submitter-bw-mode";

// CSS for hiding media - PRECISE OPTION
const HIDE_MEDIA_CSS = `
  /* Hide standard media elements */
  img, video, audio, source, track,
  iframe, embed, object, param,
  picture, canvas, map, area,
  svg, figure, figcaption,
  [role="img"], [aria-label*="image"],
  
  /* Select specific generic classes but exclude buttons */
  .image:not(button):not(.btn):not(a):not(input), 
  .img:not(button):not(.btn):not(a):not(input), 
  .photo:not(button):not(.btn):not(a):not(input), 
  .pic:not(button):not(.btn):not(a):not(input), 
  .thumbnail:not(button):not(.btn):not(a):not(input),
  
  /* Hide elements with background images, only if they contain a URL (image) */
  [style*="background-image: url"],
  [style*="background: url"],
  [style*="background-image:url"],
  [style*="background:url"] {
    display: none !important;
    visibility: hidden !important;
    opacity: 0 !important;
  }
`;

// Define BACKGROUND_NUKE_CSS as empty since global nuke kills buttons

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
      styleEl.textContent = css; // Eliminated BACKGROUND_NUKE_CSS
      document.documentElement.appendChild(styleEl);
      console.log(`Universal Submitter: Injected style ${styleId}`);
    }
  } else {
    if (styleEl) {
      styleEl.remove();
      console.log(`Universal Submitter: Removed style ${styleId}`);
    }
  }
}

// Smart JS-based hiding using Computed Styles
function aggressiveHide() {
  if (!isMediaHidden) return;

  // 1. Tag-based hiding
  const selectors = ["img", "video", "iframe", "svg", "canvas"];
  document.querySelectorAll(selectors.join(",")).forEach((el) => {
    // Preserve icons inside buttons if needed, but for now hide specific media tags
    if (
      el.tagName === "SVG" &&
      el.matches("button *, a *, [role='button'] *")
    ) {
      // Optional: keep SVGs in buttons? Let's hide them if user wants NO media.
      // But preventing layout break is good.
      // Let's hide them for consistency with "Hide Media".
    }
    el.style.setProperty("display", "none", "important");
    el.style.setProperty("visibility", "hidden", "important");
    el.style.setProperty("opacity", "0", "important");
  });

  // 2. Computed Style Check for Background Images (The expensive but safer part)
  // We process this in chunks or just main elements if performance is an issue.
  // For now, let's scan div, span, section, header, footer
  const contentElements = document.querySelectorAll(
    "div, span, section, header, footer, a, li",
  );

  contentElements.forEach((el) => {
    // Skip inputs and buttons explicitly
    if (el.tagName === "BUTTON" || el.tagName === "INPUT") return;
    if (el.matches(".btn, [role='button']")) return;

    // Check inline style first (fast)
    if (
      el.style.backgroundImage.includes("url(") ||
      el.style.background.includes("url(")
    ) {
      el.style.setProperty("background-image", "none", "important");
      el.style.setProperty("background", "none", "important");
      return;
    }

    // Check computed style (slower, generally relying on CSS for most)
    // We rely on CSS standard rules for most things.
    // If we want to be 100% sure we catch non-inline styles:
    /*
    const style = window.getComputedStyle(el);
    if (style.backgroundImage.includes('url(')) {
        el.style.setProperty("background-image", "none", "important");
    }
    */
  });
}

// Observer to handle lazy-loaded content
const observer = new MutationObserver((_mutations) => {
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
