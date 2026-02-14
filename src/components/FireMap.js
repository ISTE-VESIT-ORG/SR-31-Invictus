'use client';
import { useEffect, useRef, useState } from 'react';
import styles from './FireMap.module.css';

const SAMPLE_FIRES = [
    { lat: -12.5, lng: -55.3, brightness: 340, confidence: 95, country: 'Brazil' },
    { lat: -8.7, lng: -63.1, brightness: 320, confidence: 85, country: 'Brazil' },
    { lat: 37.2, lng: -119.8, brightness: 355, confidence: 92, country: 'USA' },
    { lat: 36.8, lng: -121.3, brightness: 330, confidence: 78, country: 'USA' },
    { lat: -33.8, lng: 150.9, brightness: 310, confidence: 88, country: 'Australia' },
    { lat: -34.2, lng: 148.5, brightness: 345, confidence: 91, country: 'Australia' },
    { lat: 62.0, lng: 129.5, brightness: 315, confidence: 72, country: 'Russia' },
    { lat: 56.3, lng: 105.2, brightness: 325, confidence: 80, country: 'Russia' },
    { lat: 8.5, lng: 2.3, brightness: 305, confidence: 68, country: 'Nigeria' },
    { lat: -15.4, lng: 28.3, brightness: 290, confidence: 75, country: 'Zambia' },
    { lat: 15.3, lng: -1.5, brightness: 300, confidence: 82, country: 'Mali' },
    { lat: 40.6, lng: 22.9, brightness: 310, confidence: 70, country: 'Greece' },
    { lat: 38.7, lng: -9.1, brightness: 295, confidence: 65, country: 'Portugal' },
    { lat: -3.4, lng: 36.7, brightness: 280, confidence: 60, country: 'Tanzania' },
    { lat: 28.6, lng: 77.2, brightness: 285, confidence: 55, country: 'India' },
    { lat: 1.3, lng: 103.8, brightness: 310, confidence: 78, country: 'Singapore' },
    { lat: -6.2, lng: 106.8, brightness: 325, confidence: 85, country: 'Indonesia' },
    { lat: 14.6, lng: 121.0, brightness: 295, confidence: 72, country: 'Philippines' },
    { lat: 43.7, lng: -79.4, brightness: 270, confidence: 50, country: 'Canada' },
    { lat: -22.9, lng: -43.2, brightness: 300, confidence: 77, country: 'Brazil' },
];

function getFireColor(confidence) {
    if (confidence >= 90) return '#FF2D2D';
    if (confidence >= 75) return '#FF6B35';
    if (confidence >= 60) return '#FBBF24';
    return '#94A3B8';
}

export default function FireMap() {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        let map;
        import('leaflet').then(L => {
            // Load CSS
            if (!document.querySelector('link[href*="leaflet"]')) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
                document.head.appendChild(link);
            }

            if (!mapRef.current || mapInstanceRef.current) return;

            map = L.map(mapRef.current).setView([20, 0], 2);
            mapInstanceRef.current = map;

            L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; CARTO',
            }).addTo(map);

            SAMPLE_FIRES.forEach(fire => {
                L.circleMarker([fire.lat, fire.lng], {
                    radius: Math.max(4, fire.confidence / 15),
                    color: getFireColor(fire.confidence),
                    fillColor: getFireColor(fire.confidence),
                    fillOpacity: 0.6,
                    weight: 1,
                }).addTo(map).bindPopup(`
                    <div style="color:#1a1a2e;font-size:0.82rem">
                        <strong>Fire Hotspot</strong><br/>
                        Country: ${fire.country}<br/>
                        Brightness: ${fire.brightness}K<br/>
                        Confidence: ${fire.confidence}%
                    </div>
                `);
            });

            setReady(true);
        });

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, []);

    return (
        <div className={styles.wrapper}>
            <div className={styles.mapContainer}>
                <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
            </div>
            <div className={styles.legend}>
                <span className={styles.legendTitle}>Confidence Level:</span>
                <span className={styles.legendItem}><span style={{ background: '#FF2D2D' }} className={styles.dot} /> 90%+</span>
                <span className={styles.legendItem}><span style={{ background: '#FF6B35' }} className={styles.dot} /> 75–89%</span>
                <span className={styles.legendItem}><span style={{ background: '#FBBF24' }} className={styles.dot} /> 60–74%</span>
                <span className={styles.legendItem}><span style={{ background: '#94A3B8' }} className={styles.dot} /> &lt;60%</span>
            </div>
        </div>
    );
}
