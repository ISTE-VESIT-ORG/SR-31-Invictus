'use client';
import { useState, useEffect } from 'react';
import styles from './CharacterGuide.module.css';
import avatarimage from "./../../public/avatarcharacterimage.png";
export default function CharacterGuide({ isActive, messages, onClose }) {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setCurrentMessage(0);
  }, [messages]);

  useEffect(() => {
    if (isActive) {
      // Scroll down to show the popup
      setTimeout(() => {
        window.scrollBy({
          top: 1100,
          behavior: 'smooth'
        });
      }, 100);

      // Add escape key listener
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isActive, onClose]);

  if (!isActive || !messages || messages.length === 0) {
    return null;
  }

  const handleNext = () => {
    if (currentMessage < messages.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentMessage(currentMessage + 1);
        setIsAnimating(false);
      }, 300);
    } else {
      onClose();
    }
  };

  const handleClose = () => {
    onClose();
  };

  const message = messages[currentMessage];
  const isLastMessage = currentMessage === messages.length - 1;

  return (
    <div className={styles.backdrop} onClick={handleClose}>
      <div className={styles.container} onClick={(e) => e.stopPropagation()}>
        {/* Character Avatar */}
        <div className={styles.characterWrapper}>
          <img
            src={avatarimage.src}
            alt="Guide Character"
            className={styles.character}
          />
        </div>

        {/* Message Box */}

        <div
          className={`${styles.messageBox} ${isAnimating ? styles.fadeOut : styles.fadeIn}`}
        >
          <div className={styles.messageContent}>
            <h3 className={styles.title}>{message.title}</h3>
            <p className={styles.text}>{message.text}</p>
            {message.funFact && (
              <div className={styles.funFactBox}>
                <h1>
                  <span className={styles.bulb}>💡</span>
                </h1>
                <p className={styles.funFact}>{message.funFact}</p>
              </div>
            )}
          </div>

          {/* Progress Indicator */}
          <div className={styles.progress}>
            {messages.map((_, index) => (
              <div
                key={index}
                className={`${styles.dot} ${index === currentMessage ? styles.active : ""}`}
              />
            ))}
          </div>

          {/* Buttons */}
          <div className={styles.buttonGroup}>
            <button
              className={`${styles.btn} ${styles.nextBtn}`}
              onClick={handleNext}
            >
              {isLastMessage ? "Close" : "Next"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
