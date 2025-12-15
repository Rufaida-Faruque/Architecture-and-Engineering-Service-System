import { google } from "googleapis";

export default async function handler(req, res) {
  try {
    const cookie = req.headers.cookie || "";
    const tokenCookie = cookie.split("; ").find(c => c.startsWith("google_tokens="));

    if (!tokenCookie) {
      return res.status(401).json({ error: "Not authenticated with Google Calendar" });
    }

    const tokens = JSON.parse(tokenCookie.replace("google_tokens=", ""));

    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials(tokens);

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    const events = await calendar.events.list({
      calendarId: "primary",
      maxResults: 10,
      singleEvents: true,
      orderBy: "startTime",
    });

    return res.status(200).json(events.data.items);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch events", details: error.message });
  }
}
