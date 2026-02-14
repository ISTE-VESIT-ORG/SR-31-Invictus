// ====================================================================
// Celestia — Upcoming Astronomical Events Database (2025–2027)
// Used by the push notification system to alert users about sky events.
// ====================================================================

// Helper: parse "Mon DD" into a Date for the current/next occurrence
function nextOccurrence(month, day) {
    const now = new Date();
    const year = now.getFullYear();
    const date = new Date(year, month - 1, day);
    // If the date has already passed this year, use next year
    if (date < new Date(now.getFullYear(), now.getMonth(), now.getDate())) {
        date.setFullYear(year + 1);
    }
    return date.toISOString().split('T')[0]; // YYYY-MM-DD
}

// ============ METEOR SHOWERS (annual, recurring) ============
export const METEOR_SHOWER_EVENTS = [
    {
        id: 'quadrantids-peak',
        type: 'meteor',
        title: '🌠 Quadrantids Meteor Shower Peak',
        date: nextOccurrence(1, 3),
        description: 'Up to 110 meteors/hour! Best after midnight facing NE. Known for bright fireballs.',
        url: '/cosmos',
        icon: '🌠',
    },
    {
        id: 'lyrids-peak',
        type: 'meteor',
        title: '🌠 Lyrids Meteor Shower Peak',
        date: nextOccurrence(4, 22),
        description: 'Up to 18 meteors/hour from comet Thatcher. Look toward the constellation Lyra after midnight.',
        url: '/cosmos',
        icon: '🌠',
    },
    {
        id: 'eta-aquariids-peak',
        type: 'meteor',
        title: '🌠 Eta Aquariids Meteor Shower Peak',
        date: nextOccurrence(5, 6),
        description: 'Up to 50 meteors/hour from Halley\'s Comet debris. Best viewed in Southern Hemisphere.',
        url: '/cosmos',
        icon: '🌠',
    },
    {
        id: 'perseids-peak',
        type: 'meteor',
        title: '🌠 Perseids Meteor Shower Peak',
        date: nextOccurrence(8, 12),
        description: 'The most popular shower! Up to 100 fast, bright meteors/hour with persistent trains.',
        url: '/cosmos',
        icon: '🌠',
    },
    {
        id: 'orionids-peak',
        type: 'meteor',
        title: '🌠 Orionids Meteor Shower Peak',
        date: nextOccurrence(10, 21),
        description: 'Up to 20 meteors/hour from Halley\'s Comet. Fast meteors that leave glowing trains.',
        url: '/cosmos',
        icon: '🌠',
    },
    {
        id: 'leonids-peak',
        type: 'meteor',
        title: '🌠 Leonids Meteor Shower Peak',
        date: nextOccurrence(11, 17),
        description: 'Up to 15 meteors/hour with occasional storm years producing thousands. Look toward Leo.',
        url: '/cosmos',
        icon: '🌠',
    },
    {
        id: 'geminids-peak',
        type: 'meteor',
        title: '🌠 Geminids Meteor Shower Peak',
        date: nextOccurrence(12, 13),
        description: 'King of meteor showers! Up to 150 multicolored meteors/hour from asteroid 3200 Phaethon.',
        url: '/cosmos',
        icon: '🌠',
    },
    {
        id: 'ursids-peak',
        type: 'meteor',
        title: '🌠 Ursids Meteor Shower Peak',
        date: nextOccurrence(12, 22),
        description: 'Up to 10 meteors/hour radiating from Ursa Minor. A quiet shower near the winter solstice.',
        url: '/cosmos',
        icon: '🌠',
    },
];

