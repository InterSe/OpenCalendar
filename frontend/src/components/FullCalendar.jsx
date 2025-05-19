// src/components/FullCalendar.jsx
import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import generateCalendarEvents from '../utils/generateCalendarEvents';
import { Tooltip, Typography } from '@mui/material';

export default function CalendarComponent({ events }) {
  const calendarEvents = generateCalendarEvents(Array.isArray(events) ? events : []);

  return (
    <div style={{ marginTop: '2rem' }}>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={calendarEvents}
        height="auto"
        eventContent={(arg) => {
          const { event } = arg;
          const { extendedProps } = event;

          const tooltipContent = `
📚 ${event.title}
👨‍🏫 ${extendedProps?.instructor || ''}
🕘 ${event.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} → ${event.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
📍 ${extendedProps?.room || ''}
📝 ${extendedProps?.remarks || ''}
          `.trim();

          return {
            domNodes: [
              (() => {
                const div = document.createElement('div');
                div.innerText = event.title;
                div.style.cursor = 'pointer';

                // Use Material UI tooltip
                const tooltip = document.createElement('div');
                tooltip.setAttribute('role', 'tooltip');
                tooltip.setAttribute('title', tooltipContent);

                div.appendChild(tooltip);
                return div;
              })(),
            ],
          };
        }}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,dayGridWeek,dayGridDay',
        }}
      />
    </div>
  );
}
