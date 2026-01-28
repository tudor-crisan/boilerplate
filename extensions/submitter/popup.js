document.addEventListener("DOMContentLoaded", () => {
  const appSelect = document.getElementById("app-select");
  const pName = document.getElementById("p-name");
  const pUrl = document.getElementById("p-url");
  const pDesc = document.getElementById("p-desc");
  const pKeywords = document.getElementById("p-keywords");
  const saveBtn = document.getElementById("save-data");
  const autofillBtn = document.getElementById("autofill-btn");
  const markBtn = document.getElementById("mark-submitted-btn");
  const historyList = document.getElementById("history-list");
  const statusMsg = document.getElementById("status-msg");
  const directorySelect = document.getElementById("directory-select");
  const goToDirectoryBtn = document.getElementById("go-to-directory-btn");
  const hideMediaToggle = document.getElementById("hide-media-toggle");
  const bwModeToggle = document.getElementById("bw-mode-toggle");

  // API base URL - update this to your actual API endpoint
  const API_BASE = "http://localhost:3000/api/extensions/submitter";

  // Load initial data
  loadApps();
  loadHistory();
  loadDirectories();
  loadPagePreferences();

  // --- Event Listeners ---

  appSelect.addEventListener("change", () => {
    if (appSelect.value === "new") {
      const newApp = prompt("Enter new app name:");
      if (newApp) {
        addAppOption(newApp, true);
        saveAppData(newApp); // Save empty profile
      } else {
        appSelect.value = "loyalboards"; // Revert
      }
    } else {
      loadAppData(appSelect.value);
      loadDirectories(); // Reload directories for the new app
    }
  });

  saveBtn.addEventListener("click", () => {
    const app = appSelect.value;
    const data = {
      name: pName.value,
      url: pUrl.value,
      description: pDesc.value,
      keywords: pKeywords.value,
    };
    chrome.storage.local.set({ [`profile_${app}`]: data }, () => {
      showStatus("Profile Saved!");
    });
  });

  autofillBtn.addEventListener("click", async () => {
    const data = {
      name: pName.value,
      url: pUrl.value,
      description: pDesc.value,
      keywords: pKeywords.value,
    };

    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (folderData) => {
        // Heuristic autofill
        const inputs = document.querySelectorAll("input, textarea");
        inputs.forEach((input) => {
          const name = (input.name || input.id || "").toLowerCase();
          const label = (
            input.labels && input.labels[0] ? input.labels[0].innerText : ""
          ).toLowerCase();
          const placeholder = (input.placeholder || "").toLowerCase();
          const context = name + " " + label + " " + placeholder;

          if (
            context.includes("url") ||
            context.includes("website") ||
            context.includes("link")
          ) {
            input.value = folderData.url;
          } else if (
            context.includes("name") ||
            context.includes("title") ||
            context.includes("project")
          ) {
            input.value = folderData.name;
          } else if (
            context.includes("description") ||
            context.includes("about")
          ) {
            input.value = folderData.description;
          } else if (context.includes("keyword") || context.includes("tag")) {
            input.value = folderData.keywords;
          }
        });
      },
      args: [data],
    });
    showStatus("Autofill Attempted");
  });

  markBtn.addEventListener("click", async () => {
    const app = appSelect.value;
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    const url = new URL(tab.url).hostname;
    const date = new Date().toLocaleDateString();
    const directoryUrl = directorySelect.value || tab.url;
    const directoryName =
      directorySelect.options[directorySelect.selectedIndex]?.text || url;

    const record = {
      app,
      url,
      date,
      fullUrl: tab.url,
      directoryUrl,
      directoryName,
    };

    // Save to API
    try {
      const response = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          app,
          directoryUrl,
          directoryName,
          pageUrl: tab.url,
        }),
      });

      if (response.ok) {
        showStatus("Submission Recorded!");
        loadHistory();
        loadDirectories(); // Refresh to update submitted status
      } else {
        throw new Error("API request failed");
      }
    } catch (error) {
      console.error("Failed to save via API, using local storage:", error);
      // Fallback to local storage
      chrome.storage.local.get(["submissions"], (result) => {
        const subs = result.submissions || [];
        subs.unshift(record);
        chrome.storage.local.set({ submissions: subs }, () => {
          showStatus("Submission Recorded (Offline)!");
          renderHistory(subs);
        });
      });
    }
  });

  goToDirectoryBtn.addEventListener("click", async () => {
    const selectedUrl = directorySelect.value;
    if (!selectedUrl) {
      showStatus("Please select a directory first");
      return;
    }

    // Open the directory URL in a new tab
    chrome.tabs.create({ url: selectedUrl });
    showStatus("Opening directory...");
  });

  hideMediaToggle.addEventListener("change", async () => {
    const hideMedia = hideMediaToggle.checked;

    // Save preference
    chrome.storage.local.set({ hideMedia });

    // Apply to current tab
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    chrome.tabs.sendMessage(tab.id, { action: "toggleMedia", hide: hideMedia });

    showStatus(hideMedia ? "Media Hidden" : "Media Visible");
  });

  bwModeToggle.addEventListener("change", async () => {
    const bwMode = bwModeToggle.checked;

    // Save preference
    chrome.storage.local.set({ bwMode });

    // Apply to current tab
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    chrome.tabs.sendMessage(tab.id, { action: "toggleBW", enable: bwMode });

    showStatus(bwMode ? "B&W Mode On" : "B&W Mode Off");
  });

  // --- Helper Functions ---

  function loadApps() {
    // Fetch generated data first
    fetch(chrome.runtime.getURL("data.json"))
      .then((response) => response.json())
      .then((fileData) => {
        chrome.storage.local.get(null, (items) => {
          const storedApps = Object.keys(items)
            .filter((k) => k.startsWith("profile_"))
            .map((k) => k.replace("profile_", ""));

          // Clear existing options except 'new' (last child)
          // We need to keep the "Add New" option, which is usually at the end.
          // But easier to just clear and rebuild.
          appSelect.innerHTML =
            '<option value="new">+ Add New Profile...</option>';

          // 1. Add apps from file (Default/synced apps)
          Object.keys(fileData).forEach((appName) => {
            // Check if we have an override in storage, otherwise use file data
            if (!items[`profile_${appName}`]) {
              // Pre-populate storage if missing, so it's editable later
              chrome.storage.local.set({
                [`profile_${appName}`]: fileData[appName],
              });
            }
            addAppOption(appName, false);
          });

          // 2. Add other apps from storage that might not be in file
          storedApps.forEach((app) => {
            if (!fileData[app]) {
              addAppOption(app, false);
            }
          });

          // Select default or first available
          if (fileData["loyalboards"]) {
            appSelect.value = "loyalboards";
          } else if (Object.keys(fileData).length > 0) {
            appSelect.value = Object.keys(fileData)[0];
          }

          // Load data for currently selected
          loadAppData(appSelect.value);
        });
      })
      .catch((err) => {
        console.error("Failed to load data.json", err);
        // Fallback to storage only
        chrome.storage.local.get(null, (items) => {
          const apps = Object.keys(items)
            .filter((k) => k.startsWith("profile_"))
            .map((k) => k.replace("profile_", ""));
          apps.forEach((app) => addAppOption(app, false));
          loadAppData(appSelect.value);
        });
      });
  }

  function addAppOption(appName, selectIt) {
    const opt = document.createElement("option");
    opt.value = appName;
    opt.textContent = appName;
    // Insert before the last element (which is usually '+ Add New...')
    // But since we cleared innerHTML and added 'new' first/last depending on logic...
    // Let's just fix the order: Apps first, then "Add New" at bottom.

    // Actually, my cleared innerHTML had 'new' as the only child.
    // So insertBefore(opt, appSelect.lastElementChild) puts it above 'new'.
    appSelect.insertBefore(opt, appSelect.lastElementChild);

    if (selectIt) appSelect.value = appName;
  }

  function loadAppData(appName) {
    chrome.storage.local.get([`profile_${appName}`], (result) => {
      const data = result[`profile_${appName}`] || {};
      pName.value = data.name || "";
      pUrl.value = data.url || "";
      pDesc.value = data.description || "";
      pKeywords.value = data.keywords || "";
    });
  }

  function loadHistory() {
    chrome.storage.local.get(["submissions"], (result) => {
      renderHistory(result.submissions || []);
    });
  }

  function renderHistory(subs) {
    historyList.innerHTML = "";
    subs.forEach((sub) => {
      const li = document.createElement("li");
      li.innerHTML = `<b>${sub.app}</b> at ${sub.url} <br><span style="color:#666; font-size:0.8em">${sub.date}</span>`;
      historyList.appendChild(li);
    });
  }

  function showStatus(msg) {
    statusMsg.textContent = msg;
    statusMsg.style.display = "block";
    setTimeout(() => {
      statusMsg.style.display = "none";
    }, 2000);
  }

  async function loadDirectories() {
    try {
      const app = appSelect.value || "loyalboards";
      const response = await fetch(`${API_BASE}/directories?app=${app}`);
      if (!response.ok) throw new Error("Failed to fetch directories");

      const data = await response.json();
      const directories = data.directories || [];

      directorySelect.innerHTML =
        '<option value="">-- Select a Directory --</option>';

      directories.forEach((dir) => {
        const option = document.createElement("option");
        option.value = dir.url;
        option.textContent = `${dir.name}${dir.submitted ? " ✓" : ""}`;
        if (dir.submitted) {
          option.style.color = "green";
          option.style.fontWeight = "bold";
        }
        directorySelect.appendChild(option);
      });
    } catch (error) {
      console.error("Failed to load directories:", error);
      directorySelect.innerHTML =
        '<option value="">Failed to load directories</option>';
    }
  }

  function loadPagePreferences() {
    chrome.storage.local.get(["hideMedia", "bwMode"], (result) => {
      hideMediaToggle.checked = result.hideMedia || false;
      bwModeToggle.checked = result.bwMode || false;
    });
  }
});
