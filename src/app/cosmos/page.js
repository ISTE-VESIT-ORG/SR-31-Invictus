"use client";
import { useState, useRef } from "react";
import styles from "./page.module.css";
import { METEOR_SHOWERS } from "@/data/cosmos";
import GuidedTour from "@/components/GuidedTour";
import CharacterGuide from "@/components/CharacterGuide";
import StarsSection from "@/components/StarsSection";
import MeteoritesSection from "@/components/MeteoritesSection";
import VisibilityTracker from "@/components/VisibilityTracker";

const TOUR_STEPS = [
    {
        title: "Welcome to Cosmos Guide!",
        description:
            "This is your interactive handbook to explore the night sky. Everything here is made for kids and space lovers like you!",
        tooltipTop: "10%",
        tooltipLeft: "50%",
        highlightElement: false,
        funFact:
            "The night sky has been studied for thousands of years by humans all around the world!",
    },
    {
        title: "Constellation Hunter",
        description:
            "Hover over the stars to find constellations. These are patterns of stars that form shapes, like connect-the-dots but in the sky!",
        tooltipTop: "25%",
        tooltipLeft: "50%",
        highlightElement: true,
        funFact: "There are 88 official constellations in the night sky!",
    },
    {
        title: "Meteor Showers",
        description:
            "These cards show the best meteor showers to watch. Click a card to see a live visualization. Meteors are space rocks that burn up and create beautiful streaks!",
        tooltipTop: "50%",
        tooltipLeft: "50%",
        highlightElement: true,
        arrows: [{ top: "25%", left: "35%", direction: "rotate(45deg)" }],
        funFact:
            "During a meteor shower peak, you might see 50-150 shooting stars in one night!",
    },
    {
        title: "Notable Comets",
        description:
            "Comets are like icy snowballs from space that travel around the Sun. When they get close to the Sun, they glow and create beautiful tails!",
        tooltipTop: "75%",
        tooltipLeft: "50%",
        highlightElement: true,
        funFact:
            "Halley's Comet returns every 76 years. Last seen in 1986, next in 2061!",
    },
    {
        title: "Pro Tips!",
        description:
            "Click on the ℹ️ icons throughout the page to learn more about confusing terms. Hover over cards for more details. Have fun exploring!",
        tooltipTop: "50%",
        tooltipLeft: "50%",
        highlightElement: false,
        funFact:
            "The best time to see shooting stars is 2-3 hours after sunset, away from city lights!",
    },
];

// Character Guide Messages
const getCharacterGuideForShower = (showerName) => [
    {
        title: "Hey there, Space Explorer!",
        text: `I'm your cosmic buddy! Let's learn about the ${showerName} together!`,
        funFact: `The ${showerName} happens when Earth flies through a cloud of cosmic dust. It's like Earth is driving through a space snowstorm!`,
    },
    {
        title: "How to Watch",
        text: "Find a dark spot away from city lights. Look up at the night sky and wait patiently. You'll see shooting stars zoom across the sky!",
        funFact:
            "The best time to watch is between midnight and dawn. Your eyes need about 20 minutes to adjust to the darkness.",
    },
    {
        title: "Have Fun!",
        text: "Make a wish when you see a shooting star! Tell your friends about the cool meteors you spotted. Space watching is more fun together!",
        funFact:
            "Meteors travel at speeds of 25,000 to 160,000 miles per hour - that's faster than a speeding bullet!",
    },
];

const getCharacterGuideForComet = (cometName) => [
    {
        title: "Hello, Comet Discoverer!",
        text: `Welcome! Let me tell you about the fascinating ${cometName}!`,
        funFact: `Comets are like dirty snowballs made of ice, rock, and dust. They're visitors from the outer edges of our solar system!`,
    },
    {
        title: "The Comet's Journey",
        text: `${cometName} travels in a huge orbit around the Sun. When it gets close, the heat makes it glow and creates a beautiful tail that points away from the Sun!`,
        funFact:
            "A comet's tail can stretch millions of miles into space, but it's actually very thin - almost like a ghost!",
    },
    {
        title: "Spot It Yourself!",
        text: "Check when this comet will be visible from Earth. Use binoculars or a telescope for the best view. You'll be amazed!",
        funFact: `Some comets return regularly - they're like reliable visitors! Others only pass by once in thousands of years.`,
    },
];

