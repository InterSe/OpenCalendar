// src/components/EditableTable.jsx
import React, { useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, Button, IconButton, Switch, Box, Typography, Tooltip
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import ExportICSButton from "./ExportICSButton";

const fieldOrder = [
  "course", "course_name", "instructor", "start_date",
  "start_time", "end_time", "weeks", "room", "remarks"
];

const headerLabels = {
  course: "Course ID",
  course_name: "Course Name",
  instructor: "Instructor",
  start_date: "Start Date",
  start_time: "Start Time",
  end_time: "End Time",
  weeks: "Weeks",
  room: "Room",
  remarks: "Remarks"
};

const helperTexts = {
  course: "e.g. MATH101",
  course_name: "e.g. Descriptive course name",
  instructor: "Instructor's name",
  start_date: "Format: YYYY-MM-DD",
  start_time: "e.g. 09:00 or 9.00",
  end_time: "e.g. 10:30 or 10.30",
  weeks: "e.g. 1-6, 8, 10-12",
  room: "e.g. venue or location",
  remarks: "e.g. any additional notes"
};

const initialRow = {
  course: "", course_name: "", instructor: "",
  start_date: "", start_time: "", end_time: "",
  weeks: "", room: "", remarks: ""
};

function EditableTable({ data, setData }) {
  const [editRows, setEditRows] = useState({});
  const [alarmsEnabled, setAlarmsEnabled] = useState(true);
  const [alarmTimes, setAlarmTimes] = useState(["10", ""]);

  const handleChange = (index, field, value) => {
    const updatedData = [...data];
    updatedData[index][field] = value;
    setData(updatedData);
    setEditRows((prev) => ({
      ...prev,
      [index]: { ...prev[index], [field]: value }
    }));
  };

  const handleSave = (index) => {
    const updatedData = [...data];
    if (editRows[index]) {
      updatedData[index] = { ...updatedData[index], ...editRows[index] };
    }
    setData(updatedData);
    setEditRows((prev) => {
      const updated = { ...prev };
      delete updated[index];
      return updated;
    });
  };

  const handleDelete = (index) => {
    const updatedData = [...data];
    updatedData.splice(index, 1);
    setData(updatedData);
  };

  const handleAddRow = () => {
    setData([...data, { ...initialRow }]);
  };

  return (
    <>
      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <Switch
          checked={alarmsEnabled}
          onChange={(e) => setAlarmsEnabled(e.target.checked)}
        />
        <Typography>Include 10-minute reminders</Typography>
        {alarmsEnabled && (
          <>
            <TextField
              label="Alarm 1 (min)"
              size="small"
              value={alarmTimes[0]}
              onChange={(e) => setAlarmTimes([e.target.value, alarmTimes[1]])}
              sx={{ width: 100 }}
            />
            <TextField
              label="Alarm 2 (optional)"
              size="small"
              value={alarmTimes[1]}
              onChange={(e) => setAlarmTimes([alarmTimes[0], e.target.value])}
              sx={{ width: 120 }}
            />
          </>
        )}
        <ExportICSButton data={data} alarmsEnabled={alarmsEnabled} alarmTimes={alarmTimes} />
      </Box>

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              {fieldOrder.map((key) => (
                <TableCell key={key}>{headerLabels[key]}</TableCell>
              ))}
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, idx) => (
              <TableRow key={idx}>
                {fieldOrder.map((key) => (
                  <TableCell key={key}>
                    <Tooltip title={helperTexts[key] || ""} arrow>
                      <TextField
                        value={row[key] || ""}
                        onChange={(e) => handleChange(idx, key, e.target.value)}
                        variant="standard"
                        fullWidth
                      />
                    </Tooltip>
                  </TableCell>
                ))}
                <TableCell>
                  <IconButton onClick={() => handleSave(idx)} color="primary">
                    <SaveIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(idx)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Button onClick={handleAddRow} variant="outlined" sx={{ mt: 2 }}>
        ➕ Add Row
      </Button>
    </>
  );
}

export default EditableTable;
