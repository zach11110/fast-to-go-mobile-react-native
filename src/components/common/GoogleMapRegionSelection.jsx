import { StyleSheet, Text, TouchableHighlight, View } from "react-native";
import MapView, { Polyline,Polygon, Marker } from "react-native-maps";
import { PanGestureHandler,GestureHandlerRootView } from "react-native-gesture-handler";
import useScreen from "../../hooks/useScreen";
import Geocoder from "react-native-geocoding";
import useLocale from "../../hooks/useLocale";

Geocoder.init("AIzaSyCCEmVrr0YEw2JDMpYpXMfhSztRyeu1ycw");

const initialRegion = {
  latitude: 32.86806972,
  longitude: 13.1172586594,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

const GoogleMapRegionSelection = ({
  polylineCoordinates,
  onMapPress,
  onPanGestureEvent,
  onDeleteRegion,
  containerStyles,
}) => {
  const screen = useScreen();
  const { i18n } = useLocale();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    map: {
      flex: 1,
      width: "100%",
      height: "100%",
    },
    gestureContainer: {
      position: "absolute",
      bottom: screen.getVerticalPixelSize(20),
      alignSelf: "center",
    },
    controlButton: {
      backgroundColor: "#f00",
      paddingVertical: screen.getVerticalPixelSize(7),
      paddingHorizontal: screen.getHorizontalPixelSize(15),
      borderRadius: screen.getHorizontalPixelSize(8),
    },
    buttonText: {
      fontSize: screen.getResponsiveFontSize(15),
      color: "#fff",
      fontFamily: "cairo-700",
    },
  });

  return (
    <View style={styles.container}>
    
      <MapView
        style={[styles.map, containerStyles || {}]}
        onPress={onMapPress}
        region={initialRegion}
      >
        

        {polylineCoordinates.length > 0&&
        <Polygon fillColor="#79e37d5c" coordinates={polylineCoordinates}/>}

     
        {/* Render the polyline */}
        {polylineCoordinates.length > 1 && (
          <Polyline
            coordinates={polylineCoordinates}
            strokeWidth={screen.getHorizontalPixelSize(3)}
            strokeColor="green"
          />
        )}
      </MapView>

        
      {/* Enable/disable polyline control */}
      {!!polylineCoordinates.length && (
      <GestureHandlerRootView>
        <PanGestureHandler onGestureEvent={onPanGestureEvent}>
          <View style={styles.gestureContainer}>
            <TouchableHighlight
              style={styles.controlButton}
              onPress={onDeleteRegion}
            >
              <Text style={styles.buttonText}>{i18n("deleteRegion")}</Text>
            </TouchableHighlight>
          </View>
        </PanGestureHandler>
      </GestureHandlerRootView>
      )}
    </View>
  );
};

export default GoogleMapRegionSelection;
