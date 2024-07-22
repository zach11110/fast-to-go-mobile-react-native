import { useState } from "react";
import { StyleSheet, SafeAreaView, ScrollView, Text, View } from "react-native";
import DefaultScreenTitle from "../../components/screenTitles/DefaultScreenTitle";
import useScreen from "../../hooks/useScreen";
import useLocale from "../../hooks/useLocale";
import InputIcon from "../../components/inputs/InputIcon";
import { Feather } from "@expo/vector-icons";
import * as theme from "../../constants/theme";
import PhoneInput from "../../components/inputs/PhoneInput";
import CustomButton from "../../components/buttons/CustomButton";
import PopupConfirm from "../../components/popups/PopupConfirm";
import PopupError from "../../components/popups/PopupError";
import PopupLoading from "../../components/popups/PopupLoading";
import { blockUser, findUserByName, assignAsAdmin } from "../../api/user/users";

export default function SearchUserScreen({ navigation }) {
  const screen = useScreen();
  const { i18n, lang } = useLocale();
  const [userName, setUserName] = useState("");
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPopupConfirm, setShowPopupConfirm] = useState(false);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: screen.getHorizontalPixelSize(15),
      paddingVertical: screen.getVerticalPixelSize(15),
      paddingTop: screen.getVerticalPixelSize(50),
      gap: screen.getVerticalPixelSize(25),
    },
    contentContainer: {
      gap: screen.getVerticalPixelSize(15),
      paddingBottom: screen.getVerticalPixelSize(20),
    },
    icon: {
      color: theme.primaryColor,
      fontSize: screen.getResponsiveFontSize(30),
      marginRight: lang === "ar" ? screen.getHorizontalPixelSize(10) : 0,
      marginLeft: lang === "en" ? screen.getHorizontalPixelSize(10) : 0,
    },
    infoTitle: {
      fontSize: screen.getResponsiveFontSize(18),
      fontFamily: "cairo-700",
      color: theme.primaryColor,
      marginTop: screen.getVerticalPixelSize(10),
    },
    buttonsContainer: {
      justifyContent: "center",
      gap: screen.getVerticalPixelSize(10),
    },
    buttonText: {
      fontFamily: "cairo-800",
      fontSize: screen.getResponsiveFontSize(18),
    },
    blockButtonContainer: {
      backgroundColor: "#f00",
    },
  });

  const handleSearchUser = async () => {
    try {
      setIsLoading(true);
      const { data } = await findUserByName(userName);
      setUser(data);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setError(err?.response?.data?.message[lang] || i18n("networkError"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserNameChange = (ev) => {
    setUserName(ev);
  };

  const handleAssignAdmin = async () => {
    try {
      setIsLoading(true);
      const { data } = await assignAsAdmin(user._id);
      console.log(data);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      setError(err?.response?.data?.message[lang] || i18n("networkError"));
    }
  };

  const handleGoBack = () => {
    try {
      navigation.goBack();
    } catch (err) {}
  };

  const getInfoTitle = () => {
    return user.role === "driver"
      ? i18n("driverInfo")
      : user.role === "passenger"
      ? i18n("passengerInfo")
      : i18n("adminInfo");
  };

  const handleBlockUser = async () => {
    try {
      setIsLoading(true);

      await blockUser(user._id);

      setIsLoading(false);
      setShowPopupConfirm(null);
    } catch (err) {
      setError(err?.response?.data?.message[lang] || i18n("networkError"));
    } finally {
      setIsLoading(false);
      setShowPopupConfirm(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <DefaultScreenTitle title={i18n("searchUser")} onPrev={handleGoBack} />

      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <InputIcon
          title={i18n("emailOrPhone")}
          placeholder={i18n("emailOrPhone")}
          value={userName}
          onChange={handleUserNameChange}
          Icon={() => (
            <Feather
              name="search"
              onPress={handleSearchUser}
              style={styles.icon}
            />
          )}
          keyboardType="email-address"
        />

        <PopupLoading visible={isLoading} />

        <PopupConfirm
          title={i18n("popupBlockUserTitle")}
          subtitle={i18n("popupBlockUserSubtitle")}
          hint={i18n("popupBlockUserHint")}
          visible={showPopupConfirm}
          onClose={() => setShowPopupConfirm(false)}
          onConfirm={handleBlockUser}
        />

        <PopupError
          visible={!!error}
          message={error}
          onClose={() => setError(false)}
        />

        {!!user && (
          <>
            <Text style={styles.infoTitle}>{getInfoTitle()}</Text>

            <InputIcon
              title={i18n("firstname")}
              value={user.firstName}
              placeholder={i18n("firstname")}
              Icon={() => <Feather name="search" style={styles.icon} />}
            />

            <InputIcon
              title={i18n("lastname")}
              value={user.lastName}
              placeholder={i18n("lastname")}
              Icon={() => <Feather name="search" style={styles.icon} />}
            />

            <InputIcon
              title={i18n("email")}
              value={user.email}
              placeholder={i18n("email")}
              Icon={() => <Feather name="search" style={styles.icon} />}
              keyboardType="email-address"
            />

            <PhoneInput nsn={user.phone.nsn} title={i18n("phone")} />

            <InputIcon
              title={i18n("gender")}
              value={i18n(user.gender)}
              placeholder={i18n("gender")}
            />

            {user.role !== "admin" && (
              <>
                <InputIcon
                  title={i18n("balance")}
                  value={user.balance.toString()}
                  placeholder={i18n("balance")}
                />

                <InputIcon
                  title={i18n("referralsNumber")}
                  value={user.referral.number.toString()}
                  placeholder={i18n("referralsNumber")}
                />
              </>
            )}

            {user.role === "driver" && (
              <>
                <InputIcon
                  title={i18n("carType")}
                  placeholder={i18n("carType")}
                  value={i18n("commercial")}
                />
              </>
            )}

            <View style={styles.buttonsContainer}>
              {user?.role !== "admin" && (
                <CustomButton
                  onPress={handleAssignAdmin}
                  text={i18n("assignAsAdmin")}
                  textStyle={styles.buttonText}
                />
              )}

              <CustomButton
                text={user.blocked ? i18n("unBlockUser") : i18n("blockUser")}
                containerStyle={styles.blockButtonContainer}
                textStyle={styles.buttonText}
                onPress={() => setShowPopupConfirm(true)}
              />
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
