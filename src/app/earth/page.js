'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import styles from './page.module.css';
import GuidedTour from '@/components/GuidedTour';
import InfoTooltip from '@/components/InfoTooltip';

const FireMap = dynamic(() => import('@/components/FireMap'), { ssr: false });
const EPICGallery = dynamic(() => import('@/components/EPICGallery'), { ssr: false });
const DisasterMap = dynamic(() => import('@/components/DisasterMap'), { ssr: false });
const ClimatePanel = dynamic(() => import('@/components/ClimatePanel'), { ssr: false });
const AgriPanel = dynamic(() => import('@/components/AgriPanel'), { ssr: false });

const TABS = [
    { key: 'disasters', label: 'Disasters', desc: 'Natural events, earthquakes, and wildfire monitoring' },
    { key: 'climate', label: 'Climate', desc: 'Temperature, precipitation, wind, and solar radiation analysis' },
    { key: 'agriculture', label: 'Agriculture', desc: 'Crop suitability, soil moisture, and growing conditions' },
    { key: 'epic', label: 'EPIC', desc: 'Full-disc Earth imagery from the DSCOVR satellite at L1' },
];

const TOUR_STEPS = [
    {
        title: '🌍 Welcome to EarthWatch!',
        description: 'This page shows you what\'s happening on Earth right now from satellites in space!',
        tooltipTop: '10%',
        tooltipLeft: '50%',
        highlightElement: false,
        funFact: 'Satellites can see the entire Earth continuously, watching for disasters and weather!'
    },
    {
        title: '🎨 Click on Tabs',
        description: 'These tabs let you choose what to see: Disasters, Climate, Agriculture, or Earth photos!',
        tooltipTop: '25%',
        tooltipLeft: '50%',
        highlightElement: true,
        funFact: 'Each tab shows different information about our planet!'
    },
    {
        title: '🗺️ Interactive Maps',
        description: 'The maps below show real-time data. You can zoom in and explore your local area!',
        tooltipTop: '50%',
        tooltipLeft: '50%',
        highlightElement: true,
        funFact: 'NASA satellites pass over your city multiple times per day!'
    },
    {
        title: '📡 Live Data',
        description: 'All the data here is updated regularly from NASA satellites and weather stations!',
        tooltipTop: '75%',
        tooltipLeft: '50%',
        highlightElement: true,
        funFact: 'Scientists use this data to predict weather, stop wildfires, and help farmers!'
    }
];

export default function EarthPage() {
    const [activeTab, setActiveTab] = useState('disasters');
    const [showTour, setShowTour] = useState(false);

    return (
        <div className="pageContainer">
            <GuidedTour steps={TOUR_STEPS} isActive={showTour} />

            <div className="pageHeader">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%', gap: '20px' }}>
                    <div>
                        <h1 className="sectionTitle">EarthWatch</h1>
                        <p className="sectionSubtitle">
                            Monitor our planet from orbit — disaster tracking, climate analysis,
                            agricultural planning, and satellite imagery.
                        </p>
                    </div>
                    <button 
                        style={{
                            background: 'linear-gradient(135deg, var(--accent-cyan), rgba(0, 255, 200, 0.8))',
                            color: 'var(--bg-dark)',
                            border: 'none',
                            padding: '12px 24px',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            fontWeight: '600',
                            fontSize: '1rem',
                            transition: 'all 0.3s ease',
                            whiteSpace: 'nowrap'
                        }}
                        onClick={() => setShowTour(true)}
                        title="Take a guided tour of this page"
                    >
                        🎯 Start Tour
                    </button>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className={styles.tabBar}>
                {TABS.map(tab => (
                    <button
                        key={tab.key}
                        className={`${styles.tabBtn} ${activeTab === tab.key ? styles.tabActive : ''}`}
                        onClick={() => setActiveTab(tab.key)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <p className={styles.tabDesc}>
                {TABS.find(t => t.key === activeTab)?.desc}
                <InfoTooltip
                    term={TABS.find(t => t.key === activeTab)?.label}
                    explanation={TABS.find(t => t.key === activeTab)?.desc}
                    funFact="Satellite data helps us understand our planet better every day!"
                    icon="?"
                />
            </p>

            {/* Tab Content */}
            <div className={styles.tabContent}>
                {activeTab === 'disasters' && (
                    <div className={styles.grid}>
                        <section className={styles.section}>
                            <div className={styles.sectionHeader}>
                                <h2>Global Disaster Monitor</h2>
                                <span className="badge badgeDanger">EONET + USGS</span>
                            </div>
                            <p className={styles.sectionDesc}>
                                Real-time natural events from NASA EONET (wildfires, volcanoes, storms, floods, icebergs)
                                and USGS earthquake data, plotted on a live map.
                            </p>
                            <DisasterMap />
                        </section>

                        <section className={styles.section}>
                            <div className={styles.sectionHeader}>
                                <h2>Wildfire Hotspots (MODIS/VIIRS)</h2>
                                <span className="badge badgeDanger">Satellite</span>
                            </div>
                            <FireMap />
                        </section>
                    </div>
                )}

                {activeTab === 'climate' && (
                    <div className={styles.grid}>
                        <section className={styles.section}>
                            <div className={styles.sectionHeader}>
                                <h2>Climate Data Explorer</h2>
                                <span className="badge badgeInfo">NASA POWER</span>
                            </div>
                            <p className={styles.sectionDesc}>
                                Temperature, precipitation, humidity, wind speed, solar radiation, and cloud cover
                                from NASA&apos;s POWER project. Select any location on Earth to view current conditions
                                and long-term climatology.
                            </p>
                            <ClimatePanel />
                        </section>
                    </div>
                )}

                {activeTab === 'agriculture' && (
                    <div className={styles.grid}>
                        <section className={styles.section}>
                            <div className={styles.sectionHeader}>
                                <h2>Agricultural Planning</h2>
                                <span className="badge badgeSuccess">Crop Analysis</span>
                            </div>
                            <p className={styles.sectionDesc}>
                                Analyze growing conditions for any location using NASA satellite-derived meteorological data.
                                Get crop suitability scores based on temperature, precipitation, solar radiation, and soil moisture.
                            </p>
                            <AgriPanel />
                        </section>
                    </div>
                )}

                {activeTab === 'epic' && (
                    <div className={styles.grid}>
                        <section className={styles.section}>
                            <div className={styles.sectionHeader}>
                                <h2>Earth from Space (EPIC)</h2>
                                <span className="badge badgeInfo">DSCOVR Satellite</span>
                            </div>
                            <p className={styles.sectionDesc}>
                                Full-disc images of Earth captured by NASA&apos;s EPIC camera aboard the DSCOVR spacecraft,
                                orbiting at the L1 Lagrange point — 1.5 million km away.
                            </p>
                            <EPICGallery />
                        </section>
                    </div>
                )}
            </div>
        </div>
    );
}
