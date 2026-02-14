// USGS Earthquake API — real-time seismic events

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'day'; // hour, day, week, month
    const minMag = searchParams.get('minmag') || '2.5';

    const periodMap = {
        hour: 'all_hour',
        day: 'all_day',
        week: 'all_week',
        month: 'significant_month',
    };

    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);

        const feed = periodMap[period] || 'all_day';
        const url = `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/${feed}.geojson`;

        const res = await fetch(url, { signal: controller.signal, next: { revalidate: 300 } });
        clearTimeout(timeout);

        if (!res.ok) throw new Error(`USGS returned ${res.status}`);

        const data = await res.json();

        const quakes = (data.features || [])
            .filter(f => f.properties.mag >= parseFloat(minMag))
            .map(f => ({
                id: f.id,
                magnitude: f.properties.mag,
                place: f.properties.place,
                time: f.properties.time,
                depth: f.geometry.coordinates[2],
                coordinates: [f.geometry.coordinates[0], f.geometry.coordinates[1]], // [lng, lat]
                tsunami: f.properties.tsunami === 1,
                alert: f.properties.alert, // green, yellow, orange, red
                url: f.properties.url,
            }));

        return Response.json({ quakes, total: quakes.length, period });
    } catch (err) {
        return Response.json({ quakes: [], total: 0, error: err.message });
    }
}
