function getBrowser() {
  if (typeof chrome !== 'undefined' && typeof chrome.runtime !== 'undefined') {
    return chrome;
  } else if (
    typeof browser !== 'undefined' &&
    typeof browser.runtime !== 'undefined'
  ) {
    return browser;
  } else {
    console.log('browser is not supported');
    return false;
  }
}

function handlePageLoad() {
  getBrowser().storage.sync.get(
    ['blockedSites', 'blockTimes'],
    function (result) {
      const blockTimes = result.blockTimes || {};
      const blockedSites = result.blockedSites || [];
      if (blockedSites.includes('youtube.com')) {
        const { startTime, endTime } = blockTimes;
        if (!isWithinTime(startTime, endTime)) {
          return;
        }

        const observer = new MutationObserver((mutations, obs) => {
          const channelNameElement = document.querySelector(
            'a.yt-simple-endpoint.style-scope.yt-formatted-string'
          );
          if (channelNameElement) {
            const channelName = channelNameElement.textContent
              .trim()
              .toLowerCase();
            getBrowser().storage.sync.get(
              ['allowedChannels'],
              function (result) {
                const allowedChannels = result.allowedChannels || [];
                let isAllowed = false;
                allowedChannels.forEach((channel) => {
                  if (channel.includes(channelName.trim().toLowerCase())) {
                    isAllowed = true;
                    return;
                  }
                });
                if (!isAllowed) {
                  getBrowser().runtime.sendMessage({ action: 'blockPage' });
                }
              }
            );
            obs.disconnect();
          }
        });

        observer.observe(document, {
          childList: true,
          subtree: true
        });
      }
    }
  );
}

window.onload = handlePageLoad;
