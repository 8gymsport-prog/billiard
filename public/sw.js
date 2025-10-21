self.addEventListener('push', (event) => {
  const data = event.data.json();
  const title = data.title || 'Pemberitahuan';
  const options = {
    body: data.body,
    icon: data.icon || '/favicon.ico',
    badge: data.badge || '/favicon.ico',
    actions: data.actions || [],
    tag: data.tag,
    data: data.data
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  // Aksi kustom untuk klik notifikasi bisa ditambahkan di sini
});
