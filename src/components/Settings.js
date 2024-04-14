import React, { useState, useEffect } from 'react';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';
import BlockedSitesList from './BlockedSitesList';
import TextField from '@mui/material/TextField';

const Settings = ({ setViewSettings }) => {
  const [allowedChannels, setAllowedChannels] = useState([]);
  const [newChannel, setNewChannel] = useState('');

  useEffect(() => {
    chrome.storage.sync.get('allowedChannels', ({ allowedChannels }) => {
      if (allowedChannels) {
        setAllowedChannels(allowedChannels);
      }
    });
  }, []);

  const handleAddChannel = () => {
    if (!newChannel) return;
    const newChannels = [...allowedChannels, newChannel];
    chrome.storage.sync.set({ allowedChannels: newChannels }, () => {
      setAllowedChannels(newChannels);
      setNewChannel('');
    });
  };

  const handleRemoveChannel = (channelToRemove) => {
    const newChannels = allowedChannels.filter(
      (channel) => channel !== channelToRemove
    );
    chrome.storage.sync.set({ allowedChannels: newChannels }, () => {
      setAllowedChannels(newChannels);
    });
  };

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        fontWeight={'bold'}
        fontFamily={'monospace'}
      >
        Settings
      </Typography>
      <TextField
        label="Add a youtube channel to whitelist"
        variant="outlined"
        fullWidth
        value={newChannel}
        onChange={(e) => setNewChannel(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleAddChannel()}
        sx={{ mb: 2 }}
      />
      <BlockedSitesList
        blockedSites={allowedChannels}
        onDelete={handleRemoveChannel}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={() => setViewSettings(false)}
      >
        Back
      </Button>
    </Box>
  );
};

Settings.propTypes = {
  setViewSettings: PropTypes.func.isRequired
};

export default Settings;
