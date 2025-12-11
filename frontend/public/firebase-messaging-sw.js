importScripts("https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyDg1p3WGv1jR7PBRx4EZU5Qorw3zLrI8gE",
  authDomain: "groww-41493.firebaseapp.com",
  projectId: "groww-41493",
  storageBucket: "groww-41493.firebasestorage.app",
  messagingSenderId: "871063523682",
  appId: "1:871063523682:web:c9a11f56554965665b9c3b"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification?.title || "Notification";
  const notificationOptions = {
    body: payload.notification?.body || "",
    icon: "/vite.svg"
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