export default function CosmosPage() {
    const [activeShower, setActiveShower] = useState(
        METEOR_SHOWERS[0]?.viewId || "Perseids",
    );
    const [showTour, setShowTour] = useState(false);
    const [characterGuideActive, setCharacterGuideActive] = useState(false);
    const [characterGuideMessages, setCharacterGuideMessages] = useState([]);
    const [selectedJourney, setSelectedJourney] = useState(null);

    const starsRef = useRef(null);
    const meteoritesRef = useRef(null);

    const handleShowerCardClick = (showerName) => {
        setCharacterGuideMessages(getCharacterGuideForShower(showerName));
        setCharacterGuideActive(true);
    };

    const handleCometCardClick = (cometName) => {
        setCharacterGuideMessages(getCharacterGuideForComet(cometName));
        setCharacterGuideActive(true);
    };

    const handleCloseCharacterGuide = () => {
        setCharacterGuideActive(false);
    };

    const handleJourneySelect = (journey) => {
        setSelectedJourney(journey);

        // Smooth scroll to the selected section
        setTimeout(() => {
            if (journey === "stars" && starsRef.current) {
                starsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
            } else if (journey === "meteorites" && meteoritesRef.current) {
                meteoritesRef.current.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            }
        }, 300);
    };

    return (
        <div className="pageContainer">
            <GuidedTour steps={TOUR_STEPS} isActive={showTour} />
            <CharacterGuide
                isActive={characterGuideActive}
                messages={characterGuideMessages}
                onClose={handleCloseCharacterGuide}
            />

            {/* Split Screen Hero Section */}
            <div
                className={`${styles.heroSection} ${selectedJourney ? styles.heroSectionHidden : ""}`}
            >
                <div
                    className={`${styles.heroHalf} ${styles.heroLeft}`}
                    onClick={() => handleJourneySelect("stars")}
                >
                    <div className={styles.heroContent}>
                        <div className={styles.heroIcon}></div>
                        <h2 className={styles.heroTitle}>Stars & Constellations</h2>
                        <p className={styles.heroDescription}>
                            Explore the patterns in the night sky and discover ancient star
                            formations
                        </p>
                        <div className={styles.heroButton}>Begin Journey →</div>
                    </div>
                    <div className={styles.heroOverlay}></div>
                </div>

                <div className={styles.heroDivider}></div>

                <div
                    className={`${styles.heroHalf} ${styles.heroRight}`}
                    onClick={() => handleJourneySelect("meteorites")}
                >
                    <div className={styles.heroContent}>
                        <div className={styles.heroIcon}></div>
                        <h2 className={styles.heroTitle}>Meteor Showers & Comets</h2>
                        <p className={styles.heroDescription}>
                            Witness cosmic travelers and shooting star spectacles across space
                        </p>
                        <div className={styles.heroButton}>Begin Journey →</div>
                    </div>
                    <div className={styles.heroOverlay}></div>
                </div>
            </div>

            {/* Main Content - Only visible after selection */}
            <div
                className={`${styles.mainContent} ${selectedJourney ? styles.mainContentVisible : ""}`}
            >
                <div className="pageHeader">
                    <div className={styles.headerContent}>
                        <div>
                            <h1 className="sectionTitle">Cosmos Guide</h1>
                            <p className="sectionSubtitle">
                                Your handbook to the night sky: meteor showers, comets, and
                                constellations.
                            </p>
                        </div>

                    </div>
                </div>

                {/* Visibility Tracker */}

                <div className={styles.grid}>
                    {/* Stars Section */}
                    <StarsSection sectionRef={starsRef} />
                <VisibilityTracker />

                    {/* Meteorites Section */}
                    <MeteoritesSection
                        sectionRef={meteoritesRef}
                        activeShower={activeShower}
                        onShowerSelect={setActiveShower}
                        onShowerCardClick={handleShowerCardClick}
                        onCometCardClick={handleCometCardClick}
                    />
                </div>
            </div>
        </div>
    );
}
