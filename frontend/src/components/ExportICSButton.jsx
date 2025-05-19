// src/components/ExportICSButton.jsx
import React from "react";
import { Button } from "@mui/material";
import generateICSFromData from '../utils/generateICS';

function ExportICSButton({ data, alarmsEnabled, alarmTimes }) {
  const handleExport = () => {
    const ics = generateICSFromData(data, alarmsEnabled, alarmTimes);
    if (!ics || !ics.includes("BEGIN:VEVENT")) {
      alert("❌ No valid events to export.");
      return;
    }

    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "timetable.ics";
    link.click();
  };

  return (
    <Button variant="contained" color="primary" onClick={handleExport}>
      📤 Download .ics
    </Button>
  );
}

export default ExportICSButton;
