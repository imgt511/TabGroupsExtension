// Prevent multiple overlays
if (window.tabGroupsOverlayActive) {
  window.tabGroupsOverlay.remove();
}

window.tabGroupsOverlayActive = true;

// Create overlay
const overlay = document.createElement('div');
overlay.id = 'tab-groups-overlay';
overlay.innerHTML = `
  <div class="tab-groups-backdrop">
    <div class="tab-groups-container">
      <div class="tab-groups-header">
        <div class="tab-groups-title">
          <div class="grid-icon"></div>
          Tab Groups
        </div>
        <button class="close-btn" onclick="closeTabGroupsOverlay()">×</button>
      </div>
      <div class="tab-groups-content">
        <div class="loading">Loading...</div>
      </div>
      <div class="tab-groups-footer">
        <button class="create-group-btn" onclick="createNewGroup()">+ New Group</button>
      </div>
    </div>
  </div>
`;

// Add styles
const style = document.createElement('style');
style.textContent = `
  #tab-groups-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 999999;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }

  .tab-groups-backdrop {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(2px);
  }

  .tab-groups-container {
    background: white;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.3);
    width: 90%;
    max-width: 800px;
    max-height: 80vh;
    overflow: hidden;
    animation: scaleIn 0.2s ease-out;
  }

  @keyframes scaleIn {
    from { transform: scale(0.9); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }

  .tab-groups-header {
    padding: 20px;
    border-bottom: 1px solid #e0e0e0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #f8f9fa;
  }

  .tab-groups-title {
    font-size: 20px;
    font-weight: 600;
    color: #333;
    display: flex;
    align-items: center;
  }

  .grid-icon {
    width: 20px;
    height: 20px;
    margin-right: 10px;
    background: #4285f4;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .grid-icon::before {
    content: '';
    width: 10px;
    height: 10px;
    background-image: 
      radial-gradient(circle at 1.5px 1.5px, white 0.5px, transparent 0.5px),
      radial-gradient(circle at 5px 1.5px, white 0.5px, transparent 0.5px),
      radial-gradient(circle at 8.5px 1.5px, white 0.5px, transparent 0.5px),
      radial-gradient(circle at 1.5px 5px, white 0.5px, transparent 0.5px),
      radial-gradient(circle at 5px 5px, white 0.5px, transparent 0.5px),
      radial-gradient(circle at 8.5px 5px, white 0.5px, transparent 0.5px),
      radial-gradient(circle at 1.5px 8.5px, white 0.5px, transparent 0.5px),
      radial-gradient(circle at 5px 8.5px, white 0.5px, transparent 0.5px),
      radial-gradient(circle at 8.5px 8.5px, white 0.5px, transparent 0.5px);
  }

  .close-btn {
    background: none;
    border: none;
    font-size: 24px;
    color: #666;
    cursor: pointer;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .close-btn:hover {
    background: #f0f0f0;
  }

  .tab-groups-content {
    padding: 20px;
    max-height: 50vh;
    overflow-y: auto;
  }

  .tab-groups-footer {
    padding: 16px 20px;
    border-top: 1px solid #e0e0e0;
    background: #f8f9fa;
  }

  .create-group-btn {
    background: #4285f4;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
  }

  .create-group-btn:hover {
    background: #3367d6;
  }

  .groups-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 16px;
    margin-bottom: 20px;
  }

  .tab-group {
    background: #f9f9f9;
    border-radius: 8px;
    padding: 16px;
    border-left: 4px solid;
  }

  .tab-group.blue { border-left-color: #4285f4; }
  .tab-group.red { border-left-color: #ea4335; }
  .tab-group.yellow { border-left-color: #fbbc04; }
  .tab-group.green { border-left-color: #34a853; }
  .tab-group.pink { border-left-color: #ff6d01; }
  .tab-group.purple { border-left-color: #9c27b0; }
  .tab-group.cyan { border-left-color: #00bcd4; }
  .tab-group.orange { border-left-color: #ff9800; }
  .tab-group.grey { border-left-color: #9e9e9e; }

  .group-header {
    font-weight: 600;
    margin-bottom: 12px;
    font-size: 16px;
    color: #333;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .tab-count {
    background: #e0e0e0;
    color: #666;
    font-size: 12px;
    padding: 2px 6px;
    border-radius: 10px;
    font-weight: 500;
  }

  .tab-item {
    display: flex;
    align-items: center;
    padding: 8px;
    margin-bottom: 4px;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.15s;
  }

  .tab-item:hover {
    background: white;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }

  .tab-item.active {
    background: #e3f2fd;
    border-left: 3px solid #2196f3;
  }

  .tab-favicon {
    width: 16px;
    height: 16px;
    margin-right: 10px;
    border-radius: 2px;
  }

  .tab-title {
    flex-grow: 1;
    font-size: 14px;
    color: #333;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .loading {
    text-align: center;
    padding: 40px;
    color: #666;
  }

  .empty-state {
    text-align: center;
    padding: 40px;
    color: #666;
  }

  .ungrouped-section {
    margin-top: 24px;
    padding-top: 20px;
    border-top: 1px solid #e0e0e0;
  }

  .section-header {
    font-size: 16px;
    font-weight: 600;
    color: #666;
    margin-bottom: 12px;
  }
`;

