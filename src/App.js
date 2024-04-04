import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import Box from '@mui/material/Box';

function App() {
  const [blockedSites, setBlockedSites] = useState([]);
  const [newSite, setNewSite] = useState('');

  useEffect(() => {
    // Load the blocked sites from storage
    chrome.storage.sync.get('blockedSites', ({ blockedSites }) => {
      if (blockedSites) {
        setBlockedSites(blockedSites);
      }
    });
  }, []);

  const handleAddSite = () => {
    if (!newSite) return;
    const newSites = [...blockedSites, newSite];
    chrome.storage.sync.set({ blockedSites: newSites }, () => {
      setBlockedSites(newSites);
      setNewSite('');
    });
  };

  const handleRemoveSite = (siteToRemove) => {
    const newSites = blockedSites.filter((site) => site !== siteToRemove);
    chrome.storage.sync.set({ blockedSites: newSites }, () => {
      setBlockedSites(newSites);
    });
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom>
        Blocked Sites
      </Typography>
      <Box mb={2}>
        <TextField
          label="Add a site to block"
          variant="outlined"
          fullWidth
          value={newSite}
          onChange={(e) => setNewSite(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddSite()}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddSite}
          style={{ marginTop: 8 }}
        >
          Add
        </Button>
      </Box>
      <List>
        {blockedSites.map((site, index) => (
          <ListItem key={index}>
            <ListItemText primary={site} />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => handleRemoveSite(site)}
              >
                <Button />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Container>
  );
}

export default App;
