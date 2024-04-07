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
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

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

const BlockedSitesList = ({ blockedSites, openRemoveSiteDialog }) => (
  <Paper
    sx={{
      maxHeight: 300,
      width: '100%',
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
              onClick={() => openRemoveSiteDialog(site)}
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
  openRemoveSiteDialog: PropTypes.func.isRequired
};

const ConfirmationDialog = ({ open, onClose, onConfirm }) => (
  <Dialog
    open={open}
    onClose={onClose}
    aria-labelledby="confirmation-dialog-title"
    aria-describedby="confirmation-dialog-description"
    justifyContent="center"
  >
    <DialogTitle id="confirmation-dialog-title">
      {'Confirm Removal'}
    </DialogTitle>
    <DialogContent>
      <DialogContentText
        id="confirmation-dialog-description"
        sx={{
          wordBreak: 'break-word',
          overflowWrap: 'break-word'
        }}
      >
        Remove site?
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Cancel</Button>
      <Button onClick={onConfirm} autoFocus>
        Yes, Remove
      </Button>
    </DialogActions>
  </Dialog>
);

ConfirmationDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired
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
          minWidth: '360px',
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
          />
          <Typography variant="h4" component="h1" gutterBottom>
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
