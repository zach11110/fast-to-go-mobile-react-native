import { StyleSheet, Text } from "react-native";
import StaticBottomSheet from "./StaticBottomSheet";
import AddressInput from "../inputs/AddressInput";
import Location from "../common/Location";
import AddLocationButton from "../buttons/AddLocationButton";
import CustomButton from "../buttons/CustomButton";
import useLocale from "../../hooks/useLocale";
import useScreen from "../../hooks/useScreen";



export default function HomeBottomSheet1({
  onAddLocation,
  onRequestNow,
  disableButton,
  disableAddLocation,
  locationTitle,
  onSelect
}) {

  const screen = useScreen();
  const { i18n ,lang} = useLocale();

  const styles = StyleSheet.create({
    container: {
      gap: screen.getVerticalPixelSize(15),
    },
    title: {
      fontFamily: "cairo-800",
      fontSize: screen.getResponsiveFontSize(15),
    },
    buttonText: {
      fontFamily: "cairo-800",
      fontSize: screen.getResponsiveFontSize(16),
    },
  });

  

  return (
    <StaticBottomSheet 
    disableScroll={true}
    contentStyle={styles.container}>
      <Text style={styles.title}>{i18n("whereTo")}</Text>
      
      <AddressInput
        placeholder={i18n("whereYourDestination")}
        onPress={onSelect}
        
      />

  

      {/* <AddLocationButton
        onPress={onAddLocation}
        disabled={disableAddLocation}
        text={i18n("addLocationToFav")}
      /> */}

      <CustomButton
        text={i18n("requestNow")}
        onPress={onRequestNow}
        textStyle={styles.buttonText}
        disabled={disableButton}
      />
    </StaticBottomSheet>
  );
}
