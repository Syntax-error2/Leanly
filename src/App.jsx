import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { LocalNotifications } from '@capacitor/local-notifications';
import { db } from './db/db';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Progress from './pages/Progress';
import Profile from './pages/Profile';
import Meals from './pages/Meals';
import Prep from './pages/Prep';
import Onboarding from './pages/Onboarding';
import Login from './pages/Login';
import Signup from './pages/Signup';
import SetupProfile from './pages/SetupProfile';

function App() {
  useEffect(() => {
    const setupNotifications = async () => {
      try {
        await LocalNotifications.requestPermissions();
        
        await LocalNotifications.schedule({
          notifications: [
            {
              title: "Time for Breakfast! 🍳",
              body: "Log your morning meal to start the day right.",
              id: 1,
              schedule: { on: { hour: 7, minute: 0 }, allowWhileIdle: true },
            },
            {
              title: "Lunch Time! 🍱",
              body: "Keep up the good work and log your lunch.",
              id: 2,
              schedule: { on: { hour: 12, minute: 0 }, allowWhileIdle: true },
            },
            {
              title: "Dinner Time! 🍽️",
              body: "Finish the day strong. Don't forget to log your dinner.",
              id: 3,
              schedule: { on: { hour: 19, minute: 0 }, allowWhileIdle: true },
            }
          ]
        });
      } catch (e) {
        console.log("Not running in native capacitor environment, notifications skipped.");
        if ("Notification" in window && Notification.permission !== "denied") {
            Notification.requestPermission().then(permission => {
               if (permission === "granted") {
                 new Notification("Leanly Active", { body: "Desktop notifications are enabled!" });
               }
            });
        }
      }
    };
    
    setupNotifications();
  }, []);

  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const checkProfile = async () => {
      const count = await db.userProfile.count();
      setInitialRoute(count > 0 ? '/app' : '/onboarding');
    };
    checkProfile();
  }, []);

  if (!initialRoute) return null; // loading state

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={initialRoute} replace />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/setup-profile" element={<SetupProfile />} />
        
        <Route path="/app" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="meals" element={<Meals />} />
          <Route path="prep" element={<Prep />} />
          <Route path="progress" element={<Progress />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
