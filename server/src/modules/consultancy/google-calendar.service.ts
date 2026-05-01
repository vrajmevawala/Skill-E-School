import { google } from "googleapis";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/app-error";

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.VITE_API_URL || "http://localhost:8080/api"}/consultancy/google/callback`
);

export class GoogleCalendarService {
    static getAuthUrl(expertId: string) {
        return oauth2Client.generateAuthUrl({
            access_type: "offline",
            scope: ["https://www.googleapis.com/auth/calendar.readonly", "https://www.googleapis.com/auth/userinfo.email"],
            state: expertId,
            prompt: "consent"
        });
    }

    static async handleCallback(code: string, expertId: string) {
        const { tokens } = await oauth2Client.getToken(code);
        
        await prisma.expert.update({
            where: { id: expertId },
            data: {
                googleAccessToken: tokens.access_token,
                googleRefreshToken: tokens.refresh_token,
                googleTokenExpiry: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
            }
        });

        return tokens;
    }

    static async syncExpertBookings(expertId: string) {
        const expert = await prisma.expert.findUnique({
            where: { id: expertId },
            include: { user: true }
        });

        if (!expert || !expert.googleRefreshToken) {
            return []; // Skip if not connected
        }

        oauth2Client.setCredentials({
            access_token: expert.googleAccessToken,
            refresh_token: expert.googleRefreshToken,
            expiry_date: expert.googleTokenExpiry?.getTime()
        });

        const calendar = google.calendar({ version: "v3", auth: oauth2Client });
        
        // Fetch events from the primary calendar
        const response = await calendar.events.list({
            calendarId: "primary",
            timeMin: new Date().toISOString(),
            maxResults: 50,
            singleEvents: true,
            orderBy: "startTime",
        });

        const events = response.data.items || [];
        const syncedBookings = [];

        for (const event of events) {
            // Find user by attendee email
            const attendees = event.attendees || [];
            for (const attendee of attendees) {
                if (attendee.email === expert.user.email) continue; // Skip expert themselves

                const user = await prisma.user.findUnique({
                    where: { email: attendee.email! }
                });

                if (user) {
                    // Check if this booking already exists
                    const existing = await prisma.gCalBooking.findFirst({
                        where: {
                            userId: user.id,
                            expertId: expert.id,
                            scheduledAt: event.start?.dateTime ? new Date(event.start.dateTime) : new Date(event.start?.date!),
                        }
                    });

                    if (!existing) {
                        const newBooking = await prisma.gCalBooking.create({
                            data: {
                                userId: user.id,
                                expertId: expert.id,
                                scheduledAt: event.start?.dateTime ? new Date(event.start.dateTime) : new Date(event.start?.date!),
                                notes: event.summary || "Google Calendar Session",
                                googleMeetLink: event.hangoutLink || null,
                                status: "CONFIRMED"
                            }
                        });
                        syncedBookings.push(newBooking);
                    }
                }
            }
        }

        return syncedBookings;
    }
}