// ============ LUNAR ECLIPSES (specific dates) ============
export const ECLIPSE_EVENTS = [
    {
        id: 'lunar-eclipse-2025-03-14',
        type: 'eclipse',
        title: '🌑 Total Lunar Eclipse',
        date: '2025-03-14',
        description: 'Total lunar eclipse visible from the Americas, Europe, and Africa. The Moon turns blood red.',
        url: '/cosmos',
        icon: '🌑',
    },
    {
        id: 'lunar-eclipse-2025-09-07',
        type: 'eclipse',
        title: '🌗 Total Lunar Eclipse',
        date: '2025-09-07',
        description: 'Total lunar eclipse visible from Europe, Africa, Asia and Australia.',
        url: '/cosmos',
        icon: '🌗',
    },
    {
        id: 'solar-eclipse-2025-03-29',
        type: 'eclipse',
        title: '🌘 Partial Solar Eclipse',
        date: '2025-03-29',
        description: 'Partial solar eclipse visible from NW Africa, Europe, and northern Russia. NEVER look directly at the Sun!',
        url: '/cosmos',
        icon: '🌘',
    },
    {
        id: 'solar-eclipse-2025-09-21',
        type: 'eclipse',
        title: '🌘 Partial Solar Eclipse',
        date: '2025-09-21',
        description: 'Partial solar eclipse visible from Australia, New Zealand, and Antarctica.',
        url: '/cosmos',
        icon: '🌘',
    },
    {
        id: 'lunar-eclipse-2026-03-03',
        type: 'eclipse',
        title: '🌑 Total Lunar Eclipse',
        date: '2026-03-03',
        description: 'Total lunar eclipse visible from eastern Asia, Australia, the Pacific, and the Americas.',
        url: '/cosmos',
        icon: '🌑',
    },
    {
        id: 'solar-eclipse-2026-08-12',
        type: 'eclipse',
        title: '☀️ Total Solar Eclipse',
        date: '2026-08-12',
        description: 'Total solar eclipse visible from Arctic, Greenland, Iceland, and Spain. A rare event!',
        url: '/cosmos',
        icon: '☀️',
    },
    {
        id: 'lunar-eclipse-2026-08-28',
        type: 'eclipse',
        title: '🌗 Partial Lunar Eclipse',
        date: '2026-08-28',
        description: 'Partial lunar eclipse visible from eastern Asia, Australasia, the Pacific, and the Americas.',
        url: '/cosmos',
        icon: '🌗',
    },
];

// ============ PLANET ALIGNMENTS & CONJUNCTIONS ============
export const ALIGNMENT_EVENTS = [
    {
        id: 'venus-jupiter-2025-02-17',
        type: 'alignment',
        title: '🪐 Venus-Jupiter Conjunction',
        date: '2025-02-17',
        description: 'Venus and Jupiter appear extremely close in the evening sky. Visible to the naked eye after sunset.',
        url: '/cosmos',
        icon: '🪐',
    },
    {
        id: 'planet-parade-2025-02-28',
        type: 'alignment',
        title: '✨ Grand Planet Alignment',
        date: '2025-02-28',
        description: 'Six planets (Jupiter, Saturn, Mars, Venus, Mercury, Uranus) align across the evening sky. A spectacular sight!',
        url: '/cosmos',
        icon: '✨',
    },
    {
        id: 'mars-opposition-2025-01-16',
        type: 'alignment',
        title: '🔴 Mars at Opposition',
        date: '2025-01-16',
        description: 'Mars is closest to Earth and fully illuminated by the Sun. Best visibility of the year — bright red all night.',
        url: '/cosmos',
        icon: '🔴',
    },
    {
        id: 'saturn-opposition-2025-09-21',
        type: 'alignment',
        title: '🪐 Saturn at Opposition',
        date: '2025-09-21',
        description: 'Saturn is at its closest to Earth. Rings are visible through a small telescope. Visible all night.',
        url: '/cosmos',
        icon: '🪐',
    },
    {
        id: 'jupiter-opposition-2025-12-08',
        type: 'alignment',
        title: '🪐 Jupiter at Opposition',
        date: '2025-12-08',
        description: 'Jupiter at its brightest and closest. Great Galilean moons visible through binoculars.',
        url: '/cosmos',
        icon: '🪐',
    },
    {
        id: 'venus-saturn-2026-01-18',
        type: 'alignment',
        title: '🪐 Venus-Saturn Conjunction',
        date: '2026-01-18',
        description: 'Venus passes very close to Saturn in the evening sky — a beautiful naked-eye pairing.',
        url: '/cosmos',
        icon: '🪐',
    },
    {
        id: 'mars-opposition-2027-02-19',
        type: 'alignment',
        title: '🔴 Mars at Opposition',
        date: '2027-02-19',
        description: 'Mars at opposition — closest approach to Earth, shining bright red all night long.',
        url: '/cosmos',
        icon: '🔴',
    },
];

