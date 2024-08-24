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
        const hostname = url.hostname;
        const isBlocked = blockedSites.some(
          (site) => hostname.includes(site) && !hostname.includes('youtube.com')
        );

        if (isBlocked) {
          chrome.tabs.update(tabId, { url: 'blocked.html' });
        }
      });
    }
  });
}
