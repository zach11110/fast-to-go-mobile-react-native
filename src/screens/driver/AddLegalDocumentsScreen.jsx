import { StyleSheet, SafeAreaView, View, Text, Platform } from "react-native";
import AvatarInput from "../../components/inputs/AvatarInput";
import useLocale from "../../hooks/useLocale";
import PopupConfirm from "../../components/popups/PopupConfirm";
import PopupLoading from "../../components/popups/PopupLoading";
import PopupError from "../../components/popups/PopupError";
import SquarePhotoInput from "../../components/inputs/SquarePhotoInput";
import ScreenSteps from "../../components/common/ScreenSteps";
import screens from "../../static/screens.json";
import { addCar } from "../../api/user/car";
import * as ImagePicker from "expo-image-picker";
import useScreen from "../../hooks/useScreen";
import { useEffect, useState } from "react";
import * as FileSystem from "expo-file-system";

export default function AddLegalDocumentsScreen({ navigation, route }) {
  const [photo1, photo2, photo3, photo4] = route.params.photos;
  const {
    plateNumber,
    manufactureYear: productionYear,
    carModel: model,
    carColor: color,
  } = route.params.options;

  const [disable, setDisable] = useState(false);
  const screen = useScreen();
  const { i18n, lang } = useLocale();
  const [personalImage, setPersonalImage] = useState("");
  const [carInsurance, setCarInsurance] = useState("");
  const [passport, setPassport] = useState("");
  const [drivingLicense, setDrivingLicense] = useState("");
  const [carBrochure, setCarBrochure] = useState("");
  const [isLoading, setIsLoadig] = useState(false);
  const [showError, setShowError] = useState(false);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: screen.getHorizontalPixelSize(15),
      paddingVertical: screen.getVerticalPixelSize(15),
      paddingTop: screen.getVerticalPixelSize(50),
      gap: screen.getVerticalPixelSize(30),
    },
    inputsContainer: {
      gap: screen.getVerticalPixelSize(10),
    },
    arTitle: {
      fontFamily: "cairo-700",
      fontSize: screen.getResponsiveFontSize(18),
      textAlign: "right",
    },
    enTitle: {
      fontFamily: "cairo-700",
      fontSize: screen.getResponsiveFontSize(18),
      textAlign: "left",
      textTransform: "capitalize",
    },
    arSubtitle: {
      fontFamily: "cairo-500",
      fontSize: screen.getResponsiveFontSize(14),
      color: "#747474",
      textAlign: "right",
      marginBottom: screen.getVerticalPixelSize(7),
    },
    enSubtitle: {
      fontFamily: "cairo-500",
      fontSize: screen.getResponsiveFontSize(14),
      color: "#747474",
      textAlign: "left",
      textTransform: "capitalize",
      marginBottom: screen.getVerticalPixelSize(7),
    },
    avatarContainer: {
      alignSelf: "flex-end",
      marginVertical: 0,
      marginTop: screen.getVerticalPixelSize(15),
      marginHorizontal: screen.getHorizontalPixelSize(10),
    },
    photosRowContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginTop: screen.getVerticalPixelSize(10),
    },
    screenStepsContainer: {
      marginTop: "auto",
      marginBottom: screen.getVerticalPixelSize(20),
    },
  });

  const chosePhoto = async (setPhoto) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
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
  };

  const handleNext = async () => {
    try {
      setIsLoadig(true);
      const avatar = personalImage;
      const brochure = carBrochure;
      const driverLicense = drivingLicense;
      const insurance = carInsurance;
      const color = "black";

      setDisable(true);
      await addCar(
        plateNumber,
        productionYear,
        model,
        color,
        avatar,
        photo1,
        photo2,
        photo3,
        photo4,
        brochure,
        driverLicense,
        insurance,
        passport
      );

      setIsLoadig(false);
      navigation.navigate(screens.pendingRequest);
      setDisable(false);
    } catch (err) {
      console.log(err?.response?.data?.message);
      setShowError(true);
    } finally {
      setIsLoadig(false);
    }
  };

  const checkNext = () => {
    if (personalImage && carBrochure && drivingLicense && carInsurance) {
      return false;
    } else {
      return true;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputsContainer}>
        <PopupLoading visible={isLoading} />

        <PopupError visible={showError} onClose={() => setShowError(false)} />

        <Text style={lang === "ar" ? styles.arTitle : styles.enTitle}>
          {i18n("uploadPersonalPhoto")}
        </Text>

        <Text style={lang === "ar" ? styles.arSubtitle : styles.enSubtitle}>
          {i18n("personalPhotoConditions")}
        </Text>

        <AvatarInput
          value={personalImage || null}
          onChange={() => chosePhoto(setPersonalImage)}
          containerStyles={styles.avatarContainer}
        />
      </View>

      <View style={styles.inputsContainer}>
        <Text style={lang === "ar" ? styles.arTitle : styles.enTitle}>
          {i18n("uploadRequiredDocuments")}
        </Text>

        <Text style={lang === "ar" ? styles.arSubtitle : styles.enSubtitle}>
          {i18n("uploadRequiredDocumentsRequest")}
        </Text>

        <View style={styles.photosRowContainer}>
          <SquarePhotoInput
            value={drivingLicense.uri || null}
            onChange={() => chosePhoto(setDrivingLicense)}
            title={i18n("drivingLicense")}
          />
          <SquarePhotoInput
            value={carBrochure.uri || null}
            onChange={() => chosePhoto(setCarBrochure)}
            title={i18n("carBrochure")}
          />
        </View>

        <View style={styles.photosRowContainer}>
          <SquarePhotoInput
            value={passport.uri || null}
            onChange={() => chosePhoto(setPassport)}
            title={i18n("passport")}
          />
          <SquarePhotoInput
            value={carInsurance.uri || null}
            onChange={() => chosePhoto(setCarInsurance)}
            title={i18n("carInsurance")}
          />
        </View>
      </View>

      <ScreenSteps
        containerStyle={styles.screenStepsContainer}
        showPrev={false}
        disableNext={checkNext()}
        onNext={handleNext}
      />
    </SafeAreaView>
  );
}
