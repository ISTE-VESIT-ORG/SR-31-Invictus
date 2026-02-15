'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';

const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/skypulse', label: 'SkyPulse' },
    { href: '/earth', label: 'EarthWatch' },
    { href: '/aurawatch', label: 'AuraWatch' },
    { href: '/missions', label: 'Missions' },
    { href: '/cosmos', label: 'Cosmos' },
    { href: '/spaceclass', label: 'SpaceClass' },
    { href: '/favorites', label: 'Favorites' },
];

export default function Navbar() {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setMobileOpen(false);
    }, [pathname]);

    return (
        <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
            <div className={styles.navInner}>
                <Link href="/" className={styles.logo}>
                    <img src="/icon-192.png" alt="Celestia Logo" className={styles.logoIcon} style={{ height: '56px', width: 'auto' }} />
                </Link>

                <div className={`${styles.navLinks} ${mobileOpen ? styles.navLinksOpen : ''}`}>
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`${styles.navLink} ${pathname === link.href ? styles.navLinkActive : ''}`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                <div className={styles.navActions}>
                    <Link href="/settings" className={styles.settingsBtn} title="Settings">
                        Settings
                    </Link>
                    <button
                        className={styles.hamburger}
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label="Menu"
                    >
                        <span className={`${styles.hamburgerLine} ${mobileOpen ? styles.hamburgerOpen : ''}`} />
                        <span className={`${styles.hamburgerLine} ${mobileOpen ? styles.hamburgerOpen : ''}`} />
                        <span className={`${styles.hamburgerLine} ${mobileOpen ? styles.hamburgerOpen : ''}`} />
                    </button>
                </div>
            </div>
        </nav>
    );
}
