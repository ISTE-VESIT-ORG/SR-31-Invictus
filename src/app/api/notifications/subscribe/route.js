// In-memory subscription store (use a database in production)
const subscriptions = new Map();

export async function POST(request) {
    try {
        const { subscription, userId } = await request.json();

        if (!subscription || !subscription.endpoint) {
            return Response.json({ error: 'Invalid subscription' }, { status: 400 });
        }

        const key = subscription.endpoint;
        subscriptions.set(key, { subscription, userId, subscribedAt: Date.now() });

        return Response.json({
            success: true,
            message: 'Subscription saved',
            count: subscriptions.size,
        });
    } catch (err) {
        return Response.json({ error: 'Failed to subscribe' }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const { endpoint } = await request.json();

        if (!endpoint) {
            return Response.json({ error: 'Missing endpoint' }, { status: 400 });
        }

        subscriptions.delete(endpoint);

        return Response.json({
            success: true,
            message: 'Unsubscribed',
            count: subscriptions.size,
        });
    } catch (err) {
        return Response.json({ error: 'Failed to unsubscribe' }, { status: 500 });
    }
}

// Export the subscriptions map so the send route can access it
export { subscriptions };
