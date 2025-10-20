import { NextResponse } from 'next/server';
import webpush from 'web-push';
import getConfig from 'next/config';

const { serverRuntimeConfig } = getConfig();

const { VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY } = serverRuntimeConfig;

if (!VAPID_SUBJECT || !VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
  console.error('VAPID keys are not configured. Please check your environment variables.');
} else {
    webpush.setVapidDetails(
        VAPID_SUBJECT,
        VAPID_PUBLIC_KEY,
        VAPID_PRIVATE_KEY
    );
}

// This is an in-memory store for demo purposes.
// In a real application, you'd use a database.
let subscriptions: webpush.PushSubscription[] = [];

export async function POST(request: Request) {
  if (request.method === 'POST') {
    const reqBody = await request.json();

    if (reqBody.action === 'subscribe') {
      const subscription = reqBody.subscription;
      // Very basic validation
      if (subscription && subscription.endpoint) {
        // Avoid duplicates
        if (!subscriptions.some(s => s.endpoint === subscription.endpoint)) {
          subscriptions.push(subscription);
        }
        return NextResponse.json({ success: true, message: 'Subscribed successfully.' });
      }
      return NextResponse.json({ success: false, message: 'Invalid subscription object.' }, { status: 400 });
    }

    if (reqBody.action === 'send') {
      const payload = JSON.stringify(reqBody.payload);
      const notificationPromises = subscriptions.map(sub =>
        webpush.sendNotification(sub, payload).catch(error => {
          // If a subscription is invalid, you might want to remove it.
          if (error.statusCode === 410) {
            subscriptions = subscriptions.filter(s => s.endpoint !== sub.endpoint);
          }
          console.error('Error sending notification to', sub.endpoint, error);
        })
      );
      await Promise.all(notificationPromises);
      return NextResponse.json({ success: true, message: 'Notifications sent.' });
    }
    
    return NextResponse.json({ success: false, message: 'Invalid action.' }, { status: 400 });
  }

  return new Response(null, { status: 405, headers: { 'Allow': 'POST' } });
}
