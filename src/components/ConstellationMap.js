'use client';
import { useState, useEffect } from 'react';
import styles from './ConstellationMap.module.css';
import { CONSTELLATIONS } from '@/data/cosmos';

export default function ConstellationMap() {
    const [activeId, setActiveId] = useState('orion');
    const [hoveredStar, setHoveredStar] = useState(null);

    const activeConstellation = CONSTELLATIONS.find(c => c.id === activeId);

    return (
        <div className={styles.wrapper}>
            <div className={styles.sidebar}>
                <h3 className={styles.listTitle}>Constellations</h3>
                <div className={styles.list}>
                    {CONSTELLATIONS.map(c => (
                        <button
                            key={c.id}
                            className={`${styles.listItem} ${c.id === activeId ? styles.listItemActive : ''}`}
                            onClick={() => setActiveId(c.id)}
                        >
                            {c.name}
                        </button>
                    ))}
                </div>

                <div className={styles.info}>
                    <h4>{activeConstellation.name}</h4>
                    <p className={styles.meaning}>"{activeConstellation.meaning}"</p>
                    <div className={styles.statRow}>
                        <span>Best Season:</span>
                        <span>{activeConstellation.season}</span>
                    </div>
                </div>
            </div>

            <div className={styles.mapContainer}>
                <svg className={styles.svg} viewBox="0 0 100 100">
                    {/* Connecting Lines */}
                    {activeConstellation.lines.map((line, i) => {
                        const start = activeConstellation.stars.find(s => s.id === line[0]);
                        const end = activeConstellation.stars.find(s => s.id === line[1]);
                        if (!start || !end) return null;
                        return (
                            <line
                                key={i}
                                x1={start.x}
                                y1={start.y}
                                x2={end.x}
                                y2={end.y}
                                className={styles.constellationLine}
                            />
                        );
                    })}

                    {/* Stars */}
                    {activeConstellation.stars.map(star => (
                        <g
                            key={star.id}
                            className={styles.starGroup}
                            onMouseEnter={() => setHoveredStar(star)}
                            onMouseLeave={() => setHoveredStar(null)}
                        >
                            <circle
                                cx={star.x}
                                cy={star.y}
                                r={Math.max(1, 3 - star.mag) * 0.8}
                                fill={star.color || '#fff'}
                                className={styles.star}
                            />
                            {/* Halo effect for brighter stars */}
                            {star.mag < 2 && (
                                <circle
                                    cx={star.x}
                                    cy={star.y}
                                    r={Math.max(1, 3 - star.mag) * 2}
                                    fill={star.color || '#fff'}
                                    className={styles.starHalo}
                                />
                            )}
                        </g>
                    ))}
                </svg>

                {/* Hover Label */}
                {hoveredStar && (
                    <div
                        className={styles.starLabel}
                        style={{
                            left: `${hoveredStar.x}%`,
                            top: `${hoveredStar.y - 5}%`
                        }}
                    >
                        {hoveredStar.name}
                    </div>
                )}
            </div>
        </div>
    );
}
