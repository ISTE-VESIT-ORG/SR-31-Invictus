'use client';
import { useState } from 'react';
import styles from './SolarSystem.module.css';

const PLANETS = [
    {
        name: 'Mercury',
        icon: '☿️',
        color: '#94A3B8',
        size: 14,
        orbit: 60,
        period: 8,
        distance: '57.9M km',
        diameter: '4,879 km',
        moons: 0,
        dayLength: '59 Earth days',
        yearLength: '88 Earth days',
        temp: '430°C / -180°C',
        desc: 'The smallest planet and closest to the Sun. Its surface is covered in craters, and temperatures swing wildly between day and night.',
        funFact: 'A day on Mercury (sunrise to sunrise) is longer than its year!',
    },
    {
        name: 'Venus',
        icon: '♀️',
        color: '#FBBF24',
        size: 20,
        orbit: 90,
        period: 12,
        distance: '108.2M km',
        diameter: '12,104 km',
        moons: 0,
        dayLength: '243 Earth days',
        yearLength: '225 Earth days',
        temp: '465°C',
        desc: 'Often called Earth\'s twin due to similar size. Its thick atmosphere traps heat, making it the hottest planet.',
        funFact: 'Venus rotates backwards compared to most planets (retrograde rotation).',
    },
    {
        name: 'Earth',
        icon: '🌍',
        color: '#4C9FFF',
        size: 22,
        orbit: 120,
        period: 16,
        distance: '149.6M km',
        diameter: '12,742 km',
        moons: 1,
        dayLength: '24 hours',
        yearLength: '365.25 days',
        temp: '15°C average',
        desc: 'Our home world — the only known planet to harbor life. 71% of its surface is covered by water.',
        funFact: 'Earth is the densest planet in the solar system.',
    },
    {
        name: 'Mars',
        icon: '',
        color: '#FF6B35',
        size: 18,
        orbit: 155,
        period: 22,
        distance: '227.9M km',
        diameter: '6,779 km',
        moons: 2,
        dayLength: '24h 37m',
        yearLength: '687 Earth days',
        temp: '-60°C average',
        desc: 'The Red Planet, home to the largest volcano (Olympus Mons) and canyon (Valles Marineris) in the solar system.',
        funFact: 'Mars has seasons like Earth because its axis is tilted at a similar angle.',
    },
    {
        name: 'Jupiter',
        icon: '🟤',
        color: '#FF9F1C',
        size: 40,
        orbit: 200,
        period: 30,
        distance: '778.5M km',
        diameter: '139,820 km',
        moons: 95,
        dayLength: '9h 56m',
        yearLength: '12 Earth years',
        temp: '-108°C',
        desc: 'The largest planet, a gas giant with the iconic Great Red Spot — a storm larger than Earth that has raged for centuries.',
        funFact: 'Jupiter\'s mass is more than twice that of all other planets combined.',
    },
    {
        name: 'Saturn',
        icon: '🪐',
        color: '#FBBF24',
        size: 36,
        orbit: 245,
        period: 40,
        distance: '1.43B km',
        diameter: '116,460 km',
        moons: 146,
        dayLength: '10h 42m',
        yearLength: '29 Earth years',
        temp: '-138°C',
        desc: 'Famous for its stunning ring system made of ice and rock particles. It\'s the least dense planet — it would float in water.',
        funFact: 'Saturn\'s rings are mostly water ice, some pieces as large as houses.',
    },
    {
        name: 'Uranus',
        icon: '',
        color: '#06D6A0',
        size: 28,
        orbit: 285,
        period: 55,
        distance: '2.87B km',
        diameter: '50,724 km',
        moons: 28,
        dayLength: '17h 14m',
        yearLength: '84 Earth years',
        temp: '-224°C',
        desc: 'An ice giant that rotates on its side. Its blue-green color comes from methane in its atmosphere.',
        funFact: 'Uranus is tilted 98° — it essentially orbits the Sun rolling on its side.',
    },
    {
        name: 'Neptune',
        icon: '',
        color: '#8B5CF6',
        size: 26,
        orbit: 320,
        period: 70,
        distance: '4.50B km',
        diameter: '49,244 km',
        moons: 16,
        dayLength: '16h 6m',
        yearLength: '165 Earth years',
        temp: '-214°C',
        desc: 'The windiest planet with gusts over 2,000 km/h. Its deep blue color is due to atmospheric methane.',
        funFact: 'Neptune\'s moon Triton orbits backwards — suggesting it was captured from the Kuiper Belt.',
    },
];

