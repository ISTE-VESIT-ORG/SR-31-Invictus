'use client';
import { useState, useMemo } from 'react';
import styles from './page.module.css';

// ====== SPACE GLOSSARY ======
const GLOSSARY = [
    // Fundamental Concepts
    { term: 'Light Year', category: 'Fundamentals', def: 'The distance light travels in one year — about 9.46 trillion km (5.88 trillion miles). Used to measure vast cosmic distances between stars and galaxies.' },
    { term: 'Astronomical Unit (AU)', category: 'Fundamentals', def: 'The average distance from Earth to the Sun — about 149.6 million km. Used to describe distances within our solar system.' },
    { term: 'Parsec', category: 'Fundamentals', def: 'A unit of distance equal to about 3.26 light years. Derived from parallax measurements; commonly used in professional astronomy.' },
    { term: 'Redshift', category: 'Fundamentals', def: 'When light from distant objects stretches to longer (redder) wavelengths, indicating they are moving away from us. Key evidence for the expanding universe.' },
    { term: 'Blueshift', category: 'Fundamentals', def: 'When light from objects compresses to shorter (bluer) wavelengths, indicating they are moving toward us. The Andromeda galaxy is blueshifted.' },
    { term: 'Electromagnetic Spectrum', category: 'Fundamentals', def: 'The full range of electromagnetic radiation: radio waves, microwaves, infrared, visible light, ultraviolet, X-rays, and gamma rays. Telescopes observe across multiple bands.' },
    { term: 'Doppler Effect', category: 'Fundamentals', def: 'The change in frequency of a wave relative to an observer moving relative to the source. Used to detect exoplanets and measure star velocities.' },
    { term: 'Escape Velocity', category: 'Fundamentals', def: 'The minimum speed needed to break free from a celestial body\'s gravitational pull without further propulsion. Earth\'s is about 11.2 km/s.' },
    { term: 'Gravity Assist', category: 'Fundamentals', def: 'A technique where a spacecraft uses a planet\'s gravity to change speed and direction, saving fuel. Voyager missions famously used this.' },

    // Stellar Objects
    { term: 'Main Sequence Star', category: 'Stars', def: 'A star in the longest phase of its life, fusing hydrogen into helium. Our Sun is a main sequence G-type star about halfway through its 10-billion-year lifespan.' },
    { term: 'Red Dwarf', category: 'Stars', def: 'The most common type of star in the universe — small, cool, and long-lived. Proxima Centauri (nearest star to our Sun) is a red dwarf.' },
    { term: 'White Dwarf', category: 'Stars', def: 'The dense remnant core of a low-to-medium mass star after it exhausts its fuel. About Earth-sized but with a mass comparable to the Sun.' },
    { term: 'Neutron Star', category: 'Stars', def: 'An incredibly dense remnant of a massive star\'s supernova. A teaspoon of neutron star material weighs about 6 billion tons.' },
    { term: 'Pulsar', category: 'Stars', def: 'A rapidly rotating neutron star that emits beams of electromagnetic radiation. Can spin up to 716 times per second, detected as periodic radio pulses.' },
    { term: 'Magnetar', category: 'Stars', def: 'A neutron star with an extraordinarily powerful magnetic field — a trillion times stronger than Earth\'s. The most magnetic objects in the known universe.' },
    { term: 'Black Hole', category: 'Stars', def: 'A region of space where gravity is so strong that nothing, not even light, can escape. Formed from the collapse of massive stars or found at galaxy centers.' },
    { term: 'Supernova', category: 'Stars', def: 'The explosive death of a massive star, briefly outshining entire galaxies. Seeds space with heavy elements like iron, gold, and uranium.' },
    { term: 'Binary Star', category: 'Stars', def: 'Two stars that orbit around their common center of mass. Over half of all star systems are binaries or multiples.' },
    { term: 'Variable Star', category: 'Stars', def: 'A star whose brightness changes over time, either due to internal pulsation or eclipsing by a companion. Cepheid variables are key distance markers.' },
    { term: 'Protostar', category: 'Stars', def: 'A young star still gathering mass from its surrounding molecular cloud. Not yet hot enough for hydrogen fusion — the stage before becoming a main sequence star.' },

    // Solar System
    { term: 'Terrestrial Planet', category: 'Solar System', def: 'A rocky planet with a solid surface — Mercury, Venus, Earth, and Mars. Distinguished from gas and ice giants by composition.' },
    { term: 'Gas Giant', category: 'Solar System', def: 'A large planet composed mainly of hydrogen and helium — Jupiter and Saturn. They lack a well-defined solid surface.' },
    { term: 'Ice Giant', category: 'Solar System', def: 'A giant planet composed mainly of elements heavier than hydrogen/helium, like water, ammonia, and methane — Uranus and Neptune.' },
    { term: 'Dwarf Planet', category: 'Solar System', def: 'A celestial body orbiting the Sun, massive enough for gravity to make it round, but not clearing its orbital neighborhood. Examples: Pluto, Ceres, Eris.' },
    { term: 'Asteroid Belt', category: 'Solar System', def: 'A region between Mars and Jupiter containing millions of rocky objects — remnants of the early solar system that never formed into a planet.' },
    { term: 'Kuiper Belt', category: 'Solar System', def: 'A region beyond Neptune extending from 30 to 55 AU, containing icy bodies including Pluto. Much larger than the asteroid belt.' },
    { term: 'Oort Cloud', category: 'Solar System', def: 'A theoretical sphere of icy objects at the very edge of the Sun\'s influence, extending up to 100,000 AU. Source of long-period comets.' },
    { term: 'Lagrange Point', category: 'Solar System', def: 'Five special positions where gravitational forces create stable "parking spots" for spacecraft. The James Webb Space Telescope orbits the L2 point.' },
    { term: 'Solar Wind', category: 'Solar System', def: 'A stream of charged particles (plasma) released from the Sun\'s upper atmosphere at speeds of 400-800 km/s. Causes auroras on Earth.' },
    { term: 'Heliosphere', category: 'Solar System', def: 'The bubble of space dominated by the solar wind, extending far beyond Pluto. Voyager 1 crossed its boundary (heliopause) in 2012.' },
    { term: 'Magnetosphere', category: 'Solar System', def: 'The region around a planet dominated by its magnetic field. Earth\'s magnetosphere deflects solar wind and protects life from radiation.' },
    { term: 'Near-Earth Object (NEO)', category: 'Solar System', def: 'Any asteroid or comet with an orbit that brings it within 1.3 AU of the Sun. NASA tracks over 30,000 NEOs for planetary defense.' },

    // Galaxies & Cosmology
    { term: 'Galaxy', category: 'Cosmology', def: 'A vast system of stars, gas, dust, and dark matter bound together by gravity. The Milky Way contains an estimated 100-400 billion stars.' },
    { term: 'Nebula', category: 'Cosmology', def: 'A giant cloud of gas and dust in space. Emission nebulae glow from ionized gas; reflection nebulae scatter starlight; dark nebulae block light behind them.' },
    { term: 'Dark Matter', category: 'Cosmology', def: 'An invisible substance making up ~27% of the universe. It doesn\'t emit or absorb light but exerts gravitational pull, holding galaxies together.' },
    { term: 'Dark Energy', category: 'Cosmology', def: 'A mysterious force making up ~68% of the universe, driving its accelerating expansion. Discovered in 1998 through supernova observations.' },
    { term: 'Cosmic Microwave Background (CMB)', category: 'Cosmology', def: 'Ancient thermal radiation left over from the Big Bang, about 380,000 years after the universe formed. Fills all of space at 2.7 Kelvin.' },
    { term: 'Exoplanet', category: 'Cosmology', def: 'A planet orbiting a star outside our solar system. Over 5,600 have been confirmed as of 2024, found via transit and radial velocity methods.' },
    { term: 'Habitable Zone', category: 'Cosmology', def: 'The region around a star where conditions could allow liquid water on a planet\'s surface. Also called the "Goldilocks zone" — not too hot, not too cold.' },
    { term: 'Gravitational Lensing', category: 'Cosmology', def: 'The bending of light by massive objects, predicted by Einstein\'s general relativity. Used to study dark matter and magnify distant galaxies.' },
    { term: 'Quasar', category: 'Cosmology', def: 'An extremely luminous active galactic nucleus powered by a supermassive black hole consuming matter. Some are visible billions of light years away.' },

    // Space Weather
    { term: 'Solar Flare', category: 'Space Weather', def: 'A sudden burst of electromagnetic radiation from the Sun\'s surface. Classified by X-ray intensity: A, B, C, M, X (strongest). Can disrupt radio communications.' },
    { term: 'Coronal Mass Ejection (CME)', category: 'Space Weather', def: 'A massive burst of solar wind and magnetic fields rising above the solar corona. When directed at Earth, can cause geomagnetic storms.' },
    { term: 'Geomagnetic Storm', category: 'Space Weather', def: 'A disturbance in Earth\'s magnetosphere caused by solar wind. Measured on the G1-G5 scale. Can affect power grids, GPS, and cause auroras at lower latitudes.' },
    { term: 'Kp Index', category: 'Space Weather', def: 'A 0-9 scale measuring geomagnetic activity. Kp ≤ 2 is quiet; Kp 5+ indicates a geomagnetic storm. Used in Celestia\'s AuraWatch for aurora predictions.' },
    { term: 'Aurora (Northern/Southern Lights)', category: 'Space Weather', def: 'Luminous displays caused by charged particles from the Sun interacting with Earth\'s magnetic field and atmosphere. Visible near the poles, or globally during strong storms.' },
    { term: 'Sunspot', category: 'Space Weather', def: 'A dark region on the Sun\'s surface caused by magnetic activity. Sunspot count follows an 11-year solar cycle and correlates with space weather activity.' },
    { term: 'Solar Cycle', category: 'Space Weather', def: 'An approximately 11-year cycle of solar magnetic activity. Solar maximum brings more sunspots, flares, and CMEs. We\'re currently in Solar Cycle 25 (peaked ~2024).' },
    { term: 'Radiation Belt', category: 'Space Weather', def: 'Zones of energetic charged particles trapped by Earth\'s magnetic field. The Van Allen belts can pose hazards to satellites and astronauts.' },

    // Spacecraft & Technology
    { term: 'Low Earth Orbit (LEO)', category: 'Technology', def: 'Orbits between 160-2,000 km altitude. The ISS orbits at ~408 km. Most Earth observation and communication satellites operate in LEO.' },
    { term: 'Geostationary Orbit (GEO)', category: 'Technology', def: 'An orbit at ~35,786 km altitude where a satellite matches Earth\'s rotation, appearing stationary. Used for weather and communication satellites.' },
    { term: 'Delta-v', category: 'Technology', def: 'The change in velocity needed for orbital maneuvers. A key measure for mission planning — determines fuel requirements for reaching destinations.' },
    { term: 'Ion Thruster', category: 'Technology', def: 'A propulsion system that creates thrust by accelerating ions using electricity. Very fuel-efficient but low thrust — ideal for deep space missions like Dawn.' },
    { term: 'Hohmann Transfer', category: 'Technology', def: 'The most fuel-efficient way to transfer between two circular orbits using two engine burns. Standard approach for missions to Mars and other planets.' },
    { term: 'Aerobraking', category: 'Technology', def: 'Using a planet\'s atmosphere to slow down a spacecraft and reduce its orbit, saving fuel. Used by Mars orbiters like Mars Reconnaissance Orbiter.' },
    { term: 'Space Debris', category: 'Technology', def: 'Non-functional objects in orbit — defunct satellites, rocket stages, fragments. Over 36,000 objects larger than 10cm tracked; poses collision risks (Kessler syndrome).' },
    { term: 'Sol (Mars Day)', category: 'Technology', def: 'A Martian day lasting about 24 hours 39 minutes. Mars rover missions count mission progress in sols. Curiosity has operated for over 4,000 sols.' },

    // Earth Observation
    { term: 'MODIS', category: 'Earth Observation', def: 'Moderate Resolution Imaging Spectroradiometer — a key instrument on NASA\'s Terra and Aqua satellites. Observes land, oceans, and atmosphere in 36 spectral bands.' },
    { term: 'FIRMS', category: 'Earth Observation', def: 'Fire Information for Resource Management System — NASA\'s near-real-time fire detection system using MODIS and VIIRS satellite data. Powers Celestia\'s fire hotspot map.' },
    { term: 'EPIC Camera', category: 'Earth Observation', def: 'Earth Polychromatic Imaging Camera aboard DSCOVR at the L1 Lagrange point. Captures full-disc Earth images daily from 1.5 million km away.' },
    { term: 'DSCOVR', category: 'Earth Observation', def: 'Deep Space Climate Observatory — a NOAA satellite at the L1 point monitoring solar wind, space weather, and Earth\'s radiation budget.' },
    { term: 'VIIRS', category: 'Earth Observation', def: 'Visible Infrared Imaging Radiometer Suite — a sensor on Suomi NPP and NOAA-20 satellites providing high-res imagery for weather, fire detection, and ocean monitoring.' },
    { term: 'Remote Sensing', category: 'Earth Observation', def: 'Acquiring information about Earth from sensors on satellites or aircraft without physical contact. Includes optical, radar, and thermal imaging.' },
];

