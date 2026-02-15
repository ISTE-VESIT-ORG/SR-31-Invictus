'use client';
import { useState, useEffect, useCallback } from 'react';
import styles from './ClimatePanel.module.css';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTH_KEYS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

const PARAM_INFO = {
    T2M: { label: 'Temperature', unit: '°C', icon: '', desc: 'Air temperature at 2 meters above ground' },
    T2M_MAX: { label: 'Max Temp', unit: '°C', icon: '', desc: 'Daily maximum temperature' },
    T2M_MIN: { label: 'Min Temp', unit: '°C', icon: '', desc: 'Daily minimum temperature' },
    PRECTOTCORR: { label: 'Precipitation', unit: 'mm/day', icon: '', desc: 'Total precipitation (rain + snow)' },
    RH2M: { label: 'Humidity', unit: '%', icon: '', desc: 'Relative humidity at 2 meters' },
    WS2M: { label: 'Wind Speed', unit: 'm/s', icon: '', desc: 'Wind speed at 2 meters' },
    ALLSKY_SFC_SW_DWN: { label: 'Solar Radiation', unit: 'kWh/m²/d', icon: '', desc: 'Downward shortwave solar radiation reaching the surface' },
    CLOUD_AMT: { label: 'Cloud Cover', unit: '%', icon: '', desc: 'Total cloud coverage' },
};

const CITIES = [
    { name: 'Mumbai', lat: 19.076, lng: 72.8777 },
    { name: 'New York', lat: 40.7128, lng: -74.006 },
    { name: 'London', lat: 51.5074, lng: -0.1278 },
    { name: 'Tokyo', lat: 35.6762, lng: 139.6503 },
    { name: 'Sydney', lat: -33.8688, lng: 151.2093 },
    { name: 'Cairo', lat: 30.0444, lng: 31.2357 },
    { name: 'São Paulo', lat: -23.5505, lng: -46.6333 },
    { name: 'Nairobi', lat: -1.2921, lng: 36.8219 },
];

