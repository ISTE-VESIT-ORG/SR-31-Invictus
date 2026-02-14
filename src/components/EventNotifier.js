'use client';
import { useEffect } from 'react';

const NOTIF_STORAGE_KEY = 'celestia_last_event_notif';
const COOLDOWN_MS = 12 * 60 * 60 * 1000; // 12 hours between notifications

export default function EventNotifier() {
    useEffect(() => {
        // Don't run on server or if notifications aren't supported/granted
        if (typeof window === 'undefined') return;
        if (!('Notification' in window)) return;
        if (Notification.permission !== 'granted') return;

        // Check cooldown — don't spam on every page load
        const lastShown = localStorage.getItem(NOTIF_STORAGE_KEY);
        if (lastShown && Date.now() - parseInt(lastShown, 10) < COOLDOWN_MS) return;

        // Fetch upcoming events and notify about the closest one
        fetch('/api/notifications/events')
            .then((r) => r.json())
            .then((data) => {
                const events = data.events || [];
                if (events.length === 0) return;

                // Find the most urgent event (closest date)
                const urgent = events[0]; // already sorted by date
                if (!urgent) return;

                let title, body;

                if (urgent.isToday) {
                    title = `${urgent.icon} TODAY: ${urgent.title}`;
                    body = urgent.description;
                } else if (urgent.isTomorrow) {
                    title = `${urgent.icon} TOMORROW: ${urgent.title}`;
                    body = urgent.description;
                } else if (urgent.isThisWeek) {
                    title = `${urgent.icon} This week: ${urgent.title}`;
                    body = `${urgent.formattedDate} — ${urgent.description}`;
                } else {
                    title = `${urgent.icon} Coming up: ${urgent.title}`;
                    body = `In ${urgent.daysUntil} days (${urgent.formattedDate}) — ${urgent.description}`;
                }

                new Notification(title, {
                    body,
                    icon: '/icon-192.png',
                    badge: '/icon-192.png',
                    tag: `celestia-visit-${urgent.id}`,
                    silent: false,
                });

                // Record that we showed a notification
                localStorage.setItem(NOTIF_STORAGE_KEY, Date.now().toString());
            })
            .catch(() => { /* silently fail */ });
    }, []);

    return null; // This component renders nothing
}
