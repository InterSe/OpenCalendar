import React from 'react';
import { Button } from '@mui/material';

function GoogleSyncButton({ events }) {
  const handleSync = () => {
    // Later: Call backend to sync to Google Calendar
    console.log('Syncing events:', events);
  };

  return (
    <Button variant="contained" color="primary" onClick={handleSync}>
      Sync with Google Calendar
    </Button>
  );
}

export default GoogleSyncButton;