// ============ SPECIAL MOON EVENTS ============
export const MOON_EVENTS = [
    {
        id: 'supermoon-2025-10-07',
        type: 'moon',
        title: '🌕 Supermoon',
        date: '2025-10-07',
        description: 'Full Moon at perigee — appears 14% larger and 30% brighter than a typical full moon.',
        url: '/cosmos',
        icon: '🌕',
    },
    {
        id: 'supermoon-2025-11-05',
        type: 'moon',
        title: '🌕 Supermoon (Closest of 2025)',
        date: '2025-11-05',
        description: 'The closest and largest Full Moon of 2025! Peak supermoon of the year.',
        url: '/cosmos',
        icon: '🌕',
    },
    {
        id: 'supermoon-2025-12-04',
        type: 'moon',
        title: '🌕 Supermoon',
        date: '2025-12-04',
        description: 'Last supermoon of 2025. Full Moon near perigee — noticeably large and bright.',
        url: '/cosmos',
        icon: '🌕',
    },
];

// ============ SOLSTICES & EQUINOXES ============
export const SOLSTICE_EVENTS = [
    {
        id: 'vernal-equinox-2025',
        type: 'solstice',
        title: '🌸 Vernal Equinox',
        date: nextOccurrence(3, 20),
        description: 'Spring begins in the Northern Hemisphere. Day and night are nearly equal length worldwide.',
        url: '/spaceclass',
        icon: '🌸',
    },
    {
        id: 'summer-solstice-2025',
        type: 'solstice',
        title: '☀️ Summer Solstice',
        date: nextOccurrence(6, 20),
        description: 'Longest day in the Northern Hemisphere. The Sun reaches its highest point in the sky.',
        url: '/spaceclass',
        icon: '☀️',
    },
    {
        id: 'autumnal-equinox-2025',
        type: 'solstice',
        title: '🍂 Autumnal Equinox',
        date: nextOccurrence(9, 22),
        description: 'Fall begins in the Northern Hemisphere. Day and night are nearly equal.',
        url: '/spaceclass',
        icon: '🍂',
    },
    {
        id: 'winter-solstice-2025',
        type: 'solstice',
        title: '❄️ Winter Solstice',
        date: nextOccurrence(12, 21),
        description: 'Shortest day in the Northern Hemisphere. The Sun is at its lowest point. Longest night of the year.',
        url: '/spaceclass',
        icon: '❄️',
    },
];


// ============ GET ALL EVENTS (sorted by date) ============
export function getAllEvents() {
    const all = [
        ...METEOR_SHOWER_EVENTS,
        ...ECLIPSE_EVENTS,
        ...ALIGNMENT_EVENTS,
        ...MOON_EVENTS,
        ...SOLSTICE_EVENTS,
    ];

    return all.sort((a, b) => new Date(a.date) - new Date(b.date));
}

// Get events within the next N days
export function getUpcomingEvents(days = 30) {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const cutoff = new Date(now);
    cutoff.setDate(cutoff.getDate() + days);

    return getAllEvents().filter((e) => {
        const d = new Date(e.date);
        return d >= now && d <= cutoff;
    });
}

// Get events that are happening within a specific window (for notifications)
export function getEventsInWindow(daysAhead = 3) {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const cutoff = new Date(now);
    cutoff.setDate(cutoff.getDate() + daysAhead);

    return getAllEvents().filter((e) => {
        const d = new Date(e.date);
        return d >= now && d <= cutoff;
    });
}
