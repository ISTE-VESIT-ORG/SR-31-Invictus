'use client';
import { useState } from 'react';
import styles from './InfoTooltip.module.css';

export default function InfoTooltip({ term, explanation, funFact, icon = 'ℹ️' }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={styles.tooltipContainer}>
            <button
                className={styles.icon}
                onClick={() => setIsOpen(!isOpen)}
                onMouseEnter={() => setIsOpen(true)}
                onMouseLeave={() => setIsOpen(false)}
                title={explanation}
            >
                {icon}
            </button>

            {isOpen && (
                <div className={styles.popup}>
                    <div className={styles.content}>
                        <h4>{term}</h4>
                        <p className={styles.explanation}>{explanation}</p>
                        {funFact && (
                            <div className={styles.funFact}>
                                <span className={styles.funFactIcon}>💡</span>
                                <span>{funFact}</span>
                            </div>
                        )}
                        <button
                            className={styles.closeBtn}
                            onClick={() => setIsOpen(false)}
                        >
                            ✕
                        </button>
                    </div>
                    <div className={styles.arrow}></div>
                </div>
            )}
        </div>
    );
}
