import { SafeAreaView, StyleSheet, Text, Image, View } from "react-native";
import GoogleMap from "../../components/common/GoogleMap";
import useScreen from "../../hooks/useScreen";
import useLocale from "../../hooks/useLocale";
import screens from "../../static/screens.json";
import useTimer from "../../hooks/useTimer";

export default function DriverWaiting({ navigation, route }) {
  const { driver, car, trip } = route.params;
  const screen = useScreen();
  const { isTimerDone } = useTimer(10);
  const { i18n, lang } = useLocale();
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    ImageContainer: {
      alignItems: "center",
    },
    Image: {
      resizeMode: "contain",
      width: screen.getScreenWidth() / 1.5,
      height: screen.getScreenHeight() / 4,
    },
    TextContainer: {
      height: screen.getScreenHeight() / 1.8,
      gap: screen.getHorizontalPixelSize(15),
      marginHorizontal: 10,
    },
    MainText: {
      fontFamily: "cairo-700",
      fontSize: screen.getResponsiveFontSize(16),
    },
    SecondryText: {
      fontFamily: "cairo-500",
      color: "#747474",
      fontSize: screen.getResponsiveFontSize(12),
    },
  });

  if (isTimerDone) {
    return navigation.navigate(screens.TripState, { driver, car, trip });
  }

  return (
    <SafeAreaView style={styles.Container}>
      <View>
        <GoogleMap />

        <View style={styles.TextContainer}>
          <View style={styles.ImageContainer}>
            <Image
              style={styles.Image}
              source={require("../../assets/images/driverWaiting.png")}
            />
          </View>

          <Text style={styles.MainText}>{i18n("TheDriverHasReached")} </Text>
          <Text style={styles.SecondryText}>{i18n("TheDriverWating")}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
