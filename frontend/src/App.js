// src/App.js
import React, { useState } from 'react';
import { Container, Typography } from '@mui/material';
import UploadComponent from './components/UploadComponent';
import EditableTable from './components/EditableTable';
import CalendarView from './components/CalendarView';

function App() {
  const [parsedData, setParsedData] = useState([]);

  return (
    <Container sx={{ mt: 4 }}>
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
        <CalendarView events={parsedData} />
      ) : (
        <Typography variant="body2" sx={{ mt: 4 }}>
          📅 Your calendar preview will appear here after you upload a timetable.
        </Typography>
      )}
    </Container>
  );
}

export default App;
