import { Typography } from '@mui/material';
import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

const Settings = () => {
  return (
    <Box>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        fontWeight={'bold'}
        fontFamily={'monospace'}
      >
        Settings
      </Typography>
      {/* Settings content here, e.g., a switch for YouTube site granularity */}
      <Button
        variant="contained"
        color="secondary"
        onClick={() => setViewSettings(false)}
      >
        Back to Main
      </Button>
    </Box>
  );
};

export default Settings;
