import { useEffect, useState } from "react";
import { StyleSheet, SafeAreaView, View, AppState } from "react-native";
import DriverHomeScreenTitle from "../../components/screenTitles/DriverHomeScreenTitle";
import GoogleMap from "../../components/common/GoogleMap";
import DriverHomeBottomSheet from "../../components/bottomSheets/DriverHomeBottomSheet";
import useLocale from "../../hooks/useLocale";
import screens from "../../static/screens.json";
import useAuth from "../../auth/useAuth";
import useScreen from "../../hooks/useScreen";
import { setBusy, toggleConnection } from "../../api/user/users";
import sendNotification from "../../utils/sendNotification";

export default function DriverHomeSceen({ navigation }) {
  const screen = useScreen();
  const { socket, active } = useAuth();
  const { i18n } = useLocale();
  const [isConnected, setIsConntected] = useState(active);

  socket.on("bannded", () => {
    const notification = {
      content: {
        title: i18n("blockedTitle"),
        body: i18n("blockedMsg"),
      },
      trigger: {
        seconds: 0,
        repeats: false,
      },
    };
    sendNotification(notification);
  });

  useEffect(() => {
    socket.on("new-request", async (trip, passenger) => {
      await setBusy(true);

      try {
        return navigation.navigate(screens.newRequest, { trip, passenger });
      } catch (err) {
        console.log(err);
      }
    });
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      height: screen.getVerticalPixelSize(100),
      backgroundColor: "#fff",
      justifyContent: "flex-end",
      alignItems: "center",
    },
  });

  const handleOpenDrawer = () => {
    try {
      navigation.openDrawer();
    } catch (err) {}
  };

  const handleWalletClick = () => {
    try {
      navigation.navigate(screens.wallet);
    } catch (err) {}
  };

  const handleNotificationsClick = () => {
    try {
      navigation.navigate(screens.notifications);
    } catch (err) {}
  };

  const handleToggoeConnected = async () => {
    try {
      setIsConntected(!isConnected);
      await toggleConnection();
    } catch (err) {}
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <DriverHomeScreenTitle
          title={i18n("mainScreen")}
          onToggleConnected={handleToggoeConnected}
          isDriverConnected={isConnected}
          onOpenDrawer={handleOpenDrawer}
        />
      </View>

      <GoogleMap />

      <DriverHomeBottomSheet
        isDriverConnected={isConnected}
        onWalletClick={handleWalletClick}
        onNotificationsClick={handleNotificationsClick}
      />
    </SafeAreaView>
  );
}
