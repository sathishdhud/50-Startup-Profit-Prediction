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

messaging.onBackgroundMessage(function(payload) {

  console.log("FULL PAYLOAD:", payload);
  console.log("DATA URL:", payload?.data?.url);
  console.log("FCM LINK:", payload?.fcmOptions?.link);

  console.log("FCM Payload:", payload);

  const notificationTitle = payload.notification?.title || "Maaney News";

  const notificationOptions = {
    body: payload.notification?.body || "",
    icon: "https://maaney.store/logo.png",
    data: {
      url: payload.fcmOptions?.link || "https://maaney.store"
    }
  };

  self.registration.showNotification(notificationTitle, notificationOptions);

});


self.addEventListener("notificationclick", function(event) {

  event.notification.close();

  const target = event.notification.data?.url || "https://maaney.store";

  event.waitUntil(
    clients.openWindow(target)
  );

});