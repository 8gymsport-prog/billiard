import { NextResponse } from 'next/server';
import webpush from 'web-push';

const VAPID_SUBJECT = process.env.VAPID_SUBJECT;
const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;

if (!VAPID_SUBJECT || !VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
  console.error('VAPID keys are not configured. Please check your environment variables.');
} else {
    webpush.setVapidDetails(
        VAPID_SUBJECT,
        VAPID_PUBLIC_KEY,
        VAPID_PRIVATE_KEY
    );
}

// Ini adalah penyimpanan dalam memori untuk tujuan demo.
// Dalam aplikasi nyata, Anda akan menggunakan database.
let subscriptions: webpush.PushSubscription[] = [];

export async function POST(request: Request) {
    if (!VAPID_SUBJECT || !VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
        return NextResponse.json({ success: false, message: 'VAPID keys are not configured on the server.' }, { status: 500 });
    }

    try {
        const reqBody = await request.json();

        if (reqBody.action === 'subscribe') {
            const subscription = reqBody.subscription;
            // Validasi yang sangat dasar
            if (subscription && subscription.endpoint) {
                // Hindari duplikat
                if (!subscriptions.some(s => s.endpoint === subscription.endpoint)) {
                    subscriptions.push(subscription);
                    console.log('New subscription added:', subscription.endpoint);
                }
                return NextResponse.json({ success: true, message: 'Subscribed successfully.' });
            }
            return NextResponse.json({ success: false, message: 'Invalid subscription object.' }, { status: 400 });
        }

        if (reqBody.action === 'send') {
            const payload = JSON.stringify(reqBody.payload);
            console.log('Sending notifications to', subscriptions.length, 'subscribers.');
            
            const notificationPromises = subscriptions.map(sub =>
                webpush.sendNotification(sub, payload).catch(error => {
                    // Jika langganan tidak valid, Anda mungkin ingin menghapusnya.
                    if (error.statusCode === 410) {
                        console.log('Subscription expired or invalid:', sub.endpoint);
                        subscriptions = subscriptions.filter(s => s.endpoint !== sub.endpoint);
                    } else {
                        console.error('Error sending notification to', sub.endpoint, error);
                    }
                })
            );
            await Promise.all(notificationPromises);
            return NextResponse.json({ success: true, message: 'Notifications sent.' });
        }
        
        return NextResponse.json({ success: false, message: 'Invalid action.' }, { status: 400 });
    } catch (error) {
        console.error('Error in POST /api/push:', error);
        return NextResponse.json({ success: false, message: 'Internal server error.' }, { status: 500 });
    }
}
