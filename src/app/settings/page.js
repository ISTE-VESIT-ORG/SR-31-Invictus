'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useUser } from '@/context/UserContext';
import styles from './page.module.css';

const NotificationPanel = dynamic(() => import('@/components/NotificationPanel'), { ssr: false });

export default function SettingsPage() {
    const { location, units, favorites, setLocation, setUnits, clearFavorites, resetPrefs } = useUser();
    const [cityInput, setCityInput] = useState('');
    const [locating, setLocating] = useState(false);

    const handleGeolocate = () => {
        if (!navigator.geolocation) return alert('Geolocation not supported');
        setLocating(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setLocation({
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                    city: 'Current Location',
                });
                setLocating(false);
            },
            () => {
                alert('Unable to get location');
                setLocating(false);
            }
        );
    };

    const handleManualLocation = () => {
        if (!cityInput.trim()) return;
        // Simple geocoding via free API
        fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityInput)}&count=1`)
            .then(r => r.json())
            .then(data => {
                if (data.results?.[0]) {
                    const r = data.results[0];
                    setLocation({ lat: r.latitude, lng: r.longitude, city: r.name });
                    setCityInput('');
                } else {
                    alert('City not found');
                }
            })
            .catch(() => alert('Failed to search'));
    };

    return (
        <div className="pageContainer">
            <div className="pageHeader">
                <h1 className="sectionTitle">Settings</h1>
                <p className="sectionSubtitle">Personalize your Celestia experience.</p>
            </div>

            <div className={styles.sections}>
                {/* Location */}
                <section className={`${styles.settingsSection} card`}>
                    <h3>📍 Your Location</h3>
                    <p className={styles.settingsDesc}>Used for ISS pass predictions, aurora visibility, and planet visibility.</p>
                    {location ? (
                        <div className={styles.currentLocation}>
                            <span className="badge badgeLive">{location.city || 'Custom Location'}</span>
                            <span className={styles.coords}>{location.lat.toFixed(2)}°, {location.lng.toFixed(2)}°</span>
                        </div>
                    ) : (
                        <p className={styles.noData}>No location set</p>
                    )}
                    <div className={styles.locationControls}>
                        <button className="btn btnPrimary" onClick={handleGeolocate} disabled={locating}>
                            {locating ? 'Locating…' : '📍 Use My Location'}
                        </button>
                        <div className={styles.manualInput}>
                            <input
                                className="input"
                                placeholder="Enter city name…"
                                value={cityInput}
                                onChange={e => setCityInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleManualLocation()}
                            />
                            <button className="btn btnGlass" onClick={handleManualLocation}>Search</button>
                        </div>
                    </div>
                </section>

                {/* Notifications */}
                <section className={`${styles.settingsSection} card`}>
                    <h3>🔔 Push Notifications</h3>
                    <p className={styles.settingsDesc}>
                        Get alerted about upcoming meteor showers, eclipses, planet alignments, and more.
                    </p>
                    <NotificationPanel />
                </section>

                {/* Units */}
                <section className={`${styles.settingsSection} card`}>
                    <h3>📏 Units</h3>
                    <div className="tabList" style={{ width: 'fit-content' }}>
                        <button className={`tab ${units === 'metric' ? 'tabActive' : ''}`} onClick={() => setUnits('metric')}>Metric (km, °C)</button>
                        <button className={`tab ${units === 'imperial' ? 'tabActive' : ''}`} onClick={() => setUnits('imperial')}>Imperial (mi, °F)</button>
                    </div>
                </section>

                {/* Data */}
                <section className={`${styles.settingsSection} card`}>
                    <h3>💾 Data</h3>
                    <p className={styles.settingsDesc}>You have {favorites.length} saved favorite{favorites.length !== 1 ? 's' : ''}.</p>
                    <div className={styles.dangerZone}>
                        <button className={`btn ${styles.dangerBtn}`} onClick={clearFavorites}>
                            Clear All Favorites
                        </button>
                        <button className={`btn ${styles.dangerBtn}`} onClick={resetPrefs}>
                            Reset All Settings
                        </button>
                    </div>
                </section>

                {/* About */}
                <section className={`${styles.settingsSection} card`}>
                    <h3>ℹ️ About Celestia</h3>
                    <p className={styles.settingsDesc}>
                        Celestia is a unified space exploration platform combining real-time satellite tracking,
                        Earth observation, space weather monitoring, mission archives, and interactive astronomy education.
                    </p>
                    <div className={styles.credits}>
                        <p>Data sources: NASA, NOAA SWPC, Open Notify</p>
                        <p>Built with Next.js, React-Leaflet, Framer Motion</p>
                    </div>
                </section>
            </div>
        </div>
    );
}
