let activeTab = null;
let startTime = null;

// Define categories
const productiveSites = [
  "leetcode.com",
  "github.com",
  "stackoverflow.com",
  "w3schools.com",
  "geeksforgeeks.org"
];

const unproductiveSites = [
  "instagram.com",
  "facebook.com",
  "youtube.com",
  "twitter.com",
  "netflix.com"
];

// When tab changes
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const tab = await chrome.tabs.get(activeInfo.tabId);
  handleTabChange(tab);
});

// When page reloads
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    handleTabChange(tab);
  }
});

function handleTabChange(tab) {
  if (!tab.url || !tab.url.startsWith("http")) return;

  let hostname = new URL(tab.url).hostname;
  hostname = hostname.replace("www.", "");

  // Save previous tab time
  if (activeTab && startTime) {
    const timeSpent = Date.now() - startTime;

    chrome.storage.local.get([activeTab], (result) => {
      const previousData = result[activeTab] || {
        time: 0,
        category: classifySite(activeTab)
      };

      chrome.storage.local.set({
        [activeTab]: {
          time: previousData.time + timeSpent,
          category: previousData.category
        }
      });
    });
  }

  activeTab = hostname;
  startTime = Date.now();
}

// Classify logic (important fix)
function classifySite(hostname) {
  hostname = hostname.replace("www.", "");

  if (productiveSites.some(site => hostname.includes(site))) {
    return "productive";
  }

  if (unproductiveSites.some(site => hostname.includes(site))) {
    return "unproductive";
  }

  return "neutral";
}
