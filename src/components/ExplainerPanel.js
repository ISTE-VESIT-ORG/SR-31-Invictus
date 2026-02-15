import { useState } from 'react';
import styles from './ExplainerPanel.module.css';


export default function ExplainerPanel() {
    const [query, setQuery] = useState('');
    const [explanation, setExplanation] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleExplain = async () => {
        if (!query.trim()) return;

        setLoading(true);
        setError(null);
        setExplanation(null);

        try {
            const res = await fetch('/api/ml/explain', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    event_name: query,
                    raw_text: "User asked for an explanation of " + query
                }),
            });

            if (!res.ok) throw new Error('Failed to fetch explanation');

            const data = await res.json();
            setExplanation(data.explanation);
        } catch (err) {
            setError("Oops! Our space AI couldn't explain that right now.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                
                <h3 className={styles.sectionHeader}>Ask the AI Tutor</h3>
            </div>

            <p className={styles.subtitle}>
                Confused about a space term? Type it below and get a simple explanation!
            </p>

            <div className={styles.inputGroup}>
                <input
                    type="text"
                    className={styles.input}
                    placeholder="e.g., Supernova, Dark Matter..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleExplain()}
                />
                <button
                    className={styles.button}
                    onClick={handleExplain}
                    disabled={loading || !query.trim()}
                >
                    {loading ? 'Thinking...' : 'Explain'}
                </button>
            </div>

            {error && <div className={styles.error}>{error}</div>}

            {explanation && (
                <div className={styles.result}>
                    <div className={styles.badge}>{explanation.difficulty}</div>
                    <h4>{explanation.title}</h4>
                    <p className={styles.text}>{explanation.simple_explanation}</p>

                    {explanation.random_facts && (
                        <div className={styles.facts}>
                            <h5>Did you know?</h5>
                            <ul>
                                {explanation.random_facts.map((fact, i) => (
                                    <li key={i}>{fact}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
