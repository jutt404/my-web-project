self.addEventListener('push', function(event) {
    const data = event.data ? event.data.json() : { title: 'New Order', body: 'Check your admin panel!' };
    
    const options = {
        body: data.body,
        icon: 'img/logo.png', // Your logo path
        badge: 'img/logo.png',
        vibrate: [200, 100, 200, 100, 200], // Custom vibration pattern
        data: { url: '/ad-wz-login.html' } // Links to your admin login
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

// Open admin panel when notification is clicked
self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data.url)
    );
});
