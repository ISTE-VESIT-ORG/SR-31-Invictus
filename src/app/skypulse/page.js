"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import styles from "./page.module.css";
import GuidedTour from "@/components/GuidedTour";
import InfoTooltip from "@/components/InfoTooltip";

const ISSTracker = dynamic(() => import("@/components/ISSTracker"), {
  ssr: false,
});
const SatelliteTracker = dynamic(
  () => import("@/components/SatelliteTracker"),
  { ssr: false },
);
const APODCard = dynamic(() => import("@/components/APODCard"), { ssr: false });
const NEOFeed = dynamic(() => import("@/components/NEOFeed"), { ssr: false });

const TOUR_STEPS = [
  // ... (Your TOUR_STEPS remain the same)
];

export default function SkyPulsePage() {
  const [showTour, setShowTour] = useState(false);

  return (
    <div className="pageContainer">
      <GuidedTour steps={TOUR_STEPS} isActive={showTour} />

      <div className="pageHeader">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            width: "100%",
            gap: "20px",
          }}
        >
          <div>
            <h1 className="sectionTitle">SkyPulse</h1>
            <p className="sectionSubtitle">
              Real-time satellite tracking with SGP4 orbit propagation, ISS
              tracking, and cosmic discoveries at your fingertips.
            </p>
          </div>

        </div>
      </div>

      <div className={styles.grid}>
        {/* Satellite Tracker */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>🛰️ Live Satellite Tracker</h2>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span className="badge badgeLive">
                <span className="pulseDot" /> SGP4 Propagation
              </span>
              <InfoTooltip
                term="What are Satellites?"
                explanation="Satellites are machines in space that orbit Earth."
                funFact="The first satellite ever launched was Sputnik in 1957!"
                icon="?"
              />
            </div>
          </div>
          <p className={styles.sectionDesc}>
            Real-time satellite positions computed from CelesTrak TLE data.
          </p>
          <SatelliteTracker />
        </section>

        {/* ISS Tracker */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>🌌 ISS Live Tracker</h2>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span className="badge badgeLive">
                <span className="pulseDot" /> Live
              </span>
              <InfoTooltip
                term="What is the ISS?"
                explanation="The ISS is a huge laboratory floating in space."
                funFact="The ISS has been continuously occupied since 2000!"
                icon="?"
              />
            </div>
          </div>
          <ISSTracker />
        </section>

        {/* APOD */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>📸 Astronomy Picture of the Day</h2>
          </div>
          <APODCard />
        </section>

        {/* NEO Feed */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>☄️ Near-Earth Objects</h2>
            <span className="badge badgeInfo">Today</span>
          </div>
          <NEOFeed />
        </section>
      </div>
    </div>
  );
}
