import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View, TouchableHighlight } from "react-native";

import MapView, { Marker, Polygon, PROVIDER_GOOGLE } from "react-native-maps";
import * as geolib from "geolib";
import HomeBottomSheet1 from "../../components/bottomSheets/HomeBottomSheet1";
import HamburgerMenu from "../../components/common/HamburgerMenu";
import NetworkStatusLine from "../../components/common/NetworkStatusLine";
import screens from "../../static/screens.json";
import useLocation from "../../hooks/useLocation";
import * as usersApi from "../../api/user/users";
import useScreen from "../../hooks/useScreen";
import useLocale from "../../hooks/useLocale";
import Geocoder from "react-native-geocoding";
import { getWorkSpaces } from "../../api/user/workSpaces";
import PopupError from "../../components/popups/PopupError";
import { googleMapApiKey } from "../../constants/apiKeys";

Geocoder.init(googleMapApiKey);

export default function PassengerHomeScreen1({ navigation }) {
  const { location } = useLocation();
  const screen = useScreen();
  const mapRef = useRef(null);
  const pointerRef = useRef(null);
  const { i18n } = useLocale();

  const [locations, setLocations] = useState([]);
  const [destTitle, setDestTitle] = useState("unKnown location");
  const [drivers, setDrivers] = useState([]);
  const [spaces, setSpaces] = useState([]);
  const [error, setError] = useState(false);
  const [zoom, setZoom] = useState(0);
  const [validLocation, setValidLocation] = useState(true);
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

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    map: {
      flex: 1,
      minHeight: "100%",
      minWidth: "100%",
      zIndex: -2,
    },
    selectIcon: {
      marginVertical: screen.getScreenHeight() / 3,
      backgroundColor: "transparent",
      marginHorizontal: screen.getScreenWidth() / 3,
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
    staticMarker: {
      position: "absolute",
      width: 100,
      top: screen.getScreenHeight() / 3 + 75,
      left: (screen.getScreenWidth() - 105) / 2,
    },
    selectBtn: {
      borderRadius: 20,
      textAlign: "center",
      backgroundColor: "green",
      padding: 4,
    },
    Text: {
      fontWeight: "bold",
      textAlign: "center",
      color: "white",
    },
    pointer: {
      position: "absolute",
      left: 50,
      top: 20,
      marginTop: -10,
      backgroundColor: "green",
      width: 5,
      borderRadius: 20,
      padding: 2,
      height: 60,
      zIndex: -1,
    },
  });

  useEffect(() => {
    const getDrivers = async () => {
      try {
        const { data } = await usersApi.getAllDrivers("all");
        if (!data) return;
        const activeDrivers = data?.inverifiedDrivers?.filter((driver) => {
          return driver.location?.latitude && driver.driverStatus.active;
        });
        const driversLocation = activeDrivers
          .map((driver) => driver.location)
          .filter((location) => location.latitude);
        setDrivers([...driversLocation]);
      } catch (error) {}
    };

    const getSpaces = async () => {
      try {
        const { data } = await getWorkSpaces();
        setSpaces(data);
      } catch (error) {}
    };

    const getZoom = async () => {
      if (mapRef.current) {
        const { zoom } = await mapRef.current.getCamera();
        setZoom(zoom);
      }
    };

    const interval = setInterval(() => {
      getZoom();
      getSpaces();
      getDrivers();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  //check location if not valid

  useEffect(() => {
    const checkLocation = async () => {
      if (!spaces) {
        return setValidLocation(false);
      }

      try {
        const userLocation = {
          latitude: location?.coords.latitude,
          longitude: location?.coords.longitude,
        };

        const polygons = spaces.map(({ points }) => points);

        const isValid = polygons.some(async (elemnt) => {
          const valid = await geolib.isPointInPolygon(userLocation, elemnt);
          return valid;
        });
        setValidLocation(isValid);
      } catch (error) {
        console.log(error);
      }
    };
    checkLocation();
  }, [spaces]);

  const handleAddLocation = () => {
    navigation.navigate(screens.savedPlaces);
  };

  const handleRequestNow = async () => {
    try {
      const userLocation = {
        longitude: location?.coords.longitude,
        latitude: location?.coords.latitude,
        title: location?.title,
      };
      navigation.navigate(screens.passengerHome2, {
        from: userLocation,
        to: locations,
      });
    } catch (err) {}
  };

  const handleSelectLocation = async () => {
    try {
      if (!validLocation) {
        return setError(i18n("invaledLocation"));
      }
      mapRef.current.getCamera().then((camera) => {
        const location = {
          title: destTitle,
          latitude: camera.center.latitude,
          longitude: camera.center.longitude,
        };

        Geocoder.from(location.latitude, location.longitude).then(
          (response) => {
            const address = response?.results[0]?.formatted_address;
            if (address) {
              location.title = address;
            }
          }
        );
        setLocations([location]);
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteLocation = (markerLocation) => {
    try {
      const newLocations = locations.filter(
        (location) =>
          location.latitude !== markerLocation.latitude &&
          location.longitude !== markerLocation.longitude
      );

      setLocations(newLocations);
    } catch (err) {}
  };

  const handleOpenDrawer = () => {
    try {
      navigation.openDrawer();
    } catch (err) {}
  };

  const handleChoeseLocation = (data, details = null) => {
    const location = {
      latitude: details?.geometry.location.lat,
      longitude: details?.geometry.location.lng,
      latitudeDelta: 0.0022,
      longitudeDelta: 0.0021,
    };
    setDestTitle(details.formatted_address);
    mapRef.current.animateToRegion(location, 1000);
  };
  const handleCloseError = () => {
    setError(false);
  };

  return (
    <View style={styles.container}>
      <NetworkStatusLine />

      <PopupError
        visible={!!error}
        message={error}
        onClose={handleCloseError}
      />
      <HamburgerMenu onPress={handleOpenDrawer} />

      <MapView
        ref={mapRef}
        style={styles.map}
        region={region}
        provider={PROVIDER_GOOGLE}
        showsUserLocation
        showsMyLocationButton={false}
      >
        {locations &&
          locations.map((location, index) => (
            <Marker
              pinColor="green"
              key={index}
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              onPress={() => handleDeleteLocation(location)}
            />
          ))}

        {drivers &&
          drivers.map((location, index) => (
            <Marker
              draggable={false}
              icon={require("../../assets/icons/car.png")}
              fillColor="red"
              key={index}
              coordinate={{
                latitude: location?.latitude,
                longitude: location?.longitude,
              }}
              title={i18n("driver")}
              onPress={() => handleDeleteLocation(location)}
            />
          ))}

        {spaces &&
          zoom < 11 &&
          spaces.map((space, index) => (
            <Polygon
              key={index}
              fillColor="#79e37d5c"
              coordinates={space.points}
            />
          ))}
      </MapView>

      <View style={styles.staticMarker}>
        <TouchableHighlight
          onPress={handleSelectLocation}
          style={styles.selectBtn}
        >
          <Text style={styles.Text}>{i18n("selectDest")} </Text>
        </TouchableHighlight>
        <Text ref={pointerRef} style={styles.pointer}>
          .
        </Text>
      </View>

      <HomeBottomSheet1
        onAddLocation={handleAddLocation}
        onSelect={handleChoeseLocation}
        disableButton={!locations.length}
        disableAddLocation={!locations.length}
        locationTitle={locations[0]?.title}
        onRequestNow={handleRequestNow}
      />
    </View>
  );
}
