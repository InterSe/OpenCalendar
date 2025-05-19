export default function exportToICS(data, alarmsEnabled, alarmTimes = []) {
    const pad = (n) => String(n).padStart(2, '0');
  
    const escape = (str) =>
      String(str || "")
        .replace(/\\n/g, "\\n")
        .replace(/,/g, "\\,")
        .replace(/;/g, "\\;")
        .replace(/\n/g, "\\n");
  
    const buildDateTime = (dateStr, timeStr) => {
      const date = new Date(dateStr);
      const [hour, minute] = timeStr.split(/[:.]/).map(Number);
      date.setHours(hour || 0, minute || 0);
      return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}T${pad(date.getHours())}${pad(date.getMinutes())}00`;
    };
  
    let ics = `BEGIN:VCALENDAR\nVERSION:2.0\nCALSCALE:GREGORIAN\nMETHOD:PUBLISH\n`;
  
    data.forEach(item => {
      const { start_date, start_time, end_time, weeks, room, remarks, course, course_name } = item;
      if (!start_date || !start_time || !end_time || !weeks) return;
  
      const weekParts = String(weeks).replace(/\s+/g, "").split(',').filter(Boolean);
      const startBase = new Date(start_date);
  
      weekParts.forEach(range => {
        const [startW, endW] = range.includes("-") ? range.split("-").map(Number) : [Number(range), Number(range)];
        for (let wk = startW; wk <= endW; wk++) {
          const eventDate = new Date(startBase);
          eventDate.setDate(startBase.getDate() + (wk - 1) * 7);
  
          const dtStart = buildDateTime(eventDate, start_time);
          const dtEnd = buildDateTime(eventDate, end_time);
  
          ics += `BEGIN:VEVENT\n`;
          ics += `SUMMARY:Wk${wk} 📚 ${escape(course)} - ${escape(course_name)}\n`;
          ics += `DTSTART:${dtStart}\n`;
          ics += `DTEND:${dtEnd}\n`;
          if (room) ics += `LOCATION:${escape(room)}\n`;
          if (remarks) ics += `DESCRIPTION:${escape(remarks)}\n`;
  
          if (alarmsEnabled) {
            alarmTimes.filter(t => t).forEach(min => {
              ics += `BEGIN:VALARM\nTRIGGER:-PT${min}M\nACTION:DISPLAY\nDESCRIPTION:Reminder\nEND:VALARM\n`;
            });
          }
  
          ics += `END:VEVENT\n`;
        }
      });
    });
  
    ics += `END:VCALENDAR`;
    return ics;
  }
  