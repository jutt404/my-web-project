// --- BACKGROUND NOTIFICATION LISTENER ---
self.addEventListener('push', (event) => {
    const data = event.data ? event.data.json() : { title: "New Order!", body: "Check your admin panel." };

    const options = {
        body: data.body,
        icon: '/img/logo.png',
        badge: '/img/logo.png', // Small icon for the status bar
        vibrate: [200, 100, 200],
        data: { url: '/ad-wz-login.html' }
    };

    // 1. Show the Banner in the Notification Bar
    event.waitUntil(self.registration.showNotification(data.title, options));

    // 2. Set the Number on the App Icon
    if ('setAppBadge' in navigator) {
        // You can fetch the actual pending count from your DB here if needed
        navigator.setAppBadge(1).catch(err => console.error(err));
    }
});
