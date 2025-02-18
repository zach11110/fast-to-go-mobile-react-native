import { useEffect, useState } from "react";
import { StyleSheet, SafeAreaView, Text, ScrollView, View } from "react-native";
import useScreen from "../../hooks/useScreen";
import useLocale from "../../hooks/useLocale";
import DefaultScreenTitle from "../../components/screenTitles/DefaultScreenTitle";
import InputIcon from "../../components/inputs/InputIcon";
import { Ionicons } from "@expo/vector-icons";
import * as theme from "../../constants/theme";
import CustomButton from "../../components/buttons/CustomButton";
import Region from "../../components/admin/Region";
import GoogleMapRegionSelection from "../../components/common/GoogleMapRegionSelection";
import {
  addWorkSpace,
  getWorkSpaces,
  deleteSpace,
} from "../../api/user/workSpaces";

export default function RegionsScreen({ navigation }) {
  const screen = useScreen();
  const { i18n, lang } = useLocale();
  const [polylineCoordinates, setPolylineCoordinates] = useState([]);
  const [regionName, setRegionName] = useState("");
  const [spaces, setSpaces] = useState([]);

  useEffect(() => {
    getSpaces = async () => {
      const { data } = await getWorkSpaces();

      if (data.length) setSpaces(data);
    };
    getSpaces();
  });

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: screen.getHorizontalPixelSize(15),
      paddingVertical: screen.getVerticalPixelSize(15),
      paddingTop: screen.getVerticalPixelSize(50),
      gap: screen.getVerticalPixelSize(15),
    },
    contentContainer: {
      gap: screen.getVerticalPixelSize(15),
    },
    title: {
      fontFamily: "cairo-700",
      fontSize: screen.getResponsiveFontSize(16),
      marginTop: screen.getVerticalPixelSize(10),
    },
    mapContainer: {
      minHeight: screen.getScreenHeight() * 0.45,
      maxHeight: screen.getVerticalPixelSize(400),
      alignSelf: "center",
    },
    inputIcon: {
      marginRight: lang === "ar" ? screen.getHorizontalPixelSize(10) : 0,
      marginLeft: lang === "en" ? screen.getHorizontalPixelSize(10) : 0,
      fontSize: screen.getResponsiveFontSize(30),
      color: theme.primaryColor,
    },
    buttonText: {
      fontFamily: "cairo-800",
      fontSize: screen.getResponsiveFontSize(18),
    },
    regionsContainer: {
      gap: screen.getVerticalPixelSize(20),
      paddingBottom: screen.getVerticalPixelSize(15),
    },
  });

  const handleGoBack = () => {
    try {
      navigation.goBack();
    } catch (err) {}
  };

  const handleMapPress = (event) => {
    try {
      const { coordinate } = event.nativeEvent;
      setPolylineCoordinates((prevCoordinates) => [
        ...prevCoordinates,
        coordinate,
      ]);
    } catch (err) {}
  };

  const handleAddRegions = async () => {
    try {
      const workSpaces = {
        title: regionName,
        points: polylineCoordinates,
      };

      const { data } = await addWorkSpace(workSpaces);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePanGestureEvent = (event) => {
    try {
      const {
        nativeEvent: { translationX, translationY },
      } = event;
      const updatedCoordinates = polylineCoordinates.map((coordinate) => ({
        latitude: coordinate.latitude + translationY * 0.0001,
        longitude: coordinate.longitude + translationX * 0.0001,
      }));
      setPolylineCoordinates(updatedCoordinates);
    } catch (err) {}
  };

  const handleDeletePlace = async (id) => {
    try {
      const { data } = await deleteSpace(id);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteRegion = () => {
    try {
      setPolylineCoordinates([]);
    } catch (err) {}
  };

  const checkIfAddButtonDisabled = () => {
    return (
      !regionName ||
      regionName.split("").length < 5 ||
      polylineCoordinates.length < 3
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <DefaultScreenTitle title={i18n("regions")} onPrev={handleGoBack} />

      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>{i18n("addRegion")}</Text>

        <GoogleMapRegionSelection
          containerStyles={styles.mapContainer}
          polylineCoordinates={polylineCoordinates}
          onDeleteRegion={handleDeleteRegion}
          onMapPress={handleMapPress}
          onPanGestureEvent={handlePanGestureEvent}
        />

        <InputIcon
          title={i18n("region")}
          placeholder={i18n("region")}
          Icon={() => <Ionicons name="location" style={styles.inputIcon} />}
          value={regionName}
          onChange={setRegionName}
        />

        <CustomButton
          text={i18n("add")}
          textStyle={styles.buttonText}
          disabled={checkIfAddButtonDisabled()}
          onPress={handleAddRegions}
        />

        <Text style={styles.title}>{i18n("addedRegions")}</Text>

        <View style={styles.regionsContainer}>
          {spaces.map((space) => (
            <Region
              key={space._id}
              title={space.title}
              onPress={() => handleDeletePlace(space._id)}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
