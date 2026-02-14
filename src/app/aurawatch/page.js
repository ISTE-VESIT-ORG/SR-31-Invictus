"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import styles from "./page.module.css";
import GuidedTour from "@/components/GuidedTour";
import InfoTooltip from "@/components/InfoTooltip";

const AuroraMap = dynamic(() => import("@/components/AuroraMap"), {
  ssr: false,
});
const SpaceWeatherCards = dynamic(
  () => import("@/components/SpaceWeatherCards"),
  { ssr: false },
);

const TOUR_STEPS = [
  {
    title: "🌌 Welcome to AuraWatch!",
    description:
      "This page shows you real-time data about auroras and space weather from the Sun!",
    tooltipTop: "10%",
    tooltipLeft: "50%",
    highlightElement: false,
    funFact: "Auroras happen when the Sun sends energy toward Earth!",
  },
  {
    title: "⚡ Space Weather Dashboard",
    description:
      "These cards show what's happening on the Sun right now. Solar wind, magnetic storms, and radiation levels!",
    tooltipTop: "25%",
    tooltipLeft: "50%",
    highlightElement: true,
    funFact:
      "The Sun is so far away, but its energy still affects Earth every day!",
  },
  {
    title: "🗺️ Aurora Map",
    description:
      "This map shows where auroras are happening RIGHT NOW! Green areas show aurora activity. Check back often to see updates!",
    tooltipTop: "55%",
    tooltipLeft: "50%",
    highlightElement: true,
    funFact: "Auroras are mostly seen near the North and South Poles!",
  },
  {
    title: "🎨 What are Auroras?",
    description:
      "Scroll down to learn how auroras are created and what causes those incredible green lights in the sky!",
    tooltipTop: "80%",
    tooltipLeft: "50%",
    highlightElement: true,
    funFact: "Aurora colors include green, red, blue, and purple!",
  },
];

