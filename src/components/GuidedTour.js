'use client';
import { useState, useEffect } from 'react';
import styles from './GuidedTour.module.css';

export default function GuidedTour({ steps, isActive = false }) {
    const [currentStep, setCurrentStep] = useState(0);
    const [showTour, setShowTour] = useState(isActive);

    if (!showTour || !steps || steps.length === 0) {
        return null;
    }

    const step = steps[currentStep];

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            setShowTour(false);
            setCurrentStep(0);
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSkip = () => {
        setShowTour(false);
        setCurrentStep(0);
    };

    return (
        <>
            {showTour && (
                <div className={styles.overlay} onClick={handleSkip}>
                    {step.highlightElement && (
                        <div
                            className={styles.highlight}
                            style={{
                                top: step.top || 'auto',
                                left: step.left || 'auto',
                                width: step.width || 'auto',
                                height: step.height || 'auto',
                            }}
                        />
                    )}
                </div>
            )}

            {showTour && (
                <div
                    className={styles.tooltip}
                    style={{
                        top: step.tooltipTop || '50%',
                        left: step.tooltipLeft || '50%',
                    }}
                >
                    <div className={styles.content}>
                        <h3>{step.title}</h3>
                        <p>{step.description}</p>

                        {step.funFact && (
                            <div className={styles.funFact}>
                                <span className={styles.icon}>✨</span>
                                <span>{step.funFact}</span>
                            </div>
                        )}

                        <div className={styles.arrows}>
                            {step.arrows && step.arrows.map((arrow, idx) => (
                                <div
                                    key={idx}
                                    className={styles.arrow}
                                    style={{
                                        top: arrow.top,
                                        left: arrow.left,
                                        transform: arrow.direction,
                                    }}
                                >
                                    →
                                </div>
                            ))}
                        </div>

                        <div className={styles.controls}>
                            <button
                                className={styles.btn}
                                onClick={handlePrev}
                                disabled={currentStep === 0}
                            >
                                ← Back
                            </button>
                            <span className={styles.progress}>
                                {currentStep + 1} / {steps.length}
                            </span>
                            <button className={styles.btn} onClick={handleNext}>
                                {currentStep === steps.length - 1 ? 'Done ✓' : 'Next →'}
                            </button>
                        </div>

                        <button className={styles.skipBtn} onClick={handleSkip}>
                            Skip Tour
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
