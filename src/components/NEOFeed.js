'use client';
import { useState, useEffect } from 'react';
import styles from './NEOFeed.module.css';

export default function NEOFeed() {
    const [neos, setNeos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/neo')
            .then(r => r.json())
            .then(data => {
                if (data.near_earth_objects) {
                    const today = Object.keys(data.near_earth_objects)[0];
                    const objects = data.near_earth_objects[today] || [];
                    setNeos(objects.slice(0, 15));
                }
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <div className="loader"><div className="loaderDot" /><div className="loaderDot" /><div className="loaderDot" /></div>;
    }

    if (neos.length === 0) {
        return <div className="emptyState"><div className="emptyIcon">☄️</div><p>No near-Earth objects data available right now.</p></div>;
    }

    return (
        <div className={styles.tableWrapper}>
            <table className="dataTable">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Size (m)</th>
                        <th>Velocity (km/h)</th>
                        <th>Miss Distance</th>
                        <th>Hazardous</th>
                    </tr>
                </thead>
                <tbody>
                    {neos.map(neo => {
                        const approach = neo.close_approach_data?.[0];
                        const minSize = neo.estimated_diameter?.meters?.estimated_diameter_min?.toFixed(0);
                        const maxSize = neo.estimated_diameter?.meters?.estimated_diameter_max?.toFixed(0);
                        return (
                            <tr key={neo.id}>
                                <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{neo.name.replace(/[()]/g, '')}</td>
                                <td>{minSize}–{maxSize}</td>
                                <td>{parseFloat(approach?.relative_velocity?.kilometers_per_hour || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                                <td>{parseFloat(approach?.miss_distance?.kilometers || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })} km</td>
                                <td>
                                    <span className={`badge ${neo.is_potentially_hazardous_asteroid ? 'badgeDanger' : 'badgeLive'}`}>
                                        {neo.is_potentially_hazardous_asteroid ? 'Yes' : 'No'}
                                    </span>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
