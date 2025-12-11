import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDg1p3WGv1jR7PBRx4EZU5Qorw3zLrI8gE",
  authDomain: "groww-41493.firebaseapp.com",
  projectId: "groww-41493",
  storageBucket: "groww-41493.firebasestorage.app",
  messagingSenderId: "871063523682",
  appId: "1:871063523682:web:c9a11f56554965665b9c3b",
  measurementId: "G-TGBP8SD1ME"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Messaging instance
export const messaging = getMessaging(app);

// Ask permission + get token
export async function generateFcmToken(vapidKey) {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.log("Permission not granted");
      return null;
    }

    const token = await getToken(messaging, { vapidKey });
    return token;
  } catch (error) {
    console.error("FCM Token Error:", error);
    return null;
  }
}

// Listen to foreground messages
export function listenForegroundMessages(callback) {
  onMessage(messaging, (payload) => {
    callback(payload);
  });
}
