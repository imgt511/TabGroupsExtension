// Create context menu item when extension installs
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "tabGroupsManager",
    title: "Tab Groups Manager",
    contexts: ["page", "selection", "link", "image"]
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "tabGroupsManager") {
    // Inject the overlay directly into the current page
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.js"]
    });
  }
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getTabGroups") {
    getTabGroupsData().then(data => {
      sendResponse(data);
    });
    return true; // Keep message channel open for async response
  } else if (message.action === "switchToTab") {
    chrome.tabs.update(message.tabId, { active: true });
    chrome.windows.update(message.windowId, { focused: true });
  } else if (message.action === "createTabGroup") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.group({ tabIds: [tabs[0].id] }, (groupId) => {
          chrome.tabGroups.update(groupId, {
            title: message.title || "New Group",
            color: message.color || "blue"
          });
        });
      }
    });
  }
});

async function getTabGroupsData() {
  const windows = await chrome.windows.getAll({ populate: true });
  const tabGroups = {};
  const ungroupedTabs = [];
  
  for (const window of windows) {
    for (const tab of window.tabs) {
      if (tab.groupId !== chrome.tabGroups.TAB_GROUP_ID_NONE) {
        if (!tabGroups[tab.groupId]) {
          try {
            const group = await chrome.tabGroups.get(tab.groupId);
            tabGroups[tab.groupId] = {
              id: tab.groupId,
              title: group.title || "Untitled Group",
              color: group.color,
              collapsed: group.collapsed,
              windowId: window.id,
              tabs: []
            };
          } catch (e) {
            // Group might not exist anymore
            continue;
          }
        }
        if (tabGroups[tab.groupId]) {
          tabGroups[tab.groupId].tabs.push({
            id: tab.id,
            title: tab.title,
            url: tab.url,
            favIconUrl: tab.favIconUrl,
            active: tab.active,
            windowId: window.id
          });
        }
      } else {
        ungroupedTabs.push({
          id: tab.id,
          title: tab.title,
          url: tab.url,
          favIconUrl: tab.favIconUrl,
          active: tab.active,
          windowId: window.id
        });
      }
    }
  }
  
  return {
    groups: Object.values(tabGroups),
    ungroupedTabs: ungroupedTabs
  };
}