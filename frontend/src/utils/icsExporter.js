// utils/icsExporter.js
export function generateICS(events, alertMinutesArray = []) {
    const pad = (num) => String(num).padStart(2, '0');
  
    const formatDateTime = (dateObj) => {
      const y = dateObj.getFullYear();
      const m = pad(dateObj.getMonth() + 1);
      const d = pad(dateObj.getDate());
      const h = pad(dateObj.getHours());
      const min = pad(dateObj.getMinutes());
      return `${y}${m}${d}T${h}${min}00`;
    };
  
    const makeAlarm = (minutesBefore) => `
  BEGIN:VALARM
  TRIGGER:-PT${minutesBefore}M
  ACTION:DISPLAY
  DESCRIPTION:Reminder
  END:VALARM`;
  
    const lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'CALSCALE:GREGORIAN',
      'PRODID:-//Timetable App//EN',
    ];
  
    events.forEach((row, i) => {
      const [
        courseId = '', courseName = '', instructor = '',
        startDate = '', startTime = '', endTime = '',
        weeks = '', room = '', remarks = '',
      ] = row.map(cell => (cell || '').toString().trim());
  
      const [year, month, day] = startDate.split('-').map(Number);
      const [startHour, startMin] = startTime.split(':').map(Number);
      const [endHour, endMin] = endTime.split(':').map(Number);
  
      if (!year || !month || !day || !startHour || !endHour) return;
  
      // Expand weeks into dates
      const weekList = [];
      const parts = weeks.split(',');
      for (const part of parts) {
        if (part.includes('-')) {
          const [start, end] = part.split('-').map(Number);
          for (let w = start; w <= end; w++) weekList.push(w);
        } else {
          const w = Number(part.trim());
          if (!isNaN(w)) weekList.push(w);
        }
      }
  
      for (const week of weekList) {
        const baseDate = new Date(year, month - 1, day);
        const eventDate = new Date(baseDate);
        eventDate.setDate(baseDate.getDate() + (week - 1) * 7);
  
        const dtStart = new Date(eventDate);
        dtStart.setHours(startHour, startMin || 0);
  
        const dtEnd = new Date(eventDate);
        dtEnd.setHours(endHour, endMin || 0);
  
        const dtStartStr = formatDateTime(dtStart);
        const dtEndStr = formatDateTime(dtEnd);
  
        lines.push(
          'BEGIN:VEVENT',
          `UID:${i}-${week}@timetable-app`,
          `SUMMARY:${courseName || courseId}`,
          `DESCRIPTION:Instructor: ${instructor}\\nRoom: ${room}\\n${remarks}`,
          `LOCATION:${room}`,
          `DTSTART;TZID=Asia/Singapore:${dtStartStr}`,
          `DTEND;TZID=Asia/Singapore:${dtEndStr}`,
          ...alertMinutesArray.map(makeAlarm),
          'END:VEVENT'
        );
      }
    });
  
    lines.push('END:VCALENDAR');
  
    const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
    return blob;
  }
  