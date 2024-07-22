import { StyleSheet, View } from "react-native";
import { RadioButton } from "react-native-paper";
import StaticBottomSheet from "../bottomSheets/StaticBottomSheet";
import CustomButton from "../buttons/CustomButton";
import CarType from "../common/CarType";
import CouponCodeInput from "../inputs/CouponCodeInput";
import ButtonIcon from "../buttons/ButtonIcon";
import * as theme from "../../constants/theme";
import { AntDesign } from "@expo/vector-icons";
import useLocale from "../../hooks/useLocale";
import useScreen from "../../hooks/useScreen";
import { checkCouponCode } from "../../api/user/couponCodes";


export default function HomeBottomSheet2({
  pricing,
  setTripPrice,
  couponCode,
  setCode,
  getPrice,
  paymentType,
  onPaymentTypeChange,
  carType,
  onCarTypeChange,
  onCouponCodeChange,
  onRequestNow,

}) {
  const screen = useScreen();
  const { i18n, lang } = useLocale();






  const styles = StyleSheet.create({
    container: {
      gap: screen.getVerticalPixelSize(15),
    },
    carTypesContainer: {
      gap: screen.getVerticalPixelSize(10),
    },
    paymentContainer: {
      gap: screen.getVerticalPixelSize(10),
    },
    breakLine: {
      borderWidth: screen.getHorizontalPixelSize(0.5),
      borderColor: "#ababab",
      backgroundColor: "#ababab",
    },
    radioButtonsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    radioButtonText: {
      fontFamily: "cairo-600",
      fontSize: screen.getResponsiveFontSize(14),
    },
    buttonsContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: screen.getHorizontalPixelSize(10),
    },
    submitButtonContainer: {
      flex: 1,
    },
    submitButtonText: {
      fontFamily: "cairo-800",
      fontSize: screen.getResponsiveFontSize(16),
    },
  });


  
  
  
    const checkCouponValidation = async ()=>{
      try {
       const {data} =  await checkCouponCode(couponCode)
     
       setCode(data)
      } catch (err) {
        setCode({valid:false})
      }
    }

  return (
    <StaticBottomSheet contentStyle={styles.container}>
      <View style={styles.carTypesContainer}>
      <CarType
          selected={carType === "commercial"}
          onPress={() =>{
            onCarTypeChange("commercial")
            setTripPrice(getPrice("commercial"))
          }}
          amount={getPrice("commercial")||0}
          title={i18n("commercial")}
          image={require("../../assets/images/commercial-car.png")}
        />
        <CarType
          selected={carType === "luxury"}
          onPress={() =>{
            onCarTypeChange("luxury")
            setTripPrice(getPrice("luxury"))
          }}
          amount={getPrice("luxury")||0}
          title={i18n("luxury")}
          image={require("../../assets/images/luxury-car.png")}
        />

        <CarType
          selected={carType === "women"}
          onPress={() =>{
            onCarTypeChange("women")
            setTripPrice(getPrice("women"))
          }}
          amount={getPrice("women")||0}
          title={i18n("women")}
          image={require("../../assets/images/women-car.png")}
        />

     
      </View>

      <View style={styles.paymentContainer}>
        <View style={styles.breakLine}></View>

        <RadioButton.Group
          onValueChange={onPaymentTypeChange}
          value={paymentType}
        >
          <View style={styles.radioButtonsContainer}>
            <RadioButton.Item
              color={theme.primaryColor}
              uncheckedColor={theme.primaryColor}
              labelStyle={styles.radioButtonText}
              label={i18n("payFromWallet")}
              position={lang === "ar" ? "trailing" : "leading"}
              value="wallet"
            />

            <RadioButton.Item
              color={theme.primaryColor}
              uncheckedColor={theme.primaryColor}
              labelStyle={styles.radioButtonText}
              label={i18n("payCash")}
              position={lang === "ar" ? "trailing" : "leading"}
              value="cash"
            />
          </View>
        </RadioButton.Group>
      </View>

      <View>
        <CouponCodeInput
          maxLength={14}
          value={couponCode}
          onChange={onCouponCodeChange}
          placeholder={i18n("couponInputPlaceholder")} />
        <CustomButton 
         onPress={checkCouponValidation}
         containerStyle={{borderRadius:0,marginTop:4}}
         disabled={!couponCode}
         text={i18n("add")}/>
      </View>

      <View style={styles.buttonsContainer}>
        {/* <ButtonIcon>
          <AntDesign name="calendar" size={30} color="#fff" />
        </ButtonIcon> */}

        <CustomButton
          text={i18n("requestNow")}
          disabled={!pricing.length}
          onPress={onRequestNow}
          containerStyle={styles.submitButtonContainer}
          textStyle={styles.submitButtonText}
        />
      </View>
    </StaticBottomSheet>
  );
}
