export async function GET() {
    try {
        const [kpRes, windRes] = await Promise.all([
            fetch('https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json', {
                next: { revalidate: 900 },
            }),
            fetch('https://services.swpc.noaa.gov/products/solar-wind/plasma-5-minute.json', {
                next: { revalidate: 900 },
            }),
        ]);

        const kpData = await kpRes.json();
        const windData = await windRes.json();

        return Response.json({ kp: kpData, solarWind: windData });
    } catch (error) {
        return Response.json({ error: 'Failed to fetch space weather' }, { status: 500 });
    }
}
