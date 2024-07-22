import { useEffect, useState } from "react";
import { StyleSheet, SafeAreaView, View, Text, Image } from "react-native";
import InputIcon from "../../components/inputs/InputIcon";
import SelectInput from "../../components/inputs/SelectInput";
import SquarePhotoInput from "../../components/inputs/SquarePhotoInput";
import ScreenSteps from "../../components/common/ScreenSteps";
import useLocale from "../../hooks/useLocale";
import screens from "../../static/screens.json";
import useScreen from "../../hooks/useScreen";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";

export default function AddCarScreen({ navigation }) {
  const screen = useScreen();
  const [ph1, setPh1] = useState("");
  const [ph2, setPh2] = useState("");
  const [ph3, setPh3] = useState("");
  const [ph4, setPh4] = useState("");

  const [options, setOptions] = useState({
    plateNumber: "1234567",
    carColor: "black",
    manufactureYear: 2000,
    carModel: "merceds",
  });

  const { i18n, lang } = useLocale();
  const colors = ["blue", "yellow", "black", "gray"];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: screen.getHorizontalPixelSize(15),
      paddingVertical: screen.getVerticalPixelSize(15),
      paddingTop: screen.getVerticalPixelSize(50),
      gap: screen.getVerticalPixelSize(25),
    },
    arTitle: {
      fontFamily: "cairo-700",
      fontSize: screen.getResponsiveFontSize(18),
      textAlign: "right",
      marginBottom: screen.getVerticalPixelSize(7),
    },
    enTitle: {
      fontFamily: "cairo-700",
      fontSize: screen.getResponsiveFontSize(18),
      textAlign: "left",
      textTransform: "capitalize",
      marginBottom: screen.getVerticalPixelSize(7),
    },
    arCarNumberIcon: {
      width: screen.getHorizontalPixelSize(30),
      height: screen.getHorizontalPixelSize(30),
      marginRight: screen.getHorizontalPixelSize(10),
    },
    enCarNumberIcon: {
      width: screen.getHorizontalPixelSize(30),
      height: screen.getHorizontalPixelSize(30),
      marginLeft: screen.getHorizontalPixelSize(10),
    },
    inputsContainer: {
      gap: screen.getVerticalPixelSize(15),
    },
    photosRowContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
    },
    screenStepsContainer: {
      marginTop: "auto",
      marginBottom: screen.getVerticalPixelSize(20),
    },
  });

  const handleCarColor = (color) => setOptions({ ...options, carColor: color });

  const chosePhoto = async (setPhoto) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [12, 20],
        quality: 0.5,
      });
      if (!result.canceled) {
        const response = await FileSystem.readAsStringAsync(
          result.assets[0].uri,
          {
            encoding: FileSystem.EncodingType.Base64,
          }
        );
        const photo = {
          uri: result.assets[0].uri,
          base: response,
        };
        setPhoto(photo);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleNext = () => {
    try {
      const photos = [ph1, ph2, ph3, ph4];
      const data = { options, photos };
      navigation.navigate(screens.addLegalDocuments, data);
    } catch (err) {}
  };

  const checkNext = () => {
    if (ph1 && ph2 && ph3 && ph4) {
      return false;
    } else {
      return true;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputsContainer}>
        <Text style={lang === "ar" ? styles.arTitle : styles.enTitle}>
          {i18n("addCarInfoTitle")}
        </Text>

        <InputIcon
          placeholder={i18n("plateNumber")}
          onChange={(opt) => setOptions({ ...options, plateNumber: opt })}
          Icon={() => (
            <Image
              source={require("../../assets/icons/car-number.png")}
              resizeMode="contain"
              style={
                lang === "ar" ? styles.arCarNumberIcon : styles.enCarNumberIcon
              }
            />
          )}
        />

        <InputIcon
          onChange={(opt) => setOptions({ ...options, manufactureYear: opt })}
          placeholder={i18n("manufactureYear")}
        />

        <InputIcon
          onChange={(opt) => setOptions({ ...options, carModel: opt })}
          placeholder={i18n("carModel")}
        />

        <SelectInput
          placeholder={i18n("carColor")}
          options={[
            { key: 1, value: colors[0] },
            { key: 2, value: colors[1] },
            { key: 3, value: colors[2] },
            { key: 4, value: colors[3] },
          ]}
          onChange={handleCarColor}
        />
      </View>

      <View style={styles.inputsContainer}>
        <Text style={lang === "ar" ? styles.arTitle : styles.enTitle}>
          {i18n("addCarPhotosTitle")}
        </Text>

        <View style={styles.photosRowContainer}>
          <SquarePhotoInput
            value={ph1.uri || null}
            onChange={() => chosePhoto(setPh1)}
          />
          <SquarePhotoInput
            value={ph2.uri || null}
            onChange={() => chosePhoto(setPh2)}
          />
        </View>

        <View style={styles.photosRowContainer}>
          <SquarePhotoInput
            value={ph3.uri || null}
            onChange={() => chosePhoto(setPh3)}
          />
          <SquarePhotoInput
            value={ph4.uri || null}
            onChange={() => chosePhoto(setPh4)}
          />
        </View>
      </View>

      <ScreenSteps
        containerStyle={styles.screenStepsContainer}
        disableNext={checkNext()}
        showPrev={false}
        onNext={handleNext}
      />
    </SafeAreaView>
  );
}
