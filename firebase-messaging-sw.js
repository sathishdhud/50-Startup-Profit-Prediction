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

  // Extract link from any possible field
  let targetUrl =
      payload?.data?.url ||
      payload?.data?.link ||
      payload?.fcmOptions?.link ||
      "https://maaney.store";

  console.log("Detected URL:", targetUrl);

  const notificationTitle = payload.notification?.title || "Maaney News";

  const notificationOptions = {
    body: payload.notification?.body || "",
    icon: "https://maaney.store/logo.png",
    data: {
      url: targetUrl
    }
  };

  //sathish

  self.registration.showNotification(notificationTitle, notificationOptions);

});


/* NOTIFICATION CLICK HANDLER */
self.addEventListener("notificationclick", function(event) {

  event.notification.close();

  let target = event.notification?.data?.url || "https://maaney.store";

  console.log("Opening URL:", target);

  event.waitUntil(

    clients.matchAll({ type: "window", includeUncontrolled: true }).then(function(clientList) {

      for (let client of clientList) {

        // If site already open → navigate that tab
        if (client.url.includes("maaney.store") && "focus" in client) {
          client.navigate(target);
          return client.focus();
        }

      }

      // Otherwise open new tab
      return clients.openWindow(target);

    })

  );

});