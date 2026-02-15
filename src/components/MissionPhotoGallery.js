'use client';
import { useState, useEffect } from 'react';
import styles from './MissionPhotoGallery.module.css';

export default function MissionPhotoGallery({ mission, onBack }) {
    const [idx, setIdx] = useState(0);

    // Reset index when mission changes
    useEffect(() => setIdx(0), [mission]);

    if (!mission) return null;

    const images = mission.gallery || [mission.image];

    const next = () => setIdx((prev) => (prev + 1) % images.length);
    const prev = () => setIdx((prev) => (prev - 1 + images.length) % images.length);

    return (
        <div className={styles.galleryContainer}>
            <div className={styles.header}>
                <div>
                    <h2 className={styles.title}>{mission.name} Gallery</h2>
                    <p className={styles.subtitle}>{mission.year} • {mission.agency}</p>
                </div>
                <button className={styles.backBtn} onClick={onBack}>
                    ← Back to Mars Rover
                </button>
            </div>

            <div className={styles.stage}>
                <div className={styles.mainImageWrapper}>
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
                </div>

                <div className={styles.infoPanel}>
                    <p className={styles.details}>{mission.details || mission.desc}</p>
                    <div className={styles.thumbnails}>
                        {images.map((img, i) => (
                            <div
                                key={i}
                                className={`${styles.thumb} ${i === idx ? styles.activeThumb : ''}`}
                                onClick={() => setIdx(i)}
                            >
                                <img src={img} alt="" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
