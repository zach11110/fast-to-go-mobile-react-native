import { StyleSheet, TouchableOpacity } from "react-native";
import * as theme from "../../constants/theme";
import useScreen from "../../hooks/useScreen";

export default function ButtonIcon({ onPress,disabled, containerStyle, children }) {
  const screen = useScreen();

  const styles = StyleSheet.create({
    container: {
      borderRadius: 8,
      paddingVertical: screen.getVerticalPixelSize(4),
      paddingHorizontal: screen.getHorizontalPixelSize(10),
      backgroundColor: !disabled? theme.primaryColor : theme.primaryColorLight,
    },
  });

  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={disabled?()=>{return}:onPress}
      style={[styles.container, containerStyle || {}]}
    >
      {children}
    </TouchableOpacity>
  );
}
