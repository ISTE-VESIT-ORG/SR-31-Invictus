// Celestia — Service Worker for Push Notifications

const CACHE_NAME = 'celestia-v1';
const OFFLINE_URL = '/';

// Install: cache app shell
self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll([OFFLINE_URL]);
        })
    );
});

// Activate: clean old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys
                    .filter((key) => key !== CACHE_NAME)
                    .map((key) => caches.delete(key))
            )
        )
    );
    self.clients.claim();
});

// Fetch: serve from cache, fall back to network
self.addEventListener('fetch', (event) => {
    // Skip cross-origin requests
    if (!event.request.url.startsWith(self.location.origin)) return;

    // For page navigations, try network first, then cache, then offline page
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request)
                .catch(() => {
                    return caches.match(OFFLINE_URL);
                })
        );
        return;
    }

    // For other resources, try cache first, then network
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});

// Push notification received
self.addEventListener('push', (event) => {
    let data = {
        title: 'Celestia',
        body: 'A new space event is happening!',
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        url: '/',
        tag: 'celestia-event',
    };

    if (event.data) {
        try {
            const payload = event.data.json();
            data = { ...data, ...payload };
        } catch (e) {
            data.body = event.data.text();
        }
    }

    const options = {
        body: data.body,
        icon: data.icon || '/icon-192.png',
        badge: data.badge || '/icon-192.png',
        tag: data.tag || 'celestia-event',
        renotify: true,
        requireInteraction: data.requireInteraction || false,
        data: {
            url: data.url || '/',
        },
        actions: data.actions || [
            { action: 'open', title: 'View Details' },
            { action: 'dismiss', title: 'Dismiss' },
        ],
        vibrate: [100, 50, 100, 50, 200],
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

// Notification clicked
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    const targetUrl = event.notification.data?.url || '/';

    if (event.action === 'dismiss') return;

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
            // Focus existing window if possible
            for (const client of windowClients) {
                if (client.url.includes(self.location.origin) && 'focus' in client) {
                    client.navigate(targetUrl);
                    return client.focus();
                }
            }
            // Otherwise open new window
            return clients.openWindow(targetUrl);
        })
    );
});
