self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'extend') {
    // Logika untuk memperpanjang sesi (misalnya, buka aplikasi)
    clients.openWindow('/');
  } else if (event.action === 'dismiss') {
    // Tidak melakukan apa-apa, hanya menutup notifikasi
  } else {
    // Aksi default saat notifikasi di-klik (bukan pada tombol aksi)
    clients.openWindow('/');
  }
});