export default function ClimatePanel() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [lat, setLat] = useState('28.6139');
    const [lng, setLng] = useState('77.2090');
    const [locationName, setLocationName] = useState('New Delhi');
    const [error, setError] = useState(null);

    const fetchClimate = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`/api/climate?lat=${lat}&lng=${lng}&mode=climate`);
            const json = await res.json();
            if (json.error) throw new Error(json.error);
            setData(json);
        } catch (e) {
            setError(e.message);
        }
        setLoading(false);
    }, [lat, lng]);

    useEffect(() => { fetchClimate(); }, []);

    const selectCity = (city) => {
        setLat(city.lat.toString());
        setLng(city.lng.toString());
        setLocationName(city.name);
    };

    return (
        <div className={styles.wrapper}>
            {/* Location selector */}
            <div className={styles.locationBar}>
                <div className={styles.inputRow}>
                    <div className={styles.inputGroup}>
                        <label>Latitude</label>
                        <input type="text" className="input" value={lat} onChange={e => setLat(e.target.value)} />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Longitude</label>
                        <input type="text" className="input" value={lng} onChange={e => setLng(e.target.value)} />
                    </div>
                    <button className="btnPrimary" onClick={fetchClimate} disabled={loading}>
                        {loading ? 'Loading...' : 'Fetch Data'}
                    </button>
                </div>
                <div className={styles.quickCities}>
                    {CITIES.map(c => (
                        <button key={c.name} className={`tab ${locationName === c.name ? 'tabActive' : ''}`}
                            onClick={() => selectCity(c)}>
                            {c.name}
                        </button>
                    ))}
                </div>
            </div>

            {loading && (
                <div className={styles.loadingMsg}>
                    <div className="loader"><div className="loaderDot" /><div className="loaderDot" /><div className="loaderDot" /></div>
                    <p>Fetching climate data from NASA POWER...</p>
                </div>
            )}

            {error && <div className={styles.errorMsg}>{error}</div>}

            {data && !loading && (
                <>
                    <h4 className={styles.dataTitle}>
                        📍 Climate Data for {locationName || `${data.location.lat}°, ${data.location.lng}°`} <span style={{ fontSize: '0.7em', color: 'var(--text-muted)', fontWeight: '400' }}>(NASA POWER Daily Averages)</span>
                    </h4>

                    {/* Current Conditions (from daily data, last values) */}
                    {data.daily && (
                        <div className={styles.currentGrid}>
                            {Object.entries(data.daily).map(([key, val]) => {
                                const info = PARAM_INFO[key];
                                if (!info) return null;
                                return (
                                    <div key={key} className={`${styles.currentCard} card`}>
                                        <div className={styles.currentHeader}>
                                            <span className={styles.currentIcon}>{info.icon}</span>
                                            <span className="statLabel">{info.label}</span>
                                        </div>
                                        <span className="statValue">
                                            {val.current !== undefined ? val.current.toFixed(1) : '—'} <small>{info.unit}</small>
                                        </span>
                                        <div className={styles.currentRange}>
                                            <span>Low: {val.min.toFixed(1)}</span>
                                            <span>Avg: {val.avg.toFixed(1)}</span>
                                            <span>High: {val.max.toFixed(1)}</span>
                                        </div>
                                        {/* Sparkline */}
                                        {val.trend && val.trend.length > 1 && (
                                            <div className={styles.sparkline}>
                                                <Sparkline data={val.trend} color={
                                                    key === 'T2M' || key === 'T2M_MAX' ? '#EF4444' :
                                                        key === 'PRECTOTCORR' ? '#3B82F6' :
                                                            key === 'ALLSKY_SFC_SW_DWN' ? '#FBBF24' : '#8B5CF6'
                                                } />
                                            </div>
                                        )}
                                        <span className={styles.currentDesc}>{info.desc}</span>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Monthly Climatology — last 12 months from current */}
                    {data.climatology && (() => {
                        const now = new Date();
                        const currentMonthIdx = now.getMonth(); // 0-based
                        // Build trailing 12 months: from (currentMonth - 11) to currentMonth
                        const trailingMonths = [];
                        for (let i = 11; i >= 0; i--) {
                            const mIdx = (currentMonthIdx - i + 12) % 12;
                            const year = (currentMonthIdx - i < 0) ? now.getFullYear() - 1 : now.getFullYear();
                            trailingMonths.push({
                                key: MONTH_KEYS[mIdx],
                                label: `${MONTH_NAMES[mIdx]} ${String(year).slice(2)}`,
                                isCurrent: i === 0,
                            });
                        }

                        return (
                            <div className={styles.climatologySection}>
                                <h4>📅 Monthly Averages (Last 12 Months)</h4>
                                <div className={styles.climTableWrap}>
                                    <table className={styles.climTable}>
                                        <thead>
                                            <tr>
                                                <th>Parameter</th>
                                                {trailingMonths.map(m => (
                                                    <th key={m.label} style={m.isCurrent ? { color: 'var(--accent-cyan)', borderBottom: '2px solid var(--accent-cyan)' } : {}}>
                                                        {m.label}
                                                    </th>
                                                ))}
                                                <th>Annual</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Object.entries(data.climatology).map(([key, months]) => {
                                                const info = PARAM_INFO[key];
                                                if (!info || !months) return null;
                                                const values = trailingMonths.map(m => {
                                                    const v = months[m.key];
                                                    return v !== undefined ? v : -999;
                                                });
                                                const annual = months['ANN'] ?? -999;
                                                const validValues = values.filter(v => v !== undefined && v !== null && v !== -999 && !isNaN(v));
                                                const maxVal = validValues.length > 0 ? Math.max(...validValues) : 0;
                                                const minVal = validValues.length > 0 ? Math.min(...validValues) : 0;
                                                return (
                                                    <tr key={key}>
                                                        <td className={styles.paramCell}>
                                                            {info.icon} {info.label} <span className={styles.unit}>({info.unit})</span>
                                                        </td>
                                                        {values.map((v, i) => {
                                                            const isValid = v !== undefined && v !== null && v !== -999 && !isNaN(v);
                                                            const isCurrent = trailingMonths[i].isCurrent;
                                                            return (
                                                                <td key={i} className={styles.valCell}
                                                                    style={{
                                                                        background: isValid && maxVal !== minVal
                                                                            ? `rgba(76, 159, 255, ${0.1 + (v - minVal) / (maxVal - minVal) * 0.3})`
                                                                            : 'none',
                                                                        fontWeight: isCurrent ? '700' : '400',
                                                                        color: isCurrent ? 'var(--accent-cyan)' : undefined,
                                                                    }}>
                                                                    {isValid ? v.toFixed(1) : '—'}
                                                                </td>
                                                            );
                                                        })}
                                                        <td className={styles.annCell}>
                                                            {annual !== undefined && annual !== null && annual !== -999 && !isNaN(annual) ? annual.toFixed(1) : '—'}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        );
                    })()}
                </>
            )}
        </div>
    );
}

// Simple SVG sparkline
function Sparkline({ data, color = '#4C9FFF', width = 100, height = 24 }) {
    const filtered = data.filter(v => v !== -999);
    if (filtered.length < 2) return null;
    const min = Math.min(...filtered);
    const max = Math.max(...filtered);
    const range = max - min || 1;
    const points = filtered.map((v, i) => {
        const x = (i / (filtered.length - 1)) * width;
        const y = height - ((v - min) / range) * (height - 4) - 2;
        return `${x},${y}`;
    }).join(' ');
    return (
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
            <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
        </svg>
    );
}
