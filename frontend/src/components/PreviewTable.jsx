import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

function PreviewTable({ data, setParsedData }) {
  return (
    <TableContainer component={Paper} sx={{ my: 4 }}>
      <Table>
      <TableHead>
  <TableRow>
    <TableCell>Course</TableCell>
    <TableCell>Course Name</TableCell>
    <TableCell>Instructor</TableCell>
    <TableCell>Start Date</TableCell>
    <TableCell>Weeks</TableCell>
    <TableCell>Start Time</TableCell>
    <TableCell>End Time</TableCell>
    <TableCell>Remarks</TableCell>
  </TableRow>
</TableHead>

<TableBody>
  {data.map((row, index) => (
    <TableRow key={index}>
      <TableCell>{row.course}</TableCell>
      <TableCell>{row.course_name}</TableCell>
      <TableCell>{row.instructor}</TableCell>
      <TableCell>{row.start_date}</TableCell>
      <TableCell>{row.weeks}</TableCell>
      <TableCell>{row.start_time}</TableCell>
      <TableCell>{row.end_time}</TableCell>
      <TableCell>{row.remarks}</TableCell>
    </TableRow>
  ))}
</TableBody>


      </Table>
    </TableContainer>
  );
}

export default PreviewTable;
