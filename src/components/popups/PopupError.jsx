import { StyleSheet, Modal, View, Image, Text } from "react-native";
import * as theme from "../../constants/theme";
import CustomButton from "../buttons/CustomButton";
import useLocale from "../../hooks/useLocale";
import useScreen from "../../hooks/useScreen";
import { useState } from "react";

const defaultMessage = "خطأ غير متوقع";

export default function PopupError({
  visible = false,
  message = defaultMessage,
  onClose,
}) {
  const screen = useScreen();
  const { i18n } = useLocale();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(0,0,0,0.5)",
    },
    boxContainer: {
      width: screen.getScreenWidth() * 0.9,
      maxWidth: screen.getHorizontalPixelSize(400),
      paddingVertical: screen.getVerticalPixelSize(20),
      paddingHorizontal: screen.getHorizontalPixelSize(20),
      paddingBottom: 80,
      backgroundColor: "#FF5353",
      borderRadius: 8,
      alignItems: "center",
      gap: screen.getVerticalPixelSize(10),
    },
    icon: {
      width: screen.getHorizontalPixelSize(50),
      height: screen.getVerticalPixelSize(50),
    },
    title: {
      fontFamily: "cairo-700",
      color: "#fff",
      fontSize: screen.getResponsiveFontSize(17),
    },
    errorText: {
      fontFamily: "cairo-500",
      color: "#fff",
      fontSize: screen.getResponsiveFontSize(13),
    },
    buttonContainer: {
      backgroundColor: "#fff",
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      borderBottomLeftRadius: 8,
      borderBottomRightRadius: 8,
    },
    button: {
      backgroundColor: "transparent",
    },
    buttonText: {
      color: "#000",
    },
  });
  
  return (
    <>
      <Modal
        visible={visible}
        animationType="fade"
        transparent={true}
        onRequestClose={onClose}
      >
        <View style={styles.container}>
          <View style={styles.boxContainer}>
            <Image
              source={require("../../assets/images/error-emoji.png")}
              resizeMode="contain"
              style={styles.icon}
            />

            <Text style={styles.title}>{i18n("popupErrorTitle")}</Text>

            <Text style={styles.errorText}>{message}</Text>

            <View style={styles.buttonContainer}>
              <CustomButton
                text={i18n("popupErrorButtonText")}
                onPress={onClose}
                containerStyle={styles.button}
                textStyle={styles.buttonText}
              />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
