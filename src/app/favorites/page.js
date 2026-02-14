'use client';
import { useUser } from '@/context/UserContext';
import styles from './page.module.css';

export default function FavoritesPage() {
    const { favorites, toggleFavorite } = useUser();

    const grouped = {
        apod: favorites.filter(f => f.type === 'apod'),
        mars: favorites.filter(f => f.type === 'mars'),
        mission: favorites.filter(f => f.type === 'mission'),
        other: favorites.filter(f => !['apod', 'mars', 'mission'].includes(f.type)),
    };

    const totalCount = favorites.length;

    return (
        <div className="pageContainer">
            <div className="pageHeader">
                <h1 className="sectionTitle">Favorites</h1>
                <p className="sectionSubtitle">
                    {totalCount > 0 ? `${totalCount} saved item${totalCount !== 1 ? 's' : ''} across your space exploration.` : 'Save items from any module to build your personal collection.'}
                </p>
            </div>

            {totalCount === 0 ? (
                <div className="emptyState">
                    <div className="emptyIcon"></div>
                    <p>No favorites yet. Click the star icon on any APOD image, rover photo, or mission to save it here.</p>
                </div>
            ) : (
                <div className={styles.sections}>
                    {grouped.apod.length > 0 && (
                        <section>
                            <h2 className={styles.groupTitle}>Astronomy Pictures</h2>
                            <div className={styles.grid}>
                                {grouped.apod.map(item => (
                                    <div key={item.id} className={`${styles.favCard} card`}>
                                        {item.image && <img src={item.image} alt={item.title} className={styles.favImage} />}
                                        <div className={styles.favInfo}>
                                            <h4>{item.title}</h4>
                                            <button className={styles.removeBtn} onClick={() => toggleFavorite(item)}>Remove</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {grouped.mars.length > 0 && (
                        <section>
                            <h2 className={styles.groupTitle}>Mars Rover Photos</h2>
                            <div className={styles.grid}>
                                {grouped.mars.map(item => (
                                    <div key={item.id} className={`${styles.favCard} card`}>
                                        {item.image && <img src={item.image} alt={item.title} className={styles.favImage} />}
                                        <div className={styles.favInfo}>
                                            <h4>{item.title}</h4>
                                            <button className={styles.removeBtn} onClick={() => toggleFavorite(item)}>Remove</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {grouped.mission.length > 0 && (
                        <section>
                            <h2 className={styles.groupTitle}>Missions</h2>
                            <div className={styles.grid}>
                                {grouped.mission.map(item => (
                                    <div key={item.id} className={`${styles.favCard} card`}>
                                        <div className={styles.favInfo}>
                                            <h4>{item.title}</h4>
                                            <button className={styles.removeBtn} onClick={() => toggleFavorite(item)}>Remove</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            )}
        </div>
    );
}
