const NASA_KEY = process.env.NASA_API_KEY || 'DEMO_KEY';

export async function GET() {
    try {
        const res = await fetch(`https://api.nasa.gov/EPIC/api/natural?api_key=${NASA_KEY}`, {
            next: { revalidate: 3600 },
        });
        if (!res.ok) {
            console.error('EPIC API error:', res.status, res.statusText);
            // Return fallback data so the UI doesn't break
            return Response.json([]);
        }
        const data = await res.json();
        return Response.json(data);
    } catch (error) {
        console.error('EPIC fetch error:', error.message);
        return Response.json([]);
    }
}
