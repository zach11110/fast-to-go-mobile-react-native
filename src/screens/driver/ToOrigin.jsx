import GoogleMap from "../../components/common/GoogleMap";
import { useEffect, useState } from "react";
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
import { Ionicons } from "@expo/vector-icons";
import * as theme from "../../constants/theme";
import PopupError from "../../components/popups/PopupError";
import PopupConfirm from "../../components/popups/PopupConfirm";
import CustomButton from "../../components/buttons/CustomButton";
import screens from "../../static/screens.json";
import { arrived } from "../../api/user/trips";
import useLocation from "../../hooks/useLocation";

export default function ToOrigin({ navigation, route }) {
  const { passenger, trip } = route.params;

  const screen = useScreen();
  const { i18n, lang } = useLocale();
  const { location } = useLocation();

  const [showConfirm, setShowConfirm] = useState(false);
  const [directions, setDirections] = useState({ destination: trip.from });
  const [error, setError] = useState(false);
  const [call, setCall] = useState(false);

  const callInApp = () => {
    setError(i18n("Soon"));
  };

  const callOutApp = () => {
    Linking.openURL(`tel:${passenger?.phone?.full}`);
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
    containerButtons: {
      flexDirection: "row",
      gap: 4,
      justifyContent: "center",
    },
    endTripBtn: {
      backgroundColor: "red",
      fontWeight: "bold",
      width: 100,
    },
    arrived: {
      backgroundColor: theme.primaryColor,
      fontWeight: "bold",
      width: 100,
    },
  });

  //update origin

  useEffect(() => {
    const interval = setInterval(() => {
      if (!location) return;
      setDirections({
        ...directions,
        origin: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const openGoogleMaps = async () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${directions.destination.latitude},${directions.destination.longitude}`;
    Linking.openURL(url);
  };

  const handleErrorClose = () => {
    setError(false);
    navigation.navigate(screens.driverHome);
  };

  const handleArrived = async () => {
    try {
      await arrived(trip._id);
      return navigation.navigate(screens.passengerDitails, { passenger, trip });
    } catch (error) {
      console.log(error);
    } finally {
      setShowConfirm(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <PopupError
        visible={!!error}
        onClose={handleErrorClose}
        message={error}
      />

      <PopupConfirm
        visible={showConfirm}
        onConfirm={handleArrived}
        subtitle={i18n("arrivedPopupMsg")}
        title={i18n("arrivedPopupTitle")}
      />

      <GoogleMap directions={directions} trip={trip} />

      <StaticBottomSheet>
        <View style={styles.ImageContainer}>
          <CircularAvatar
            imageStyle={styles.Image}
            url={passenger?.avatarURL}
          />

          <Text style={styles.MainText}>
            {passenger?.firstName + " " + passenger?.lastName}
          </Text>

          <Text style={styles.SecondryText}>{trip.price.toFixed(2)} LYD</Text>
        </View>

        {!call ? (
          <View style={styles.Ditails2}>
            <CircularButton
              onPress={() => setCall(true)}
              Icon={() => (
                <Ionicons name="call-outline" style={styles.callIcon} />
              )}
              containerStyle={styles.endCallButton}
            />
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

        <View style={styles.containerButtons}>
          <CustomButton
            onPress={() => setShowConfirm(true)}
            text={i18n("arrived")}
            containerStyle={styles.arrived}
          />

          <CustomButton
            onPress={openGoogleMaps}
            text={i18n("openGoogleMaps")}
            containerStyle={styles.arrived}
          />
        </View>
      </StaticBottomSheet>
    </SafeAreaView>
  );
}
