'use client';
import { useState, useEffect } from 'react';
import styles from './EPICGallery.module.css';

export default function EPICGallery() {
    const [images, setImages] = useState([]);
    const [active, setActive] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/epic')
            .then(r => r.json())
            .then(data => {
                if (Array.isArray(data) && data.length > 0) {
                    const processed = data.slice(0, 8).map(img => {
                        const date = img.date.split(' ')[0].replace(/-/g, '/');
                        return {
                            ...img,
                            imageUrl: `https://epic.gsfc.nasa.gov/archive/natural/${date}/png/${img.image}.png`,
                        };
                    });
                    setImages(processed);
                }
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <div className="loader"><div className="loaderDot" /><div className="loaderDot" /><div className="loaderDot" /></div>;
    }

    if (images.length === 0) {
        return <div className="emptyState"><div className="emptyIcon"></div><p>No EPIC images available right now.</p></div>;
    }

    const current = images[active];

    return (
        <div className={styles.gallery}>
            <div className={styles.main}>
                <img src={current.imageUrl} alt={current.caption} className={styles.mainImage} />
                <div className={styles.overlay}>
                    <p className={styles.caption}>{current.caption}</p>
                    <p className={styles.date}>{current.date}</p>
                </div>
            </div>
            <div className={styles.thumbs}>
                {images.map((img, i) => (
                    <button
                        key={img.identifier}
                        className={`${styles.thumb} ${i === active ? styles.thumbActive : ''}`}
                        onClick={() => setActive(i)}
                    >
                        <img src={img.imageUrl} alt={`Earth ${i + 1}`} />
                    </button>
                ))}
            </div>
        </div>
    );
}
