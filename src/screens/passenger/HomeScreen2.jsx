import { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
} from "react-native";
import AddressInput from "../../components/inputs/AddressInput";
import Location from "../../components/common/Location";
import CustomButton from "../../components/buttons/CustomButton";
import useLocale from "../../hooks/useLocale";
import NetworkStatusLine from "../../components/common/NetworkStatusLine";
import PopupError from "../../components/popups/PopupError";
import screens from "../../static/screens.json";
import getDistance from "../../utils/getDistance";
import useScreen from "../../hooks/useScreen";
import { AntDesign } from "@expo/vector-icons";

export default function PassengerHomeScreen2({ navigation, route }) {
  const { from, to } = route.params;

  const screen = useScreen();
  const { i18n, lang } = useLocale();
  const [locations, setLocations] = useState(to);
  const [error, setError] = useState(false);
  const [ready, setReady] = useState(false);
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    getDist = async () => {
      try {
        const origin = `${from.latitude},${from.longitude}`;
        const destination = `${to[0].latitude},${to[0].longitude}`;

        const dist = await getDistance(origin, destination);
        if (dist > 100) {
          return setError(i18n("invaledLocation"));
        }
        setReady(true);
        setDistance(dist);
      } catch (error) {
        setError(i18n("invaledLocation"));
        console.log(error);
      }
    };
    getDist();
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: screen.getHorizontalPixelSize(15),
      paddingVertical: screen.getVerticalPixelSize(15),
      paddingTop: screen.getVerticalPixelSize(60),
      gap: screen.getVerticalPixelSize(15),
    },
    title: {
      fontFamily: "cairo-800",
      fontSize: screen.getResponsiveFontSize(15),
    },
    buttonText: {
      fontFamily: "cairo-800",
    },
    iconContainer: {
      display: "flex",
      flexDirection: lang == "ar" ? "row" : "row-reverse",
      alignItems: "center",
      justifyContent: "space-between",
    },
    iconStyle: {
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#eee",
      width: screen.getHorizontalPixelSize(45),
      maxWidth: 45,
      height: screen.getHorizontalPixelSize(45),
      maxHeight: 45,
      borderRadius: 50,
      zIndex: 1,
    },
  });

  const handleDeleteLocation = (locationIndex) => {
    try {
      const newLocations = [...locations];
      newLocations.splice(locationIndex, 1);
      setLocations(newLocations);
    } catch (err) {}
  };

  const handleContinue = () => {
    try {
      navigation.navigate(screens.passengerHome3, { from, to, distance });
    } catch (err) {}
  };

  const handleCloseError = () => {
    setError(false);
    navigation.goBack();
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <NetworkStatusLine />

      <PopupError
        visible={!!error}
        message={error}
        onClose={handleCloseError}
      />
      <View style={styles.iconContainer}>
        <Text style={styles.title}>{i18n("whereTo")}</Text>
        <TouchableOpacity style={styles.iconStyle} onPress={handleGoBack}>
          <AntDesign
            name={lang == "ar" ? "arrowright" : "arrowleft"}
            size={24}
            color="black"
          />
        </TouchableOpacity>
      </View>

      <AddressInput placeholder={i18n("whereYourDestination")} />

      {locations &&
        locations.map((location, index) => (
          <Location
            key={index}
            title={location.title}
            showDelete
            onDelete={() => handleDeleteLocation(index)}
          />
        ))}

      <CustomButton
        text={i18n("continue")}
        textStyle={styles.buttonText}
        disabled={!locations.length && !ready}
        onPress={handleContinue}
      />
    </SafeAreaView>
  );
}
