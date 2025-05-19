// src/components/generateCalendarEvents.js
export default function generateCalendarEvents(data) {
  if (!Array.isArray(data)) return [];

  const events = [];

  data.forEach((item, idx) => {
    const {
      course = "-", course_name = "-", instructor = "-",
      start_date = "-", start_time = "-", end_time = "-",
      weeks = "", room = "-", remarks = "-"
    } = item;

    if (!start_date || !start_time || !end_time || !weeks) return;

    const sanitizeWeeks = (w) => String(w || "").replace(/\s+/g, "");
    const weekParts = sanitizeWeeks(weeks).split(",").filter(Boolean);

    const parseTime = (str) => {
      const [h, m] = str.split(/[:.]/).map(n => parseInt(n, 10));
      return [h || 0, m || 0];
    };

    const [startH, startM] = parseTime(start_time);
    const [endH, endM] = parseTime(end_time);
    const baseDate = new Date(start_date);
    if (isNaN(baseDate)) return;

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

        const emoji = course_name.toLowerCase().includes("lab") ? "🔬"
                    : course_name.toLowerCase().includes("supp") ? "📘"
                    : course.toLowerCase().includes("assembly") ? "🏛️"
                    : "📚";

        const title = `${emoji} Wk${w} ${course} - ${course_name}`;
        const description = `Instructor: ${instructor}\nRoom: ${room}\nRemarks: ${remarks}`;

        events.push({
          title,
          start,
          end,
          desc: description
        });
      }
    });
  });

  return events;
}
