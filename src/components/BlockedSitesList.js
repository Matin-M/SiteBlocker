import React from 'react';
import {
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Box
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PropTypes from 'prop-types';

const BlockedSitesList = ({ blockedSites, onDelete, titleText }) => {
  return (
    <Paper
      sx={{
        maxHeight: 300,
        overflow: 'auto',
        mb: 2,
        p: 2,
        width: '100%',
        bgcolor: 'LightGray'
      }}
    >
      <Typography
        variant="h7"
        sx={{ mb: 2, fontWeight: 'bold', textDecoration: 'underline' }}
      >
        {titleText ? titleText : 'Blocked Sites'}
      </Typography>
      <List>
        {blockedSites.map((site, index) => (
          <ListItem
            key={index}
            divider
            sx={{ py: 1, '&:hover': { bgcolor: 'action.hover' } }}
          >
            <ListItemText
              primary={site}
              primaryTypographyProps={{ noWrap: true }}
            />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => onDelete(site)}
                sx={{ color: 'error.main' }}
              >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
        {blockedSites.length === 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Typography variant="body1" color="textSecondary">
              Nothing yet
            </Typography>
          </Box>
        )}
      </List>
    </Paper>
  );
};

BlockedSitesList.propTypes = {
  blockedSites: PropTypes.arrayOf(PropTypes.string).isRequired,
  onDelete: PropTypes.func.isRequired,
  titleText: PropTypes.string
};

export default BlockedSitesList;