// ====== SPACE ORGANIZATIONS ======
const ORGANIZATIONS = [
    {
        name: 'NASA',
        fullName: 'National Aeronautics and Space Administration',
        country: 'United States',
        founded: 1958,
        hq: 'Washington, D.C.',
        desc: 'The world\'s most prominent space agency. Operates the ISS, Hubble and James Webb telescopes, Mars rovers (Curiosity, Perseverance), and planetary missions. Responsible for the Apollo Moon landings and the Space Shuttle program.',
        website: 'https://www.nasa.gov',
        color: '#0B3D91',
        keyMissions: ['Apollo', 'Space Shuttle', 'ISS', 'Hubble', 'JWST', 'Mars 2020', 'Artemis'],
    },
    {
        name: 'ESA',
        fullName: 'European Space Agency',
        country: 'Europe (22 member states)',
        founded: 1975,
        hq: 'Paris, France',
        desc: 'Europe\'s gateway to space. Develops launch vehicles (Ariane), conducts science missions (Rosetta, Gaia), and partners with NASA on the ISS and JWST. Pioneered the first comet landing with Philae.',
        website: 'https://www.esa.int',
        color: '#003087',
        keyMissions: ['Rosetta/Philae', 'Gaia', 'ExoMars', 'JUICE', 'Euclid', 'Ariane'],
    },
    {
        name: 'ISRO',
        fullName: 'Indian Space Research Organisation',
        country: 'India',
        founded: 1969,
        hq: 'Bengaluru, India',
        desc: 'Known for cost-effective missions and remarkable achievements. First Asian agency to reach Mars orbit (Mangalyaan, 2014). Chandrayaan-3 achieved first-ever south pole lunar landing in 2023. Operates GSLV and PSLV launch vehicles.',
        website: 'https://www.isro.gov.in',
        color: '#FF6B35',
        keyMissions: ['Chandrayaan-3', 'Mangalyaan', 'Gaganyaan', 'Aditya-L1', 'PSLV-C37 (104 sats)'],
    },
    {
        name: 'JAXA',
        fullName: 'Japan Aerospace Exploration Agency',
        country: 'Japan',
        founded: 2003,
        hq: 'Chōfu, Tokyo',
        desc: 'Japan\'s unified space agency formed from three predecessors. Specializes in asteroid sample return (Hayabusa missions), Earth observation, and space science. Contributed the Kibo module to the ISS.',
        website: 'https://www.jaxa.jp/en',
        color: '#1E4D8C',
        keyMissions: ['Hayabusa2', 'SLIM', 'Kibo (ISS)', 'H3 Launch Vehicle', 'MMX'],
    },
    {
        name: 'Roscosmos',
        fullName: 'Roscosmos State Corporation',
        country: 'Russia',
        founded: 1992,
        hq: 'Moscow, Russia',
        desc: 'Successor to the Soviet space program that launched the first satellite (Sputnik, 1957), first human in space (Yuri Gagarin, 1961), and first space station (Salyut). Operates the Soyuz crewed vehicle and segments of the ISS.',
        website: 'https://www.roscosmos.ru/en',
        color: '#C41E3A',
        keyMissions: ['Sputnik', 'Vostok 1', 'Mir', 'Soyuz', 'ISS Segments', 'Luna 25'],
    },
    {
        name: 'CNSA',
        fullName: 'China National Space Administration',
        country: 'China',
        founded: 1993,
        hq: 'Beijing, China',
        desc: 'Rapidly advancing agency with an independent space station (Tiangong), lunar sample return (Chang\'e 5), and the first rover on the far side of the Moon (Chang\'e 4/Yutu-2). Plans crewed lunar missions by 2030.',
        website: 'https://www.cnsa.gov.cn/english',
        color: '#DE2910',
        keyMissions: ['Tiangong', 'Chang\'e 4/5/6', 'Tianwen-1/Zhurong', 'Long March 5B'],
    },
    {
        name: 'SpaceX',
        fullName: 'Space Exploration Technologies Corp.',
        country: 'United States (Private)',
        founded: 2002,
        hq: 'Hawthorne, California',
        desc: 'Elon Musk\'s private space company that revolutionized the industry with reusable rockets (Falcon 9). Operates Crew Dragon for ISS missions, Starlink satellite internet, and is developing the Starship super-heavy launch vehicle.',
        website: 'https://www.spacex.com',
        color: '#005288',
        keyMissions: ['Falcon 9/Heavy', 'Crew Dragon', 'Starlink', 'Starship', 'Polaris'],
    },
    {
        name: 'CSA',
        fullName: 'Canadian Space Agency',
        country: 'Canada',
        founded: 1989,
        hq: 'Saint-Hubert, Quebec',
        desc: 'Key ISS partner, known for the Canadarm/Canadarm2 robotic arms. Contributed instruments to JWST and OSIRIS-REx. Developing Canadarm3 for the Lunar Gateway station.',
        website: 'https://www.asc-csa.gc.ca',
        color: '#FF0000',
        keyMissions: ['Canadarm2', 'JWST (FGS/NIRISS)', 'Lunar Gateway', 'RADARSAT'],
    },
    {
        name: 'KARI / KASA',
        fullName: 'Korea Aerospace Research Institute / Korea AeroSpace Administration',
        country: 'South Korea',
        founded: 1989,
        hq: 'Daejeon, South Korea',
        desc: 'South Korea\'s space agency. Successfully launched the Nuri (KSLV-II) rocket domestically in 2023. Orbited the Danuri lunar probe and is planning robotic Moon landings.',
        website: 'https://www.kari.re.kr/eng',
        color: '#0047A0',
        keyMissions: ['Nuri (KSLV-II)', 'Danuri (KPLO)', 'Next-gen launch vehicle'],
    },
    {
        name: 'NOAA SWPC',
        fullName: 'Space Weather Prediction Center (NOAA)',
        country: 'United States',
        founded: 1965,
        hq: 'Boulder, Colorado',
        desc: 'Part of NOAA, the SWPC provides real-time space weather monitoring, forecasts, and alerts. Their data powers Celestia\'s AuraWatch module — Kp index, solar wind, and geomagnetic storm warnings.',
        website: 'https://www.swpc.noaa.gov',
        color: '#003087',
        keyMissions: ['Space Weather Alerts', 'Kp Index', 'Solar Wind Monitoring', 'DSCOVR'],
    },
];

