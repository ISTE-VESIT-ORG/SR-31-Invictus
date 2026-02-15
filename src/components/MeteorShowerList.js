'use client';
import styles from './MeteorShowerList.module.css';
import { METEOR_SHOWERS } from '@/data/cosmos';
import InfoTooltip from './InfoTooltip';

export default function MeteorShowerList({ activeShower, onSelect, onCardClick }) {
    const currentMonth = new Date().getMonth();

    const handleCardClick = (shower) => {
        onSelect && onSelect(shower.viewId);
        onCardClick && onCardClick(shower.name);
    };

    return (
        <div className={styles.grid}>
            {METEOR_SHOWERS.map(shower => (
                <div
                    key={shower.id}
                    className={`${styles.card} ${activeShower === shower.viewId ? styles.selected : ''}`}
                    onClick={() => handleCardClick(shower)}
                >
                    <div className={styles.header}>
                        <div className={styles.titleSection}>
                            <h3 className={styles.name}>{shower.name}</h3>
                        </div>
                        <span className={styles.peak}>Peak: {shower.peak}</span>
                    </div>

                    <div className={styles.body}>
                        <p className={styles.kidDesc}>{shower.kidFriendly}</p>
                        <p className={styles.desc}>{shower.desc}</p>

                        {shower.funFact && (
                            <div className={styles.funFactBox}>
                                <p className={styles.funFact}>{shower.funFact}</p>
                            </div>
                        )}

                        <div className={styles.stats}>
                            <div className={styles.stat}>
                                <span className={styles.statLabel}>
                                    Meteors per hour
                                    <InfoTooltip
                                        term="ZHR"
                                        explanation="This is the number of shooting stars you might see in one hour under perfect clear sky conditions."
                                        funFact="ZHR stands for 'Zenith Hourly Rate'!"
                                        icon="?"
                                    />
                                </span>
                                <span className={styles.statValue}>{shower.zhr}</span>
                            </div>
                            <div className={styles.stat}>
                                <span className={styles.statLabel}>
                                    Moon Phase Best
                                    <InfoTooltip
                                        term="Moon Phase"
                                        explanation="A bright moon makes it harder to see shooting stars. The darker the night, the better!"
                                        funFact="Stars are brightest when the moon is not visible or very thin."
                                        icon="?"
                                    />
                                </span>
                                <span className={styles.statValue}>{shower.moon}</span>
                            </div>
                        </div>

                        <div className={styles.timeline}>
                            <span className={styles.activeLabel}>Active Period: {shower.active}</span>
                            <div className={styles.timelineBar}>
                                <div className={styles.timelineProgress} style={{ width: '100%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