export default function SolarSystem() {
    const [selected, setSelected] = useState(null);

    return (
        <div className={styles.wrapper}>
            {/* Orbits visualization */}
            <div className={styles.system}>
                <div className={styles.sun}></div>
                {PLANETS.map((planet, i) => (
                    <div
                        key={planet.name}
                        className={styles.orbit}
                        style={{
                            width: planet.orbit * 2,
                            height: planet.orbit * 2,
                            animationDuration: `${planet.period}s`,
                        }}
                    >
                        <button
                            className={styles.planet}
                            style={{
                                width: planet.size,
                                height: planet.size,
                                background: planet.color,
                                boxShadow: `0 0 ${planet.size / 2}px ${planet.color}60`,
                            }}
                            onClick={() => setSelected(selected === i ? null : i)}
                            title={planet.name}
                        />
                    </div>
                ))}
            </div>

            {/* Planet cards grid */}
            <div className={styles.planetsGrid}>
                {PLANETS.map((planet, i) => (
                    <button
                        key={planet.name}
                        className={`${styles.planetCard} card ${selected === i ? styles.planetCardActive : ''}`}
                        onClick={() => setSelected(selected === i ? null : i)}
                        style={{ borderColor: selected === i ? planet.color : undefined }}
                    >
                        <span className={styles.planetIcon}>{planet.icon}</span>
                        <span className={styles.planetName}>{planet.name}</span>
                    </button>
                ))}
            </div>

            {/* Selected planet detail */}
            {selected !== null && (
                <div className={`${styles.detail} card`} style={{ borderColor: `${PLANETS[selected].color}30` }}>
                    <div className={styles.detailHeader}>
                        <div>
                            <h3 style={{ color: PLANETS[selected].color }}>{PLANETS[selected].name}</h3>
                            <p className={styles.detailDesc}>{PLANETS[selected].desc}</p>
                        </div>
                    </div>
                    <div className={styles.detailStats}>
                        <div className={styles.detailStat}>
                            <span className={styles.detailLabel}>Distance from Sun</span>
                            <span className={styles.detailValue}>{PLANETS[selected].distance}</span>
                        </div>
                        <div className={styles.detailStat}>
                            <span className={styles.detailLabel}>Diameter</span>
                            <span className={styles.detailValue}>{PLANETS[selected].diameter}</span>
                        </div>
                        <div className={styles.detailStat}>
                            <span className={styles.detailLabel}>Moons</span>
                            <span className={styles.detailValue}>{PLANETS[selected].moons}</span>
                        </div>
                        <div className={styles.detailStat}>
                            <span className={styles.detailLabel}>Day Length</span>
                            <span className={styles.detailValue}>{PLANETS[selected].dayLength}</span>
                        </div>
                        <div className={styles.detailStat}>
                            <span className={styles.detailLabel}>Year Length</span>
                            <span className={styles.detailValue}>{PLANETS[selected].yearLength}</span>
                        </div>
                        <div className={styles.detailStat}>
                            <span className={styles.detailLabel}>Temperature</span>
                            <span className={styles.detailValue}>{PLANETS[selected].temp}</span>
                        </div>
                    </div>
                    <div className={styles.funFact}>
                        <span>💡</span>
                        <p>{PLANETS[selected].funFact}</p>
                    </div>
                </div>
            )}
        </div>
    );
}
