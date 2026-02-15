'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import styles from './ISSTracker.module.css';

export default function ISSTracker() {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markerRef = useRef(null);
    const trailRef = useRef(null);
    const satrecRef = useRef(null);
    const trailPoints = useRef([]);
    const [position, setPosition] = useState(null);
    const [altitude, setAltitude] = useState(null);
    const [speed, setSpeed] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch ISS TLE
    useEffect(() => {
        async function loadISS() {
            try {
                const satellite = await import('satellite.js');
                const res = await fetch('/api/iss');
                const data = await res.json();

                if (!data.line1 || !data.line2) throw new Error('Invalid ISS data');

                const satrec = satellite.twoline2satrec(data.line1, data.line2);
                satrecRef.current = { satrec, satellite };
                setLoading(false);
            } catch (e) {
                console.error('ISS load error:', e);
                setError('Could not load ISS orbital data');
                setLoading(false);
            }
        }
        loadISS();
    }, []);

    // Init Leaflet map
    useEffect(() => {
        import('leaflet').then(L => {
            const Leaf = L.default || L;
            if (!document.querySelector('link[href*="leaflet"]')) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
                document.head.appendChild(link);
            }
            if (!mapRef.current || mapInstanceRef.current) return;

            const map = Leaf.map(mapRef.current, {
                worldCopyJump: true,
                minZoom: 2,
                maxZoom: 8
            }).setView([20, 0], 2);
            mapInstanceRef.current = map;

            Leaf.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; CARTO',
            }).addTo(map);

            const icon = Leaf.icon({
                iconUrl: 'data:image/svg+xml;base64,' + btoa(`
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
                        <circle cx="24" cy="24" r="22" fill="#00F0D4" fill-opacity="0.15" stroke="#00F0D4" stroke-width="2"/>
                        <circle cx="24" cy="24" r="10" fill="#00F0D4" fill-opacity="0.3"/>
                        <circle cx="24" cy="24" r="5" fill="#00F0D4"/>
                        <line x1="14" y1="24" x2="34" y2="24" stroke="#00F0D4" stroke-width="1.5" stroke-opacity="0.5"/>
                        <line x1="24" y1="14" x2="24" y2="34" stroke="#00F0D4" stroke-width="1.5" stroke-opacity="0.5"/>
                    </svg>
                `),
                iconSize: [48, 48],
                iconAnchor: [24, 24],
            });

            markerRef.current = Leaf.marker([0, 0], { icon }).addTo(map);
            trailRef.current = Leaf.polyline([], {
                color: '#00F0D4', weight: 2, opacity: 0.5, dashArray: '6, 10',
            }).addTo(map);
        });

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, []);

    // Propagate ISS position every 2 seconds
    const propagate = useCallback(() => {
        if (!satrecRef.current) return;
        const { satrec, satellite } = satrecRef.current;

        const now = new Date();
        const posVel = satellite.propagate(satrec, now);
        if (!posVel || !posVel.position) return;

        const gmst = satellite.gstime(now);
        const geo = satellite.eciToGeodetic(posVel.position, gmst);
        const lat = satellite.degreesLat(geo.latitude);
        const lng = satellite.degreesLong(geo.longitude);
        const alt = geo.height;
        const vel = posVel.velocity;
        const spd = Math.sqrt(vel.x ** 2 + vel.y ** 2 + vel.z ** 2);

        setPosition([lat, lng]);
        setAltitude(alt);
        setSpeed(spd * 3600);

        trailPoints.current = [...trailPoints.current.slice(-100), [lat, lng]];

        if (markerRef.current) {
            markerRef.current.setLatLng([lat, lng]);
        }
        if (trailRef.current) {
            trailRef.current.setLatLngs(trailPoints.current);
        }
        if (mapInstanceRef.current && trailPoints.current.length <= 2) {
            mapInstanceRef.current.setView([lat, lng], 3);
        }
    }, []);

    useEffect(() => {
        if (loading) return;
        propagate();
        const interval = setInterval(propagate, 2000);
        return () => clearInterval(interval);
    }, [loading, propagate]);

    return (
        <div className={styles.wrapper}>
            <div className={styles.mapContainer}>
                <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
                {loading && (
                    <div className={styles.overlay}>
                        <div className="loader">
                            <div className="loaderDot" /><div className="loaderDot" /><div className="loaderDot" />
                        </div>
                        <p>Loading ISS orbital data...</p>
                    </div>
                )}
                {error && (
                    <div className={styles.overlay}>
                        <p style={{ color: '#FBBF24' }}>{error}</p>
                    </div>
                )}
            </div>
            <div className={styles.info}>
                <div className={`${styles.coordCard} card`}>
                    <span className="statLabel">Latitude</span>
                    <span className="statValue" style={{ fontSize: '1.15rem' }}>
                        {position ? position[0].toFixed(4) + '\u00B0' : '\u2014'}
                    </span>
                </div>
                <div className={`${styles.coordCard} card`}>
                    <span className="statLabel">Longitude</span>
                    <span className="statValue" style={{ fontSize: '1.15rem' }}>
                        {position ? position[1].toFixed(4) + '\u00B0' : '\u2014'}
                    </span>
                </div>
                <div className={`${styles.coordCard} card`}>
                    <span className="statLabel">Altitude</span>
                    <span className="statValue" style={{ fontSize: '1.15rem' }}>
                        {altitude ? altitude.toFixed(1) + ' km' : '\u2014'}
                    </span>
                </div>
                <div className={`${styles.coordCard} card`}>
                    <span className="statLabel">Speed</span>
                    <span className="statValue" style={{ fontSize: '1.15rem' }}>
                        {speed ? speed.toFixed(0) + ' km/h' : '\u2014'}
                    </span>
                </div>
            </div>
        </div>
    );
}

