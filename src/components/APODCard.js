'use client';
import { useState, useEffect } from 'react';
import styles from './APODCard.module.css';
import { useUser } from '@/context/UserContext';

export default function APODCard() {
    const [apod, setApod] = useState(null);
    const [expanded, setExpanded] = useState(false);
    const { toggleFavorite, isFavorite } = useUser();

    useEffect(() => {
        fetch('/api/apod')
            .then(r => r.json())
            .then(setApod)
            .catch(() => { });
    }, []);

    if (!apod) {
        return <div className="loader"><div className="loaderDot" /><div className="loaderDot" /><div className="loaderDot" /></div>;
    }

    const favItem = {
        id: `apod-${apod.date}`,
        type: 'apod',
        title: apod.title,
        image: apod.url,
    };

    return (
        <div className={styles.apod}>
            <div className={styles.imageWrap}>
                {apod.media_type === 'video' ? (
                    <iframe src={apod.url} title={apod.title} className={styles.video} allowFullScreen />
                ) : (
                    <img src={apod.hdurl || apod.url} alt={apod.title} className={styles.image} />
                )}
                <button
                    className={`${styles.favBtn} ${isFavorite(favItem.id) ? styles.favActive : ''}`}
                    onClick={() => toggleFavorite(favItem)}
                    title={isFavorite(favItem.id) ? 'Remove from favorites' : 'Save to favorites'}
                >
                    {isFavorite(favItem.id) ? '★' : '☆'}
                </button>
            </div>
            <div className={styles.content}>
                <span className="badge badgeInfo">📸 APOD · {apod.date}</span>
                <h3 className={styles.title}>{apod.title}</h3>
                {apod.copyright && <p className={styles.copyright}>© {apod.copyright}</p>}
                <p className={styles.explanation}>
                    {expanded ? apod.explanation : (apod.explanation?.slice(0, 250) + '…')}
                </p>
                {apod.explanation?.length > 250 && (
                    <button className={styles.readMore} onClick={() => setExpanded(!expanded)}>
                        {expanded ? 'Show less' : 'Read more'}
                    </button>
                )}
            </div>
        </div>
    );
}
