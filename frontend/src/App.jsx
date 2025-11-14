import { useEffect } from "react";
//import "./App.css";
import { generateFcmToken, listenForegroundMessages } from "./firebase";
import Homepage from "./Components/Home/Homepage.jsx";
import Navbar from "./Components/Home/Navbar";
function App() {
  useEffect(() => {
    const vapidKey =
      "BNuO8ul1x-GKuOpEDPGkBBv911cMJJ30P1wcxx1Tp0WhkZ7jsQ9RyUi26YGAzTuYGDR2HUAILm9wYaVnZ4PUHVQ";

    async function registerFCM() {
      const token = await generateFcmToken(vapidKey);
      console.log("FCM Token:", token);

      if (token) {
        // Send token to your backend
        await fetch("http://localhost:4000/save-token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });
      }
    }

    registerFCM();

    // Listen to messages when app is open
    listenForegroundMessages((payload) => {
      console.log("Foreground Message:", payload);
      alert(payload.notification?.title + "\n" + payload.notification?.body);
    });
  }, []);

  return (
    <div>
      <Navbar />
      {/* Render your Groww UI here */}
      <Homepage />
    </div>
  );
}

export default App;
