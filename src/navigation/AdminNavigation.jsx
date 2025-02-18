import { createNativeStackNavigator } from "@react-navigation/native-stack";

import DrawerNavigation from "./DrawerNavigation";
import screens from "../static/screens.json";

import AboutScreen from "../screens/common/AboutScreen";
import AdminHomeSceen from "../screens/admin/HomeScreen";
import DriversScreen from "../screens/admin/DriversScreen";
import NotificationsScreen from "../screens/common/NotificationsScreen";
import ProfileScreen from "../screens/common/ProfileScreen";
import VerifyPhoneScreen from "../screens/common/VerifyPhoneScreen";
import CallScreen from "../screens/common/CallScreen";
import DriverRequestScreen from "../screens/admin/DriverRequestScreen";
import PhotoDisplayScreen from "../screens/admin/PhotoDisplayScreen";
import TripsScreen from "../screens/admin/TripsScreen";
import PassengersScreen from "../screens/admin/PassengersScreen";
import FinancialManagementScreen from "../screens/admin/FinancialManagementScreen";
import TripPricingScreen from "../screens/admin/TripPricingScreen";
import CouponCodesScreen from "../screens/admin/CouponCodesScreen";
import PaymentCardsScreen from "../screens/admin/PaymentCardsScreen";
import AddDriverScreen1 from "../screens/admin/AddDriverScreen1";
import AddDriverScreen2 from "../screens/admin/AddDriverScreen2";
import AddDriverScreen3 from "../screens/admin/AddDriverScreen3";
import AddDriverScreen4 from "../screens/admin/AddDriverScreen4";
import RegionsScreen from "../screens/admin/RegionsScreen";
import ChallengesPanelScreen from "../screens/admin/ChallengesPanelScreen";
import SendNotificationScreen from "../screens/admin/SendNotificationScreen";
import ExcelExportScreen from "../screens/admin/ExcelExportScreen";
import SearchUserScreen from "../screens/admin/SearchUserScreen";

const globalScreenOptions = {
  contentStyle: { backgroundColor: "#fff" },
  headerShown: false,
};

const Stack = createNativeStackNavigator();

export default function AdminNavigation() {
  return (
    <Stack.Navigator screenOptions={globalScreenOptions}>
      <Stack.Screen  name={screens.drawer} component={DrawerNavigation} />

      <Stack.Screen name={screens.verifyPhone} component={VerifyPhoneScreen} />

      <Stack.Screen name={screens.adminHome} component={AdminHomeSceen} />

      <Stack.Screen name={screens.profile} component={ProfileScreen} />

      <Stack.Screen
        name={screens.notifications}
        component={NotificationsScreen}
      />

      <Stack.Screen name={screens.about} component={AboutScreen} />

      <Stack.Screen name={screens.drivers} component={DriversScreen} />

      <Stack.Screen name={screens.call} component={CallScreen} />

      <Stack.Screen
        name={screens.driverRequest}
        component={DriverRequestScreen}
      />

      <Stack.Screen
        name={screens.photoDisplay}
        component={PhotoDisplayScreen}
      />

      <Stack.Screen name={screens.trips} component={TripsScreen} />

      <Stack.Screen name={screens.passengers} component={PassengersScreen} />

      <Stack.Screen
        name={screens.financialManagement}
        component={FinancialManagementScreen}
      />

      <Stack.Screen name={screens.tripPricing} component={TripPricingScreen} />

      <Stack.Screen name={screens.couponCodes} component={CouponCodesScreen} />

      <Stack.Screen name={screens.chargeCards} component={PaymentCardsScreen} />

      <Stack.Screen name={screens.addDriver1} component={AddDriverScreen1} />

      <Stack.Screen name={screens.addDriver2} component={AddDriverScreen2} />

      <Stack.Screen name={screens.addDriver3} component={AddDriverScreen3} />

      <Stack.Screen name={screens.addDriver4} component={AddDriverScreen4} />

      <Stack.Screen name={screens.regions} component={RegionsScreen} />

      <Stack.Screen
        name={screens.challengesPanel}
        component={ChallengesPanelScreen}
      />

      <Stack.Screen
        name={screens.sendNotification}
        component={SendNotificationScreen}
      />

      <Stack.Screen
        name={screens.exportToExcel}
        component={ExcelExportScreen}
      />

      <Stack.Screen name={screens.searchUser} component={SearchUserScreen} />
    </Stack.Navigator>
  );
}
