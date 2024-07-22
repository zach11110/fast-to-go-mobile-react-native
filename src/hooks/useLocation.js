import { useState, useEffect } from "react";
import {
  requestForegroundPermissionsAsync,
  watchPositionAsync,
  Accuracy,
} from "expo-location";

const useLocation = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let subscriber;

    const requestLocation = async () => {
      try {
        const { status } = await requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setError("Permission to access location was denied");
          return;
        }

        subscriber = await watchPositionAsync(
          { accuracy: Accuracy.High, timeInterval: 5000, distanceInterval: 5 },
          (newLocation) => {
            setLocation(newLocation);
            console.log(
              "new location",
              newLocation.coords.longitude,
              newLocation.coords.latitude
            );
          }
        );
      } catch (err) {
        setError(err.message);
      }
    };

    requestLocation();

    return () => {
      if (subscriber) {
        subscriber.remove();
      }
    };
  }, []);

  return { location, error };
};

export default useLocation;