export default function AuraWatchPage() {
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
            <h1 className="sectionTitle">AuraWatch</h1>
            <p className="sectionSubtitle">
              Real-time space weather monitoring — aurora forecasts, solar wind,
              and geomagnetic storm tracking.
            </p>
          </div>
          <button
            style={{
              background:
                "linear-gradient(135deg, var(--accent-cyan), rgba(0, 255, 200, 0.8))",
              color: "var(--bg-dark)",
              border: "none",
              padding: "12px 24px",
              borderRadius: "12px",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "1rem",
              transition: "all 0.3s ease",
              whiteSpace: "nowrap",
            }}
            onClick={() => setShowTour(true)}
            title="Take a guided tour of this page"
          >
            🎯 Start Tour
          </button>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "60px",
          paddingBottom: "60px",
        }}
      >
        {/* Space Weather Dashboard */}
        <section style={{ width: "100%" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "15px",
              marginBottom: "15px",
            }}
          >
            <h2
              style={{
                fontFamily: "'Instrument Serif', serif",
                fontSize: "2rem",
                fontWeight: "400",
                margin: 0,
              }}
            >
              Space Weather Dashboard
            </h2>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span className="badge badgeLive">
                <span className="pulseDot" /> Live from NOAA
              </span>
              <InfoTooltip
                term="What is Space Weather?"
                explanation="Space weather is what happens on the Sun. Storms on the Sun can affect Earth with radiation and solar wind!"
                funFact="Scientists watch the Sun 24/7 to predict space weather, just like meteorologists predict storms on Earth!"
                icon="?"
              />
            </div>
          </div>
          <SpaceWeatherCards />
        </section>

        {/* Aurora Forecast Map */}
        <section style={{ width: "100%" }}>
          <AuroraMap />
        </section>

        {/* Aurora Info Card */}
        <section style={{ width: "100%" }}>
          <div
            style={{
              display: "flex",
              flex: "1",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            <div
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid var(--border-light)",
                borderRadius: "16px",
                padding: "24px",
                transition: "all 0.3s ease",
              }}
            >
              <h3
                style={{
                  marginTop: 0,
                  marginBottom: "16px",
                  fontSize: "1.3rem",
                  color: "var(--text-primary)",
                }}
              >
                What Causes Auroras?
              </h3>
              <p
                style={{
                  color: "var(--text-secondary)",
                  lineHeight: "1.6",
                  marginBottom: "16px",
                }}
              >
                Auroras occur when charged particles from the Sun (solar wind)
                interact with Earth&apos;s magnetosphere. These particles travel
                along magnetic field lines to the poles, where they collide with
                atmospheric gases, producing the stunning light displays we know
                as Aurora Borealis (north) and Aurora Australis (south).
              </p>

              <div
                style={{
                  display: "flex",
                  gap: "20px",
                  flexWrap: "wrap",
                  marginBottom: "24px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    alignItems: "flex-start",
                  }}
                >
                  <span style={{ fontSize: "1.5rem" }}>🛸</span>
                  <div>
                    <strong>Altitude</strong>
                    <p
                      style={{
                        margin: "4px 0 0 0",
                        color: "var(--text-secondary)",
                        fontSize: "0.9rem",
                      }}
                    >
                      100–300 km above Earth
                    </p>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    alignItems: "flex-start",
                  }}
                >
                  <span style={{ fontSize: "1.5rem" }}>🌍</span>
                  <div>
                    <strong>Location</strong>
                    <p
                      style={{
                        margin: "4px 0 0 0",
                        color: "var(--text-secondary)",
                        fontSize: "0.9rem",
                      }}
                    >
                      Arctic &amp; Antarctic Circles
                    </p>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    alignItems: "flex-start",
                  }}
                >
                  <span style={{ fontSize: "1.5rem" }}>⚡</span>
                  <div>
                    <strong>Colors</strong>
                    <p
                      style={{
                        margin: "4px 0 0 0",
                        color: "var(--text-secondary)",
                        fontSize: "0.9rem",
                      }}
                    >
                      Green, Red, Blue, Purple
                    </p>
                  </div>
                </div>
              </div>

              {/* Integrated the extra facts section here */}
              <div
                style={{
                  display: "flex",
                  gap: "20px",
                  flexWrap: "wrap",
                  borderTop: "1px solid var(--border-light)",
                  paddingTop: "20px",
                }}
              >
                <div className={styles.fact}>
                  <span className={styles.factIcon}></span>
                  <div>
                    <strong>Green Color</strong>
                    <br />
                    <span>Oxygen at ~100 km</span>
                  </div>
                </div>
                <div className={styles.fact}>
                  <span className={styles.factIcon}></span>
                  <div>
                    <strong>Purple/Red</strong>
                    <br />
                    <span>Nitrogen molecules</span>
                  </div>
                </div>
                <div className={styles.fact}>
                  <span className={styles.factIcon}></span>
                  <div>
                    <strong>Solar Cycles</strong>
                    <br />
                    <span>Peak every ~11 years</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Aurora Viewing Tips */}
        <section className={styles.section}>
          <div className={styles.tipsGrid}>
            <div className={`${styles.tipCard} card`}>
              <span className={styles.tipIcon}></span>
              <h4>Best Time</h4>
              <p>10 PM – 2 AM local time, during new moon for darkest skies</p>
            </div>
            <div className={`${styles.tipCard} card`}>
              <span className={styles.tipIcon}></span>
              <h4>Best Location</h4>
              <p>
                High latitudes (above 60°N / below 60°S), away from light
                pollution
              </p>
            </div>
            <div className={`${styles.tipCard} card`}>
              <span className={styles.tipIcon}></span>
              <h4>Kp Index Guide</h4>
              <p>
                Kp 5+ needed at mid-latitudes. Kp 7+ visible as far south as
                40°N
              </p>
            </div>
            <div className={`${styles.tipCard} card`}>
              <span className={styles.tipIcon}></span>
              <h4>Photography</h4>
              <p>
                ISO 1600+, 15–30s exposure, wide angle lens, tripod essential
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
