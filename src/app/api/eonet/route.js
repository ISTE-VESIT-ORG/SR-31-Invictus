// NASA EONET — Earth Observatory Natural Event Tracker
// Returns natural events: wildfires, volcanoes, storms, floods, icebergs, etc.

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '50';
    const days = searchParams.get('days') || '30';
    const category = searchParams.get('category') || ''; // e.g., wildfires, volcanoes, severeStorms

    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);

        let url = `https://eonet.gsfc.nasa.gov/api/v3/events?limit=${limit}&days=${days}&status=open`;
        if (category) url += `&category=${category}`;

        const res = await fetch(url, { signal: controller.signal, next: { revalidate: 600 } });
        clearTimeout(timeout);

        if (!res.ok) throw new Error(`EONET returned ${res.status}`);

        const data = await res.json();

        // Process events into a simpler format
        const events = (data.events || []).map(event => {
            const geo = event.geometry?.[event.geometry.length - 1];
            return {
                id: event.id,
                title: event.title,
                category: event.categories?.[0]?.title || 'Unknown',
                categoryId: event.categories?.[0]?.id || '',
                date: geo?.date || event.geometry?.[0]?.date,
                coordinates: geo?.coordinates || null, // [lng, lat]
                source: event.sources?.[0]?.url || '',
                magnitudeValue: geo?.magnitudeValue || null,
                magnitudeUnit: geo?.magnitudeUnit || '',
            };
        }).filter(e => e.coordinates);

        return Response.json({ events, total: events.length });
    } catch (err) {
        return Response.json({ events: [], total: 0, error: err.message });
    }
}
