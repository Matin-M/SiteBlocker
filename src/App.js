import React, { useState, useEffect } from 'react';

function App() {
  const [blockedSites, setBlockedSites] = useState([]);

  useEffect(() => {
    chrome.storage.sync.get('blockedSites', ({ blockedSites }) => {
      if (blockedSites) {
        setBlockedSites(blockedSites);
      }
    });
  }, []);

  const addSite = (site) => {
    const newSites = [...blockedSites, site];
    chrome.storage.sync.set({ blockedSites: newSites }, () => {
      setBlockedSites(newSites);
    });
  };

  const removeSite = (siteToRemove) => {
    const newSites = blockedSites.filter((site) => site !== siteToRemove);
    chrome.storage.sync.set({ blockedSites: newSites }, () => {
      setBlockedSites(newSites);
    });
  };

  return (
    <div>
      <h1>Blocked Sites</h1>
      {blockedSites.map((site, index) => (
        <div key={index}>
          {site} <button onClick={() => removeSite(site)}>Remove</button>
        </div>
      ))}
    </div>
  );
}

export default App;
