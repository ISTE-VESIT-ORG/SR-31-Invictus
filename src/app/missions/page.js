'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import styles from './page.module.css';
import GuidedTour from '@/components/GuidedTour';
import InfoTooltip from '@/components/InfoTooltip';

const RoverGallery = dynamic(() => import('@/components/RoverGallery'), { ssr: false });
const MissionTimeline = dynamic(() => import('@/components/MissionTimeline'), { ssr: false });
const MissionBento = dynamic(() => import('@/components/MissionBento'), { ssr: false });
const MissionPhotoGallery = dynamic(() => import('@/components/MissionPhotoGallery'), { ssr: false });

const TOUR_STEPS = [
    {
        title: '🚀 Welcome to Mission Control!',
        description: 'This page shows you the history of space exploration from the first satellite to modern missions!',
        tooltipTop: '10%',
        tooltipLeft: '50%',
        highlightElement: false,
        funFact: 'Humans have sent hundreds of missions to space since 1957!'
    },
    {
        title: '🎯 Major Missions',
        description: 'Click on these mission cards to learn about famous space missions and see amazing space photos!',
        tooltipTop: '30%',
        tooltipLeft: '50%',
        highlightElement: true,
        funFact: 'Each mission has hundreds of incredible photos from space!'
    },
    {
        title: '📅 Mission Timeline',
        description: 'This shows when major space missions happened. You can see the history of space exploration!',
        tooltipTop: '55%',
        tooltipLeft: '50%',
        highlightElement: true,
        funFact: 'The timeline goes back to 1957 with Sputnik, the first satellite!'
    },
    {
        title: '🔴 Mars Rovers',
        description: 'Select Mars Rovers to see real photos from robots exploring the Red Planet right now!',
        tooltipTop: '80%',
        tooltipLeft: '50%',
        highlightElement: true,
        funFact: 'The Curiosity rover is still exploring Mars and sending back photos daily!'
    }
];

export default function MissionsPage() {
    const [selectedMission, setSelectedMission] = useState(null);
    const [showTour, setShowTour] = useState(false);

    return (
        <div className={styles.fullWidthPage}>
            <GuidedTour steps={TOUR_STEPS} isActive={showTour} />

            <div className="pageHeader">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%', gap: '20px' }}>
                    <div>
                        <h1 className="sectionTitle">Mission Control</h1>
                        <p className="sectionSubtitle">
                            Tracing humanity&apos;s journey through the cosmos — from Sputnik to Artemis.
                        </p>
                    </div>

                </div>
            </div>

            <div className={styles.grid}>
                {/* Mission Bento Grid */}
                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2>🎯 Major Space Missions</h2>
                        <InfoTooltip
                            term="Space Missions"
                            explanation="A mission is when we send a spacecraft or rover to explore space. It can carry people or just robots and cameras!"
                            funFact="Some missions take years to plan and cost millions of dollars, but give us amazing discoveries!"
                            icon="?"
                        />
                    </div>
                    <MissionBento onSelect={setSelectedMission} />
                </section>

                {/* Mission Timeline - Moved Up */}
                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2>📅 Mission Timeline</h2>
                        <InfoTooltip
                            term="Timeline"
                            explanation="A timeline shows events in order from the past to today. This one shows when each major space mission happened!"
                            funFact="Space exploration started in 1957 with a satellite called Sputnik!"
                            icon="?"
                        />
                    </div>
                    <MissionTimeline onSelect={setSelectedMission} />
                </section>

                {/* Dynamic Gallery Section: Rover or Selected Mission */}
                <section className={styles.section} style={{ minHeight: '600px' }}>
                    {selectedMission?.id === 'mars-rovers' ? (
                        <>
                            <div className={styles.sectionHeader}>
                                <h2>🔴 Mars Rover Photos</h2>
                                <span className="badge badgeInfo">Curiosity Rover Live Data</span>
                            </div>
                            <RoverGallery />
                        </>
                    ) : selectedMission ? (
                        <MissionPhotoGallery
                            mission={selectedMission}
                            onBack={() => setSelectedMission(null)}
                        />
                    ) : (
                        <div className="emptyState" style={{ padding: '60px 20px', textAlign: 'center' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '20px', opacity: 0.5 }}>🚀</div>
                            <h2 style={{ fontFamily: 'Instrument Serif, serif', fontSize: '2rem', marginBottom: '10px' }}>
                                Select a Mission
                            </h2>
                            <p style={{ color: 'var(--text-secondary)' }}>
                                Click on any mission in the timeline above to view its gallery and details.
                            </p>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
