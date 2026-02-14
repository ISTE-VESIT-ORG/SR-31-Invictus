import { getUpcomingEvents } from '@/data/events';

export async function GET() {
    try {
        const events = getUpcomingEvents(60); // next 60 days

        // Enhance with days-until calculation
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        const enriched = events.map((event) => {
            const eventDate = new Date(event.date);
            const diffMs = eventDate - now;
            const daysUntil = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

            return {
                ...event,
                daysUntil,
                isToday: daysUntil === 0,
                isTomorrow: daysUntil === 1,
                isThisWeek: daysUntil <= 7,
                formattedDate: eventDate.toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                }),
            };
        });

        return Response.json({
            events: enriched,
            count: enriched.length,
            generated: new Date().toISOString(),
        });
    } catch (err) {
        return Response.json({ error: 'Failed to fetch events', details: err.message }, { status: 500 });
    }
}
