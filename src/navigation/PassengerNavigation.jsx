import { createNativeStackNavigator } from "@react-navigation/native-stack";
import useAuth from "../auth/useAuth";

import PassengerHomeScreen1 from "../screens/passenger/HomeScreen1";
import PassengerHomeScreen2 from "../screens/passenger/HomeScreen2";
import PassengerHomeScreen3 from "../screens/passenger/HomeScreen3";
import SavedPlacesScreen from "../screens/passenger/SavedPlacesScreen";
import ReservedTripsScreen from "../screens/passenger/ReservedTripsScreen";
import ChallengesScreen from "../screens/passenger/ChallengesScreen";
import TripDetailsScreen from "../screens/passenger/TripDetailsScreen";
import PendingTripRequest from "../screens/passenger/PendingTripRequest";
import CallScreen from "../screens/common/CallScreen";
import DriverDitails from "../screens/passenger/DriverDitails";

import VerifyPhoneScreen from "../screens/common/VerifyPhoneScreen";
import ProfileScreen from "../screens/common/ProfileScreen";
import NotificationsScreen from "../screens/common/NotificationsScreen";
import AboutScreen from "../screens/common/AboutScreen";
import WalletScreen from "../screens/common/WalletScreen";
import EarnMoreScreen from "../screens/common/EarnMoreScreen";

import screens from "../static/screens.json";

import DrawerNavigation from "./DrawerNavigation";
import TripEvalution from "../screens/passenger/TripEvalution";
import DriverWaiting from "../screens/passenger/DriverWaiting";
import TripState from "../screens/passenger/TripState";

const globalScreenOptions = {
  contentStyle: { backgroundColor: "#fff" },
  headerShown: false,
};

const Stack = createNativeStackNavigator();

export default function PassengerNavigation() {
  const { user } = useAuth();

  const isFullyVerified = () => {
    return user?.verified?.phone;
  };

  const isPhoneVerified = () => {
    return user?.verified?.phone;
  };

  return (
    <Stack.Navigator screenOptions={globalScreenOptions}>
      {isFullyVerified() && (
        <Stack.Screen name={screens.drawer} component={DrawerNavigation} />
      )}

      {!isPhoneVerified() && (
        <Stack.Screen
          name={screens.verifyPhone}
          component={VerifyPhoneScreen}
        />
      )}


      {isFullyVerified() && (
        <Stack.Screen
          name={screens.DriverWaiting}
          component={DriverWaiting}
        />
      )}

      {isFullyVerified() && (
        <Stack.Screen
          name={screens.passengerHome1}
          component={PassengerHomeScreen1}
        />
      )}

      {isFullyVerified() && (
        <Stack.Screen
          name={screens.TripState}
          component={TripState}
        />
      )}

      {isFullyVerified() && (
        <Stack.Screen
          name={screens.DriverDitails}
          component={DriverDitails}
        />
      )}

       {isFullyVerified() && (
        <Stack.Screen
          name={screens.TripEvalution}
          component={TripEvalution}
        />
      )}

      {isFullyVerified() && (
        <Stack.Screen
          name={screens.pendingTrip}
          component={PendingTripRequest}
        />
      )}

      {isFullyVerified() && (
        <Stack.Screen
          name={screens.passengerHome2}
          component={PassengerHomeScreen2}
        />
      )}

      {isFullyVerified() && (
        <Stack.Screen
          name={screens.passengerHome3}
          component={PassengerHomeScreen3}
        />
      )}

      {isFullyVerified() && (
        <Stack.Screen name={screens.profile} component={ProfileScreen} />
      )}

      {isFullyVerified() && (
        <Stack.Screen
          name={screens.notifications}
          component={NotificationsScreen}
        />
      )}

      {isFullyVerified() && (
        <Stack.Screen
          name={screens.savedPlaces}
          component={SavedPlacesScreen}
        />
      )}

      {isFullyVerified() && (
        <Stack.Screen
          name={screens.reservedTrips}
          component={ReservedTripsScreen}
        />
      )}

      {isFullyVerified() && (
        <Stack.Screen name={screens.about} component={AboutScreen} />
      )}

      {isFullyVerified() && (
        <Stack.Screen name={screens.wallet} component={WalletScreen} />
      )}

      {isFullyVerified() && (
        <Stack.Screen name={screens.earnMore} component={EarnMoreScreen} />
      )}

      {isFullyVerified() && (
        <Stack.Screen name={screens.challenges} component={ChallengesScreen} />
      )}

      {isFullyVerified() && (
        <Stack.Screen
          name={screens.tripDetails}
          component={TripDetailsScreen}
        />
      )}

      {isFullyVerified() && (
        <Stack.Screen name={screens.call} component={CallScreen} />
      )}
    </Stack.Navigator>
  );
}