// --- TLE Construction from CelesTrak JSON GP data ---
function buildTleLine1(sat) {
    const noradId = String(sat.NORAD_CAT_ID).padStart(5);
    const classification = sat.CLASSIFICATION_TYPE || 'U';
    const intlDes = (sat.OBJECT_ID || '').replace(/-/, '').padEnd(8);
    const epoch = formatEpochForTLE(sat.EPOCH);
    const meanMotionDot = formatMeanMotionDot(sat.MEAN_MOTION_DOT);
    const meanMotionDDot = ' 00000-0';
    const bstar = formatBstar(sat.BSTAR);
    const ephType = '0';
    const elSetNum = String(sat.ELEMENT_SET_NO || 999).padStart(4);
    const raw = `1 ${noradId}${classification} ${intlDes} ${epoch} ${meanMotionDot} ${meanMotionDDot} ${bstar} ${ephType} ${elSetNum}`;
    return raw + checksumTle(raw);
}

function buildTleLine2(sat) {
    const noradId = String(sat.NORAD_CAT_ID).padStart(5);
    const inc = String(sat.INCLINATION.toFixed(4)).padStart(8);
    const raan = String(sat.RA_OF_ASC_NODE.toFixed(4)).padStart(8);
    const ecc = sat.ECCENTRICITY.toFixed(7).replace('0.', '');
    const argP = String(sat.ARG_OF_PERICENTER.toFixed(4)).padStart(8);
    const ma = String(sat.MEAN_ANOMALY.toFixed(4)).padStart(8);
    const mm = String(sat.MEAN_MOTION.toFixed(8)).padStart(11);
    const revNum = String(sat.REV_AT_EPOCH || 0).padStart(5);
    const raw = `2 ${noradId} ${inc} ${raan} ${ecc} ${argP} ${ma} ${mm}${revNum}`;
    return raw + checksumTle(raw);
}

function formatEpochForTLE(epochStr) {
    const d = new Date(epochStr);
    const yr = d.getUTCFullYear() % 100;
    const start = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const day = (d - start) / 86400000 + 1;
    return `${String(yr).padStart(2, '0')}${day.toFixed(8).padStart(12)}`;
}

function formatMeanMotionDot(v) {
    if (!v && v !== 0) return ' .00000000';
    const s = v >= 0 ? ' ' : '-';
    return s + Math.abs(v).toFixed(8).replace('0.', '.');
}

function formatBstar(v) {
    if (!v && v !== 0) return ' 00000-0';
    const sign = v >= 0 ? ' ' : '-';
    const abs = Math.abs(v);
    if (abs === 0) return ' 00000-0';
    const exp = Math.floor(Math.log10(abs)) + 1;
    const man = (abs / Math.pow(10, exp - 5)).toFixed(0).padStart(5, '0');
    return `${sign}${man}${exp >= 0 ? '-' : '+'}${Math.abs(exp)}`;
}

function checksumTle(line) {
    let sum = 0;
    for (const ch of line) {
        if (ch >= '0' && ch <= '9') sum += parseInt(ch);
        else if (ch === '-') sum += 1;
    }
    return String(sum % 10);
}
