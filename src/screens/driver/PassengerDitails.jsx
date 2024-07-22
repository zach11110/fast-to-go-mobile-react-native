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
import useAuth from "../../auth/useAuth";
import * as theme from "../../constants/theme";
import PopupError from "../../components/popups/PopupError";
import PopupConfirm from "../../components/popups/PopupConfirm";
import CustomButton from "../../components/buttons/CustomButton";
import screens from "../../static/screens.json";
import { endTrip } from "../../api/user/trips";
import useLocation from "../../hooks/useLocation";
import { setBusy } from "../../api/user/users";

export default function PassengerDitails({ navigation, route }) {
  const { passenger, trip } = route.params;

  const screen = useScreen();
  const { location } = useLocation();
  const { i18n, lang } = useLocale();

  const [showConfirm, setShowConfirm] = useState(false);
  const [directions, setDirections] = useState({
    origin: location,
    distenation: trip.to,
  });
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
    openGoogleMaps: {
      backgroundColor: theme.primaryColor,
      fontWeight: "bold",
      width: 100,
    },
  });

  const handleEndTrip = async () => {
    try {
      setShowConfirm(false);
      await endTrip(trip._id);
      await setBusy(false);
      navigation.navigate(screens.driverHome);
    } catch (err) {
      setError(err?.response?.data?.message[lang]);
    }
  };

  const handleErrorClose = () => {
    setError(false);
    navigation.navigate(screens.driverHome);
  };

  //update origin

  useEffect(() => {
    const interval = setInterval(() => {
      if (!!location) {
        setDirections({
          ...directions,
          origin: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          },
        });
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const openGoogleMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${directions.distenation.latitude},${directions.distenation.longitude}`;

    Linking.openURL(url);
  };

  return (
    <SafeAreaView style={styles.container}>
      <PopupError
        visible={!!error}
        onClose={handleErrorClose}
        message={error}
      />

      {!!location ? (
        <GoogleMap locations={[trip?.to]} directions={directions} />
      ) : (
        <GoogleMap locations={[trip?.to]} />
      )}

      <StaticBottomSheet>
        <PopupConfirm
          title={i18n("endTrip")}
          subtitle={i18n("confirmEndTrip")}
          onConfirm={handleEndTrip}
          onClose={() => setShowConfirm(false)}
          visible={showConfirm}
        />

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
            text={i18n("endTrip")}
            containerStyle={styles.endTripBtn}
          />

          <CustomButton
            onPress={openGoogleMaps}
            text={i18n("openGoogleMaps")}
            containerStyle={styles.openGoogleMaps}
          />
        </View>
      </StaticBottomSheet>
    </SafeAreaView>
  );
}
