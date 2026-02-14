export const METEOR_SHOWERS = [
    {
        id: 'quadrantids',
        name: 'Quadrantids',
        viewId: 'Quadrantids',
        peak: 'Jan 3-4',
        zhr: 110,
        moon: 'Last Quarter',
        desc: 'Known for bright fireball meteors. Best seen from the Northern Hemisphere.',
        active: 'Dec 28 - Jan 12',
        kidFriendly: 'Space rocks dancing across the sky like fireworks! 🎆',
        funFact: 'You could see up to 110 shooting stars per hour at its peak!',
        emoji: '✨'
    },
    {
        id: 'lyrids',
        name: 'Lyrids',
        viewId: 'Lyrids',
        peak: 'Apr 22-23',
        zhr: 18,
        moon: 'Full Moon',
        desc: 'One of the oldest known meteor showers. Produced by comet C/1861 G1 Thatcher.',
        active: 'Apr 14 - Apr 30',
        kidFriendly: 'Ancient space rocks from way before dinosaurs! 🦕',
        funFact: 'The Lyrids have been seen for over 2,700 years! People watched them in ancient China.',
        emoji: '🌟'
    },
    {
        id: 'eta-aquariids',
        name: 'Eta Aquariids',
        viewId: 'Eta-Aquariids',
        peak: 'May 6-7',
        zhr: 50,
        moon: 'Waning Crescent',
        desc: 'Created by dust from Halley\'s Comet. Best seen in the Southern Hemisphere.',
        active: 'Apr 19 - May 28',
        kidFriendly: 'Tiny pieces from Halley\'s famous space comet! 💫',
        funFact: 'Halley\'s Comet only visits Earth every 76 years. Next time: 2061!',
        emoji: '⭐'
    },
    {
        id: 'perseids',
        name: 'Perseids',
        viewId: 'Perseids',
        peak: 'Aug 12-13',
        zhr: 100,
        moon: 'Waning Gibbous',
        desc: 'The most popular shower of the year. Fast, bright meteors with persistent trains.',
        active: 'Jul 17 - Aug 24',
        kidFriendly: 'The BEST meteor show of the year—super bright and fast! 🚀',
        funFact: 'These meteors zoom across the sky at 140,000 mph! That\'s faster than any rocket!',
        emoji: '💥'
    },
    {
        id: 'orionids',
        name: 'Orionids',
        viewId: 'Orionids',
        peak: 'Oct 21-22',
        zhr: 20,
        moon: 'Waxing Gibbous',
        desc: 'Also from Halley\'s Comet. Fast meteors that leave glowing trains.',
        active: 'Oct 2 - Nov 7',
        kidFriendly: 'More pieces from Halley\'s Comet leaving bright trails! ✨',
        funFact: 'You can see these meteors emerging from the constellation Orion (the Hunter).',
        emoji: '🔦'
    },
    {
        id: 'geminids',
        name: 'Geminids',
        viewId: 'Geminids',
        peak: 'Dec 13-14',
        zhr: 150,
        moon: 'Waxing Crescent',
        desc: 'The king of meteor showers. Multicolored, slow, and bright meteors from asteroid 3200 Phaethon.',
        active: 'Dec 4 - Dec 17',
        kidFriendly: 'The KING of all meteor showers! Colorful, slow, and amazing! 👑',
        funFact: 'These come from an asteroid that acts like a comet—it\'s special AND rare!',
        emoji: '👑'
    }
];

export const COMETS = [
    {
        id: '12p',
        name: '12P/Pons-Brooks',
        type: 'Halley-type',
        status: 'Recently Visible',
        perihelion: 'Apr 21, 2024',
        desc: 'A "cryovolcanic" comet that often flares up, sometimes resembling distinct horns.',
        image: 'https://upload.wikimedia.org/wikipedia/commons/b/b2/Comet_12P_Pons-Brooks_on_March_13%2C_2024.jpg'
    },
    {
        id: 'tsuchinshan',
        name: 'C/2023 A3',
        type: 'Oort Cloud',
        status: 'Inbound',
        perihelion: 'Sep 27, 2024',
        desc: 'Tsuchinshan-ATLAS. Predicted to become bright enough to be visible to the naked eye in late 2024.',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/C2023_A3_%28Tsuchinshan%E2%80%93ATLAS%29_2024-05-04.jpg/800px-C2023_A3_%28Tsuchinshan%E2%80%93ATLAS%29_2024-05-04.jpg'
    },
    {
        id: 'halley',
        name: '1P/Halley',
        type: 'Halley-type',
        status: 'Deep Space',
        perihelion: 'Feb 9, 1986',
        next: 'Jul 28, 2061',
        desc: 'The most famous short-period comet. Currently beyond the orbit of Neptune, slowly turning back.',
        image: 'https://upload.wikimedia.org/wikipedia/commons/2/20/Halley_Giotto.jpg'
    },
    {
        id: 'neowise',
        name: 'C/2020 F3 (NEOWISE)',
        type: 'Long-period',
        status: 'Outbound',
        perihelion: 'Jul 3, 2020',
        desc: 'A spectacular comet visible in 2020. Won\'t return for another 6,800 years.',
        image: 'https://upload.wikimedia.org/wikipedia/commons/6/63/Comet_NEOWISE_above_Split%2C_Croatia.jpg'
    }
];

