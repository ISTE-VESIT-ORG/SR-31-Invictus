import { NextResponse } from 'next/server';

export const revalidate = 300; // Cache for 5 minutes

export async function GET() {
    try {
        const res = await fetch('https://celestrak.org/NORAD/elements/gp.php?CATNR=25544&FORMAT=TLE', {
            next: { revalidate: 300 }
        });

        if (!res.ok) throw new Error('Failed to fetch ISS TLE');

        const text = await res.text();
        const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);

        // Expecting 3 lines: Name, Line 1, Line 2
        // Or sometimes just Line 1, Line 2 if Name is missing (unlikely from CelesTrak)
        let line1, line2;

        if (lines.length >= 3) {
            line1 = lines[1];
            line2 = lines[2];
        } else if (lines.length === 2) {
            line1 = lines[0];
            line2 = lines[1];
        } else {
            throw new Error('Invalid TLE format');
        }

        return NextResponse.json({ line1, line2 });

    } catch (error) {
        console.error('ISS API Error:', error);

        // Fallback TLE (approximate, current as of early 2024, but better than nothing for UI testing)
        // Ideally this should be updated periodically or sourced from a local file
        return NextResponse.json({
            line1: '1 25544U 98067A   24045.54997000  .00019000  00000-0  36000-3 0  9990',
            line2: '2 25544  51.6416 247.4627 0002000 130.5360 325.0288 15.49970000491690',
            fallback: true
        });
    }
}
