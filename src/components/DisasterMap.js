'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import styles from './DisasterMap.module.css';

const EVENT_COLORS = {
    'Wildfires': '#FF4500',
    'Volcanoes': '#DC143C',
    'Severe Storms': '#8B5CF6',
    'Floods': '#3B82F6',
    'Earthquakes': '#FBBF24',
    'Drought': '#D97706',
    'Sea and Lake Ice': '#06B6D4',
    'Icebergs': '#67E8F9',
    'default': '#EC4899',
};

const QUAKE_COLORS = {
    minor: '#86EFAC',    // < 3
    light: '#FBBF24',    // 3-4.9
    moderate: '#F97316',  // 5-5.9
    strong: '#EF4444',    // 6-6.9
    major: '#DC2626',     // 7+
};

function quakeColor(mag) {
    if (mag < 3) return QUAKE_COLORS.minor;
    if (mag < 5) return QUAKE_COLORS.light;
    if (mag < 6) return QUAKE_COLORS.moderate;
    if (mag < 7) return QUAKE_COLORS.strong;
    return QUAKE_COLORS.major;
}

export default function DisasterMap() {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const layersRef = useRef({ eonet: [], quakes: [], fires: [] });
    const [events, setEvents] = useState([]);
    const [quakes, setQuakes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeLayer, setActiveLayer] = useState({ eonet: true, quakes: true, fires: true });
    const [quakePeriod, setQuakePeriod] = useState('day');
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [stats, setStats] = useState({ eonet: 0, quakes: 0, fires: 0 });

    // Fetch EONET + Earthquakes
    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [eonetRes, quakeRes, fireRes] = await Promise.all([
                fetch('/api/eonet?limit=80&days=30').then(r => r.json()),
                fetch(`/api/earthquakes?period=${quakePeriod}&minmag=2.5`).then(r => r.json()),
                fetch('/api/fires?source=VIIRS_SNPP_NRT&days=2&limit=200').then(r => r.json()).catch(() => ({ fires: [] })),
            ]);
            setEvents(eonetRes.events || []);
            setQuakes(quakeRes.quakes || []);
            setStats({
                eonet: (eonetRes.events || []).length,
                quakes: (quakeRes.quakes || []).length,
                fires: (fireRes.fires || []).length,
            });
        } catch (e) {
            console.error('Disaster data fetch error:', e);
        }
        setLoading(false);
    }, [quakePeriod]);

    useEffect(() => { fetchData(); }, [fetchData]);

    // Init map
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

            const map = Leaf.map(mapRef.current, { worldCopyJump: true }).setView([20, 0], 2);
            mapInstanceRef.current = map;

            Leaf.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; CARTO',
            }).addTo(map);
        });

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, []);

    // Filter helper
    const getFilteredData = useCallback(() => {
        const now = Date.now();
        const hour = 3600000;
        const day = 86400000;
        const week = day * 7;

        let cutoff = now - week; // default
        if (quakePeriod === 'hour') cutoff = now - hour;
        if (quakePeriod === 'day') cutoff = now - day;

        const filteredEvents = events.filter(e => {
            const date = new Date(e.date).getTime();
            return date >= cutoff;
        });

        const filteredQuakes = quakes.filter(q => {
            const date = new Date(q.time).getTime();
            return date >= cutoff;
        });

        return { filteredEvents, filteredQuakes };
    }, [events, quakes, quakePeriod]);

    // Update stats when data or period changes
    useEffect(() => {
        const { filteredEvents, filteredQuakes } = getFilteredData();
        setStats({
            eonet: filteredEvents.length,
            quakes: filteredQuakes.length,
            fires: stats.fires // fires are separate API
        });
    }, [getFilteredData, stats.fires]);

    // Render markers
    useEffect(() => {
        import('leaflet').then(L => {
            const Leaf = L.default || L;
            const map = mapInstanceRef.current;
            if (!map) return;

            // Clear old layers
            Object.values(layersRef.current).forEach(arr => arr.forEach(m => map.removeLayer(m)));
            layersRef.current = { eonet: [], quakes: [], fires: [] };

            const { filteredEvents, filteredQuakes } = getFilteredData();

            // EONET events
            if (activeLayer.eonet) {
                filteredEvents.forEach(evt => {
                    if (!evt.coordinates) return;
                    const [lng, lat] = evt.coordinates;
                    const color = EVENT_COLORS[evt.category] || EVENT_COLORS.default;
                    const marker = Leaf.circleMarker([lat, lng], {
                        radius: 7,
                        color,
                        fillColor: color,
                        fillOpacity: 0.6,
                        weight: 2,
                    }).addTo(map);
                    marker.bindPopup(`
                        <div style="color:#1a1a2e;font-size:0.8rem;min-width:200px">
                            <strong>${evt.category === 'Wildfires' ? '' : evt.category === 'Volcanoes' ? '' : evt.category === 'Severe Storms' ? '' : evt.category === 'Floods' ? '' : ''} ${evt.title}</strong><br/>
                            <span style="color:#666">${evt.category}</span><br/>
                            ${evt.date ? `Date: ${new Date(evt.date).toLocaleDateString()}<br/>` : ''}
                            ${evt.magnitudeValue ? `Magnitude: ${evt.magnitudeValue} ${evt.magnitudeUnit}<br/>` : ''}
                            ${evt.source ? `<a href="${evt.source}" target="_blank" style="color:#4C9FFF">Source ↗</a>` : ''}
                        </div>
                    `);
                    marker.on('click', () => setSelectedEvent({ ...evt, type: 'eonet' }));
                    layersRef.current.eonet.push(marker);
                });
            }

            // Earthquakes
            if (activeLayer.quakes) {
                filteredQuakes.forEach(q => {
                    const [lng, lat] = q.coordinates;
                    const color = quakeColor(q.magnitude);
                    const radius = Math.max(4, q.magnitude * 2);
                    const marker = Leaf.circleMarker([lat, lng], {
                        radius,
                        color,
                        fillColor: color,
                        fillOpacity: 0.5,
                        weight: 1.5,
                    }).addTo(map);
                    marker.bindPopup(`
                        <div style="color:#1a1a2e;font-size:0.8rem;min-width:200px">
                            <strong>M${q.magnitude.toFixed(1)} Earthquake</strong><br/>
                            <span style="color:#666">${q.place}</span><br/>
                            Depth: ${q.depth.toFixed(1)} km<br/>
                            Time: ${new Date(q.time).toLocaleString()}<br/>
                            ${q.tsunami ? '<span style="color:#DC2626;font-weight:bold">Tsunami Warning</span><br/>' : ''}
                            ${q.alert ? `Alert: <span style="font-weight:bold;color:${q.alert}">${q.alert.toUpperCase()}</span><br/>` : ''}
                            <a href="${q.url}" target="_blank" style="color:#4C9FFF">USGS Details ↗</a>
                        </div>
                    `);
                    marker.on('click', () => setSelectedEvent({ ...q, type: 'quake' }));
                    layersRef.current.quakes.push(marker);
                });
            }
        });
    }, [getFilteredData, activeLayer]);

    const toggleLayer = (layer) => {
        setActiveLayer(prev => ({ ...prev, [layer]: !prev[layer] }));
    };

    return (
        <div className={styles.wrapper}>
            {/* Controls */}
            <div className={styles.controls}>
                <div className={styles.layerToggles}>
                    <button
                        className={`${styles.toggleBtn} ${activeLayer.eonet ? styles.toggleActive : ''}`}
                        onClick={() => toggleLayer('eonet')}
                        style={{ '--toggle-color': '#EC4899' }}
                    >
                        Natural Events ({stats.eonet})
                    </button>
                    <button
                        className={`${styles.toggleBtn} ${activeLayer.quakes ? styles.toggleActive : ''}`}
                        onClick={() => toggleLayer('quakes')}
                        style={{ '--toggle-color': '#FBBF24' }}
                    >
                        Earthquakes ({stats.quakes})
                    </button>
                </div>
                <div className={styles.periodSelector}>
                    {['hour', 'day', 'week'].map(p => (
                        <button
                            key={p}
                            className={`tab ${quakePeriod === p ? 'tabActive' : ''}`}
                            onClick={() => setQuakePeriod(p)}
                        >
                            {p === 'hour' ? 'Last Hour' : p === 'day' ? 'Today' : 'This Week'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Map */}
            <div className={styles.mapContainer}>
                <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
                {loading && (
                    <div className={styles.loadingOverlay}>
                        <div className="loader">
                            <div className="loaderDot" /><div className="loaderDot" /><div className="loaderDot" />
                        </div>
                        <p>Loading disaster data...</p>
                    </div>
                )}

                {/* Legend */}
                <div className={styles.legend}>
                    <div className={styles.legendTitle}>Legend</div>
                    {Object.entries(EVENT_COLORS).filter(([k]) => k !== 'default').map(([name, color]) => (
                        <div key={name} className={styles.legendItem}>
                            <span className={styles.legendDot} style={{ background: color }} />
                            <span>{name}</span>
                        </div>
                    ))}
                    <div className={styles.legendDivider} />
                    <div className={styles.legendItem}>
                        <span className={styles.legendDot} style={{ background: QUAKE_COLORS.minor }} />
                        <span>Quake &lt;3</span>
                    </div>
                    <div className={styles.legendItem}>
                        <span className={styles.legendDot} style={{ background: QUAKE_COLORS.moderate }} />
                        <span>Quake 5-6</span>
                    </div>
                    <div className={styles.legendItem}>
                        <span className={styles.legendDot} style={{ background: QUAKE_COLORS.major }} />
                        <span>Quake 7+</span>
                    </div>
                </div>
            </div>

            {/* Event Stats */}
            <div className={styles.statsRow}>
                <div className={`${styles.statCard} card`}>
                    <span className="statLabel">Natural Events (30d)</span>
                    <span className="statValue">{stats.eonet}</span>
                </div>
                <div className={`${styles.statCard} card`}>
                    <span className="statLabel">Earthquakes ({quakePeriod})</span>
                    <span className="statValue">{stats.quakes}</span>
                </div>
                <div className={`${styles.statCard} card`}>
                    <span className="statLabel">Active Fires</span>
                    <span className="statValue">{stats.fires}</span>
                </div>
                <div className={`${styles.statCard} card`}>
                    <span className="statLabel">Strongest Quake</span>
                    <span className="statValue">
                        {quakes.length > 0
                            ? `M${Math.max(...quakes.map(q => q.magnitude)).toFixed(1)}`
                            : '—'}
                    </span>
                </div>
            </div>

            {/* Recent Events Feed */}
            <div className={styles.eventFeed}>
                <h4 className={styles.feedTitle}>Recent Events</h4>
                <div className={styles.feedList}>
                    {[
                        ...events.slice(0, 8).map(e => ({ ...e, type: 'eonet' })),
                        ...quakes.slice(0, 8).map(q => ({ ...q, type: 'quake', title: `M${q.magnitude.toFixed(1)} — ${q.place}`, category: 'Earthquakes', date: new Date(q.time).toISOString() })),
                    ]
                        .sort((a, b) => new Date(b.date) - new Date(a.date))
                        .slice(0, 12)
                        .map((item, i) => (
                            <div key={i} className={styles.feedItem}>
                                <span className={styles.feedDot} style={{ background: item.type === 'quake' ? quakeColor(item.magnitude || 0) : EVENT_COLORS[item.category] || EVENT_COLORS.default }} />
                                <div className={styles.feedInfo}>
                                    <span className={styles.feedItemTitle}>{item.title}</span>
                                    <span className={styles.feedItemMeta}>
                                        {item.category} • {item.date ? new Date(item.date).toLocaleDateString() : ''}
                                    </span>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
}