document.head.appendChild(style);
document.body.appendChild(overlay);
window.tabGroupsOverlay = overlay;

// Close on backdrop click
overlay.querySelector('.tab-groups-backdrop').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) {
    closeTabGroupsOverlay();
  }
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && window.tabGroupsOverlayActive) {
    closeTabGroupsOverlay();
  }
});

// Global functions
window.closeTabGroupsOverlay = function () {
  if (window.tabGroupsOverlay) {
    window.tabGroupsOverlay.remove();
    window.tabGroupsOverlayActive = false;
  }
};

window.createNewGroup = function () {
  const title = prompt('Enter a name for the new tab group:');
  if (title !== null) {
    chrome.runtime.sendMessage({
      action: "createTabGroup",
      title: title.trim() || "New Group",
      color: 'blue'
    });
    setTimeout(loadTabGroups, 500);
  }
};

function switchToTab(tabId, windowId) {
  chrome.runtime.sendMessage({
    action: "switchToTab",
    tabId: tabId,
    windowId: windowId
  });
  closeTabGroupsOverlay();
}

// Load tab groups data
function loadTabGroups() {
  chrome.runtime.sendMessage({ action: "getTabGroups" }, (data) => {
    if (data) {
      displayTabGroups(data);
    }
  });
}

function displayTabGroups(data) {
  const { groups, ungroupedTabs } = data;
  const content = document.querySelector('.tab-groups-content');

  let html = '';

  if (groups.length === 0) {
    html = '<div class="empty-state">No tab groups found.<br>Create your first group!</div>';
  } else {
    html += '<div class="groups-grid">';
    groups.forEach(group => {
      html += `
        <div class="tab-group ${group.color}">
          <div class="group-header">
            <span>${group.title || 'Untitled Group'}</span>
            <span class="tab-count">${group.tabs.length} tab${group.tabs.length !== 1 ? 's' : ''}</span>
          </div>
          ${group.tabs.map(tab => `
            <div class="tab-item ${tab.active ? 'active' : ''}" onclick="switchToTab(${tab.id}, ${tab.windowId})">
              <img class="tab-favicon" src="${tab.favIconUrl || 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="%23666" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>'}" onerror="this.src='data:image/svg+xml,<svg xmlns=\\"http://www.w3.org/2000/svg\\" viewBox=\\"0 0 24 24\\"><path fill=\\"%23666\\" d=\\"M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z\\"/></svg>'">
              <div class="tab-title" title="${tab.title}">${tab.title || 'Untitled Tab'}</div>
            </div>
          `).join('')}
        </div>
      `;
    });
    html += '</div>';
  }

  if (ungroupedTabs.length > 0) {
    html += `
      <div class="ungrouped-section">
        <div class="section-header">Ungrouped Tabs</div>
        ${ungroupedTabs.map(tab => `
          <div class="tab-item ${tab.active ? 'active' : ''}" onclick="switchToTab(${tab.id}, ${tab.windowId})">
            <img class="tab-favicon" src="${tab.favIconUrl || 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="%23666" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>'}" onerror="this.src='data:image/svg+xml,<svg xmlns=\\"http://www.w3.org/2000/svg\\" viewBox=\\"0 0 24 24\\"><path fill=\\"%23666\\" d=\\"M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z\\"/></svg>'">
            <div class="tab-title" title="${tab.title}">${tab.title || 'Untitled Tab'}</div>
          </div>
        `).join('')}
      </div>
    `;
  }

  content.innerHTML = html;
}

// Load the data
loadTabGroups();