const NASA_KEY = process.env.NASA_API_KEY || 'DEMO_KEY';

export async function GET() {
    try {
        const res = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${NASA_KEY}`, {
            next: { revalidate: 3600 },
        });
        const data = await res.json();
        return Response.json(data);
    } catch (error) {
        return Response.json({ error: 'Failed to fetch APOD' }, { status: 500 });
    }
}
