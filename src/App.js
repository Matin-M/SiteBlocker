import React, { useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
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
import DeleteIcon from '@mui/icons-material/Delete';
import Paper from '@mui/material/Paper';
import PropTypes from 'prop-types';

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900
    }
  },
  palette: {
    primary: {
      main: '#556cd6'
    }
  },
  typography: {
    h4: {
      fontWeight: 'bold'
    }
  }
});

const BlockedSitesList = ({ blockedSites, onRemoveSite }) => (
  <Paper
    sx={{
      maxHeight: 300,
      overflow: 'auto',
      borderColor: 'divider',
      borderWidth: 1,
      borderStyle: 'solid',
      mb: 2
    }}
  >
    <List>
      {blockedSites.map((site, index) => (
        <ListItem key={index} divider>
          <ListItemText primary={site} />
          <ListItemSecondaryAction>
            <IconButton
              edge="end"
              aria-label="delete"
              onClick={() => onRemoveSite(site)}
            >
              <DeleteIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  </Paper>
);

BlockedSitesList.propTypes = {
  blockedSites: PropTypes.arrayOf(PropTypes.string).isRequired,
  onRemoveSite: PropTypes.func.isRequired
};

function App() {
  const [blockedSites, setBlockedSites] = useState([]);
  const [newSite, setNewSite] = useState('');

  useEffect(() => {
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
    <ThemeProvider theme={theme}>
      <CssBaseline />
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
            sx={{ mb: 2 }}
          />
          <Button variant="contained" color="primary" onClick={handleAddSite}>
            Add
          </Button>
        </Box>
        <BlockedSitesList
          blockedSites={blockedSites}
          onRemoveSite={handleRemoveSite}
        />
      </Container>
    </ThemeProvider>
  );
}

export default App;
