import "react-native-gesture-handler";
import { useEffect, useState } from "react";
import { StatusBar, Dimensions, LogBox, I18nManager } from "react-native";
import useFonts from "./src/hooks/useFonts";
import useNetworkStatus from "./src/hooks/useNetworkStatus";
import useLocation from "./src/hooks/useLocation";
import * as usersApi from "./src/api/user/users";
import { SafeAreaProvider } from "react-native-safe-area-context";
import socket from "./src/socket/client";
import authStorage from "./src/auth/storage";
import { updateLocation } from "./src/api/user/users";
import {
  lockAsync,
  OrientationLock,
  unlockAsync,
} from "expo-screen-orientation";
import { NavigationContainer } from "@react-navigation/native";
import AuthNavigation from "./src/navigation/AuthNavigation";
import PassengerNavigation from "./src/navigation/PassengerNavigation";
import DriverNavigation from "./src/navigation/DriverNavigation";
import AdminNavigation from "./src/navigation/AdminNavigation";
import AuthContext from "./src/auth/context";
import Onboarding from "./src/screens/common/Onboarding";
import PopupError from "./src/components/popups/PopupError";
import sendNotification from "./src/utils/sendNotification";
import usePushNotifications from "./src/hooks/usePushNotifications";

// Set text direction to LTR
I18nManager.forceRTL(false);
I18nManager.allowRTL(false);
I18nManager.doLeftAndRightSwapInRTL = false;

export default function App() {
  LogBox.ignoreLogs(["new NativeEventEmitter()"]);
  LogBox.ignoreAllLogs(); //Ignore all log nottifications

  // Hooks
  const { fontLoaded } = useFonts();
  const { location: currentLocation } = useLocation();
  const isOnline = useNetworkStatus();
  const deviceToken = usePushNotifications();

  // States
  const [active, setActive] = useState(true);
  const [bussy, setBussy] = useState(false);
  const [lang, setLang] = useState("ar");
  const [showHomeScreen, setShowHomeScreen] = useState(false);
  const [user, setUser] = useState(false);
  const [isUserLoading, setIsUserLoading] = useState(true);
  const [displayMode, setDisplayMode] = useState("admin");
  const [popupAccountDeleted, setPopupAccountDeleted] = useState({
    visible: false,
    message: "",
    onClose: () => {},
  });
  const [screenDimensions, setScreenDimensions] = useState(
    Dimensions.get("screen")
  );

  usePushNotifications();

  if (user) {
    try {
      usersApi
        .joinSocket(socket.id)
        .then(() => {})
        .catch((err) => {});
    } catch (err) {}
  }

  useEffect(() => {
    usersApi
      .authenticate()
      .then((res) => {
        if (res?.data) {
          const user = res.data;
          setUser(user);
          setActive(user?.driverStatus?.active);

          setLang(user?.display?.language);
          if (user?.role !== "admin") {
            setDisplayMode(user.role);
          }
        }
      })
      .catch((err) => {
        return setUser(false);
      })
      .finally(() => setIsUserLoading(false));
  }, []);

  useEffect(() => {
    if (!user) return;
    socket.on("connect", () => {
      try {
        usersApi
          .joinSocket(socket.id)
          .then(() => {})
          .catch((err) => {});
      } catch (err) {}
    });

    socket.on("notification received", (notification) => {
      try {
        setUser({
          ...user,
          notifications: {
            ...user.notifications,
            list: [notification, ...user.notifications.list],
          },
        });

        sendNotification({
          ...notification,
          trigger: { seconds: 0, repeats: false },
        });
      } catch (err) {}
    });

    socket.on("account deleted", async () => {
      try {
        setPopupAccountDeleted({
          message: "Your account has been deleted",
          onClose: handleDeleteAccount,
          visible: true,
        });
      } catch (err) {}
    });
  }, []);

  useEffect(() => {
    try {
      const subscription = Dimensions.addEventListener(
        "change",
        ({ screen }) => {
          setScreenDimensions(screen);
        }
      );

      return () => {
        subscription.remove();
      };
    } catch (err) {}
  }, []);

  useEffect(() => {
    try {
      const lockScreenOrientation = async () => {
        try {
          await lockAsync(OrientationLock.PORTRAIT);
        } catch (err) {}
      };

      lockScreenOrientation();

      return () => {
        try {
          // Unlock the screen orientation when the component is unmounted
          unlockAsync();
        } catch (err) {}
      };
    } catch (err) {}
  }, []);

  // update location every 15 second

  useEffect(() => {
    if (!user) return;

    const sendLocation = async () => {
      // console.log("in location");
      try {
        const location = {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        };

        // console.log(location);

        if (location.longitude && location.latitude && user?.verified?.phone) {
          return await updateLocation(location);
        } else {
          return;
        }
      } catch (error) {}
    };

    const interval = setInterval(async () => {
      try {
        await sendLocation();
      } catch (error) {}
    }, 15000);

    return () => clearInterval(interval);
  });

  const handleDeleteAccount = async () => {
    try {
      setPopupAccountDeleted({ ...popupAccountDeleted, visible: false });
      setUser(null);
      await authStorage.removeToken();
    } catch (err) {}
  };

  const checkIfPassenger = () => {
    try {
      return (
        user && (user?.role === "passenger" || displayMode === "passenger")
      );
    } catch (err) {
      return false;
    }
  };

  const checkIfDriver = () => {
    try {
      return user && user?.role === "driver" && displayMode === "driver";
    } catch (err) {
      return false;
    }
  };

  const checkIfAdmin = () => {
    try {
      return user && user?.role === "admin";
    } catch (err) {
      return false;
    }
  };

  if (!fontLoaded || isUserLoading) {
    return null;
  }

  return (
    <>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      <AuthContext.Provider
        value={{
          user,
          setUser,
          deviceToken,
          bussy,
          setBussy,
          lang,
          setLang,
          isOnline,
          displayMode,
          setDisplayMode,
          screenDimensions,
          socket,
          active,
        }}
      >
        <PopupError
          onClose={popupAccountDeleted.onClose}
          visible={popupAccountDeleted.visible}
          message={popupAccountDeleted.message}
        />

        {!showHomeScreen && (
          <Onboarding onDone={() => setShowHomeScreen(true)} />
        )}

        {showHomeScreen && (
          <SafeAreaProvider>
            <NavigationContainer>
              {!user && <AuthNavigation />}
              {checkIfPassenger() && <PassengerNavigation />}
              {checkIfDriver() && <DriverNavigation />}
              {checkIfAdmin() && <AdminNavigation />}
            </NavigationContainer>
          </SafeAreaProvider>
        )}
      </AuthContext.Provider>
    </>
  );
}
