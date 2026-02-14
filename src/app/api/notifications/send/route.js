import webpush from 'web-push';
import { subscriptions } from '../subscribe/route';
import { getEventsInWindow } from '@/data/events';

const VAPID_PUBLIC = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const VAPID_PRIVATE = process.env.VAPID_PRIVATE_KEY;
const VAPID_EMAIL = 'mailto:celestia@example.com';

if (VAPID_PUBLIC && VAPID_PRIVATE) {
    webpush.setVapidDetails(VAPID_EMAIL, VAPID_PUBLIC, VAPID_PRIVATE);
}

export async function POST(request) {
    try {
        if (!VAPID_PUBLIC || !VAPID_PRIVATE) {
            return Response.json(
                { error: 'VAPID keys not configured. Check .env.local' },
                { status: 500 }
            );
        }

        // Get optional body params
        let categories = null;
        let testMode = false;
        try {
            const body = await request.json();
            categories = body.categories;
            testMode = body.test === true;
        } catch {
            // no body is fine
        }

        // If test mode, send a test notification
        if (testMode) {
            const payload = JSON.stringify({
                title: '🚀 Celestia Notifications Active!',
                body: 'You will now be alerted about upcoming meteor showers, eclipses, planet alignments, and more.',
                icon: '/icon-192.png',
                badge: '/icon-192.png',
                url: '/settings',
                tag: 'celestia-test',
            });

            const results = await sendToAll(payload);
            return Response.json({
                success: true,
                test: true,
                sent: results.sent,
                failed: results.failed,
            });
        }

        // Find upcoming events within the next 3 days
        const events = getEventsInWindow(3);

        if (events.length === 0) {
            return Response.json({
                success: true,
                message: 'No upcoming events in the next 3 days',
                sent: 0,
            });
        }

        // Filter by categories if provided
        const filteredEvents = categories
            ? events.filter((e) => categories[e.type] !== false)
            : events;

        if (filteredEvents.length === 0) {
            return Response.json({
                success: true,
                message: 'No events matching selected categories',
                sent: 0,
            });
        }

        // Send a notification for each event
        let totalSent = 0;
        let totalFailed = 0;

        for (const event of filteredEvents) {
            const now = new Date();
            now.setHours(0, 0, 0, 0);
            const eventDate = new Date(event.date);
            const daysUntil = Math.ceil((eventDate - now) / (1000 * 60 * 60 * 24));

            let urgency = '';
            if (daysUntil === 0) urgency = 'TODAY: ';
            else if (daysUntil === 1) urgency = 'TOMORROW: ';
            else urgency = `In ${daysUntil} days: `;

            const payload = JSON.stringify({
                title: `${event.icon} ${urgency}${event.title}`,
                body: event.description,
                icon: '/icon-192.png',
                badge: '/icon-192.png',
                url: event.url,
                tag: `celestia-${event.id}`,
                requireInteraction: daysUntil === 0,
            });

            const results = await sendToAll(payload);
            totalSent += results.sent;
            totalFailed += results.failed;
        }

        return Response.json({
            success: true,
            eventsFound: filteredEvents.length,
            sent: totalSent,
            failed: totalFailed,
        });
    } catch (err) {
        console.error('Notification send error:', err);
        return Response.json(
            { error: 'Failed to send notifications', details: err.message },
            { status: 500 }
        );
    }
}

async function sendToAll(payload) {
    let sent = 0;
    let failed = 0;
    const expired = [];

    for (const [endpoint, { subscription }] of subscriptions.entries()) {
        try {
            await webpush.sendNotification(subscription, payload);
            sent++;
        } catch (err) {
            failed++;
            // Remove expired/invalid subscriptions
            if (err.statusCode === 404 || err.statusCode === 410) {
                expired.push(endpoint);
            }
        }
    }

    // Clean up expired
    for (const ep of expired) {
        subscriptions.delete(ep);
    }

    return { sent, failed };
}
