import { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, View, text } from "react-native";
import GoogleMap from "../../components/common/GoogleMap";
import NetworkStatusLine from "../../components/common/NetworkStatusLine";
import useScreen from "../../hooks/useScreen";
import PendingRequestBottom from "../../components/bottomSheets/PendingRequestBottom";
import socket from "../../socket/client";
import screens from "../../static/screens.json";
import useLocale from "../../hooks/useLocale";
import { deleteTrip } from "../../api/user/trips";
import sendNotification from "../../utils/sendNotification";

export default function PendingTripRequest({ navigation, route }) {
  const trip = route.params;
  const screen = useScreen();
  const [approved, setApproved] = useState(false);
  const { i18n, lang } = useLocale();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    iconContainer: {
      justifyContent: "center",
      alignItems: "center",
      position: "absolute",
      top: screen.getVerticalPixelSize(55),
      right: screen.getHorizontalPixelSize(20),
      backgroundColor: "#fff",
      width: screen.getHorizontalPixelSize(45),
      maxWidth: 45,
      height: screen.getHorizontalPixelSize(45),
      maxHeight: 45,
      borderRadius: 50,
      zIndex: 1,
    },
  });

  socket.on("accepted", (driver, car, trip) => {
    setApproved(true);

    return navigation.navigate(screens.DriverDitails, { driver, car, trip });
  });

  const handleCancel = async () => {
    try {
      await deleteTrip(trip._id);

      return navigation.goBack();
    } catch (error) {
      console.log(error);
    }
  };

  const handleGoBack = () => {
    try {
      if (!approved) {
        navigation.goBack();
      }
    } catch (err) {}
  };

  return (
    <SafeAreaView style={styles.container}>
      <NetworkStatusLine />

      <GoogleMap />
      <PendingRequestBottom
        onCancel={handleCancel}
        carType={trip.carType}
        onTimerDone={handleGoBack}
      />
    </SafeAreaView>
  );
}
