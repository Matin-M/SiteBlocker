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

function handleDOMContentLoaded() {
  const channelNameElement = document.querySelector('a.yt-simple-endpoint');
  const channelName = channelNameElement
    ? channelNameElement.textContent.trim()
    : null;

  chrome.storage.sync.get(['allowedChannels'], function (result) {
    const allowedChannels = result.allowedChannels || [];
    if (!allowedChannels.includes(channelName)) {
      getBrowser().runtime.sendMessage({ action: 'blockPage' });
    } else {
      console.log(`Access granted to: ${channelName}`);
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', handleDOMContentLoaded);
} else {
  handleDOMContentLoaded();
}
