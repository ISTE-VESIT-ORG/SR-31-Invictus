import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const res = await fetch('http://127.0.0.1:5000/today-events', {
            next: { revalidate: 0 } // No cache for live events
        });

        if (!res.ok) {
            throw new Error(`Python backend error: ${res.statusText}`);
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('ML Events Error:', error);
        // Return empty list on error instead of breaking UI
        return NextResponse.json([]);
    }
}
