import { StyleSheet, SafeAreaView } from "react-native";
import GoogleMap from "../../components/common/GoogleMap";
import NewRequestBottomSheet from "../../components/bottomSheets/NewRequestBottomSheet";
import screens from "../../static/screens.json";
import { approveTrip, rejectTrip } from "../../api/user/trips";
import { setBusy } from "../../api/user/users";
import { useState } from "react";
export default function NewRequestScreen({ navigation, route }) {
  const { trip, passenger } = route.params;
  const [approved, setApproved] = useState(false);

  const handleTimerDone = async () => {
    if (approved) return;
    try {
      return await handleReject();
    } catch (err) {
    } finally {
      navigation.goBack();
    }
  };

  const handleApprove = async () => {
    try {
      setApproved(true);
      await approveTrip(trip._id);

      navigation.navigate(screens.toOrigin, { passenger, trip });
    } catch (error) {
      console.log(error);
    }
  };
  const handleReject = async () => {
    try {
      setBusy(false);
      await rejectTrip(trip._id);
      navigation.goBack();
    } catch (error) {
    } finally {
      setBusy(false);
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <GoogleMap trip={trip} />

      <NewRequestBottomSheet
        handleApprove={handleApprove}
        handleReject={handleReject}
        trip={trip}
        onTimerDone={handleTimerDone}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
