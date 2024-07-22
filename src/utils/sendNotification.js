import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default sendNotification = async (notification) => {
  return await Notifications.scheduleNotificationAsync(notification);
};
