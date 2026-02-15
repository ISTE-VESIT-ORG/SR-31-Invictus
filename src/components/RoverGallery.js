'use client';
import { useState, useEffect } from 'react';
import styles from './RoverGallery.module.css';
import { useUser } from '@/context/UserContext';

const CAMERAS = [
    { value: '', label: 'All Cameras' },
    { value: 'fhaz', label: 'Front Hazard' },
    { value: 'rhaz', label: 'Rear Hazard' },
    { value: 'mast', label: 'Mast Cam' },
    { value: 'chemcam', label: 'ChemCam' },
    { value: 'navcam', label: 'NavCam' },
];

export default function RoverGallery() {
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sol, setSol] = useState(1000);
    const [camera, setCamera] = useState('');
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const { toggleFavorite, isFavorite } = useUser();

    useEffect(() => {
        setLoading(true);
        fetch(`/api/mars?rover=curiosity&sol=${sol}&camera=${camera}`)
            .then(r => r.json())
            .then(data => setPhotos((data.photos || []).slice(0, 24)))
            .catch(() => setPhotos([]))
            .finally(() => setLoading(false));
    }, [sol, camera]);

    return (
        <div className={styles.wrapper}>
            <div className={styles.controls}>
                <div className={styles.controlGroup}>
                    <label className={styles.label}>Sol (Mars Day)</label>
                    <input
                        type="number"
                        className="input"
                        value={sol}
                        onChange={e => setSol(Math.max(1, parseInt(e.target.value) || 1))}
                        min="1"
                        max="4000"
                        style={{ width: '120px' }}
                    />
                </div>
                <div className={styles.controlGroup}>
                    <label className={styles.label}>Camera</label>
                    <div className="tabList">
                        {CAMERAS.map(c => (
                            <button
                                key={c.value}
                                className={`tab ${camera === c.value ? 'tabActive' : ''}`}
                                onClick={() => setCamera(c.value)}
                            >
                                {c.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="loader"><div className="loaderDot" /><div className="loaderDot" /><div className="loaderDot" /></div>
            ) : photos.length === 0 ? (
                <div className="emptyState">
                    <div className="emptyIcon">📷</div>
                    <p>No photos found for Sol {sol}. Try a different sol or camera.</p>
                </div>
            ) : (
                <div className={styles.grid}>
                    {photos.map(photo => {
                        const favId = `mars-${photo.id}`;
                        return (
                            <div key={photo.id} className={styles.photoCard} onClick={() => setSelectedPhoto(photo)}>
                                <img src={photo.img_src} alt={`Mars Sol ${photo.sol}`} loading="lazy" />
                                <div className={styles.photoOverlay}>
                                    <span className={styles.photoCam}>{photo.camera?.full_name}</span>
                                    <button
                                        className={`${styles.photoFav} ${isFavorite(favId) ? styles.photoFavActive : ''}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleFavorite({ id: favId, type: 'mars', title: `Sol ${photo.sol} - ${photo.camera?.name}`, image: photo.img_src });
                                        }}
                                    >
                                        {isFavorite(favId) ? '★' : '☆'}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Lightbox */}
            {selectedPhoto && (
                <div className={styles.lightbox} onClick={() => setSelectedPhoto(null)}>
                    <div className={styles.lightboxContent} onClick={e => e.stopPropagation()}>
                        <button className={styles.lightboxClose} onClick={() => setSelectedPhoto(null)}>✕</button>
                        <img src={selectedPhoto.img_src} alt={`Mars Sol ${selectedPhoto.sol}`} />
                        <div className={styles.lightboxInfo}>
                            <h4>Sol {selectedPhoto.sol} — {selectedPhoto.camera?.full_name}</h4>
                            <p>Rover: {selectedPhoto.rover?.name} · Earth Date: {selectedPhoto.earth_date}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
