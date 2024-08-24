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
  const observer = new MutationObserver((mutations, obs) => {
    const channelNameElement = document.querySelector(
      'a.yt-simple-endpoint.style-scope.yt-formatted-string'
    );
    if (channelNameElement) {
      const channelName = channelNameElement.textContent.trim();
      getBrowser().storage.sync.get(['allowedChannels'], function (result) {
        const allowedChannels = result.allowedChannels || [];
        if (!allowedChannels.includes(channelName)) {
          getBrowser().runtime.sendMessage({ action: 'blockPage' });
          console.log(`Access denied to: ${channelName}`);
          console.log('allowedChannels', allowedChannels);
        } else {
          console.log(`Access granted to: ${channelName}`);
          console.log('allowedChannels', allowedChannels);
        }
      });
      obs.disconnect();
    }
  });

  observer.observe(document, {
    childList: true,
    subtree: true
  });
}

window.onload = handlePageLoad;
