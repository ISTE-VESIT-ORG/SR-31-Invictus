export async function GET() {
    try {
        const res = await fetch('https://services.swpc.noaa.gov/json/ovation_aurora_latest.json', {
            next: { revalidate: 1800 },
        });
        const data = await res.json();
        return Response.json(data);
    } catch (error) {
        return Response.json({ error: 'Failed to fetch aurora data' }, { status: 500 });
    }
}
