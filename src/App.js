import React, { useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import BlockedSitesList from './components/BlockedSitesList';

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

const ConfirmationDialog = ({ open, onClose, onConfirm, siteToRemove }) => {
  const [confirmText, setConfirmText] = useState('');

  const handleConfirmClick = () => {
    if (confirmText === siteToRemove) {
      onConfirm();
      setConfirmText('');
    } else {
      alert('The entered site does not match. Please try again.');
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm Removal</DialogTitle>
      <DialogContent>
        <DialogContentText>Type: {siteToRemove}</DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Site Name"
          type="text"
          fullWidth
          variant="standard"
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleConfirmClick} autoFocus>
          Yes, Remove
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ConfirmationDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  siteToRemove: PropTypes.string.isRequired
};

function App() {
  const [blockedSites, setBlockedSites] = useState([]);
  const [newSite, setNewSite] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [siteToRemove, setSiteToRemove] = useState('');

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
                color="warning"
                onClick={openDeleteAllDialog}
              >
                Delete All
              </Button>
            </Box>
          </Box>
          <BlockedSitesList
            blockedSites={blockedSites}
            openRemoveSiteDialog={openRemoveSiteDialog}
          />
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