export const CONSTELLATIONS = [
    {
        id: 'orion',
        name: 'Orion',
        meaning: 'The Hunter',
        season: 'Winter',
        ra: '5h',
        dec: '+5°',
        stars: [
            { id: 'betelgeuse', x: 25, y: 25, mag: 0.5, name: 'Betelgeuse', color: '#ffcc99' },
            { id: 'bellatrix', x: 75, y: 30, mag: 1.6, name: 'Bellatrix', color: '#ccccff' },
            { id: 'mintaka', x: 45, y: 50, mag: 2.2, name: 'Mintaka', color: '#ffffff' }, // Belt 1
            { id: 'alnilam', x: 50, y: 52, mag: 1.7, name: 'Alnilam', color: '#ffffff' }, // Belt 2
            { id: 'alnitak', x: 55, y: 54, mag: 1.7, name: 'Alnitak', color: '#ffffff' }, // Belt 3
            { id: 'saiph', x: 30, y: 80, mag: 2.0, name: 'Saiph', color: '#ccccff' },
            { id: 'rigel', x: 70, y: 85, mag: 0.1, name: 'Rigel', color: '#99ccff' }
        ],
        lines: [
            ['betelgeuse', 'alnitak'],
            ['bellatrix', 'mintaka'],
            ['mintaka', 'alnilam'],
            ['alnilam', 'alnitak'],
            ['alnitak', 'saiph'],
            ['mintaka', 'rigel'],
            ['betelgeuse', 'bellatrix'], // Shoulders
            ['saiph', 'rigel'] // Feet - usually not connected directly but open
            // Simplified "Hourglass" + Belt
        ]
    },
    {
        id: 'ursa_major',
        name: 'Ursa Major',
        meaning: 'The Great Bear (Big Dipper)',
        season: 'Spring',
        stars: [
            { id: 'dubhe', x: 70, y: 30, mag: 1.8, name: 'Dubhe' },
            { id: 'merak', x: 70, y: 45, mag: 2.3, name: 'Merak' },
            { id: 'phecda', x: 55, y: 50, mag: 2.4, name: 'Phecda' },
            { id: 'megrez', x: 50, y: 35, mag: 3.3, name: 'Megrez' },
            { id: 'alioth', x: 40, y: 32, mag: 1.7, name: 'Alioth' },
            { id: 'mizar', x: 30, y: 28, mag: 2.2, name: 'Mizar' },
            { id: 'alkaid', x: 15, y: 20, mag: 1.8, name: 'Alkaid' }
        ],
        lines: [
            ['dubhe', 'merak'],
            ['merak', 'phecda'],
            ['phecda', 'megrez'],
            ['megrez', 'dubhe'], // Bowl
            ['megrez', 'alioth'],
            ['alioth', 'mizar'],
            ['mizar', 'alkaid'] // Handle
        ]
    },
    {
        id: 'cassiopeia',
        name: 'Cassiopeia',
        meaning: 'The Queen',
        season: 'Autumn',
        stars: [
            { id: 'caph', x: 10, y: 50, mag: 2.2, name: 'Caph' },
            { id: 'schedar', x: 30, y: 70, mag: 2.2, name: 'Schedar' },
            { id: 'cih', x: 50, y: 55, mag: 2.1, name: 'Cih' }, // Gamma Cas
            { id: 'ruchbah', x: 70, y: 65, mag: 2.6, name: 'Ruchbah' },
            { id: 'segin', x: 90, y: 40, mag: 3.3, name: 'Segin' }
        ],
        lines: [
            ['caph', 'schedar'],
            ['schedar', 'cih'],
            ['cih', 'ruchbah'],
            ['ruchbah', 'segin'] // W shape
        ]
    }
];
