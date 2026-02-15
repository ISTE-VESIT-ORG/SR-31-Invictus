'use client';
import { useState, useEffect, useCallback } from 'react';
import styles from './AgriPanel.module.css';

const CROPS = {
    wheat: { name: 'Wheat', tempMin: 10, tempMax: 25, waterNeed: 'Moderate', growingDays: '100-130', icon: '' },
    rice: { name: 'Rice', tempMin: 20, tempMax: 35, waterNeed: 'High', growingDays: '120-150', icon: '' },
    corn: { name: 'Corn/Maize', tempMin: 18, tempMax: 32, waterNeed: 'Moderate-High', growingDays: '80-110', icon: '' },
    soybean: { name: 'Soybean', tempMin: 15, tempMax: 30, waterNeed: 'Moderate', growingDays: '80-120', icon: '' },
    cotton: { name: 'Cotton', tempMin: 20, tempMax: 38, waterNeed: 'Moderate', growingDays: '150-180', icon: '' },
    potato: { name: 'Potato', tempMin: 10, tempMax: 24, waterNeed: 'Moderate', growingDays: '80-120', icon: '' },
};

const CITIES = [
    { name: 'Punjab, India', lat: 30.9, lng: 75.85 },
    { name: 'Iowa, USA', lat: 41.87, lng: -93.09 },
    { name: 'Mato Grosso, BR', lat: -12.68, lng: -56.92 },
    { name: 'Punjab, PK', lat: 31.17, lng: 72.7 },
    { name: 'Nile Delta, EG', lat: 31.04, lng: 31.37 },
    { name: 'Hokkaido, JP', lat: 43.06, lng: 141.35 },
];

