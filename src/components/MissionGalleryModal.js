'use client';
import { useState, useEffect } from 'react';
import styles from './MissionGalleryModal.module.css';

export default function MissionGalleryModal({ mission, onClose }) {
    const [idx, setIdx] = useState(0);

    // Reset index when mission changes
    useEffect(() => setIdx(0), [mission]);

    // Handle key press
    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowRight') next();
            if (e.key === 'ArrowLeft') prev();
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [idx]);

    if (!mission) return null;

    const images = mission.gallery || [mission.image];

    const next = () => setIdx((prev) => (prev + 1) % images.length);
    const prev = () => setIdx((prev) => (prev - 1 + images.length) % images.length);

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <button className={styles.closeBtn} onClick={onClose}>&times;</button>

                <div className={styles.imageStage}>
                    <img
                        src={images[idx]}
                        alt={`${mission.name} - Image ${idx + 1}`}
                        className={styles.mainImage}
                    />

                    {images.length > 1 && (
                        <>
                            <button className={`${styles.navBtn} ${styles.prev}`} onClick={prev}>‹</button>
                            <button className={`${styles.navBtn} ${styles.next}`} onClick={next}>›</button>
                        </>
                    )}

                    <div className={styles.dots}>
                        {images.map((_, i) => (
                            <button
                                key={i}
                                className={`${styles.dot} ${i === idx ? styles.activeDot : ''}`}
                                onClick={() => setIdx(i)}
                            />
                        ))}
                    </div>
                </div>

                <div className={styles.content}>
                    <div className={styles.header}>
                        <h2 className={styles.title} style={{ color: mission.color }}>{mission.name}</h2>
                        <span className={styles.year}>{mission.year}</span>
                    </div>
                    <p className={styles.desc}>{mission.details || mission.desc}</p>
                    <div className={styles.meta}>
                        <span className={styles.pill}>{mission.agency}</span>
                        <span className={styles.pill}>{mission.type}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
