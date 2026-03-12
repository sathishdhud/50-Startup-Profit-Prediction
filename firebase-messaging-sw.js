importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyCxjwyWQXR1zK-iEwkIagwuDLs5c-JMxa4",
  authDomain: "maaney-store-fd6ed.firebaseapp.com",
  projectId: "maaney-store-fd6ed",
  storageBucket: "maaney-store-fd6ed.firebasestorage.app",
  messagingSenderId: "213639902345",
  appId: "1:213639902345:web:209c5352f7a52115c44258",
  measurementId: "G-8J1V4NB56X"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {

  const notificationTitle = payload.notification.title;
  
  const notificationOptions = {
    body: payload.notification.body,
    icon: "https://maaney.store/icon.png",
    data: {
      url: payload.notification.click_action
    }
  };

  self.registration.showNotification(notificationTitle, notificationOptions);

});

self.addEventListener("notificationclick", function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});