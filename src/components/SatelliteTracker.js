'use client';
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import styles from './SatelliteTracker.module.css';

// Human-readable orbit descriptions
function describeOrbit(sat) {
    const inc = sat.INCLINATION;
    const mm = sat.MEAN_MOTION;
    const ecc = sat.ECCENTRICITY;
    const period = (1440 / mm).toFixed(1); // minutes
    const altApprox = Math.round(((8681663.7 / (mm * mm)) ** (1 / 3)) - 6371); // rough altitude km

    let incDesc = '';
    if (inc < 10) incDesc = 'Equatorial orbit — stays near the equator';
    else if (inc >= 85 && inc <= 100) incDesc = 'Polar orbit — covers nearly the entire Earth';
    else if (inc > 96 && inc < 100) incDesc = 'Sun-synchronous orbit — crosses equator at same local time daily';
    else if (inc >= 40 && inc <= 60) incDesc = `Mid-inclination orbit (${inc.toFixed(1)}°) — covers populated latitudes`;
    else incDesc = `${inc.toFixed(1)}° inclination — tilted orbit`;

    let eccDesc = '';
    if (ecc < 0.01) eccDesc = 'Nearly circular orbit';
    else if (ecc < 0.1) eccDesc = 'Slightly elliptical orbit';
    else eccDesc = `Elliptical orbit (e=${ecc.toFixed(4)})`;

    let altDesc = '';
    if (altApprox < 600) altDesc = 'Low Earth Orbit (LEO)';
    else if (altApprox < 2000) altDesc = 'LEO — upper range';
    else if (altApprox < 35000) altDesc = 'Medium Earth Orbit (MEO)';
    else altDesc = 'Geostationary / High orbit';

    return { period, altApprox, incDesc, eccDesc, altDesc };
}

// Color based on orbit type
function satColor(sat) {
    const alt = Math.round(((8681663.7 / (sat.MEAN_MOTION * sat.MEAN_MOTION)) ** (1 / 3)) - 6371);
    if (sat.OBJECT_NAME?.includes('ISS')) return '#06D6A0';
    if (sat.OBJECT_NAME?.includes('TIANGONG') || sat.OBJECT_NAME?.includes('CSS')) return '#FF6B35';
    if (alt < 600) return '#4C9FFF';
    if (alt < 2000) return '#818CF8';
    return '#EC4899';
}

