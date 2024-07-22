import { useEffect, useRef, useState } from "react";
import { StyleSheet } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Polygon } from "react-native-maps";
import useLocation from "../../hooks/useLocation";
import useLocale from "../../hooks/useLocale";
import Geocoder from "react-native-geocoding";
import MapViewDirections from "react-native-maps-directions";
import { getWorkSpaces } from "../../api/user/workSpaces";
import * as theme from "../../constants/theme";
import { googleMapApiKey } from "../../constants/apiKeys";

Geocoder.init(googleMapApiKey);

const initialRegion = {
  latitude: 0,
  longitude: 0,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

export default function GoogleMap({
  locations = [],
  trip,
  passenger,
  icon,
  directions,
  drivers = [],
  onSelectLocation,
  onMarkerPress,
  containerStyles,
}) {
  const mapRef = useRef(null);

  const { location } = useLocation();
  const [spaces, setSpaces] = useState([]);
  const [direction, setDirection] = useState(directions);
  const [zoom, setZoom] = useState(0);
  const { i18n } = useLocale();
  const [region, setRegion] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    if (location && (region.latitude === 0) & (region.longitude === 0)) {
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
  }, [location]);

  useEffect(() => {
    const getSpaces = async () => {
      try {
        const { data } = await getWorkSpaces();

        setSpaces(data);
      } catch (error) {
        console.log(error);
      }
    };

    const getZoom = async () => {
      try {
        const { zoom } = await mapRef.current.getCamera();

        setZoom(zoom);
      } catch (error) {
        console.log(error);
      }
    };

    const interval = setInterval(() => {
      getZoom();
      getSpaces();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleSelectLocation = async (event) => {
    try {
      const location = {
        latitude:
          event?.nativeEvent?.coordinate?.latitude || initialRegion.latitude,

        longitude:
          event?.nativeEvent?.coordinate?.longitude || initialRegion.longitude,

        title: i18n("unknownLocation"),
      };

      Geocoder.from(location.latitude, location.longitude)
        .then((response) => {
          try {
            const address = response?.results[0]?.formatted_address;
            console.log(address);
            if (address) {
              location.title = address;
            }
            onSelectLocation?.(location);
          } catch (err) {}
        })
        .catch((err) => {
          try {
            onSelectLocation?.(location);
          } catch (err) {}
        });
    } catch (err) {}
  };

  useEffect(() => {
    if (!directions) return;
    setDirection(directions);
  }, [directions]);

  return (
    <MapView
      ref={mapRef}
      style={[styles.map, containerStyles || {}]}
      region={region}
      provider={PROVIDER_GOOGLE}
      showsUserLocation
      showsMyLocationButton={false}
      onPress={handleSelectLocation}
    >
      {direction && (
        <MapViewDirections
          origin={direction.origin}
          destination={direction.destination}
          apikey={googleMapApiKey}
          strokeWidth={6}
          strokeColor={theme.primaryColor}
        />
      )}

      {spaces &&
        zoom < 11 &&
        spaces.map((space, index) => (
          <Polygon
            key={index}
            fillColor="#79e37d5c"
            coordinates={space.points}
          />
        ))}

      {locations.map((location, index) => (
        <Marker
          pinColor="green"
          key={index}
          coordinate={{
            latitude: location?.latitude,
            longitude: location?.longitude,
          }}
          onPress={() => onMarkerPress?.(location)}
        />
      ))}

      {!!drivers.length > 0 &&
        drivers.map((location, index) => (
          <Marker
            draggable={false}
            icon={icon || null}
            key={index}
            coordinate={{
              latitude: location?.latitude,
              longitude: location?.longitude,
            }}
            onPress={() => onMarkerPress?.(location)}
          />
        ))}

      {!!passenger && (
        <Marker
          draggable={false}
          icon={require("../../assets/icons/avatar.png")}
          coordinate={{
            latitude: passenger?.latitude,
            longitude: passenger?.longitude,
          }}
        />
      )}

      {!!trip?.from && (
        <Marker
          draggable={false}
          icon={require("../../assets/icons/avatar.png")}
          coordinate={{
            latitude: trip?.from?.latitude,
            longitude: trip?.from?.longitude,
          }}
        />
      )}
      {!!trip?.to && (
        <Marker
          draggable={false}
          pinColor="green"
          coordinate={{
            latitude: trip?.to?.latitude,
            longitude: trip?.to?.longitude,
          }}
        />
      )}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
    minHeight: "100%",
    minWidth: "100%",
  },
});
