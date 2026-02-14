'use client';
import { useState, useEffect } from 'react';
import styles from './AuroraMap.module.css';

const HEMISPHERES = {
    NORTH: {
        label: 'Northern Hemisphere',
        url: 'https://services.swpc.noaa.gov/images/animations/ovation/north/latest.jpg',
    },
    SOUTH: {
        label: 'Southern Hemisphere',
        url: 'https://services.swpc.noaa.gov/images/animations/ovation/south/latest.jpg',
    }
};

export default function AuroraMap() {
    const [view, setView] = useState('NORTH');
    const [imageKey, setImageKey] = useState(Date.now()); // Force refresh

    useEffect(() => {
        // Refresh image every 5 minutes
        const interval = setInterval(() => setImageKey(Date.now()), 300000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <div className={styles.titleGroup}>
                    <h3>Aurora Forecast Map</h3>
                    <span className="badge badgeLive"><span className="pulseDot" /> Live NOAA Model</span>
                </div>
                <div className={styles.controls}>
                    <button
                        className={`${styles.tab} ${view === 'NORTH' ? styles.active : ''}`}
                        onClick={() => setView('NORTH')}
                    >
                        North
                    </button>
                    <button
                        className={`${styles.tab} ${view === 'SOUTH' ? styles.active : ''}`}
                        onClick={() => setView('SOUTH')}
                    >
                        South
                    </button>
                </div>
            </div>

            <div className={`${styles.mapCard} card`}>
                <div className={styles.imageContainer}>
                    <img
                        key={`${view}-${imageKey}`}
                        src={`${HEMISPHERES[view].url}?t=${imageKey}`}
                        alt={`Aurora Forecast - ${HEMISPHERES[view].label}`}
                        className={styles.mapImage}
                    />
                    <div className={styles.overlay}>
                        <p className={styles.timestamp}>
                            Latest Model Run • {new Date().toLocaleTimeString()}
                        </p>
                        <p className={styles.credit}>Data: NOAA SWPC Ovation</p>
                    </div>
                </div>
                <div className={styles.legend}>
                    <span className={styles.probability}>Probability of Visible Aurora</span>
                    <div className={styles.gradientBar} />
                    <div className={styles.labels}>
                        <span>0%</span>
                        <span>50%</span>
                        <span>100%</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
