import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Pressable,
  BackHandler,
} from "react-native";
import useScreen from "../../hooks/useScreen";
import StarRating from "react-native-star-rating";
import TextAreaInput from "../../components/inputs/TextAreaInput";
import screens from "../../static/screens.json";
import useLocale from "../../hooks/useLocale";
import * as theme from "../../constants/theme";
import CustomBotton from "../../components/buttons/CustomButton";
import { useState, useEffect } from "react";
import { addEvaluation } from "../../api/user/users";

export default function TripEvalution({ navigation, route }) {
  const driverId = route.params;
  const screen = useScreen();
  const [disabled, setDisabled] = useState(true);
  const [rate, setRate] = useState(0);
  const [selected, setSelected] = useState("");
  const [textEvaluation, setTextEvaluation] = useState("");
  const { i18n, lang } = useLocale();

  const styles = StyleSheet.create({
    container: {
      marginTop: 60,
      marginHorizontal: 15,
      gap: 20,

      flex: 1,
    },
    TitleContainer: {
      display: "flex",
      flexDirection: "row",
      marginHorizontal: 20,
      width: screen.getScreenWidth() / 1.75,
      justifyContent: "space-between",
      alignItems: "center",
    },
    Title: {
      fontFamily: "cairo-700",
      fontSize: screen.getResponsiveFontSize(18),
      textAlign: "center",
    },
    containerStyle: {
      marginHorizontal: 50,
      marginVertical: 20,
    },

    ListStyle: {
      display: "flex",
      flexDirection: lang === "ar" ? "row-reverse" : "row",
      gap: 10,
      flexWrap: "nowrap",
    },
    SecondryText: {
      fontFamily: "cairo-500",
      color: "#747474",
      fontSize: screen.getResponsiveFontSize(14),
    },
    DisabledBtn: {
      fontFamily: "cairo-400",
      fontSize: screen.getResponsiveFontSize(18),
      color: "#747474",
    },
    OptionStyle: {
      padding: 10,
      fontFamily: "cairo-400",
      fontSize: screen.getResponsiveFontSize(12),
      backgroundColor: "#eee",
    },
    MainText: {
      fontFamily: "cairo-700",
      fontSize: screen.getResponsiveFontSize(14),
    },
    selected: {
      padding: 10,
      borderRadius: 5,
      fontFamily: "cairo-400",
      fontSize: screen.getResponsiveFontSize(12),
      backgroundColor: "#c3bfbf",
    },
  });

  const handleGoToHome = () => {
    navigation.navigate(screens.passengerHome1);
  };

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", handleGoToHome);
    return () =>
      BackHandler.removeEventListener("hardwareBackPress", handleGoToHome);
  }, []);

  const handleSelectStar = (stars) => {
    setRate(stars);

    setDisabled(false);
  };

  const handleContinue = async () => {
    try {
      navigation.navigate(screens.passengerHome1);
    } catch (err) {
      navigation.navigate(screens.passengerHome1);
    }
  };

  const handleTextEvaluation = (text) => {
    setTextEvaluation(text);
  };

  const handleSendEvaluation = async () => {
    try {
      const evaluation = {
        rate: rate,
        text: textEvaluation,
      };
      await addEvaluation(evaluation, driverId);

      handleContinue();
    } catch (error) {}
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.TitleContainer}>
        <Pressable onPress={handleContinue} disabled={disabled}>
          <Text style={disabled ? styles.DisabledBtn : styles.Title}>
            {i18n("Continue")}
          </Text>
        </Pressable>
        <Text style={styles.Title}>{i18n("TripEvalution")}</Text>
      </View>
      <View>
        <Text style={styles.MainText}>{i18n("HowWasTheTrip")}</Text>
        <Text style={styles.SecondryText}>{i18n("GivUsEvalution")}</Text>

        <StarRating
          disabled={false}
          maxStars={5}
          rating={rate}
          emptyStarColor={"#747474"}
          fullStarColor={"gold"}
          selectedStar={handleSelectStar}
          containerStyle={styles.containerStyle}
        />
      </View>
      <Text style={styles.MainText}>{i18n("WhatDidYouLike")}</Text>
      <View style={styles.ListStyle}>
        <Text
          onPress={() => setSelected("fantactec")}
          style={
            selected === "fantactec" ? styles.selected : styles.OptionStyle
          }
        >
          {i18n("fantasticService")}
        </Text>
        <Text
          onPress={() => setSelected("safe")}
          style={selected === "safe" ? styles.selected : styles.OptionStyle}
        >
          {i18n("safeAndComfortable")}
        </Text>
        <Text
          onPress={() => setSelected("fast")}
          style={selected === "fast" ? styles.selected : styles.OptionStyle}
        >
          {i18n("fastAccess")}
        </Text>
      </View>
      <View style={styles.ListStyle}>
        <Text
          onPress={() => setSelected("good")}
          style={selected === "good" ? styles.selected : styles.OptionStyle}
        >
          {i18n("goodPrices")}
        </Text>
        <Text
          onPress={() => setSelected("aouther")}
          style={selected === "aouther" ? styles.selected : styles.OptionStyle}
        >
          {i18n("aouthers")}
        </Text>
      </View>
      <Text style={styles.MainText}>{i18n("ShareYourNotes")}</Text>

      <TextAreaInput
        onChange={handleTextEvaluation}
        placeholder={i18n("WriteYourNotes")}
      />

      <CustomBotton
        onPress={handleSendEvaluation}
        disabled={disabled}
        text={i18n("SendEvalution")}
      />
    </SafeAreaView>
  );
}
