import {
  SafeAreaView,
  StyleSheet,
  BackHandler,
  Text,
  Image,
  View,
  Linking,
} from "react-native";
import CircularAvatar from "../../components/common/CircularAvatar";
import StaticBottomSheet from "../../components/bottomSheets/StaticBottomSheet";
import useScreen from "../../hooks/useScreen";
import useLocale from "../../hooks/useLocale";
import CircularButton from "../../components/buttons/CircularButton";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import parseDate from "../../utils/parseDate";
import * as theme from "../../constants/theme";
import PopupError from "../../components/popups/PopupError";
import HorizontalLines from "../../components/common/HorizontalLines";
import ButtonIcon from "../../components/buttons/ButtonIcon";
import GoogleMap from "../../components/common/GoogleMap";
import screens from "../../static/screens.json";
import useAuth from "../../auth/useAuth";
import { sendSos } from "../../api/user/trips";

export default function TripState({ navigation, route }) {
  const { driver, car, trip } = route.params;
  const screen = useScreen();
  const { socket } = useAuth();
  const { i18n, lang } = useLocale();
  const [call, setCall] = useState(false);
  const [disableSos, setDisableSos] = useState(false);
  const [showMessage, setShowMesage] = useState(false);

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
    enContainer: {
      textAlign: "right",
    },
    ImageContainer: {
      alignItems: "center",
    },
    Image: {
      resizeMode: "contain",
      width: screen.getScreenWidth() / 1.5,
      height: screen.getScreenHeight() / 4,
    },
    callIcon: {
      color: "#fff",
      padding: 0,
      fontSize: screen.getResponsiveFontSize(30),
    },
    TextContainer: {
      gap: screen.getVerticalPixelSize(10),
      flexBasis: screen.getScreenWidth() / 3,
      alignItems: "center",
    },
    MainText: {
      textAlign: "center",
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
    ContainerButton: {
      flexDirection: "row",
      justifyContent: "center",
      padding: 0,
      borderRadius: 25,
      alignItems: "center",
      backgroundColor: disableSos ? theme.disabled : "red",
      width: screen.getScreenWidth() / 4,
      marginHorizontal: screen.getScreenWidth() / 3,
    },
    Ditails1: {
      flexDirection: "row",
      marginHorizontal: 40,
      justifyContent: "space-around",
    },
    Ditails2: {
      marginVertical: 30,
      marginBottom: 60,
      flexDirection: "row",
      marginHorizontal: 10,
      justifyContent: "space-between",
      alignContent: "center",
    },
    arContainerAdvice: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    enContainerAdvice: {
      flexDirection: "row-reverse",
      justifyContent: "space-between",
    },
    TextAdvice: {
      fontFamily: "cairo-700",
      width: screen.getScreenWidth() / 1.5,
    },
    PriceContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end",
      marginTop: screen.getHorizontalPixelSize(6),
    },
  });

  const handleSos = async () => {
    try {
      await sendSos(driver._id);
      setDisableSos(true);
    } catch (error) {
      console.log(error);
    }
  };

  socket.on("end-trip", (driverId) => {
    return navigation.navigate(screens.TripEvalution, driverId);
  });

  return (
    <SafeAreaView style={styles.container}>
      <GoogleMap />

      <StaticBottomSheet>
        <PopupError
          visible={showMessage}
          onClose={() => setShowMesage(false)}
          message={i18n("Soon")}
        />
        <View style={styles.ImageContainer}>
          <CircularAvatar url={driver?.avatarURL} />
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

        <HorizontalLines />

        <View>
          <ButtonIcon
            disabled={disableSos}
            containerStyle={styles.ContainerButton}
            onPress={handleSos}
          >
            <Ionicons name="call-outline" style={styles.callIcon} />
            <Text style={{ color: "white", fontWeight: "bold" }}> SOS </Text>
          </ButtonIcon>
        </View>

        <View
          style={
            lang === "en" ? styles.enContainerAdvice : styles.arContainerAdvice
          }
        >
          <Image source={require("../../assets/icons/safety.png") || null} />
          <Text style={styles.TextAdvice}>
            <Text style={styles.MainText}>{i18n("AdviceTitle")} </Text>
            {i18n("AdviceText")}
          </Text>
        </View>
        <View style={styles.PriceContainer}>
          <Text style={styles.MainText}>{trip.price.toFixed(2)} LYD </Text>
          <Image source={require("../../assets/icons/dollar.png")} />
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
