export const MISSIONS_DATA = [
    {
        id: 'sputnik',
        name: 'Sputnik 1',
        year: '1957',
        agency: 'USSR',
        type: 'Satellite',
        desc: 'The first artificial satellite to orbit Earth.',
        details: 'Launched on October 4, 1957, Sputnik 1 was a polished metal sphere 58 cm in diameter with four external radio antennas to broadcast radio pulses. Its success precipitated the American Sputnik crisis and triggered the Space Race.',
        image: 'https://www.nasa.gov/sites/default/files/styles/full_width_feature/public/thumbnails/image/c-1957-30005.jpg',
        gallery: [
            'https://www.nasa.gov/sites/default/files/styles/full_width_feature/public/thumbnails/image/c-1957-30005.jpg',
            'https://upload.wikimedia.org/wikipedia/commons/b/b0/Sputnik_1.jpg',
            'https://nssdc.gsfc.nasa.gov/planetary/image/sputnik_asm.jpg'
        ],
        featured: true,
        size: 'large',
        color: '#FF6B35'
    },
    {
        id: 'vostok1',
        name: 'Vostok 1',
        year: '1961',
        agency: 'USSR',
        type: 'Human Spaceflight',
        desc: 'First human in space.',
        details: 'Yuri Gagarin became the first human to journey into outer space, completing one orbit of Earth on 12 April 1961.',
        image: 'https://upload.wikimedia.org/wikipedia/commons/d/df/Gagarin_in_Sweden.jpg',
        gallery: [
            'https://upload.wikimedia.org/wikipedia/commons/d/df/Gagarin_in_Sweden.jpg',
            'https://upload.wikimedia.org/wikipedia/commons/b/b8/Vostok_spacecraft.jpg',
            'https://upload.wikimedia.org/wikipedia/commons/e/e6/Vostok_1_capsule.jpg'
        ],
        featured: false,
        size: 'medium',
        color: '#FF3333'
    },
    {
        id: 'apollo11',
        name: 'Apollo 11',
        year: '1969',
        agency: 'NASA',
        type: 'Human Spaceflight',
        desc: 'First humans to land on the Moon.',
        details: 'Mission commander Neil Armstrong and pilot Buzz Aldrin landed the lunar module Eagle on July 20, 1969. Armstrong became the first person to step onto the lunar surface.',
        image: 'https://www.nasa.gov/sites/default/files/styles/full_width_feature/public/thumbnails/image/apollo11-buzz.jpg',
        gallery: [
            'https://www.nasa.gov/sites/default/files/styles/full_width_feature/public/thumbnails/image/apollo11-buzz.jpg',
            'https://www.nasa.gov/sites/default/files/thumbnails/image/aldrin_visor.jpg',
            'https://www.nasa.gov/sites/default/files/thumbnails/image/apollo_11_launch.jpg',
            'https://www.nasa.gov/sites/default/files/thumbnails/image/as11-40-5903.jpg'
        ],
        featured: true,
        size: 'large',
        color: '#FBBF24'
    },
    {
        id: 'voyager',
        name: 'Voyager 1 & 2',
        year: '1977',
        agency: 'NASA',
        type: 'Probe',
        desc: 'The grand tour of the solar system.',
        details: 'Launched to study the outer Solar System, both voyagers have since entered interstellar space. They carry the Golden Record, a phonograph record containing sounds and images selected to portray the diversity of life and culture on Earth.',
        image: 'https://www.jpl.nasa.gov/edu/images/news/voyager.jpg',
        gallery: [
            'https://www.jpl.nasa.gov/edu/images/news/voyager.jpg',
            'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Voyager_spacecraft_model.png/1200px-Voyager_spacecraft_model.png',
            'https://voyager.jpl.nasa.gov/assets/images/golden-record/record-cover.jpg',
            'https://photojournal.jpl.nasa.gov/jpeg/PIA00013.jpg'
        ],
        featured: true,
        size: 'medium',
        color: '#8B5CF6'
    },
    {
        id: 'gps',
        name: 'GPS Navstar',
        year: '1978',
        agency: 'USAF / USSF',
        type: 'Navigation',
        desc: 'Global Positioning System.',
        details: 'The launch of the first Block I satellite in 1978 paved the way for the Global Positioning System, which revolutionized navigation, timing, and positioning for the entire world.',
        image: 'https://upload.wikimedia.org/wikipedia/commons/8/82/GPS_Satellite_NASA_art-iif.jpg',
        gallery: [
            'https://upload.wikimedia.org/wikipedia/commons/8/82/GPS_Satellite_NASA_art-iif.jpg',
            'https://www.gps.gov/multimedia/images/constellation.jpg',
            'https://www.nasa.gov/sites/default/files/thumbnails/image/gps_iii_sv03_mission_patch.jpg'
        ],
        featured: false,
        size: 'small',
        color: '#4C9FFF'
    },
    {
        id: 'hubble',
        name: 'Hubble Telescope',
        year: '1990',
        agency: 'NASA/ESA',
        type: 'Telescope',
        desc: 'Revolutionizing our view of the universe.',
        details: 'Hubble has recorded some of the most detailed visible-light images ever, allowing a deep view into space and time. It has observed the most distant stars and galaxies as well as the planets in our solar system.',
        image: 'https://upload.wikimedia.org/wikipedia/commons/3/3f/HST-SM4.jpeg',
        gallery: [
            'https://upload.wikimedia.org/wikipedia/commons/3/3f/HST-SM4.jpeg',
            'https://esahubble.org/media/archives/images/large/heic1509a.jpg',
            'https://esahubble.org/media/archives/images/large/heic0607a.jpg',
            'https://esahubble.org/media/archives/images/large/heic1307a.jpg'
        ],
        featured: false,
        size: 'medium',
        color: '#4C9FFF'
    },
    {
        id: 'iss',
        name: 'ISS',
        year: '1998',
        agency: 'International',
        type: 'Space Station',
        desc: 'A floating laboratory in low Earth orbit.',
        details: 'The ISS is the largest modular space station in low Earth orbit. It is a multinational collaborative project involving five participating space agencies: NASA, Roscosmos, JAXA, ESA, and CSA.',
        image: 'https://upload.wikimedia.org/wikipedia/commons/0/04/International_Space_Station_after_undocking_of_STS-132.jpg',
        gallery: [
            'https://upload.wikimedia.org/wikipedia/commons/0/04/International_Space_Station_after_undocking_of_STS-132.jpg',
            'https://www.nasa.gov/sites/default/files/thumbnails/image/iss064e052026.jpg',
            'https://www.nasa.gov/sites/default/files/thumbnails/image/iss065e158679.jpg',
            'https://www.nasa.gov/sites/default/files/thumbnails/image/iss_cupola.jpg'
        ],
        featured: true,
        size: 'wide',
        color: '#06D6A0'
    },
    {
        id: 'mars-rovers',
        name: 'Mars Rovers',
        year: '2004',
        agency: 'NASA',
        type: 'Rovers',
        desc: 'Spirit, Opportunity, Curiosity, Perseverance.',
        details: 'A legacy of robotic exploration on the Red Planet. From the twin MER rovers to the nuclear-powered Curiosity and the life-seeking Perseverance, these machines have transformed our understanding of Mars.',
        image: 'https://mars.nasa.gov/system/resources/detail_files/25638_PIA24422-web.jpg',
        gallery: [
            'https://mars.nasa.gov/system/resources/detail_files/25638_PIA24422-web.jpg',
            'https://mars.nasa.gov/system/resources/detail_files/25464_PIA24264-web.jpg',
            'https://mars.nasa.gov/system/resources/detail_files/3847_PIA16239_MAIN-web.jpg'
        ],
        featured: true,
        size: 'large',
        color: '#FF9F1C'
    },
    {
        id: 'starlink',
        name: 'Starlink',
        year: '2019',
        agency: 'SpaceX',
        type: 'Constellation',
        desc: 'Mega-constellation for global internet.',
        details: 'SpaceX started launching Starlink satellites in 2019, creating the largest satellite constellation in history with thousands of units in low Earth orbit to provide high-speed internet access globally.',
        image: 'https://upload.wikimedia.org/wikipedia/commons/2/2c/Starlink_Mission_%2847926144123%29.jpg',
        gallery: [
            'https://upload.wikimedia.org/wikipedia/commons/2/2c/Starlink_Mission_%2847926144123%29.jpg',
            'https://www.nasa.gov/sites/default/files/thumbnails/image/spacex_crew-2_launch_nc.jpg',
            'https://upload.wikimedia.org/wikipedia/commons/9/91/Starlink_satellites_train.jpg'
        ],
        featured: false,
        size: 'medium',
        color: '#FFFFFF'
    },
    {
        id: 'jwst',
        name: 'James Webb',
        year: '2021',
        agency: 'NASA/ESA/CSA',
        type: 'Telescope',
        desc: 'Looking back to the dawn of time.',
        details: 'JWST is the largest optical telescope in space. Its high resolution and sensitivity allow it to view objects too old, distant, or faint for the Hubble Space Telescope.',
        image: 'https://www.nasa.gov/sites/default/files/thumbnails/image/main_image_deep_field_smacs0723-5mb.jpg',
        gallery: [
            'https://www.nasa.gov/sites/default/files/thumbnails/image/main_image_deep_field_smacs0723-5mb.jpg',
            'https://www.nasa.gov/sites/default/files/thumbnails/image/carina_nebula.jpg',
            'https://www.nasa.gov/sites/default/files/thumbnails/image/pillars_of_creation.jpg',
            'https://www.nasa.gov/sites/default/files/thumbnails/image/stsci-01gfavs252r4wtd9q5x85055b8.jpg'
        ],
        featured: true,
        size: 'large',
        color: '#EC4899'
    },
    {
        id: 'artemis',
        name: 'Artemis I',
        year: '2022',
        agency: 'NASA',
        type: 'Human Spaceflight',
        desc: 'Returning humanity to the Moon.',
        details: 'The Artemis program aims to reestablish a human presence on the Moon for the first time since Apollo 17 in 1972. Artemis I was a successful uncrewed test flight of the Orion spacecraft.',
        image: 'https://images-assets.nasa.gov/image/artemis-i-launch-20221116-large/artemis-i-launch-20221116-large~orig.jpg',
        gallery: [
            'https://images-assets.nasa.gov/image/artemis-i-launch-20221116-large/artemis-i-launch-20221116-large~orig.jpg',
            'https://images-assets.nasa.gov/image/artemis-i-flight-day-13-earth-and-moon-eclipsing-sun_52528340243_o/artemis-i-flight-day-13-earth-and-moon-eclipsing-sun_52528340243_o~orig.jpg',
            'https://images-assets.nasa.gov/image/art001e000672/art001e000672~orig.jpg'
        ],
        featured: true,
        size: 'wide',
        color: '#4C9FFF'
    },
    {
        id: 'chandrayaan3',
        name: 'Chandrayaan-3',
        year: '2023',
        agency: 'ISRO',
        type: 'Lander/Rover',
        desc: 'First successful landing near the lunar south pole.',
        details: 'India\'s Chandrayaan-3 successfully landed the Vikram lander and Pragyan rover near the lunar south pole, making India the fourth nation to land on the Moon and the first to reach the polar region.',
        image: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Chandrayaan-3_landing_site_from_Vikram_lander.jpg',
        gallery: [
            'https://upload.wikimedia.org/wikipedia/commons/9/91/Chandrayaan-3_landing_site_from_Vikram_lander.jpg',
            'https://upload.wikimedia.org/wikipedia/commons/b/bc/Chandrayaan-3_rover_rolling_out.jpg',
            'https://upload.wikimedia.org/wikipedia/commons/6/67/Chandrayaan-3_LVM3_M4_Launch.jpg'
        ],
        featured: false,
        size: 'medium',
        color: '#FF6B35'
    },
    {
        id: 'juno',
        name: 'Juno',
        year: '2011',
        agency: 'NASA',
        type: 'Orbiter',
        desc: 'Unlocking the secrets of Jupiter.',
        details: 'Juno is orbiting Jupiter to study gravity, magnetic fields, and atmospheric dynamics. It has captured breathtaking images of Jupiter\'s cyclones.',
        image: 'https://www.missionjuno.swri.edu/Vault/VaultOutput?VaultID=26922&t=1920',
        gallery: [
            'https://www.missionjuno.swri.edu/Vault/VaultOutput?VaultID=26922&t=1920',
            'https://www.nasa.gov/sites/default/files/thumbnails/image/pia21971-16.jpg',
            'https://www.nasa.gov/sites/default/files/thumbnails/image/pia21972-16.jpg'
        ],
        featured: false,
        size: 'small',
        color: '#FF9F1C'
    },
    {
        id: 'newhorizons',
        name: 'New Horizons',
        year: '2006',
        agency: 'NASA',
        type: 'Probe',
        desc: 'First flyby of Pluto and Arrokoth.',
        details: 'New Horizons performed the first reconnaissance of the dwarf planet Pluto and is now exploring the Kuiper Belt.',
        image: 'https://www.nasa.gov/sites/default/files/thumbnails/image/nh-pluto-charon-v2-10-1-15.jpg',
        gallery: [
            'https://www.nasa.gov/sites/default/files/thumbnails/image/nh-pluto-charon-v2-10-1-15.jpg',
            'https://www.nasa.gov/sites/default/files/thumbnails/image/nh-pluto-mountains-plains-9-17-15.jpg',
            'https://www.nasa.gov/sites/default/files/thumbnails/image/nh-charon-neutral-bright-2015-10-1.jpg'
        ],
        featured: false,
        size: 'medium',
        color: '#FBBF24'
    }
];
