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


/* BACKGROUND NOTIFICATION HANDLER */
messaging.onBackgroundMessage(function(payload) {

  console.log("FULL PAYLOAD:", payload);
  console.log("DATA URL:", payload?.data?.url);
  console.log("DATA LINK:", payload?.data?.link);
  console.log("FCM LINK:", payload?.fcmOptions?.link);

  // Get correct URL from payload
  const targetUrl =
    payload?.data?.url ||
    payload?.data?.link ||
    payload?.fcmOptions?.link ||
    "https://maaney.store";

  const notificationTitle = payload.notification?.title || "Maaney News";

  const notificationOptions = {
    body: payload.notification?.body || "",
    icon: "https://maaney.store/logo.png",
    data: {
      url: targetUrl
    }
  };

  console.log("Final URL used:", targetUrl);

  self.registration.showNotification(notificationTitle, notificationOptions);

});


/* NOTIFICATION CLICK HANDLER */
self.addEventListener("notificationclick", function(event) {

  event.notification.close();

  let target = event.notification?.data?.url;

  // Prevent undefined or empty links
  if (!target || target === "undefined") {
    target = "https://maaney.store";
  }

  console.log("Opening URL:", target);

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true })
      .then(function(clientList) {

        for (let client of clientList) {
          if (client.url.includes("maaney.store") && "focus" in client) {
            client.navigate(target);
            return client.focus();
          }
        }

        return clients.openWindow(target);

      })
  );

});