// ====== DATA INTERPRETATION GUIDES ======
const DATA_GUIDES = [
    {
        title: 'Reading the Kp Index',
        module: 'AuraWatch',
        icon: '📊',
        content: 'The Kp index (0-9) measures geomagnetic disturbance. Kp 0-2 means quiet conditions, Kp 3-4 is unsettled, Kp 5+ indicates a geomagnetic storm (G1-G5). Higher Kp = auroras visible at lower latitudes. Kp 7+ means auroras could be seen in mid-latitudes like London or New York.',
    },
    {
        title: 'Understanding NEO Hazard Data',
        module: 'SkyPulse',
        icon: '☄️',
        content: 'Near-Earth Object data shows miss distance (how far it passes from Earth), diameter estimates (min/max), and relative velocity. "Potentially hazardous" means it passes within 0.05 AU (~7.5 million km) AND is larger than 140m. This doesn\'t mean impact is imminent — it\'s a monitoring classification.',
    },
    {
        title: 'Fire Confidence Levels',
        module: 'EarthWatch',
        icon: '🔥',
        content: 'MODIS fire detections show brightness temperature (Kelvin) and confidence percentage. >90% = very likely fire; 75-89% = probable fire; 60-74% = possible fire; <60% = low confidence (could be volcanic activity, gas flares, or hot surfaces). Brighter = hotter fire.',
    },
    {
        title: 'Mars Sol vs Earth Date',
        module: 'Missions',
        icon: '📅',
        content: 'A "sol" is a Martian solar day (24h 39m 35s). Sol 1 = the rover\'s first day on Mars. You can convert between sol and Earth date. Curiosity landed Aug 6, 2012 (Sol 0). Higher sol numbers = more recent photos. Some sols have no photos (rover was driving, sleeping, or in safe mode).',
    },
    {
        title: 'Solar Wind Speed & Density',
        module: 'AuraWatch',
        icon: '💨',
        content: 'Normal solar wind: ~400 km/s speed, ~5 protons/cm³ density. During CME impacts: speed can exceed 800 km/s with density spikes to 20-50/cm³. Higher speed + density = stronger geomagnetic effects. The Bz component of the magnetic field matters most — southward Bz enables aurora activity.',
    },
    {
        title: 'ISS Tracking Coordinates',
        module: 'SkyPulse',
        icon: '🛰️',
        content: 'The ISS orbits at ~408 km altitude, traveling at 27,600 km/h. Latitude ranges from -51.6° to +51.6° (the orbital inclination). Longitude changes continuously. One full orbit takes ~90 minutes. The trail line shows recent orbital path — useful for predicting when it might pass over your location.',
    },
];

