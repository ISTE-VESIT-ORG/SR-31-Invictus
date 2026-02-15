import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const body = await request.json();

        const res = await fetch('http://127.0.0.1:5000/explain-event', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            throw new Error(`Python backend error: ${res.statusText}`);
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('ML Explainer Error:', error);
        return NextResponse.json(
            { error: 'Failed to explain event' },
            { status: 500 }
        );
    }
}
