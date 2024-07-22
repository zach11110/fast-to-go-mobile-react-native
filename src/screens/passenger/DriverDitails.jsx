import GoogleMap from "../../components/common/GoogleMap";
import { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  BackHandler,
  View,
  Linking,
} from "react-native";
import CircularAvatar from "../../components/common/CircularAvatar";
import StaticBottomSheet from "../../components/bottomSheets/StaticBottomSheet";
import useScreen from "../../hooks/useScreen";
import useLocale from "../../hooks/useLocale";
import CircularButton from "../../components/buttons/CircularButton";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import PopupError from "../../components/popups/PopupError";
import parseDate from "../../utils/parseDate";
import screens from "../../static/screens.json";
import useAuth from "../../auth/useAuth";
import sendNotification from "../../utils/sendNotification";

export default function PassengerDitails({ navigation, route }) {
  const { driver, car } = route?.params;
  const screen = useScreen();
  const { i18n, lang } = useLocale();
  const [call, setCall] = useState(false);
  const [showMessage, setShowMesage] = useState(false);
  const { socket } = useAuth();

  const callInApp = () => {
    setShowMesage(true);
  };

  const callOutApp = () => {
    Linking.openURL(`tel:${driver.phone.full}`);
  };

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", () => {
      return true;
    });
    return () =>
      BackHandler.removeEventListener("hardwareBackPress", () => {
        return true;
      });
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    ImageContainer: {
      alignItems: "center",
    },
    Image: {
      marginVertical: 10,
    },
    callIcon: {
      color: "#fff",
      fontSize: screen.getResponsiveFontSize(30),
    },
    TextContainer: {
      gap: screen.getVerticalPixelSize(10),
      flexBasis: screen.getScreenWidth() / 3,
      alignItems: "center",
    },
    MainText: {
      fontFamily: "cairo-700",
      fontSize: screen.getResponsiveFontSize(16),
    },
    SecondryText: {
      fontFamily: "cairo-800",
      color: "#AEB0AE",
      fontSize: screen.getResponsiveFontSize(12),
    },
    Evalution: {
      flexDirection: "row",
      alignItems: "center",
    },
    Ditails1: {
      flexDirection: "row",
      marginHorizontal: 40,
      justifyContent: "space-around",
    },
    Ditails2: {
      marginVertical: 30,
      flexDirection: "row",
      marginHorizontal: 10,
      justifyContent: "center",
      alignContent: "center",
    },
    endTripBtn: {
      backgroundColor: "red",
      fontWeight: "bold",
    },
  });

  socket.on("arrived", async (trip) => {
    return navigation.navigate(screens.DriverWaiting, { driver, car, trip });
  });

  return (
    <SafeAreaView style={styles.container}>
      {driver?.location?.latitude ? (
        <GoogleMap locations={[driver.location]} />
      ) : (
        <GoogleMap />
      )}

      <StaticBottomSheet>
        <PopupError
          visible={showMessage}
          onClose={() => setShowMesage(false)}
          message={i18n("Soon")}
        />

        <View style={styles.ImageContainer}>
          <CircularAvatar imageStyle={styles.Image} url={driver?.avatarURL} />
          <Text style={styles.MainText}>
            {driver?.firstName + " " + driver?.lastName}
          </Text>
        </View>

        <View style={styles.Ditails1}>
          <View style={styles.Evalution}>
            <Text style={{ color: "#EFBF0D" }}>
              {(
                driver?.driverEvalution?.rate / driver?.trips?.asDriver
              ).toFixed(1)}
            </Text>
            <MaterialIcons name="star" size={18} color={"gold"} />
          </View>
          <Text style={styles.SecondryText}>{car?.model}</Text>
          <Text style={styles.SecondryText}>{car?.plateNumber}</Text>
        </View>

        {!call ? (
          <View style={styles.Ditails2}>
            <View style={styles.TextContainer}>
              <Text style={styles.MainText}>
                {parseDate(driver?.createdAt)}
              </Text>
              <Text style={styles.SecondryText}>{i18n("StartWorking")}</Text>
            </View>

            <CircularButton
              onPress={() => setCall(true)}
              Icon={() => (
                <Ionicons name="call-outline" style={styles.callIcon} />
              )}
              containerStyle={styles.endCallButton}
            />

            <View style={styles.TextContainer}>
              <Text style={styles.MainText}>
                {"+" + driver?.trips?.asDriver}
              </Text>
              <Text style={styles.SecondryText}>{i18n("SumTrips")}</Text>
            </View>
          </View>
        ) : (
          <View style={styles.Ditails2}>
            <View style={styles.TextContainer}>
              <CircularButton
                onPress={callInApp}
                Icon={() => (
                  <Ionicons name="call-outline" style={styles.callIcon} />
                )}
              />
              <Text style={styles.SecondryText}>{i18n("CallInsideApp")}</Text>
            </View>
            <View style={styles.TextContainer}>
              <CircularButton
                onPress={callOutApp}
                Icon={() => (
                  <Ionicons name="call-outline" style={styles.callIcon} />
                )}
              />
              <Text style={styles.SecondryText}>{i18n("CallOutsideApp")}</Text>
            </View>
          </View>
        )}
      </StaticBottomSheet>
    </SafeAreaView>
  );
}
