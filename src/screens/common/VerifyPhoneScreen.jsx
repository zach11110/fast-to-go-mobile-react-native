import { useState } from "react";
import {
  Keyboard,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import ScreenSteps from "../../components/common/ScreenSteps";
import OTPInput from "../../components/inputs/OTPInput";
import useTimer from "../../hooks/useTimer";
import useAuth from "../../auth/useAuth";
import useLocale from "../../hooks/useLocale";
import NetworkStatusLine from "../../components/common/NetworkStatusLine";
import * as theme from "../../constants/theme";
import useScreen from "../../hooks/useScreen";
import PopupError from "../../components/popups/PopupError";
import { verifyPhone } from "../../api/user/users";
import generatCode from "../../utils/generateVerifyCode";
import sendOtpCode from "../../utils/sendOtpCode";
import { sendOTP } from "../../api/user/auth";
import cache from "../../utils/cache";

const MAX_CODE_LENGTH = 6;

export default function VerifyPhoneScreen({ navigation }) {
  const [error, setError] = useState(false);
  const screen = useScreen();
  const { i18n, lang } = useLocale();
  const { user, setUser } = useAuth();
  const { remainingSeconds, resetTimer, isTimerDone } = useTimer(150);
  const [code, setCode] = useState("");
  const [readyPin, setReadyPin] = useState(false);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingVertical: screen.getVerticalPixelSize(15),
      paddingHorizontal: screen.getHorizontalPixelSize(15),
      paddingTop: screen.getVerticalPixelSize(70),
    },
    title: {
      fontFamily: "cairo-700",
      fontSize: screen.getResponsiveFontSize(18),
    },
    otpInputContainer: {
      alignSelf: "center",
    },
    timerText: {
      fontFamily: "cairo-500",
      textAlign: "center",
    },
    resendCodeText: {
      fontFamily: "cairo-700",
      color: theme.primaryColor,
      textDecorationLine: "underline",
      textAlign: "center",
      paddingVertical: screen.getVerticalPixelSize(5),
      paddingHorizontal: screen.getHorizontalPixelSize(5),
      fontSize: screen.getResponsiveFontSize(16),
    },
    remainingSeconds: {
      fontFamily: "cairo-700",
    },
    screenStepsContainer: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      paddingHorizontal: screen.getHorizontalPixelSize(15),
      marginBottom: screen.getVerticalPixelSize(50),
    },
  });
  const handleSubmit = async () => {
    try {
      // const verifierCode = await cache.get("verifirCode");
      if (code.length === MAX_CODE_LENGTH) {
        // if (code != verifierCode) {
        const res = await verifyPhone(code);

        if (res.data.statusCode === 400) {
          throw new Error("invaled code ");
        }

        // await cache.remove("verifirCode");
        setUser({
          ...user,
          verified: {
            ...user.verified,
            phone: true,
          },
        });
      }
    } catch (err) {
      setError(
        err?.response?.data?.message[lang] ||
          i18n("invalidVerifiCode") ||
          i18n("networkError")
      );
    }
  };

  const handleResendCode = async () => {
    try {
      // const newCode = generatCode();

      // await cache.store("verifirCode", newCode, 40);
      // await sendOtpCode(user.phone, newCode);

      await sendOTP(user.phone.nsn);
      resetTimer();
    } catch (err) {
      console.log(err);
    }
  };

  const mapSeconds = (seconds) => {
    try {
      const _minutes = Math.floor(seconds / 60);
      const _seconds = seconds % 60;

      const displayMinutes = _minutes < 10 ? `0${_minutes}` : _minutes;
      const displaySeconds = _seconds < 10 ? `0${_seconds}` : _seconds;
      return `${displayMinutes}:${displaySeconds}`;
    } catch (err) {
      return seconds;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <NetworkStatusLine />

      <PopupError
        visible={!!error}
        message={error}
        onClose={() => setError(false)}
      />
      <Pressable style={styles.container} onPress={Keyboard.dismiss}>
        <Text style={styles.title}>{i18n("enterSixDigitsCode")}</Text>

        <OTPInput
          code={code}
          setCode={setCode}
          setReadyPin={setReadyPin}
          maxLength={MAX_CODE_LENGTH}
          containerStyle={styles.otpInputContainer}
          onSubmit={handleSubmit}
        />

        {isTimerDone ? (
          <Text onPress={handleResendCode} style={styles.resendCodeText}>
            {i18n("resendCode")}
          </Text>
        ) : (
          <Text style={styles.timerText}>
            {i18n("youCanResendAfter")}{" "}
            <Text style={styles.remainingSeconds}>
              {mapSeconds(remainingSeconds)}
            </Text>
          </Text>
        )}

        <View style={styles.screenStepsContainer}>
          <ScreenSteps
            disableNext={!readyPin}
            showPrev={false}
            onNext={handleSubmit}
          />
        </View>
      </Pressable>
    </SafeAreaView>
  );
}
