const NASA_KEY = process.env.NASA_API_KEY || 'DEMO_KEY';

export async function GET() {
    try {
        const today = new Date().toISOString().split('T')[0];
        const res = await fetch(
            `https://api.nasa.gov/neo/rest/v1/feed?start_date=${today}&end_date=${today}&api_key=${NASA_KEY}`,
            { next: { revalidate: 3600 } }
        );
        const data = await res.json();
        return Response.json(data);
    } catch (error) {
        return Response.json({ error: 'Failed to fetch NEO data' }, { status: 500 });
    }
}
