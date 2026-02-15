"use client";
import dynamic from "next/dynamic";
import styles from "./MeteoritesSection.module.css";
import { COMETS } from "@/data/cosmos";
import InfoTooltip from "./InfoTooltip";

const MeteorShowerList = dynamic(() => import("./MeteorShowerList"), {
  ssr: false,
});

export default function MeteoritesSection({
  sectionRef,
  activeShower,
  onShowerSelect,
  onShowerCardClick,
  onCometCardClick,
}) {
  return (
    <>
      {/* Meteor Showers */}
      <section className={styles.section} ref={sectionRef}>
        <div className={styles.sectionHeader}>
          <h2>Major Meteor Showers</h2>
          <div className={styles.headerIcons}>
            <span className="badge badgeLive">Interactive</span>
            <InfoTooltip
              term="What are Meteor Showers?"
              explanation="Meteor showers happen when Earth passes through a cloud of space dust left by a comet. The dust burns up in our atmosphere and creates shooting stars!"
              funFact="We know exactly when meteor showers will happen because we track the orbits of comets!"
              icon="?"
            />
          </div>
        </div>
        <p className={styles.sectionDesc}>
          The best times to look up.{" "}
          <span className={styles.highlight}>
            Click on a meteor shower card
          </span>{" "}
          below to visualize it in the 3D simulation. Each card shows fun facts
          about that shower!
        </p>
        <MeteorShowerList
          activeShower={activeShower}
          onSelect={onShowerSelect}
          onCardClick={onShowerCardClick}
        />

        <div className={styles.visualizationFrame}>
          <iframe
            src={`https://www.meteorshowers.org/view/${activeShower}?autoshow=1&speed=2`}
            className={styles.iframe}
            title="Meteor Shower Visualization"
            allowFullScreen
          />
        </div>
      </section>

      Comets
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Notable Comets</h2>
          <InfoTooltip
            term="What are Comets?"
            explanation="Comets are icy space rocks that orbit the Sun. When they get close to the Sun, they heat up and create a beautiful glowing tail!"
            funFact="Comets can be seen from Earth only when they're close enough to our planet. Some visit regularly, others only once every thousands of years!"
            icon="?"
          />
        </div> */}
        {/* <div className={styles.cometGrid}>
          {COMETS.map((comet) => (
            <div
              key={comet.id}
              className={styles.cometCard}
              onClick={() => onCometCardClick(comet.name)}
              style={{ cursor: "pointer" }}
            >
              <div className={styles.cometImageWrapper}>
                <img
                  src={comet.image}
                  alt={comet.name}
                  className={styles.cometImage}
                />
                <div className={styles.cometTag}>{comet.status}</div>
              </div>
              <div className={styles.cometContent}>
                <h3>{comet.name}</h3>
                <p className={styles.cometType}>{comet.type}</p>
                <p className={styles.cometDesc}>{comet.desc}</p>
                <div className={styles.cometStats}>
                  <span>Perihelion: {comet.perihelion}</span>
                  {comet.next && <span>Next: {comet.next}</span>}
                </div>
              </div>
            </div>
          ))}
        </div> */}
      </section>
    </>
  );
}
