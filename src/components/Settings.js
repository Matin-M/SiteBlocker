import React, { useState, useEffect } from 'react';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';
import BlockedSitesList from './BlockedSitesList';
import TextField from '@mui/material/TextField';
import { TimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

const Settings = ({ setViewSettings }) => {
  const [allowedChannels, setAllowedChannels] = useState([]);
  const [newChannel, setNewChannel] = useState('');
  const [startTime, setStartTime] = useState(
    dayjs().startOf('day').format('HH:mm')
  );
  const [endTime, setEndTime] = useState(dayjs().endOf('day').format('HH:mm'));

  useEffect(() => {
    chrome.storage.sync.get(
      ['allowedChannels', 'blockTimes'],
      ({ allowedChannels, blockTimes }) => {
        if (allowedChannels) {
          setAllowedChannels(allowedChannels);
        }
        if (blockTimes) {
          setStartTime(blockTimes.startTime);
          setEndTime(blockTimes.endTime);
        }
      }
    );
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

  const handleTimeChange = (newStartTime, newEndTime) => {
    chrome.storage.sync.set({
      blockTimes: {
        startTime: newStartTime.format('HH:mm'),
        endTime: newEndTime.format('HH:mm')
      }
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
      <Box
        sx={{
          width: '100%',
          border: '1px solid black',
          borderRadius: '4px',
          padding: '16px',
          marginBottom: '16px'
        }}
      >
        <Typography
          variant="subtitle1"
          component="h2"
          gutterBottom
          fontWeight={'bold'}
          fontFamily={'monospace'}
        >
          YT Channel Whitelisting
        </Typography>
        <TextField
          label="Enter a channel name"
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
          titleText="Whitelisted Channels"
        />
      </Box>
      <Box
        sx={{
          width: '100%',
          border: '1px solid black',
          borderRadius: '4px',
          padding: '16px',
          marginBottom: '16px'
        }}
      >
        <Typography
          variant="subtitle1"
          component="h2"
          gutterBottom
          fontWeight={'bold'}
          fontFamily={'monospace'}
        >
          Downtime
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}
        >
          <TimePicker
            label="Start Time"
            value={dayjs(startTime, 'HH:mm')}
            onChange={(newValue) => {
              setStartTime(newValue);
              handleTimeChange(newValue, endTime);
            }}
            onClose={handleTimeChange}
            onBlur={handleTimeChange}
            views={['hours']}
            format="HH:00"
          />
          <TimePicker
            label="End Time"
            value={dayjs(endTime, 'HH:mm')}
            onChange={(newValue) => {
              setEndTime(newValue);
              handleTimeChange(startTime, newValue);
            }}
            onClose={handleTimeChange}
            onBlur={handleTimeChange}
            views={['hours']}
            format="HH:00"
          />
        </Box>
      </Box>
      <Box sx={{ pb: 2 }}>
        {' '}
        <Button
          variant="contained"
          color="primary"
          onClick={() => setViewSettings(false)}
        >
          Back
        </Button>
      </Box>
    </Box>
  );
};

Settings.propTypes = {
  setViewSettings: PropTypes.func.isRequired
};

export default Settings;
