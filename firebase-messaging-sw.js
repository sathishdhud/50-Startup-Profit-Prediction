importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyCxjwyWQXR1zK-iEwkIagwuDLs5c-JMxa4",
  authDomain: "maaney-store-fd6ed.firebaseapp.com",
  projectId: "maaney-store-fd6ed",
  storageBucket: "maaney-store-fd6ed.firebasestorage.app",
  messagingSenderId: "213639902345",
  appId: "1:213639902345:web:209c5352f7a52115c44258"
});

const messaging = firebase.messaging();

/* BACKGROUND MESSAGE */
messaging.onBackgroundMessage(function(payload) {

  console.log("FCM Payload:", payload);

  const targetUrl =
      payload?.data?.link ||
      payload?.data?.url ||
      payload?.fcmOptions?.link ||
      "https://maaney.store";

  console.log("Notification URL:", targetUrl);

  const notificationTitle = payload.notification?.title || "Maaney News";

  const notificationOptions = {
    body: payload.notification?.body || "",
    icon: "https://maaney.store/logo.png",
    image: payload.notification?.image,
    data: {
      url: targetUrl
    }
  };

  self.registration.showNotification(notificationTitle, notificationOptions);

});


/* CLICK HANDLER */
self.addEventListener("notificationclick", function(event) {

  event.notification.close();

  let url = event.notification?.data?.url || "https://maaney.store";

  console.log("Opening URL:", url);

  event.waitUntil(

    clients.matchAll({ type: "window", includeUncontrolled: true })
      .then(function(clientList) {

        // If site already open → focus that tab
        for (let client of clientList) {
          if (client.url.includes("maaney.store") && "focus" in client) {
            client.focus();
            client.postMessage({ action: "navigate", url: url });
            return;
          }
        }

        // Otherwise open new tab
        return clients.openWindow(url);

      })

  );

});