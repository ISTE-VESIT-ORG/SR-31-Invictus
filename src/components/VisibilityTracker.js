import { useState, useEffect } from 'react';
import styles from './VisibilityTracker.module.css';

export default function VisibilityTracker() {
    const [loading, setLoading] = useState(false);
    const [visibilityData, setVisibilityData] = useState(null);
    const [events, setEvents] = useState([]);
    const [error, setError] = useState(null);

    // Fetch location and visibility
    const checkVisibility = () => {
        setLoading(true);
        setError(null);

        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser");
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;

                    // Call ML API
                    const res = await fetch('/api/ml/visibility', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            lat: latitude,
                            lon: longitude,
                            city: "Unknown" // Could use a geocoding API here or let backend handle it
                        }),
                    });

                    if (!res.ok) throw new Error('Failed to predict visibility');

                    const data = await res.json();
                    setVisibilityData(data);

                    // Also fetch events
                    const eventsRes = await fetch('/api/ml/events');
                    if (eventsRes.ok) {
                        const eventsData = await eventsRes.json();
                        setEvents(eventsData);
                    }

                } catch (err) {
                    setError("Could not calculate visibility. Check if the ML server is running.");
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            },
            (err) => {
                setError("Location access denied. Cannot calculate local visibility.");
                setLoading(false);
            }
        );
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <h2>🔭 Stargazing Forecast</h2>
                    <p>Use AI to check if tonight is good for observing!</p>
                </div>

                {!visibilityData && !loading && (
                    <div className={styles.actionArea}>
                        <button className={styles.checkBtn} onClick={checkVisibility}>
                            Check My Visibility
                        </button>
                    </div>
                )}

                {loading && (
                    <div className={styles.loading}>
                        <div className={styles.spinner}></div>
                        <p>Analyzing atmosphere & light pollution...</p>
                    </div>
                )}

                {error && <div className={styles.error}>{error}</div>}

                {visibilityData && (
                    <div className={styles.results}>
                        <div className={`${styles.score} ${styles[visibilityData.visibility_level.toLowerCase()]}`}>
                            <span className={styles.scoreLabel}>VISIBILITY</span>
                            <span className={styles.scoreValue}>{visibilityData.visibility_level}</span>
                        </div>

                        <div className={styles.stats}>
                            <div className={styles.statItem}>
                                <span className={styles.statLabel}>☁️ Cloud Cover</span>
                                <span>{visibilityData.features_used.cloud_cover}%</span>
                            </div>
                            <div className={styles.statItem}>
                                <span className={styles.statLabel}>🌑 Moon Phase</span>
                                <span>{visibilityData.features_used.moon_phase}%</span>
                            </div>
                            <div className={styles.statItem}>
                                <span className={styles.statLabel}>💡 Light Pollution</span>
                                <span>Level {visibilityData.features_used.light_pollution}</span>
                            </div>
                        </div>

                        {/* TODAY'S EVENTS LIST */}
                        {events.length > 0 && (
                            <div className={styles.eventsSection}>
                                <h3>Tonight's Highlights</h3>
                                <div className={styles.eventsList}>
                                    {events.map((ev, i) => (
                                        <div key={i} className={styles.eventItem}>
                                            <div className={styles.eventHeader}>
                                                <strong>{ev.event}</strong>
                                                <span className={`${styles.badge} ${ev.visibility === 'High' ? styles.high : styles.medium}`}>
                                                    {ev.visibility} Visibility
                                                </span>
                                            </div>
                                            <p>{ev.explanation.simple_explanation}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        <button className={styles.refreshBtn} onClick={checkVisibility}>
                            🔄 Check Again
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
