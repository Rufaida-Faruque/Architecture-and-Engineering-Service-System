import { google } from "googleapis";

export default async function handler(req, res) {
  try {
    const code = req.query.code;

    if (!code) {
      return res.status(400).json({
        error: "Missing authorization code",
        details: "Google did not return ?code="
      });
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    const { tokens } = await oauth2Client.getToken(code);

    // Save refresh_token so we can fetch events later
    global.googleTokens = tokens;

    return res.redirect("/dashboard/client");

  } catch (err) {
    console.error("CALLBACK ERROR:", err);
    return res.status(500).json({
      error: "Authentication failed",
      details: err.message,
    });
  }
}