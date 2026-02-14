'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

import dynamic from 'next/dynamic';

const Beams = dynamic(() => import('../../animatedComponents/beams.js'), { ssr: false });

const modules = [
    { href: '/skypulse', title: 'SkyPulse', desc: 'Satellites · ISS · NEOs' },
    { href: '/earth', title: 'EarthWatch', desc: 'Disasters · Climate · EPIC' },
    { href: '/aurawatch', title: 'AuraWatch', desc: 'Aurora · Solar Wind' },
    { href: '/cosmos', title: 'Cosmos', desc: 'Meteors · Comets · Stars' },
    { href: '/missions', title: 'Missions', desc: 'Mars Rovers · History' },
    { href: '/spaceclass', title: 'SpaceClass', desc: 'Learn · Explore · Discover' },
];

const FACTS = [
    'The ISS orbits Earth every 90 minutes at 27,600 km/h',
    'One million Earths could fit inside the Sun',
    'A day on Venus is longer than a year on Venus',
    'Neutron stars can spin 600 times per second',
    'Space is completely silent — no medium for sound waves',
    'Light takes 8 minutes to travel from Sun to Earth',
    'The footprints on the Moon will last 100 million years',
    'Saturn could float in water if a bathtub big enough existed',
    'There are more stars in the universe than grains of sand on Earth',
    'A teaspoon of neutron star material weighs about one billion tons',
    'Mars sunsets are blue due to fine dust scattering light',
    'Jupiter\u2019s Great Red Spot is a storm larger than Earth',
    'Black holes warp time \u2014 clocks slow near their event horizons',
    'The Milky Way collides with Andromeda in ~4.5 billion years',
    'Uranus rotates on its side at a 98-degree tilt',
    'Space is not empty \u2014 it contains radiation, dust, and plasma',
    'Olympus Mons on Mars is the tallest volcano in the solar system',
    'There are rogue planets drifting without any star',
    'Astronauts grow taller in space due to spinal decompression',
    'The coldest natural place known is the Boomerang Nebula',
    'Mercury experiences temperature swings of 600\u00B0C',
    'A full NASA space suit costs over $12 million',
    'Venus has crushing pressure equal to 900 meters underwater',
    'The observable universe is about 93 billion light-years wide',
    'Some exoplanets rain molten glass sideways',
    'There may be ice in permanently shadowed lunar craters',
    'Cosmic rays regularly pass through your body unnoticed'
];

export default function HomePage() {
    const [fact, setFact] = useState('');
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        setFact(FACTS[Math.floor(Math.random() * FACTS.length)]);
        setTimeout(() => setLoaded(true), 100);
    }, []);

    return (
        <div className={styles.page}>
            <div className={styles.bgLayer}>
                <Beams
                    beamWidth={3}
                    beamHeight={30}
                    beamNumber={15}
                    lightColor="#00f0ff"
                    speed={2}
                    noiseIntensity={1.75}
                    scale={0.2}
                    rotation={30}
                />
            </div>

            <div className={styles.overlay} />

            {/* Content */}
            <div className={`${styles.content} ${loaded ? styles.visible : ''}`}>

                <section className={styles.hero}>
                    <span className={styles.tag}>ALL YOUR SPACE DATA IN ONE PLACE</span> 
                    <h1 className={styles.title}>Celestia</h1>
                    <p className={styles.subtitle}>{fact}</p>
                    <div className={styles.actions}>
                        <Link href="/skypulse" className={styles.btnPrimary}>
                            Launch Dashboard
                        </Link>
                        <Link href="/spaceclass" className={styles.btnOutline}>
                            Learn More
                        </Link>
                    </div>
                </section>

                {/* Modules */}
                

                
            </div>
        </div>
    );
}
