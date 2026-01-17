
// Chrome Extension Background Service Worker
chrome.runtime.onInstalled.addListener(() => {
  console.log('ApplyWise AI Assistant installed.');
});

// Open SidePanel when clicking the extension icon (requires 'sidePanel' permission in manifest)
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

// Listen for messages from content scripts or the side panel
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'FIELDS_DETECTED') {
    // Forward fields to the dashboard if it's open
    chrome.runtime.sendMessage({
      type: 'UPDATE_FIELDS',
      fields: request.fields
    });
  }
  return true;
});
