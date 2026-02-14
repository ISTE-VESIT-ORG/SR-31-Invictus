// CelesTrak active satellites API route
// Fetches GP (General Perturbations) data in JSON format
// Caches for 2 hours since TLE data doesn't change frequently

let cache = { data: null, timestamp: 0 };
const CACHE_DURATION = 2 * 60 * 60 * 1000; // 2 hours

// Notable satellites to highlight
const NOTABLE_NORAD_IDS = [
    25544,  // ISS
    48274,  // CSS (Tiangong)
    43013,  // NOAA-20
    27424,  // XMM-Newton
    20580,  // Hubble
    54216,  // JWST (approximate)
];

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const group = searchParams.get('group') || 'stations'; // stations, active, starlink, etc.
    const limit = parseInt(searchParams.get('limit') || '50');
    const notable = searchParams.get('notable') === 'true';

    const cacheKey = `${group}_${notable}`;

    try {
        // Check cache
        if (cache.data && cache.key === cacheKey && Date.now() - cache.timestamp < CACHE_DURATION) {
            const data = notable
                ? cache.data
                : cache.data.slice(0, limit);
            return Response.json({ satellites: data, cached: true, total: cache.data.length });
        }

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 15000);

        const url = `https://celestrak.org/NORAD/elements/gp.php?GROUP=${group}&FORMAT=json`;
        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(timeout);

        if (!res.ok) {
            throw new Error(`CelesTrak returned ${res.status}`);
        }

        let data = await res.json();

        // If notable mode, filter to well-known satellites
        if (notable) {
            const notableSet = new Set(NOTABLE_NORAD_IDS);
            data = data.filter(sat => notableSet.has(sat.NORAD_CAT_ID));
        }

        // Cache the result
        cache = { data, timestamp: Date.now(), key: cacheKey };

        const result = notable ? data : data.slice(0, limit);
        return Response.json({ satellites: result, cached: false, total: data.length });

    } catch (err) {
        // Generate a current-epoch TLE so SGP4 propagation works
        const now = new Date();
        const yr = now.getUTCFullYear() % 100;
        const startOfYear = new Date(Date.UTC(now.getUTCFullYear(), 0, 1));
        const dayOfYear = ((now - startOfYear) / 86400000 + 1).toFixed(8).padStart(12, ' ');
        const epoch = `${String(yr).padStart(2, '0')}${dayOfYear}`;

        const line1 = `1 25544U 98067A   ${epoch}  .00019000  00000-0  36000-3 0  9990`;
        const line2 = `2 25544  51.6416 247.4627 0002000 130.5360 325.0288 15.49970000491690`;

        return Response.json({
            satellites: [{
                OBJECT_NAME: 'ISS (ZARYA)',
                OBJECT_ID: '1998-067A',
                NORAD_CAT_ID: 25544,
                EPOCH: now.toISOString(),
                MEAN_MOTION: 15.4997,
                ECCENTRICITY: 0.0002,
                INCLINATION: 51.6416,
                RA_OF_ASC_NODE: 247.4627,
                ARG_OF_PERICENTER: 130.536,
                MEAN_ANOMALY: 325.0288,
                BSTAR: 0.00036,
                MEAN_MOTION_DOT: 0.00019,
                MEAN_MOTION_DDOT: 0,
                REV_AT_EPOCH: 49169,
                ELEMENT_SET_NO: 999,
                EPHEMERIS_TYPE: 0,
                CLASSIFICATION_TYPE: 'U',
                TLE_LINE1: line1,
                TLE_LINE2: line2,
            }],
            cached: false,
            total: 1,
            fallback: true,
        });
    }
}
