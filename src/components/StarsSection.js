"use client";
import { useEffect } from "react"; // 1. Added useEffect
import dynamic from "next/dynamic";
import styles from "./StarsSection.module.css";
import InfoTooltip from "./InfoTooltip";

const ConstellationMap = dynamic(() => import("./ConstellationMap"), {
  ssr: false,
});

export default function StarsSection({ sectionRef }) {
  // 2. Wrap DOM manipulation in useEffect
  useEffect(() => {
    const targetElement = document.querySelector(".container.pa-0");
    if (targetElement) {
      targetElement.style.display = "none";
    }

    // Optional: Clean up and show it again when the user leaves the section
    return () => {
      if (targetElement) {
        targetElement.style.display = "block";
      }
    };
  }, []);

  return (
    <section className={styles.section} ref={sectionRef}>
      <div className={styles.sectionHeader}>
        <h2>Constellation Hunter</h2>
        <div className={styles.headerIcons}>
          <span className="badge badgeInfo">Interactive</span>
          <InfoTooltip
            term="What are Constellations?"
            explanation="Constellations are patterns of stars that people imagine connect like connect-the-dots."
            funFact="Ancient Greeks named many constellations after their myths and legends."
            icon="?"
          />
        </div>
      </div>

      <p className={styles.sectionDesc}>
        Explore major constellations.{" "}
        <span className={styles.highlight}>Hover over stars</span> to identify
        them and switch between constellations to learn their patterns.
      </p>

      <div className={styles.stellariumWrapper}>
        <div className={styles.visualizationFrame}>
          <iframe
            src="https://stellarium-web.org/?fov=120&date=2026-02-14T22:00:00Z&lat=28.6&lng=77.2&elev=0"
            className={styles.iframe}
            title="Stellarium Web - Interactive Star Map"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}
