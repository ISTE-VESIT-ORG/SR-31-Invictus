'use client';
import { useState } from 'react';
import { MISSIONS_DATA } from '@/data/missions';
import styles from './MissionBento.module.css';

export default function MissionBento() {
    return (
        <div className={styles.gridContainer}>
            {MISSIONS_DATA.map((mission) => (
                <div
                    key={mission.id}
                    className={`${styles.card} ${styles[mission.size]}`}
                    style={{ backgroundImage: `url(${mission.image})` }}
                >
                    <div className={styles.overlay}>
                        <div className={styles.content}>
                            <div className={styles.header}>
                                <span className={styles.year}>{mission.year}</span>
                                <span className={styles.agency}>{mission.agency}</span>
                            </div>
                            <h3 className={styles.title}>{mission.name}</h3>
                            <p className={styles.desc}>{mission.desc}</p>
                            <div className={styles.details}>
                                <div className={styles.divider} />
                                <p>{mission.details}</p>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
