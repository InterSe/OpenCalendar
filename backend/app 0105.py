import React, { useState } from 'react';
import { Box, Container, Typography } from '@mui/material';
import UploadComponent from './components/UploadComponent';
import EditableTable from './components/EditableTable';
import FullCalendar from './components/FullCalendar';

function App() {
  const [parsedData, setParsedData] = useState([]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        overflowX: 'hidden',
        backgroundColor: '#f9f9f9',
      }}
    >
      <Container maxWidth="lg" sx={{ flexGrow: 1, py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Timetable ➔ Google Calendar
        </Typography>

        {/* Upload Section */}
        <UploadComponent setParsedData={setParsedData} />

        {/* Editable Table */}
        {parsedData.length > 0 && (
          <EditableTable data={parsedData} setData={setParsedData} />
        )}

        {/* Calendar Preview */}
        {parsedData.length > 0 ? (
          <Box sx={{ mt: 4 }}>
            <FullCalendar events={parsedData} />
          </Box>
        ) : (
          <Typography variant="body2" sx={{ mt: 4 }}>
            📅 Your calendar preview will appear here after you upload a timetable.
          </Typography>
        )}
      </Container>
    </Box>
  );
}

export default App;
