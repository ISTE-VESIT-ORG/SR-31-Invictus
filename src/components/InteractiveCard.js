'use client';
import { useState } from 'react';
import styles from './InteractiveCard.module.css';
import InfoTooltip from './InfoTooltip';

export default function InteractiveCard({ 
    title, 
    description, 
    content,
    terms = [],
    highlights = []
}) {
    const [expandedTerm, setExpandedTerm] = useState(null);

    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <h3>{title}</h3>
                <div className={styles.helpZone}>
                    <InfoTooltip
                        term={title}
                        explanation={description}
                        icon="?"
                    />
                </div>
            </div>

            <div className={styles.body}>
                {content}
            </div>

            {terms.length > 0 && (
                <div className={styles.glossary}>
                    <h4>Key Terms</h4>
                    <div className={styles.termsList}>
                        {terms.map((term) => (
                            <div key={term.id} className={styles.termItem}>
                                <InfoTooltip
                                    term={term.name}
                                    explanation={term.explanation}
                                    funFact={term.funFact}
                                    icon="📖"
                                />
                                <span className={styles.termName}>{term.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
