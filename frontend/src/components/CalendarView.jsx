// src/components/CalendarView.jsx
import React, { useState } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import generateCalendarEvents from '../utils/generateCalendarEvents';

const localizer = momentLocalizer(moment);

function CalendarView({ events }) {
  const safeEvents = Array.isArray(events) ? events : [];
  const calendarEvents = generateCalendarEvents(safeEvents);

  const [view, setView] = useState(Views.MONTH);
  const [date, setDate] = useState(new Date());

  return (
    <div style={{ height: '600px', marginTop: 20 }}>
      <Calendar
        localizer={localizer}
        events={calendarEvents}
        startAccessor="start"
        endAccessor="end"
        titleAccessor={e => e.title}
        tooltipAccessor={e => e.desc}
        view={view}
        onView={setView}
        date={date}
        onNavigate={setDate}
        style={{ height: '100%' }}
      />
    </div>
  );
}

export default CalendarView;
