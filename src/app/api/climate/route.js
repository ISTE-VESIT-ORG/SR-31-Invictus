// NASA POWER API — solar & meteorological data for any location
// Used for climate monitoring and agricultural planning

const NASA_KEY = process.env.NASA_API_KEY || 'DEMO_KEY';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat') || '28.6139';
    const lng = searchParams.get('lng') || '77.2090';
    const mode = searchParams.get('mode') || 'climate'; // climate or agri

    // Date range: last 365 days
    const end = new Date();
    const start = new Date(end);
    start.setDate(start.getDate() - 365);

    const startStr = formatDate(start);
    const endStr = formatDate(end);

    // Climate parameters
    const climateParams = [
        'T2M',          // Temperature at 2m (°C)
        'T2M_MAX',      // Max temperature
        'T2M_MIN',      // Min temperature
        'PRECTOTCORR',  // Precipitation (mm/day)
        'RH2M',         // Relative Humidity at 2m (%)
        'WS2M',         // Wind Speed at 2m (m/s)
        'ALLSKY_SFC_SW_DWN', // Solar radiation (kW-hr/m²/day)
        'CLOUD_AMT',    // Cloud amount (%)
    ].join(',');

    // Agriculture parameters
    const agriParams = [
        'T2M',
        'T2M_MAX',
        'T2M_MIN',
        'PRECTOTCORR',
        'ALLSKY_SFC_SW_DWN',
        'T2MDEW',       // Dew point temperature
        'GWETROOT',     // Root Zone Soil Wetness (0-1)
        'GWETPROF',     // Profile Soil Moisture (0-1)
        'EVPTRNS',      // Evapotranspiration
    ].join(',');

    const params = mode === 'agri' ? agriParams : climateParams;

    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 15000);

        // Monthly climatology (long-term averages)
        const climatologyUrl = `https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=${params}&community=AG&longitude=${lng}&latitude=${lat}&format=JSON`;

        // Recent daily data (last 30 days for trends)
        const recentStart = new Date(end);
        recentStart.setDate(recentStart.getDate() - 30);
        const dailyUrl = `https://power.larc.nasa.gov/api/temporal/daily/point?parameters=${params}&community=AG&longitude=${lng}&latitude=${lat}&start=${formatDate(recentStart)}&end=${endStr}&format=JSON`;

        const [climatologyRes, dailyRes] = await Promise.all([
            fetch(climatologyUrl, { signal: controller.signal, next: { revalidate: 86400 } }),
            fetch(dailyUrl, { signal: controller.signal, next: { revalidate: 3600 } }),
        ]);
        clearTimeout(timeout);

        if (!climatologyRes.ok && !dailyRes.ok) {
            throw new Error('NASA POWER unavailable');
        }

        const climatology = climatologyRes.ok ? await climatologyRes.json() : null;
        const daily = dailyRes.ok ? await dailyRes.json() : null;

        // Process daily data into a summary
        let dailySummary = null;
        if (daily?.properties?.parameter) {
            const p = daily.properties.parameter;
            dailySummary = {};
            for (const [key, values] of Object.entries(p)) {
                const nums = Object.values(values).filter(v => v !== -999);
                if (nums.length > 0) {
                    dailySummary[key] = {
                        current: nums[nums.length - 1],
                        avg: nums.reduce((a, b) => a + b, 0) / nums.length,
                        min: Math.min(...nums),
                        max: Math.max(...nums),
                        trend: nums.slice(-7), // last 7 days
                    };
                }
            }
        }

        return Response.json({
            location: { lat: parseFloat(lat), lng: parseFloat(lng) },
            mode,
            climatology: climatology?.properties?.parameter || null,
            daily: dailySummary,
        });
    } catch (err) {
        return Response.json({
            location: { lat: parseFloat(lat), lng: parseFloat(lng) },
            mode,
            climatology: null,
            daily: null,
            error: err.message,
        });
    }
}

function formatDate(d) {
    return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
}
