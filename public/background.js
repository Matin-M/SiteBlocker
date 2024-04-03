chrome.tabs.onUpdated.addListener(function (tabId, tab) {
  chrome.storage.sync.get('blockedSites', function (data) {
    const blockedSites = data.blockedSites || [];
    const url = new URL(tab.url);
    const isBlocked = blockedSites.some((site) => url.host.includes(site));

    if (isBlocked) {
      chrome.tabs.update(tabId, { url: 'blocked.html' });
    }
  });
});
