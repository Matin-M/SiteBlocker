import React, { useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import BlockedSitesList from './components/BlockedSitesList';
import ConfirmationDialog from './components/ConfirmationDialog';
import Settings from './components/Settings';

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
    },
    background: {
      default: '#d47770'
    }
  },
  typography: {
    h1: {
      fontWeight: 'bold',
      fontSize: '2rem'
    },
    allVariants: {
      whiteSpace: 'nowrap'
    }
  }
});

function App() {
  const [blockedSites, setBlockedSites] = useState([]);
  const [newSite, setNewSite] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [siteToRemove, setSiteToRemove] = useState('');
  const [viewSettings, setViewSettings] = useState(false);

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

  const openRemoveSiteDialog = (site) => {
    setSiteToRemove(site);
    setDialogType('removeSite');
    setDialogOpen(true);
  };

  const openDeleteAllDialog = () => {
    setDialogType('deleteAll');
    setDialogOpen(true);
  };

  const handleConfirmAction = () => {
    if (dialogType === 'removeSite') {
      handleRemoveSiteConfirmed();
    } else if (dialogType === 'deleteAll') {
      handleDeleteAllConfirmed();
    }
  };

  const handleRemoveSiteConfirmed = () => {
    handleRemoveSite(siteToRemove);
    setDialogOpen(false);
  };

  const handleDeleteAllConfirmed = () => {
    chrome.storage.sync.set({ blockedSites: [] }, () => {
      setBlockedSites([]);
      setDialogOpen(false);
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container
        maxWidth="md"
        style={{
          minWidth: '300px',
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        {viewSettings ? (
          <Settings />
        ) : (
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <ConfirmationDialog
              open={dialogOpen}
              onClose={() => setDialogOpen(false)}
              onConfirm={handleConfirmAction}
              siteToRemove={siteToRemove}
            />
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              fontWeight={'bold'}
              fontFamily={'monospace'}
            >
              SiteBlocker
            </Typography>
            <Box
              mb={2}
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <TextField
                label="Add a site to block"
                variant="outlined"
                fullWidth
                value={newSite}
                onChange={(e) => setNewSite(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddSite()}
                sx={{ mb: 2 }}
              />
              <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddSite}
                >
                  Add Site
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setViewSettings(true)}
                >
                  Settings
                </Button>
              </Box>
            </Box>
            <BlockedSitesList
              blockedSites={blockedSites}
              openRemoveSiteDialog={openRemoveSiteDialog}
            />
          </Box>
        )}
      </Container>
    </ThemeProvider>
  );
}

export default App;
