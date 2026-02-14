import './globals.css';
import Script from 'next/script';
import Navbar from '@/components/Navbar';
import AnimatedBackground from '@/components/AnimatedBackground';
import { UserProvider } from '@/context/UserContext';

export const metadata = {
    title: 'Celestia — Explore the Universe',
    description: 'Your unified space exploration platform. Track the ISS, discover near-Earth objects, monitor space weather, explore Mars rover photos, and learn astronomy.',
    keywords: 'space, astronomy, ISS tracker, NASA, aurora, mars rover, near earth objects, space weather',
    manifest: '/manifest.json',
    themeColor: '#0a0a0a',
    viewport: 'width=device-width, initial-scale=1',
    icons: {
        icon: '/favicon.ico',
    },
};

import dynamic from 'next/dynamic';

const EventNotifier = dynamic(() => import('@/components/EventNotifier'), { ssr: false });

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <UserProvider>
                    <AnimatedBackground />
                    <Navbar />
                    <EventNotifier />
                    <main className="mainContent">
                        {children}
                    </main>
                </UserProvider>
                <Script id="sw-register" strategy="afterInteractive">{`
                    if ('serviceWorker' in navigator) {
                        navigator.serviceWorker.register('/sw.js')
                            .then(reg => console.log('SW registered:', reg.scope))
                            .catch(err => console.warn('SW registration failed:', err));
                    }
                `}</Script>
            </body>
        </html>
    );
}
