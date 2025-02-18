import { useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  StyleSheet,
  Image,
  Text,
} from "react-native";
import NotificationsScreenTitle from "../../components/screenTitles/NotificationsScreenTitle";
import Notification from "../../components/common/Notification";
import useLocale from "../../hooks/useLocale";
import NetworkStatusLine from "../../components/common/NetworkStatusLine";
import screens from "../../static/screens.json";
import useAuth from "../../auth/useAuth";
import useScreen from "../../hooks/useScreen";
import * as usersApi from "../../api/user/users";

export default function NotificationsScreen({ navigation }) {
  const screen = useScreen();
  const { user, setUser } = useAuth();
  const { i18n } = useLocale();

  useEffect(() => {
    try {
      usersApi
        .seeNotifications()
        .then((res) => {
          setUser({
            ...user,
            notifications: {
              ...user.notifications,
              list: res.data.notifications,
            },
          });
        })
        .catch(() => {});
    } catch (err) {}
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: screen.getHorizontalPixelSize(15),
      paddingVertical: screen.getVerticalPixelSize(15),
      paddingTop: screen.getVerticalPixelSize(40),
    },
    contentContainer:{
      paddingHorizontal: screen.getHorizontalPixelSize(15),

    },
    notificationsContainer: {
      flex: 1,
      gap: screen.getVerticalPixelSize(10),
      marginTop: screen.getVerticalPixelSize(20),
    },
    emptyNotificationsContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      gap: screen.getVerticalPixelSize(25),
    },
    emptyImage: {
      alignSelf: "center",
      width: screen.getHorizontalPixelSize(200),
      height: screen.getVerticalPixelSize(200),
    },
    emptyText: {
      fontFamily: "cairo-700",
      fontSize: screen.getResponsiveFontSize(15),
    },
  });

  const handleGoBack = () => {
    try {
      navigation.goBack();
    } catch (err) {}
  };

  const handleNotificationPress = (notification) => () => {
    try {
      navigation.navigate(screens[notification.data.screen]);
    } catch (err) {}
  };

  return (
    <SafeAreaView style={styles.container}>
      <NetworkStatusLine />

      <NotificationsScreenTitle
        title={i18n("notifications")}
        onPrev={handleGoBack}
      />

      {!!user?.notifications?.list?.length && (
        <ScrollView
        contentContainerStyle={styles.contentContainer}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.notificationsContainer}>
            {user?.notifications?.list?.map?.((notification, index) => (
              <Notification
                key={index}
                notification={notification}
                onPress={handleNotificationPress(notification)}
              />
            ))}
          </View>
        </ScrollView>
      )}

      {!user?.notifications?.list?.length && (
        <View style={styles.emptyNotificationsContainer}>
          <Image
            source={require("../../assets/images/empty-notifications.png")}
            resizeMode="contain"
            style={styles.emptyImage}
          />

          <Text style={styles.emptyText}>{i18n("noNotifications")}</Text>
        </View>
      )}
    </SafeAreaView>
  );
}
