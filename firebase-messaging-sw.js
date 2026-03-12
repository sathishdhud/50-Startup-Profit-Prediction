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

  // Extract link from payload
  let targetUrl =
      payload?.data?.link ||
      payload?.data?.url ||
      payload?.fcmOptions?.link ||
      "https://maaney.store";

  console.log("Notification link:", targetUrl);

  const notificationTitle = payload.notification?.title || "Maaney News";

  const notificationOptions = {
    body: payload.notification?.body || "",
    icon: "https://maaney.store/logo.png",
    image: payload.notification?.image,
    data: {
      click_action: targetUrl
    }
  };

  self.registration.showNotification(notificationTitle, notificationOptions);

});


/* CLICK HANDLER */
self.addEventListener("notificationclick", function(event) {

  event.notification.close();

  let url = event.notification?.data?.click_action || "https://maaney.store";

  console.log("Opening:", url);

  event.waitUntil(

    clients.matchAll({ type: "window", includeUncontrolled: true })
      .then(function(clientList) {

        for (let client of clientList) {

          if (client.url.includes("maaney.store") && "focus" in client) {
            client.navigate(url);
            return client.focus();
          }

        }

        return clients.openWindow(url);

      })

  );

});