export default function AgriPanel() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [lat, setLat] = useState('30.9');
    const [lng, setLng] = useState('75.85');
    const [locationName, setLocationName] = useState('Punjab, India');
    const [error, setError] = useState(null);

    const fetchAgri = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`/api/climate?lat=${lat}&lng=${lng}&mode=agri`);
            const json = await res.json();
            if (json.error) throw new Error(json.error);
            setData(json);
        } catch (e) {
            setError(e.message);
        }
        setLoading(false);
    }, [lat, lng]);

    useEffect(() => { fetchAgri(); }, []);

    const selectCity = (city) => {
        setLat(city.lat.toString());
        setLng(city.lng.toString());
        setLocationName(city.name);
    };

    // Compute crop suitability based on climate data
    const computeSuitability = () => {
        if (!data?.daily) return null;
        const avgTemp = data.daily?.T2M?.avg;
        const precip = data.daily?.PRECTOTCORR?.avg;
        const solar = data.daily?.ALLSKY_SFC_SW_DWN?.avg;

        if (avgTemp === undefined) return null;

        return Object.entries(CROPS).map(([key, crop]) => {
            let score = 0;
            let notes = [];

            // Temperature suitability
            if (avgTemp >= crop.tempMin && avgTemp <= crop.tempMax) {
                score += 40;
                notes.push(`Temp ${avgTemp.toFixed(1)}°C is ideal (${crop.tempMin}-${crop.tempMax}°C)`);
            } else if (avgTemp >= crop.tempMin - 5 && avgTemp <= crop.tempMax + 5) {
                score += 20;
                notes.push(`Temp ${avgTemp.toFixed(1)}°C is marginal (ideal: ${crop.tempMin}-${crop.tempMax}°C)`);
            } else {
                notes.push(`Temp ${avgTemp.toFixed(1)}°C is outside range (${crop.tempMin}-${crop.tempMax}°C)`);
            }

            // Precipitation
            if (precip !== undefined) {
                if (crop.waterNeed === 'High' && precip >= 4) {
                    score += 30;
                    notes.push(`Precipitation ${precip.toFixed(1)} mm/day — adequate for high water needs`);
                } else if (crop.waterNeed === 'Moderate' && precip >= 2) {
                    score += 30;
                    notes.push(`Precipitation ${precip.toFixed(1)} mm/day — adequate`);
                } else if (precip >= 1) {
                    score += 15;
                    notes.push(`Precipitation ${precip.toFixed(1)} mm/day — may need irrigation`);
                } else {
                    notes.push(`Very low precipitation — irrigation essential`);
                }
            }

            // Solar
            if (solar !== undefined) {
                if (solar >= 4) {
                    score += 30;
                    notes.push(`Solar radiation ${solar.toFixed(1)} kWh/m²/day — excellent`);
                } else if (solar >= 2.5) {
                    score += 20;
                    notes.push(`Solar radiation ${solar.toFixed(1)} kWh/m²/day — moderate`);
                } else {
                    score += 5;
                    notes.push(`Low solar radiation — may limit growth`);
                }
            }

            return { key, ...crop, score, notes };
        }).sort((a, b) => b.score - a.score);
    };

    const suitability = data ? computeSuitability() : null;

    return (
        <div className={styles.wrapper}>
            {/* Location */}
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
                    <button className="btnPrimary" onClick={fetchAgri} disabled={loading}>
                        {loading ? 'Loading...' : 'Analyze'}
                    </button>
                </div>
                <div className={styles.quickCities}>
                    <span className={styles.quickLabel}>Agricultural regions:</span>
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
                    <p>Analyzing agricultural conditions...</p>
                </div>
            )}

            {error && <div className={styles.errorMsg}>{error}</div>}

            {data && !loading && (
                <>
                    <h4 className={styles.dataTitle}>
                        Agricultural Analysis for {locationName || `${data.location.lat}°, ${data.location.lng}°`}
                    </h4>

                    {/* Key Metrics */}
                    {data.daily && (
                        <div className={styles.metricsGrid}>
                            {data.daily.T2M && (
                                <div className={`${styles.metricCard} card`}>
                                    <span className={styles.metricIcon}></span>
                                    <span className="statLabel">Avg Temperature</span>
                                    <span className="statValue">{data.daily.T2M.avg.toFixed(1)}°C</span>
                                    <span className={styles.metricRange}>{data.daily.T2M_MIN?.avg.toFixed(1)}° — {data.daily.T2M_MAX?.avg.toFixed(1)}°</span>
                                </div>
                            )}
                            {data.daily.PRECTOTCORR && (
                                <div className={`${styles.metricCard} card`}>
                                    <span className={styles.metricIcon}></span>
                                    <span className="statLabel">Avg Precipitation</span>
                                    <span className="statValue">{data.daily.PRECTOTCORR.avg.toFixed(1)} mm/d</span>
                                    <span className={styles.metricRange}>~{(data.daily.PRECTOTCORR.avg * 30).toFixed(0)} mm/month</span>
                                </div>
                            )}
                            {data.daily.ALLSKY_SFC_SW_DWN && (
                                <div className={`${styles.metricCard} card`}>
                                    <span className={styles.metricIcon}></span>
                                    <span className="statLabel">Solar Radiation</span>
                                    <span className="statValue">{data.daily.ALLSKY_SFC_SW_DWN.avg.toFixed(1)} kWh</span>
                                    <span className={styles.metricRange}>per m²/day</span>
                                </div>
                            )}
                            {data.daily.GWETROOT && (
                                <div className={`${styles.metricCard} card`}>
                                    <span className={styles.metricIcon}></span>
                                    <span className="statLabel">Root Zone Moisture</span>
                                    <span className="statValue">{(data.daily.GWETROOT.avg * 100).toFixed(0)}%</span>
                                    <span className={styles.metricRange}>Soil wetness (0-100%)</span>
                                </div>
                            )}
                            {data.daily.T2MDEW && (
                                <div className={`${styles.metricCard} card`}>
                                    <span className={styles.metricIcon}>🌫️</span>
                                    <span className="statLabel">Dew Point</span>
                                    <span className="statValue">{data.daily.T2MDEW.avg.toFixed(1)}°C</span>
                                    <span className={styles.metricRange}>Moisture indicator</span>
                                </div>
                            )}
                            {data.daily.EVPTRNS && (
                                <div className={`${styles.metricCard} card`}>
                                    <span className={styles.metricIcon}>⬆️</span>
                                    <span className="statLabel">Evapotranspiration</span>
                                    <span className="statValue">{data.daily.EVPTRNS.avg.toFixed(1)} mm/d</span>
                                    <span className={styles.metricRange}>Water loss rate</span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Crop Suitability */}
                    {suitability && (
                        <div className={styles.suitabilitySection}>
                            <h4>🌱 Crop Suitability Analysis</h4>
                            <p className={styles.suitDesc}>
                                Based on current 30-day average temperature, precipitation, and solar radiation for this location.
                            </p>
                            <div className={styles.cropGrid}>
                                {suitability.map(crop => (
                                    <div key={crop.key} className={`${styles.cropCard} card`}>
                                        <div className={styles.cropHeader}>
                                            <span className={styles.cropIcon}>{crop.icon}</span>
                                            <div>
                                                <h5>{crop.name}</h5>
                                                <span className={styles.cropMeta}>
                                                    {crop.growingDays} days • {crop.waterNeed} water
                                                </span>
                                            </div>
                                            <div className={styles.scoreWrapper}>
                                                <div className={styles.scoreBar}>
                                                    <div className={styles.scoreFill}
                                                        style={{
                                                            width: `${crop.score}%`,
                                                            background: crop.score >= 70 ? '#06D6A0' : crop.score >= 40 ? '#FBBF24' : '#EF4444'
                                                        }}
                                                    />
                                                </div>
                                                <span className={styles.scoreText}>{crop.score}/100</span>
                                            </div>
                                        </div>
                                        <div className={styles.cropNotes}>
                                            {crop.notes.map((note, i) => (
                                                <span key={i} className={styles.cropNote}>{note}</span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
