'use client';
import { useState, useEffect } from 'react';
import styles from './SpaceWeatherCards.module.css';

const STORM_SCALE = [
    { level: 'G0', label: 'Quiet', color: '#06D6A0', desc: 'No geomagnetic storm' },
    { level: 'G1', label: 'Minor', color: '#FBBF24', desc: 'Weak power grid fluctuations' },
    { level: 'G2', label: 'Moderate', color: '#FF9F1C', desc: 'High-latitude power systems affected' },
    { level: 'G3', label: 'Strong', color: '#FF6B35', desc: 'Voltage corrections needed' },
    { level: 'G4', label: 'Severe', color: '#FF3333', desc: 'Widespread voltage problems' },
    { level: 'G5', label: 'Extreme', color: '#CC0000', desc: 'Complete grid collapse possible' },
];

function getStormLevel(kp) {
    if (kp >= 9) return 5;
    if (kp >= 8) return 4;
    if (kp >= 7) return 3;
    if (kp >= 6) return 2;
    if (kp >= 5) return 1;
    return 0;
}

export default function SpaceWeatherCards() {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/space-weather')
            .then(r => r.json())
            .then(setWeather)
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <div className="loader"><div className="loaderDot" /><div className="loaderDot" /><div className="loaderDot" /></div>;
    }

    // Parse latest Kp value
    const kpData = weather?.kp;
    const latestKp = kpData && kpData.length > 1 ? parseFloat(kpData[kpData.length - 1]?.[1]) : 0;
    const stormIdx = getStormLevel(latestKp);
    const storm = STORM_SCALE[stormIdx];

    // Parse latest solar wind
    const windData = weather?.solarWind;
    const latestWind = windData && windData.length > 1 ? windData[windData.length - 1] : null;
    const windSpeed = latestWind ? parseFloat(latestWind[1] || 0) : 0;
    const windDensity = latestWind ? parseFloat(latestWind[2] || 0) : 0;
    const windTemp = latestWind ? parseFloat(latestWind[3] || 0) : 0;

    return (
        <div className={styles.wrapper}>
            {/* Storm Scale */}
            <div className={`${styles.stormCard} card`}>
                <div className={styles.stormHeader}>
                    <h3>Geomagnetic Storm Index</h3>
                    <div className={styles.stormLevel} style={{ background: `${storm.color}20`, color: storm.color, borderColor: `${storm.color}40` }}>
                        {storm.level}
                    </div>
                </div>
                <p className={styles.stormLabel} style={{ color: storm.color }}>{storm.label}</p>
                <p className={styles.stormDesc}>{storm.desc}</p>
                <div className={styles.scaleBar}>
                    {STORM_SCALE.map((s, i) => (
                        <div
                            key={s.level}
                            className={`${styles.scaleSegment} ${i <= stormIdx ? styles.scaleActive : ''}`}
                            style={{ background: i <= stormIdx ? s.color : 'var(--bg-tertiary)' }}
                            title={`${s.level} — ${s.label}`}
                        />
                    ))}
                </div>
            </div>

            {/* Stats Cards */}
            <div className={styles.statsGrid}>
                <div className={`${styles.stat} card statCard`}>
                    <span className="statLabel">Kp Index</span>
                    <span className="statValue">{latestKp.toFixed(1)}</span>
                    <span className={styles.statNote}>Planetary K-index</span>
                </div>
                <div className={`${styles.stat} card statCard`}>
                    <span className="statLabel">Solar Wind</span>
                    <span className="statValue">{windSpeed.toFixed(0)} <span className="statUnit">km/s</span></span>
                    <span className={styles.statNote}>Plasma speed</span>
                </div>
                <div className={`${styles.stat} card statCard`}>
                    <span className="statLabel">Wind Density</span>
                    <span className="statValue">{windDensity.toFixed(1)} <span className="statUnit">p/cm³</span></span>
                    <span className={styles.statNote}>Proton density</span>
                </div>
                <div className={`${styles.stat} card statCard`}>
                    <span className="statLabel">Temperature</span>
                    <span className="statValue">{(windTemp / 1000).toFixed(0)}K <span className="statUnit">×10³</span></span>
                    <span className={styles.statNote}>Plasma temperature</span>
                </div>
            </div>

            {/* Recent Kp history */}
            {kpData && kpData.length > 5 && (
                <div className={`${styles.historyCard} card`}>
                    <h3 className={styles.historyTitle}>Recent Kp Index History</h3>
                    <div className={styles.kpBars}>
                        {kpData.slice(-12).filter((_, i) => i > 0).map((entry, i) => {
                            const val = parseFloat(entry[1] || 0);
                            const pct = Math.min((val / 9) * 100, 100);
                            const lvl = getStormLevel(val);
                            return (
                                <div key={i} className={styles.kpBar}>
                                    <div className={styles.kpBarFill} style={{ height: `${pct}%`, background: STORM_SCALE[lvl].color }} />
                                    <span className={styles.kpBarLabel}>{val.toFixed(0)}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
