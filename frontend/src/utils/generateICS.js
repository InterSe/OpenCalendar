// src/components/generateICS.js
export default function generateICS(data, alarmsEnabled = false, alarmTimes = []) {
    const lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "PRODID:-//Timetable//Calendar Exporter//EN"
    ];
  
    const sanitizeWeeks = (w) => String(w || "").replace(/\s+/g, "");
    const parseTime = (str) => {
      const [h, m] = str.split(/[:.]/).map(n => parseInt(n, 10));
      return [h || 0, m || 0];
    };
  
    data.forEach((item) => {
      const {
        course = "-", course_name = "-", instructor = "-",
        start_date = "-", start_time = "-", end_time = "-",
        weeks = "", room = "-", remarks = "-"
      } = item;
  
      if (!start_date || !start_time || !end_time || !weeks) return;
  
      const weekParts = sanitizeWeeks(weeks).split(",").filter(Boolean);
      const baseDate = new Date(start_date);
      if (isNaN(baseDate)) return;
  
      const [startH, startM] = parseTime(start_time);
      const [endH, endM] = parseTime(end_time);
  
      weekParts.forEach(part => {
        const [wStart, wEnd] = part.includes("-")
          ? part.split("-").map(Number)
          : [Number(part), Number(part)];
  
        for (let w = wStart; w <= wEnd; w++) {
          const day = new Date(baseDate);
          day.setDate(baseDate.getDate() + (w - 1) * 7);
  
          const start = new Date(day);
          start.setHours(startH, startM);
          const end = new Date(day);
          end.setHours(endH, endM);
  
          const pad = (n) => String(n).padStart(2, "0");
          const formatICSDate = (d) =>
            `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
  
          const emoji = course_name.toLowerCase().includes("lab") ? "🔬"
                      : course_name.toLowerCase().includes("supp") ? "📘"
                      : course.toLowerCase().includes("assembly") ? "🏛️"
                      : "📚";
  
          const title = `${emoji} Wk${w} ${course} - ${course_name}`;
          const description = `Instructor: ${instructor}\\nRoom: ${room}\\nRemarks: ${remarks}`;
  
          lines.push("BEGIN:VEVENT");
          lines.push(`SUMMARY:${title}`);
          lines.push(`DESCRIPTION:${description}`);
          lines.push(`LOCATION:${room}`);
          lines.push(`DTSTART:${formatICSDate(start)}`);
          lines.push(`DTEND:${formatICSDate(end)}`);
          lines.push("STATUS:CONFIRMED");
          lines.push("TRANSP:OPAQUE");
  
          if (alarmsEnabled && Array.isArray(alarmTimes)) {
            alarmTimes.filter(min => min).forEach(min => {
              lines.push("BEGIN:VALARM");
              lines.push("ACTION:DISPLAY");
              lines.push("DESCRIPTION:Reminder");
              lines.push(`TRIGGER:-PT${parseInt(min)}M`);
              lines.push("END:VALARM");
            });
          }
  
          lines.push("END:VEVENT");
        }
      });
    });
  
    lines.push("END:VCALENDAR");
    return lines.join("\r\n");
  }
  