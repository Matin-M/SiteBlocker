function handleDOMContentLoaded() {
  console.log('Page content has loaded');
  const channelNameElement = document.querySelector('a.yt-simple-endpoint');
  const channelName = channelNameElement
    ? channelNameElement.textContent.trim()
    : null;

  chrome.storage.sync.get(['allowedChannels'], function (result) {
    const allowedChannels = result.allowedChannels || [];
    if (!allowedChannels.includes(channelName)) {
      // set currrent tab to blocked.html
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const currentTab = tabs[0];
        chrome.tabs.update(currentTab.id, { url: 'blocked.html' });
      });
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