export default function SatelliteTracker() {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markersRef = useRef({});
    const trailsRef = useRef({});
    const leafletRef = useRef(null);
    const satelliteJsRef = useRef(null);
    const [satellites, setSatellites] = useState([]);
    const [selected, setSelected] = useState(null);
    const [positions, setPositions] = useState({});
    const [loading, setLoading] = useState(true);
    const [group, setGroup] = useState('stations');
    const [error, setError] = useState(null);

    // Fetch satellite TLE data
    useEffect(() => {
        setLoading(true);
        setError(null);
        const limit = group === 'active' ? 100 : 50;
        fetch(`/api/satellites?group=${group}&limit=${limit}`)
            .then(r => r.json())
            .then(data => {
                setSatellites(data.satellites || []);
                setLoading(false);
            })
            .catch(err => {
                setError('Failed to fetch satellite data');
                setLoading(false);
            });
    }, [group]);

    // Initialize map
    useEffect(() => {
        Promise.all([
            import('leaflet'),
            import('satellite.js'),
        ]).then(([L, satJs]) => {
            leafletRef.current = L.default || L;
            satelliteJsRef.current = satJs;

            const Leaf = leafletRef.current;

            if (!document.querySelector('link[href*="leaflet"]')) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
                document.head.appendChild(link);
            }

            if (!mapRef.current || mapInstanceRef.current) return;

            const map = Leaf.map(mapRef.current, {
                worldCopyJump: true,
                maxBoundsViscosity: 1.0,
                minZoom: 2,
                maxZoom: 8,
            }).setView([20, 0], 2);
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

    // Propagate satellite positions
    const propagate = useCallback(() => {
        const satJs = satelliteJsRef.current;
        const L = leafletRef.current;
        const map = mapInstanceRef.current;
        if (!satJs || !L || !map || satellites.length === 0) return;

        const now = new Date();
        const gmst = satJs.gstime(now);
        const newPositions = {};

        satellites.forEach(sat => {
            try {
                let satrec;
                if (sat.TLE_LINE1 && sat.TLE_LINE2) {
                    satrec = satJs.twoline2satrec(sat.TLE_LINE1, sat.TLE_LINE2);
                } else {
                    // Build TLE from JSON GP data
                    const meanMotionRad = sat.MEAN_MOTION * (2 * Math.PI / 1440); // rev/day -> rad/min
                    satrec = satJs.twoline2satrec(
                        buildTleLine1(sat),
                        buildTleLine2(sat)
                    );
                }

                const posVel = satJs.propagate(satrec, now);
                if (!posVel.position) return;

                const geo = satJs.eciToGeodetic(posVel.position, gmst);
                const lat = satJs.degreesLat(geo.latitude);
                const lng = satJs.degreesLong(geo.longitude);
                const altKm = geo.height;
                const speed = Math.sqrt(
                    posVel.velocity.x ** 2 +
                    posVel.velocity.y ** 2 +
                    posVel.velocity.z ** 2
                ).toFixed(1);

                newPositions[sat.NORAD_CAT_ID] = { lat, lng, altKm, speed };

                // Update or create marker
                const color = satColor(sat);
                const markerId = sat.NORAD_CAT_ID;

                if (markersRef.current[markerId]) {
                    markersRef.current[markerId].setLatLng([lat, lng]);
                } else {
                    const icon = L.divIcon({
                        className: styles.satMarker,
                        html: `<div style="
                            width:12px;height:12px;border-radius:50%;
                            background:${color};
                            box-shadow: 0 0 8px ${color}80;
                            border: 2px solid ${color};
                        "></div>`,
                        iconSize: [12, 12],
                        iconAnchor: [6, 6],
                    });

                    const marker = L.marker([lat, lng], { icon }).addTo(map);
                    marker.bindPopup(`
                        <div style="color:#1a1a2e;font-size:0.8rem;min-width:180px">
                            <strong>${sat.OBJECT_NAME}</strong><br/>
                            <span style="color:#666">NORAD: ${sat.NORAD_CAT_ID}</span><br/>
                            Lat: ${lat.toFixed(4)}° | Lng: ${lng.toFixed(4)}°<br/>
                            Alt: ${altKm.toFixed(0)} km | Speed: ${speed} km/s
                        </div>
                    `);
                    marker.on('click', () => setSelected(sat));
                    markersRef.current[markerId] = marker;
                }

                // Ground track (next orbit)
                if (!trailsRef.current[markerId]) {
                    const trailPoints = [];
                    const periodMin = 1440 / sat.MEAN_MOTION;
                    for (let m = 0; m < periodMin; m += 2) {
                        const future = new Date(now.getTime() + m * 60000);
                        const futureGmst = satJs.gstime(future);
                        const futurePos = satJs.propagate(satrec, future);
                        if (futurePos.position) {
                            const futureGeo = satJs.eciToGeodetic(futurePos.position, futureGmst);
                            trailPoints.push([
                                satJs.degreesLat(futureGeo.latitude),
                                satJs.degreesLong(futureGeo.longitude),
                            ]);
                        }
                    }
                    // Split trail at antimeridian
                    const segments = splitAtAntimeridian(trailPoints);
                    const lines = segments.map(seg =>
                        L.polyline(seg, { color, weight: 1.5, opacity: 0.35, dashArray: '4, 8' }).addTo(map)
                    );
                    trailsRef.current[markerId] = lines;
                }
            } catch (e) {
                // Skip satellites with bad TLE data
            }
        });

        setPositions(newPositions);
    }, [satellites]);

    // Propagation interval (every 5 seconds)
    useEffect(() => {
        if (satellites.length === 0) return;

        // Clear old markers and trails when satellite list changes
        const L = leafletRef.current;
        const map = mapInstanceRef.current;
        if (L && map) {
            Object.values(markersRef.current).forEach(m => map.removeLayer(m));
            Object.values(trailsRef.current).forEach(lines => lines.forEach(l => map.removeLayer(l)));
            markersRef.current = {};
            trailsRef.current = {};
        }

        propagate();
        const interval = setInterval(propagate, 5000);
        return () => clearInterval(interval);
    }, [propagate, satellites]);

    const selectedInfo = useMemo(() => {
        if (!selected) return null;
        const pos = positions[selected.NORAD_CAT_ID];
        const orbit = describeOrbit(selected);
        return { ...selected, pos, orbit };
    }, [selected, positions]);

    return (
        <div className={styles.wrapper}>
            {/* Controls */}
            <div className={styles.controls}>
                <div className="tabList">
                    {[
                        { key: 'stations', label: 'Space Stations' },
                        { key: 'active', label: 'Active (Top 100)' },
                        { key: 'visual', label: 'Brightest' },
                        { key: 'weather', label: 'Weather' },
                        { key: 'science', label: 'Science' },
                    ].map(g => (
                        <button
                            key={g.key}
                            className={`tab ${group === g.key ? 'tabActive' : ''}`}
                            onClick={() => { setGroup(g.key); setSelected(null); }}
                        >
                            {g.label}
                        </button>
                    ))}
                </div>
                <div className={styles.statBadges}>
                    <span className="badge badgeInfo">
                        {satellites.length} satellites
                    </span>
                    <span className="badge badgeLive">
                        <span className="pulseDot" /> Propagating every 5s
                    </span>
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
                        <p>Loading orbital data...</p>
                    </div>
                )}
                {error && (
                    <div className={styles.loadingOverlay}>
                        <p style={{ color: '#FBBF24' }}>{error}</p>
                    </div>
                )}
            </div>

            {/* Satellite List + Details */}
            <div className={styles.infoPanel}>
                {selectedInfo ? (
                    <div className={styles.detailPanel}>
                        <button className={styles.backBtn} onClick={() => setSelected(null)}>
                            ← Back to list
                        </button>
                        <div className={styles.detailHeader}>
                            <div className={styles.detailDot} style={{ background: satColor(selectedInfo) }} />
                            <div>
                                <h3>{selectedInfo.OBJECT_NAME}</h3>
                                <span className={styles.noradId}>NORAD {selectedInfo.NORAD_CAT_ID}</span>
                            </div>
                        </div>

                        {selectedInfo.pos && (
                            <div className={styles.posGrid}>
                                <div className={styles.posItem}>
                                    <span className="statLabel">Latitude</span>
                                    <span className="statValue">{selectedInfo.pos.lat.toFixed(4)}°</span>
                                </div>
                                <div className={styles.posItem}>
                                    <span className="statLabel">Longitude</span>
                                    <span className="statValue">{selectedInfo.pos.lng.toFixed(4)}°</span>
                                </div>
                                <div className={styles.posItem}>
                                    <span className="statLabel">Altitude</span>
                                    <span className="statValue">{selectedInfo.pos.altKm.toFixed(0)} km</span>
                                </div>
                                <div className={styles.posItem}>
                                    <span className="statLabel">Speed</span>
                                    <span className="statValue">{selectedInfo.pos.speed} km/s</span>
                                </div>
                            </div>
                        )}

                        <div className={styles.orbitInfo}>
                            <h4>Orbital Description</h4>
                            <div className={styles.orbitItems}>
                                <div className={styles.orbitItem}>
                                    <span className={styles.orbitLabel}>Type</span>
                                    <span>{selectedInfo.orbit.altDesc}</span>
                                </div>
                                <div className={styles.orbitItem}>
                                    <span className={styles.orbitLabel}>📐 Inclination</span>
                                    <span>{selectedInfo.orbit.incDesc}</span>
                                </div>
                                <div className={styles.orbitItem}>
                                    <span className={styles.orbitLabel}>⭕ Shape</span>
                                    <span>{selectedInfo.orbit.eccDesc}</span>
                                </div>
                                <div className={styles.orbitItem}>
                                    <span className={styles.orbitLabel}>⏱️ Period</span>
                                    <span>Orbits Earth every ~{selectedInfo.orbit.period} min</span>
                                </div>
                                <div className={styles.orbitItem}>
                                    <span className={styles.orbitLabel}>📡 Altitude</span>
                                    <span>~{selectedInfo.orbit.altApprox} km above Earth</span>
                                </div>
                                <div className={styles.orbitItem}>
                                    <span className={styles.orbitLabel}>🔄 Revolutions</span>
                                    <span>{selectedInfo.MEAN_MOTION.toFixed(2)} orbits/day</span>
                                </div>
                            </div>
                        </div>

                        {selectedInfo.BSTAR !== undefined && (
                            <div className={styles.orbitInfo}>
                                <h4>Drag & Decay</h4>
                                <p className={styles.dragDesc}>
                                    B* drag term: {selectedInfo.BSTAR.toExponential(4)}.{' '}
                                    {Math.abs(selectedInfo.BSTAR) < 0.0001
                                        ? 'Very low drag — stable orbit with minimal decay.'
                                        : Math.abs(selectedInfo.BSTAR) < 0.001
                                            ? 'Moderate drag — will slowly lose altitude over months/years.'
                                            : 'High drag — orbit is decaying. May re-enter in weeks/months.'}
                                </p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className={styles.satList}>
                        <h4 className={styles.listTitle}>
                            Tracked Satellites
                            <span className={styles.listCount}>{Object.keys(positions).length} live</span>
                        </h4>
                        <div className={styles.listItems}>
                            {satellites.map(sat => {
                                const pos = positions[sat.NORAD_CAT_ID];
                                return (
                                    <button
                                        key={sat.NORAD_CAT_ID}
                                        className={styles.satItem}
                                        onClick={() => {
                                            setSelected(sat);
                                            if (pos && mapInstanceRef.current) {
                                                mapInstanceRef.current.setView([pos.lat, pos.lng], 4, { animate: true });
                                            }
                                        }}
                                    >
                                        <div className={styles.satItemDot} style={{ background: satColor(sat) }} />
                                        <div className={styles.satItemInfo}>
                                            <span className={styles.satItemName}>{sat.OBJECT_NAME}</span>
                                            <span className={styles.satItemMeta}>
                                                {pos
                                                    ? `${pos.altKm.toFixed(0)} km • ${pos.speed} km/s`
                                                    : 'Propagating...'}
                                            </span>
                                        </div>
                                        <span className={styles.satItemArrow}>→</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// ===== HELPERS =====

// Build TLE Line 1 from JSON GP data
function buildTleLine1(sat) {
    const catId = String(sat.NORAD_CAT_ID).padStart(5, '0');
    const cls = sat.CLASSIFICATION_TYPE || 'U';
    const intlDes = (sat.OBJECT_ID || '00001A').replace(/-/, '').padEnd(8);
    const epoch = epochToTle(sat.EPOCH);
    const mmDot = formatTleFloat(sat.MEAN_MOTION_DOT || 0, 10);
    const mmDDot = formatTleExp(sat.MEAN_MOTION_DDOT || 0);
    const bstar = formatTleExp(sat.BSTAR || 0);
    const ephType = sat.EPHEMERIS_TYPE || 0;
    const elSet = String(sat.ELEMENT_SET_NO || 999).padStart(4);

    const raw = `1 ${catId}${cls} ${intlDes} ${epoch} ${mmDot} ${mmDDot} ${bstar} ${ephType}${elSet}`;
    return raw.padEnd(68) + checksumTle(raw.padEnd(68));
}

// Build TLE Line 2 from JSON GP data
function buildTleLine2(sat) {
    const catId = String(sat.NORAD_CAT_ID).padStart(5, '0');
    const inc = sat.INCLINATION.toFixed(4).padStart(8);
    const raan = sat.RA_OF_ASC_NODE.toFixed(4).padStart(8);
    const ecc = sat.ECCENTRICITY.toFixed(7).replace('0.', '').padStart(7, '0');
    const argP = sat.ARG_OF_PERICENTER.toFixed(4).padStart(8);
    const ma = sat.MEAN_ANOMALY.toFixed(4).padStart(8);
    const mm = sat.MEAN_MOTION.toFixed(8).padStart(11);
    const rev = String(sat.REV_AT_EPOCH || 0).padStart(5);

    const raw = `2 ${catId} ${inc} ${raan} ${ecc} ${argP} ${ma} ${mm}${rev}`;
    return raw.padEnd(68) + checksumTle(raw.padEnd(68));
}

function epochToTle(epochStr) {
    const d = new Date(epochStr);
    const year = d.getUTCFullYear() % 100;
    const start = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const dayOfYear = (d - start) / 86400000 + 1;
    return `${String(year).padStart(2, '0')}${dayOfYear.toFixed(8).padStart(12)}`;
}

function formatTleFloat(val, width) {
    if (val === 0) return ' .00000000';
    return val.toFixed(8).padStart(width);
}

function formatTleExp(val) {
    if (val === 0) return ' 00000-0';
    const s = val.toExponential(4);
    const [m, e] = s.split('e');
    const mantissa = m.replace('.', '').replace('-', '');
    const sign = val < 0 ? '-' : ' ';
    const eSign = parseInt(e) >= 0 ? '+' : '-';
    return `${sign}${mantissa.slice(0, 5)}${eSign}${Math.abs(parseInt(e))}`;
}

function checksumTle(line) {
    let sum = 0;
    for (let i = 0; i < 68; i++) {
        const c = line[i];
        if (c >= '0' && c <= '9') sum += parseInt(c);
        else if (c === '-') sum += 1;
    }
    return String(sum % 10);
}

// Split polyline at antimeridian crossings
function splitAtAntimeridian(points) {
    if (points.length < 2) return [points];
    const segments = [[]];
    segments[0].push(points[0]);
    for (let i = 1; i < points.length; i++) {
        const prev = points[i - 1][1];
        const curr = points[i][1];
        if (Math.abs(curr - prev) > 180) {
            segments.push([]);
        }
        segments[segments.length - 1].push(points[i]);
    }
    return segments.filter(s => s.length > 1);
}
