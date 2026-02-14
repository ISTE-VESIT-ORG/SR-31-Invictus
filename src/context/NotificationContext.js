'use client';
import { createContext, useContext, useState, useCallback } from 'react';
import styles from './Toast.module.css';

const NotificationContext = createContext();

export function useNotification() {
    return useContext(NotificationContext);
}

export function NotificationProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const addNotification = useCallback((type, title, message, duration = 5000) => {
        const id = Date.now().toString();
        setToasts(prev => [...prev, { id, type, title, message }]);

        if (duration > 0) {
            setTimeout(() => {
                removeNotification(id);
            }, duration);
        }
    }, []);

    const removeNotification = useCallback((id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    return (
        <NotificationContext.Provider value={{ addNotification, removeNotification }}>
            {children}
            <div className={styles.container}>
                {toasts.map(toast => (
                    <div key={toast.id} className={`${styles.toast} ${styles[toast.type]}`}>
                        <div className={styles.icon}>
                            {toast.type === 'success' && '✅'}
                            {toast.type === 'error' && '❌'}
                            {toast.type === 'info' && 'ℹ️'}
                            {toast.type === 'warning' && '⚠️'}
                        </div>
                        <div className={styles.toastContent}>
                            {toast.title && <div className={styles.toastTitle}>{toast.title}</div>}
                            <div className={styles.toastMessage}>{toast.message}</div>
                        </div>
                        <button
                            className={styles.closeBtn}
                            onClick={() => removeNotification(toast.id)}
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>
        </NotificationContext.Provider>
    );
}
