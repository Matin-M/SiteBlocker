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
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();

  getBrowser().storage.sync.get(['blockTimes'], function (result) {
    const { startTime, endTime } = result.blockTimes || {};
    if (startTime && endTime) {
      const [startHours, startMinutes] = startTime.split(':').map(Number);
      const [endHours, endMinutes] = endTime.split(':').map(Number);
      const startTimeInMinutes = startHours * 60 + startMinutes;
      const endTimeInMinutes = endHours * 60 + endMinutes;

      if (
        currentTime <= startTimeInMinutes ||
        currentTime >= endTimeInMinutes
      ) {
        return;
      }
    }

    getBrowser().storage.sync.get(['blockedSites'], function (result) {
      const blockedSites = result.blockedSites || [];
      if (blockedSites.includes('youtube.com')) {
        const observer = new MutationObserver((mutations, obs) => {
          const channelNameElement = document.querySelector(
            'a.yt-simple-endpoint.style-scope.yt-formatted-string'
          );
          if (channelNameElement) {
            const channelName = channelNameElement.textContent.trim();
            getBrowser().storage.sync.get(
              ['allowedChannels'],
              function (result) {
                const allowedChannels = result.allowedChannels || [];
                if (!allowedChannels.includes(channelName)) {
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
    });
  });
}

window.onload = handlePageLoad;
