// Load tab groups when popup opens
document.addEventListener('DOMContentLoaded', loadTabGroups);

async function loadTabGroups() {
  try {
    const data = await chrome.runtime.sendMessage({ action: "getTabGroups" });
    displayTabGroups(data);
  } catch (error) {
    console.error('Error loading tab groups:', error);
    document.getElementById('loading').textContent = 'Error loading tab groups';
  }
}

function displayTabGroups(data) {
  const { groups, ungroupedTabs } = data;

  document.getElementById('loading').style.display = 'none';
  document.getElementById('content').style.display = 'block';

  const groupsContainer = document.getElementById('groups-container');
  groupsContainer.innerHTML = '';

  if (groups.length === 0) {
    groupsContainer.innerHTML = `
      <div class="empty-state">
        <p>No tab groups found.</p>
        <p>Create your first group by clicking "New Group" above!</p>
      </div>
    `;
  } else {
    groups.forEach(group => {
      const groupElement = createGroupElement(group);
      groupsContainer.appendChild(groupElement);
    });
  }

  // Show ungrouped tabs if any exist
  if (ungroupedTabs.length > 0) {
    const ungroupedSection = document.getElementById('ungrouped-section');
    const ungroupedList = document.getElementById('ungrouped-tabs-list');

    ungroupedList.innerHTML = '';
    ungroupedTabs.forEach(tab => {
      const tabElement = createTabElement(tab);
      ungroupedList.appendChild(tabElement);
    });

    ungroupedSection.style.display = 'block';
  }
}

function createGroupElement(group) {
  const groupDiv = document.createElement('div');
  groupDiv.className = `tab-group ${group.color}`;

  const header = document.createElement('div');
  header.className = 'group-header';

  const title = document.createElement('div');
  title.className = 'group-title';
  title.textContent = group.title || 'Untitled Group';

  const count = document.createElement('span');
  count.className = 'tab-count';
  count.textContent = `${group.tabs.length} tab${group.tabs.length !== 1 ? 's' : ''}`;

  header.appendChild(title);
  header.appendChild(count);
  groupDiv.appendChild(header);

  // Add tabs
  group.tabs.forEach(tab => {
    const tabElement = createTabElement(tab);
    groupDiv.appendChild(tabElement);
  });

  return groupDiv;
}

function createTabElement(tab) {
  const tabDiv = document.createElement('div');
  tabDiv.className = `tab-item ${tab.active ? 'active' : ''}`;
  tabDiv.onclick = () => switchToTab(tab.id, tab.windowId);

  const favicon = document.createElement('img');
  favicon.className = 'tab-favicon';
  favicon.src = tab.favIconUrl || 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="%23666" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>';
  favicon.onerror = () => {
    favicon.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="%23666" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>';
  };

  const title = document.createElement('div');
  title.className = 'tab-title';
  title.textContent = tab.title || 'Untitled Tab';
  title.title = tab.title; // Tooltip for long titles

  tabDiv.appendChild(favicon);
  tabDiv.appendChild(title);

  return tabDiv;
}

function switchToTab(tabId, windowId) {
  chrome.runtime.sendMessage({
    action: "switchToTab",
    tabId: tabId,
    windowId: windowId
  });

  // Close the popup tab if we're in a tab (not popup)
  if (window.location.protocol === 'chrome-extension:') {
    window.close();
  }
}

function createNewGroup() {
  const title = prompt('Enter a name for the new tab group:');
  if (title !== null) {
    const colors = ['blue', 'red', 'yellow', 'green', 'pink', 'purple', 'cyan', 'orange'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    chrome.runtime.sendMessage({
      action: "createTabGroup",
      title: title.trim() || "New Group",
      color: randomColor
    });

    // Reload the display after a short delay
    setTimeout(loadTabGroups, 500);
  }
}