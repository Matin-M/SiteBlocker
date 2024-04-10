import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const ConfirmationDialog = ({ open, onClose, onConfirm, siteToRemove }) => {
  const [confirmText, setConfirmText] = useState('');

  const handleConfirmClick = () => {
    if (confirmText === siteToRemove) {
      onConfirm();
      setConfirmText('');
    } else {
      alert('The entered text does not match. Please try again.');
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm Removal</DialogTitle>
      <DialogContent>
        <DialogContentText>{`Type "${siteToRemove}"`}</DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label={
            siteToRemove.includes('Delete All')
              ? 'Enter Confirmation'
              : 'Site Name'
          }
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
  siteToRemove: PropTypes.string.isRequired,
  dialogType: PropTypes.string.isRequired
};

export default ConfirmationDialog;
