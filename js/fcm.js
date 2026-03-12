import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getMessaging, getToken } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging.js";

const firebaseConfig = {
  apiKey: "AIzaSyCxjwyWQXR1zK-iEwkIagwuDLs5c-JMxa4",
  authDomain: "maaney-store-fd6ed.firebaseapp.com",
  projectId: "maaney-store-fd6ed",
  storageBucket: "maaney-store-fd6ed.firebasestorage.app",
  messagingSenderId: "213639902345",
  appId: "1:213639902345:web:209c5352f7a52115c44258"
};

const app = initializeApp(firebaseConfig);

const messaging = getMessaging(app);

async function startFCM(){

const permission = await Notification.requestPermission();

if(permission === "granted"){

const token = await getToken(messaging,{
vapidKey:"BF0Gc3mQtnG6qUfY4GDw-HUkhoCo-AZ3jcptzAUx-c7d8knzlnCKJr4_Vm4W0vhQ5JBpWulaPF7Qk06WaCCPIKg"
});

console.log("TOKEN:",token);

}

}

startFCM();