const ALL_CATEGORIES = ['All', ...new Set(GLOSSARY.map(g => g.category))];

export default function SpaceClassPage() {
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');
    const [expandedOrg, setExpandedOrg] = useState(null);

    const filteredGlossary = useMemo(() => {
        return GLOSSARY.filter(item => {
            const matchesCategory = category === 'All' || item.category === category;
            const matchesSearch = !search ||
                item.term.toLowerCase().includes(search.toLowerCase()) ||
                item.def.toLowerCase().includes(search.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [search, category]);

    return (
        <div className="pageContainer">
            <div className="pageHeader">
                <h1 className="sectionTitle">SpaceClass</h1>
                <p className="sectionSubtitle">
                    Your space knowledge hub — interactive 3D exploration, comprehensive glossary, organization profiles,
                    and guides to help you understand every data point on Celestia.
                </p>
            </div>

            <div className={styles.grid}>
                {/* NASA Eyes on the Solar System */}
                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2>NASA's EYES on the SOLAR SYSTEM</h2>
                        {/* <span className="badge badgeInfo">3D Interactive</span> */}
                    </div>
                    <p className={styles.sectionDesc}>
                        Explore the solar system in stunning 3D — fly between planets, follow spacecraft,
                        and witness cosmic events in real-time. Powered by NASA/JPL.
                    </p>
                    <div className={styles.nasaEyesWrapper}>
                        <iframe
                            src="https://eyes.nasa.gov/apps/solar-system/#/home"
                            title="NASA Eyes on the Solar System"
                            className={styles.nasaEyesFrame}
                            allowFullScreen
                            allow="fullscreen; autoplay"
                        />
                        <div className={styles.nasaEyesOverlay}>
                            <a href="https://eyes.nasa.gov/apps/solar-system/#/home" target="_blank" rel="noopener noreferrer" className={styles.nasaEyesLink}>
                                Open Full Screen ↗
                            </a>
                        </div>
                    </div>
                </section>

                {/* Data Interpretation Guides */}
                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2>Understanding Celestia&apos;s Data</h2>
                        <span className="badge badgeSuccess">Interpretability</span>
                    </div>
                    <p className={styles.sectionDesc}>
                        Quick guides to help you understand what the numbers, charts, and indicators across Celestia actually mean.
                    </p>
                    <div className={styles.guidesGrid}>
                        {DATA_GUIDES.map((guide, i) => (
                            <div key={i} className={`${styles.guideCard} card`}>
                                <div className={styles.guideHeader}>
                                    <span className={styles.guideIcon}>{guide.icon}</span>
                                    <div>
                                        <h4>{guide.title}</h4>
                                        <span className={styles.guideModule}>{guide.module}</span>
                                    </div>
                                </div>
                                <p>{guide.content}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Space Organizations */}
                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2>Space Organizations</h2>
                        <span className="badge badgeInfo">{ORGANIZATIONS.length} Agencies</span>
                    </div>
                    <p className={styles.sectionDesc}>
                        The agencies and companies pushing the boundaries of human space exploration.
                    </p>
                    <div className={styles.orgsGrid}>
                        {ORGANIZATIONS.map((org, i) => (
                            <div
                                key={i}
                                className={`${styles.orgCard} card ${expandedOrg === i ? styles.orgCardExpanded : ''}`}
                                onClick={() => setExpandedOrg(expandedOrg === i ? null : i)}
                            >
                                <div className={styles.orgHeader}>
                                    <div className={styles.orgName} style={{ borderLeftColor: org.color }}>
                                        <h3>{org.name}</h3>
                                        <span className={styles.orgFullName}>{org.fullName}</span>
                                    </div>
                                    <span className={styles.orgToggle}>{expandedOrg === i ? '▲' : '▼'}</span>
                                </div>
                                <div className={styles.orgMeta}>
                                    <span>{org.country}</span>
                                    <span>Est. {org.founded}</span>
                                    <span>{org.hq}</span>
                                </div>
                                {expandedOrg === i && (
                                    <div className={styles.orgDetails}>
                                        <p>{org.desc}</p>
                                        <div className={styles.orgMissions}>
                                            <strong>Key Missions:</strong>
                                            <div className={styles.missionTags}>
                                                {org.keyMissions.map((m, j) => (
                                                    <span key={j} className={styles.missionTag} style={{ borderColor: org.color, color: org.color }}>{m}</span>
                                                ))}
                                            </div>
                                        </div>
                                        <a href={org.website} target="_blank" rel="noopener noreferrer" className={styles.orgWebsite}>
                                            Visit Website ↗
                                        </a>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                {/* Space Glossary (Dictionary) */}
                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2>Space Dictionary</h2>
                        <span className="badge badgeInfo">{GLOSSARY.length} Terms</span>
                    </div>
                    <p className={styles.sectionDesc}>
                        A comprehensive reference of space terminology — from fundamental concepts to the specific metrics shown across Celestia.
                    </p>

                    {/* Search & Filter */}
                    <div className={styles.glossaryControls}>
                        <input
                            type="text"
                            className="input"
                            placeholder="Search terms..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            style={{ maxWidth: '320px' }}
                        />
                        <div className="tabList">
                            {ALL_CATEGORIES.map(cat => (
                                <button
                                    key={cat}
                                    className={`tab ${category === cat ? 'tabActive' : ''}`}
                                    onClick={() => setCategory(cat)}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className={styles.glossaryCount}>
                        Showing {filteredGlossary.length} of {GLOSSARY.length} terms
                        {category !== 'All' && <span> in <strong>{category}</strong></span>}
                        {search && <span> matching &quot;<strong>{search}</strong>&quot;</span>}
                    </div>

                    <div className={styles.glossary}>
                        {filteredGlossary.length === 0 ? (
                            <div className="emptyState">
                                <div className="emptyIcon"></div>
                                <p>No terms found. Try a different search or category.</p>
                            </div>
                        ) : (
                            filteredGlossary.map((item, i) => (
                                <div key={i} className={`${styles.glossaryItem} card`}>
                                    <div className={styles.glossaryHeader}>
                                        <h4>{item.term}</h4>
                                        <span className={styles.glossaryCategory}>{item.category}</span>
                                    </div>
                                    <p>{item.def}</p>
                                </div>
                            ))
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}
