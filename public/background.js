importScripts('utils.js');

function isURLBlocked(urlString, blockedSites) {
  try {
    const currentURL = new URL(urlString);
    const hostname = currentURL.hostname;
    const pathname = currentURL.pathname;

    return blockedSites.some((blockedSite) => {
      const site = blockedSite.trim();
      if (!site) return false;

      try {
        const blockedURL = new URL(site);
        return (
          hostname === blockedURL.hostname &&
          pathname.startsWith(blockedURL.pathname)
        );
      } catch (e) {
        return hostname === site || hostname.endsWith('.' + site);
      }
    });
  } catch (e) {
    return false;
  }
}

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
      chrome.storage.sync.get(['blockedSites', 'blockTimes'], function (data) {
        const blockedSites = data.blockedSites || [];
        const blockTimes = data.blockTimes || {};

        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes();

        const { startTime, endTime } = blockTimes;
        if (startTime && endTime) {
          if (isWithinTime(startTime, endTime)) {
            const url = tab.url;

            if (
              isURLBlocked(url, blockedSites) &&
              !url.includes('youtube.com') &&
              !url.endsWith('blocked.html')
            ) {
              chrome.tabs.update(tabId, {
                url: chrome.runtime.getURL('blocked.html')
              });
            }
          }
        } else {
          const url = tab.url;

          if (
            isURLBlocked(url, blockedSites) &&
            !url.includes('youtube.com') &&
            !url.endsWith('blocked.html')
          ) {
            chrome.tabs.update(tabId, {
              url: chrome.runtime.getURL('blocked.html')
            });
          }
        }
      });
    }
  });
}
