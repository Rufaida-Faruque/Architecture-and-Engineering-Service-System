import { useEffect, useState } from "react";
import axios from "axios";

export default function CalendarView() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("g_access_token");
    if (!token) return alert("Login with Google first!");

    async function loadEvents() {
      const res = await axios.get(
        "https://www.googleapis.com/calendar/v3/calendars/primary/events",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );

      setEvents(res.data.items || []);
    }

    loadEvents();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Your Google Calendar</h1>

      {events.length === 0 && <p>No events found.</p>}

      {events.map(e => (
        <div key={e.id} style={{ marginBottom: 15, padding: 10, border: "1px solid #ccc" }}>
          <h3>{e.summary}</h3>
          <p>{e.start?.dateTime || e.start?.date}</p>
        </div>
      ))}
    </div>
  );
}
