'use client';
import { MISSIONS_DATA } from '@/data/missions';
import styles from './MissionTimeline.module.css';

export default function MissionTimeline({ onSelect }) {
    // Sort by year
    const sortedMissions = [...MISSIONS_DATA].sort((a, b) => parseInt(a.year) - parseInt(b.year));

    return (
        <div className={styles.timeline}>
            <div className={styles.line} />
            {sortedMissions.map((mission, i) => (
                <div key={mission.id} className={styles.item}>
                    <div className={styles.dot} style={{ background: mission.color || '#fff', boxShadow: `0 0 16px ${mission.color}50` }} />
                    <div
                        className={styles.card}
                        onClick={() => onSelect && onSelect(mission)}
                        style={{ cursor: 'pointer' }}
                    >
                        <div className={styles.cardHeader}>
                            <span className={styles.year}>{mission.year}</span>
                        </div>
                        <h3 style={{ color: mission.color || '#fff' }}>{mission.name}</h3>
                        <p className={styles.agency}>{mission.agency}</p>
                        <p className={styles.desc}>{mission.desc}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
