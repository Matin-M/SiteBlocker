if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
  chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
      if (request.action === 'blockPage') {
        chrome.tabs.update(sender.tab.id, { url: 'blocked.html' });
      }
    }
  );

  chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete') {
      chrome.storage.sync.get('blockedSites', function (data) {
        const blockedSites = data.blockedSites || [];
        const url = new URL(tab.url);
        const isBlocked = blockedSites.some((site) => url.host.includes(site));

        if (isBlocked) {
          chrome.tabs.update(tabId, { url: 'blocked.html' });
        }
      });
    }
  });
}
