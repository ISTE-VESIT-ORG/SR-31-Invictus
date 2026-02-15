'use client';
import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@/context/UserContext';
import styles from './NotificationPanel.module.css';

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

const EVENT_CATEGORIES = [
    { key: 'meteor', label: 'Meteor Showers', icon: '🌠', desc: 'Annual meteor shower peaks' },
    { key: 'eclipse', label: 'Eclipses', icon: '🌑', desc: 'Lunar & solar eclipses' },
    { key: 'alignment', label: 'Planet Events', icon: '🪐', desc: 'Conjunctions & oppositions' },
    { key: 'moon', label: 'Moon Events', icon: '🌕', desc: 'Supermoons & special moons' },
    { key: 'solstice', label: 'Solstices', icon: '☀️', desc: 'Equinoxes & solstices' },
];

export default function NotificationPanel() {
    const user = useUser();
    const notificationPrefs = user.notificationPrefs || {
        enabled: false,
        categories: { meteor: true, eclipse: true, alignment: true, moon: true, solstice: true },
    };
    const setNotificationPrefs = user.setNotificationPrefs || (() => { });
    const [permission, setPermission] = useState('default');
    const [subscribed, setSubscribed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [events, setEvents] = useState([]);
    const [eventsLoading, setEventsLoading] = useState(true);
    const [testSending, setTestSending] = useState(false);
    const [pushSupport, setPushSupport] = useState({ supported: false, reason: '' });

    // Check support & current permission
    useEffect(() => {
        const isSecure = window.isSecureContext;
        const hasSW = 'serviceWorker' in navigator;
        const hasPush = 'PushManager' in window;
        const hasNotif = 'Notification' in window;

        if (!isSecure) {
            setPushSupport({
                supported: false,
                reason: 'Push notifications require HTTPS or localhost. You\'re on an insecure connection — try accessing via http://localhost:3000 instead.',
            });
        } else if (!hasSW || !hasPush || !hasNotif) {
            setPushSupport({
                supported: false,
                reason: 'Push notifications are not supported in this browser. Try Chrome, Edge, or Firefox.',
            });
        } else {
            setPushSupport({ supported: true, reason: '' });
            setPermission(Notification.permission);
        }
    }, []);

    // Load upcoming events (always, regardless of push support)
    useEffect(() => {
        fetch('/api/notifications/events')
            .then((r) => r.json())
            .then((data) => {
                setEvents(data.events || []);
                setEventsLoading(false);
            })
            .catch(() => setEventsLoading(false));
    }, []);

    // Subscribe to push notifications
    const handleSubscribe = useCallback(async () => {
        if (!VAPID_PUBLIC_KEY) {
            alert('VAPID public key not configured. Check .env.local');
            return;
        }

        setLoading(true);
        try {
            const perm = await Notification.requestPermission();
            setPermission(perm);

            if (perm !== 'granted') {
                setLoading(false);
                return;
            }

            const reg = await navigator.serviceWorker.ready;
            const subscription = await reg.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
            });

            const res = await fetch('/api/notifications/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ subscription }),
            });

            if (res.ok) {
                setSubscribed(true);
                setNotificationPrefs({ ...notificationPrefs, enabled: true });
            }
        } catch (err) {
            console.error('Subscribe error:', err);
        }
        setLoading(false);
    }, [notificationPrefs, setNotificationPrefs]);

    // Unsubscribe
    const handleUnsubscribe = useCallback(async () => {
        setLoading(true);
        try {
            const reg = await navigator.serviceWorker.ready;
            const subscription = await reg.pushManager.getSubscription();
            if (subscription) {
                await fetch('/api/notifications/subscribe', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ endpoint: subscription.endpoint }),
                });
                await subscription.unsubscribe();
            }
            setSubscribed(false);
            setNotificationPrefs({ ...notificationPrefs, enabled: false });
        } catch (err) {
            console.error('Unsubscribe error:', err);
        }
        setLoading(false);
    }, [notificationPrefs, setNotificationPrefs]);

    // Send test notification — uses direct Notification API for instant desktop feedback
    const handleTest = useCallback(async () => {
        setTestSending(true);
        try {
            // First show a direct desktop notification so user sees it immediately
            if (Notification.permission === 'granted') {
                new Notification('🚀 Celestia Notifications Active!', {
                    body: 'You will now be alerted about upcoming meteor showers, eclipses, planet alignments, and more.',
                    icon: '/icon-192.png',
                    badge: '/icon-192.png',
                    tag: 'celestia-test',
                });
            }
            // Also trigger the server-side push if subscribed
            if (subscribed) {
                await fetch('/api/notifications/send', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ test: true }),
                });
            }
        } catch (err) {
            console.error('Test notification error:', err);
        }
        setTestSending(false);
    }, [subscribed]);

    // Toggle category
    const toggleCategory = (key) => {
        const cats = { ...notificationPrefs.categories, [key]: !notificationPrefs.categories[key] };
        setNotificationPrefs({ ...notificationPrefs, categories: cats });
    };

    return (
        <div className={styles.panel}>
            {/* Push Support Banner (shown only when push is unavailable) */}
            {!pushSupport.supported && pushSupport.reason && (
                <div className={styles.unsupported}>
                    <span className={styles.unsupportedIcon}>⚠️</span>
                    <div>
                        <p className={styles.unsupportedTitle}>Push Notifications Unavailable</p>
                        <p>{pushSupport.reason}</p>
                    </div>
                </div>
            )}

            {/* Push Controls (only when supported) */}
            {pushSupport.supported && (
                <div className={styles.statusSection}>
                    <div className={styles.statusRow}>
                        <div className={styles.statusInfo}>
                            <div className={styles.statusIndicator}>
                                <span className={`${styles.statusDot} ${subscribed ? styles.dotActive : permission === 'denied' ? styles.dotDenied : ''}`} />
                                <span className={styles.statusText}>
                                    {permission === 'denied'
                                        ? 'Blocked by browser'
                                        : subscribed
                                            ? 'Notifications enabled'
                                            : 'Notifications disabled'}
                                </span>
                            </div>
                            <p className={styles.statusDesc}>
                                {permission === 'denied'
                                    ? 'Please enable notifications in your browser settings.'
                                    : subscribed
                                        ? 'You\'ll be alerted about upcoming cosmic events.'
                                        : 'Enable to receive alerts about meteor showers, eclipses, and more.'}
                            </p>
                        </div>

                        <button
                            className={`${styles.toggleBtn} ${subscribed ? styles.toggleActive : ''}`}
                            onClick={subscribed ? handleUnsubscribe : handleSubscribe}
                            disabled={loading || permission === 'denied'}
                        >
                            {loading ? (
                                <span className={styles.spinner} />
                            ) : subscribed ? (
                                '🔔 Enabled'
                            ) : (
                                '🔕 Enable'
                            )}
                        </button>
                    </div>

                    {subscribed && (
                        <button
                            className={styles.testBtn}
                            onClick={handleTest}
                            disabled={testSending}
                        >
                            {testSending ? 'Sending…' : '🧪 Send Test Notification'}
                        </button>
                    )}
                    {!subscribed && permission !== 'denied' && pushSupport.supported && (
                        <button
                            className={styles.testBtn}
                            onClick={async () => {
                                const perm = await Notification.requestPermission();
                                setPermission(perm);
                                if (perm === 'granted') {
                                    new Notification('🚀 Celestia is ready!', {
                                        body: 'Desktop notifications are working. Enable push to get alerts about cosmic events!',
                                        icon: '/icon-192.png',
                                    });
                                }
                            }}
                        >
                            🔔 Test Desktop Notification
                        </button>
                    )}
                </div>
            )}

            {/* Category Toggles */}
            {pushSupport.supported && subscribed && (
                <div className={styles.categories}>
                    <h4 className={styles.sectionLabel}>Event Categories</h4>
                    <div className={styles.categoryGrid}>
                        {EVENT_CATEGORIES.map((cat) => (
                            <button
                                key={cat.key}
                                className={`${styles.categoryCard} ${notificationPrefs.categories[cat.key] ? styles.categoryActive : ''}`}
                                onClick={() => toggleCategory(cat.key)}
                            >
                                <span className={styles.categoryIcon}>{cat.icon}</span>
                                <div className={styles.categoryInfo}>
                                    <span className={styles.categoryLabel}>{cat.label}</span>
                                    <span className={styles.categoryDesc}>{cat.desc}</span>
                                </div>
                                <div className={`${styles.categoryToggle} ${notificationPrefs.categories[cat.key] ? styles.categoryToggleOn : ''}`}>
                                    <div className={styles.categoryToggleDot} />
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Upcoming Events Timeline (ALWAYS shown) */}
            <div className={styles.eventsSection}>
                <h4 className={styles.sectionLabel}>Upcoming Cosmic Events</h4>
                {eventsLoading ? (
                    <div className="loader">
                        <span className="loaderDot" />
                        <span className="loaderDot" />
                        <span className="loaderDot" />
                    </div>
                ) : events.length === 0 ? (
                    <p className={styles.noEvents}>No upcoming events in the next 60 days.</p>
                ) : (
                    <div className={styles.timeline}>
                        {events.map((event) => (
                            <div key={event.id} className={styles.eventCard}>
                                <div className={styles.eventDate}>
                                    <span className={styles.eventIcon}>{event.icon}</span>
                                    <div className={styles.eventDateInfo}>
                                        <span className={styles.eventFormattedDate}>{event.formattedDate}</span>
                                        {event.isToday ? (
                                            <span className={`${styles.eventBadge} ${styles.badgeToday}`}>TODAY</span>
                                        ) : event.isTomorrow ? (
                                            <span className={`${styles.eventBadge} ${styles.badgeTomorrow}`}>TOMORROW</span>
                                        ) : event.isThisWeek ? (
                                            <span className={`${styles.eventBadge} ${styles.badgeWeek}`}>THIS WEEK</span>
                                        ) : (
                                            <span className={styles.eventDaysUntil}>in {event.daysUntil} days</span>
                                        )}
                                    </div>
                                </div>
                                <div className={styles.eventContent}>
                                    <h5 className={styles.eventTitle}>{event.title}</h5>
                                    <p className={styles.eventDesc}>{event.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
