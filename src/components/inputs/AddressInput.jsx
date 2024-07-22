import { View, StyleSheet, TextInput, KeyboardAvoidingView, ScrollView } from "react-native";
import { EvilIcons } from "@expo/vector-icons";
import * as theme from "../../constants/theme";
import useLocale from "../../hooks/useLocale";
import useScreen from "../../hooks/useScreen";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { googleMapApiKey } from "../../constants/apiKeys";
import { useCallback } from "react";


export default function AddressInput({
  onPress,
  placeholder,
  onFocus,
}) {
  const screen = useScreen();
  const { lang } = useLocale();

  const styles = StyleSheet.create({
    arContainer: {
      borderRadius: 8,
      backgroundColor: "#fff",
      borderWidth: screen.getHorizontalPixelSize(1.5),
      borderColor: theme.primaryColor,
      flexDirection: "row",
      alignItems: "center",
    },
    enContainer: {
      borderRadius: 8,
      backgroundColor: "#fff",
      borderWidth: screen.getHorizontalPixelSize(1.5),
      borderColor: theme.primaryColor,
      flexDirection: "row-reverse",
      alignItems: "center",
    },
    arInput: {
      flex: 1,
      color: "#000",
      paddingVertical: screen.getVerticalPixelSize(10),
      paddingHorizontal: screen.getHorizontalPixelSize(10),
      fontFamily: "cairo-400",
      textAlign: "right",
    },
    enInput: {
      flex: 1,
      color: "#000",
      paddingVertical: screen.getVerticalPixelSize(10),
      paddingHorizontal: screen.getHorizontalPixelSize(10),
      fontFamily: "cairo-400",
      textAlign: "left",
    },
  });
  const onSearchError = useCallback((error) => {
    console.log(error);
  }, []);
  
  return (
     <View
    style={lang === "ar" ? styles.arContainer : styles.enContainer}>
   
     <GooglePlacesAutocomplete
      styles={lang === "ar" ? styles.arInput : styles.enInput}
      placeholder={placeholder}
      onPress={onPress}


      query={{
        key: googleMapApiKey,
        language: {lang},
      }}
      enablePoweredByContainer={false}
      fetchDetails={true}
      GooglePlacesDetailsQuery={{
        fields:["geometry"]
      }}
    />

      <EvilIcons name="location" size={34} color={theme.primaryColor} />
    </View>
  );
}
