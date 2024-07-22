import { useState } from "react";
import { SafeAreaView, ScrollView, View, Text, StyleSheet } from "react-native";
import PhoneInput from "../../components/inputs/PhoneInput";
import CustomButton from "../../components/buttons/CustomButton";
import useLocale from "../../hooks/useLocale";
import NetworkStatusLine from "../../components/common/NetworkStatusLine";
import PopupLoading from "../../components/popups/PopupLoading";
import screens from "../../static/screens.json";
import checkPhoneNSN from "../../utils/checkPhoneNSN";
import useScreen from "../../hooks/useScreen";
import useAuth from "../../auth/useAuth";
import usePushNotifications from "../../hooks/usePushNotifications";
import sendOtpCode from "../../utils/sendOtpCode";
import cache from "../../utils/cache";
import generatCode from "../../utils/generateVerifyCode";
import { getUserByPhoneNumber, sendOTP } from "../../api/user/auth";
import { setDeviceToken } from "../../api/user/users";
import DefaultScreenTitle from "../../components/screenTitles/DefaultScreenTitle";

export default function LoginScreen1({ navigation, route }) {
  const screen = useScreen();
  const { role } = route.params;
  const { login } = useAuth();
  const { i18n } = useLocale();
  const deviceToken = usePushNotifications();

  // status
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState({ icc: "+218", nsn: "" });

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: screen.getHorizontalPixelSize(15),
      paddingVertical: screen.getVerticalPixelSize(15),
      paddingTop: screen.getVerticalPixelSize(50),
    },
    contentContainer: {
      paddingHorizontal: screen.getHorizontalPixelSize(15),
    },
    title: {
      fontFamily: "cairo-800",
      fontSize: screen.getResponsiveFontSize(28),
      marginBottom: screen.getVerticalPixelSize(5),
      textAlign: "center",
    },
    subtitle: {
      fontFamily: "cairo-600",
      fontSize: screen.getResponsiveFontSize(16),
      color: "#747474",
      textAlign: "center",
    },
    phoneContainer: {
      marginTop: screen.getVerticalPixelSize(60),
      marginBottom: screen.getVerticalPixelSize(20),
    },
    buttonContainer: {
      paddingVertical: screen.getVerticalPixelSize(12),
    },
    buttonText: {
      fontFamily: "cairo-800",
      fontSize: screen.getResponsiveFontSize(16),
    },
    horizontalLinesContainer: {
      marginVertical: screen.getVerticalPixelSize(25),
    },
    horizontalLinesText: {
      fontFamily: "cairo-700",
      marginHorizontal: screen.getHorizontalPixelSize(5),
    },
    loginButtonsContainer: {
      gap: screen.getVerticalPixelSize(15),
    },
    conditionsText: {
      fontFamily: "cairo-400",
      marginTop: screen.getVerticalPixelSize(30),
      color: "#747474",
      textAlign: "center",
    },
    privacyPolicyText: {
      fontFamily: "cairo-400",
      marginTop: screen.getVerticalPixelSize(30),
      color: "#747474",
      textAlign: "center",
    },
    blueText: {
      color: "#0038FF",
    },
  });

  const handlePhoneNSNChange = (phoneNSN) => {
    try {
      const inputValue = phoneNSN.trim();

      if (inputValue.length <= 10) {
        setPhone({ ...phone, nsn: inputValue });
      }
    } catch (err) {}
  };

  const handleContinue = async () => {
    try {
      setLoading(true);
      const res = await getUserByPhoneNumber(phone.nsn);
      if (!res.data.user) {
        return navigation.navigate(screens.login2, {
          authType: "phone",
          phone,
          role,
          deviceToken,
        });
      }
      const { user, token } = res.data;

      await sendOTP(phone.nsn);

      await login(user, token);

      // if (!res.data.user.verified.phone) {
      //   const verifierCode = generatCode();
      //   //send otp code
      //   await cache.store("verifirCode", verifierCode, 40);
      //   await sendOtpCode(phone, verifierCode);
      // }
      await setDeviceToken(deviceToken);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  const handleGoBack = () => {
    try {
      navigation.goBack();
    } catch (err) {}
  };

  return (
    <SafeAreaView style={styles.container}>
      <NetworkStatusLine />

      <PopupLoading visible={loading} />
      <DefaultScreenTitle onPrev={handleGoBack} />

      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <Text style={styles.title}>{i18n("loginScreen1Title")}</Text>
        <Text style={styles.subtitle}>{i18n("loginScreen1Subtitle")}</Text>

        <View style={styles.phoneContainer}>
          <PhoneInput
            icc={phone.icc}
            nsn={phone.nsn}
            onNSNChange={handlePhoneNSNChange}
          />
        </View>

        <CustomButton
          text={i18n("continue")}
          onPress={handleContinue}
          containerStyle={styles.buttonContainer}
          textStyle={styles.buttonText}
          disabled={!checkPhoneNSN(phone.nsn)}
        />

        {/* <HorizontalLines
          text={i18n("or")}
          containerStyle={styles.horizontalLinesContainer}
          textStyle={styles.horizontalLinesText}
        /> */}

        {/* <View style={styles.loginButtonsContainer}>
          <ContinueButton
            text={i18n("continueWithGoogle")}
            icon={require("../../assets/images/google.png")}
            onPress={handleContinueWithGoogle}
          />

          <ContinueButton
            text={i18n("continueWithFacebook")}
            icon={require("../../assets/images/facebook.png")}
            onPress={handleContinueWithFacebook}
          />

          <ContinueButton
            text={i18n("continueWithApple")}
            icon={require("../../assets/images/apple.png")}
            onPress={handleContinueWithApple}
          />
        </View> */}

        <Text style={styles.conditionsText}>{i18n("registerConditions")}</Text>

        <Text style={styles.privacyPolicyText}>
          {i18n("googleConditionsPart1")}{" "}
          <Text style={styles.conditionsText}>
            {i18n("googleConditionsPart2")}
          </Text>{" "}
          {i18n("googleConditionsPart3")}{" "}
          <Text style={styles.conditionsText}>
            {i18n("googleConditionsPart4")}
          </Text>
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
