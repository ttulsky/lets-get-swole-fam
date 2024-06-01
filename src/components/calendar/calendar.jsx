import React from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./LogCalendar.css"; // Custom CSS for styling

const LogCalendar = ({ logs, onDateClick }) => {
  const datesWithLogs = logs.map((log) =>
    new Date(log.dateTime).toDateString()
  );

  const tileContent = ({ date, view }) => {
    if (view === "month" && datesWithLogs.includes(date.toDateString())) {
      return <div className="log-marker"></div>;
    }
    return null;
  };

  return (
    <div className="log-calendar-container">
      <Calendar tileContent={tileContent} onClickDay={onDateClick} />
    </div>
  );
};

export default LogCalendar;
