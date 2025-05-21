import React, { useState } from 'react';
import axios from 'axios';
import { Button, Box, Typography, Input, Stack, Divider } from '@mui/material';

function UploadComponent({ setParsedData }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  const API_URL =
    process.env.NODE_ENV === "production"
      ? "https://timetable-backend.onrender.com/upload" // Replace with your actual Render URL
      : "http://localhost:5000/upload";

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError("");
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(API_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      console.log("✅ Parsed data received from backend:", response.data);
      setParsedData(response.data);

    } catch (err) {
      console.error("❌ Upload failed:", err);
      setError("Failed to upload file. Please check the server and file format.");
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Step 1: Download Excel Template
      </Typography>
      <Typography variant="body2" sx={{ mb: 1 }}>
        Use this Excel file to fill in your timetable. Then upload it below.
      </Typography>
      <Button
        variant="outlined"
        href="https://docs.google.com/spreadsheets/d/11UdSyVBHyNUL8byJ0sYJe_iXx0JsHps4ZwcaCBYFKaQ/export?format=xlsx"
        target="_blank"
        rel="noopener noreferrer"
        sx={{ mb: 3 }}
      >
        Download Excel Template
      </Button>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" gutterBottom>
        Step 2: Upload Your Completed Timetable (.xlsx only)
      </Typography>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Input type="file" onChange={handleFileChange} />
        <Button variant="contained" onClick={handleUpload}>
          Upload
        </Button>
      </Stack>

      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
}

export default UploadComponent;
