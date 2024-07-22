import { useEffect, useState } from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import GoogleMap from "../../components/common/GoogleMap";
import HomeBottomSheet2 from "../../components/bottomSheets/HomeBottomSheet2";
import screens from "../../static/screens.json";
import { AntDesign } from "@expo/vector-icons";
import NetworkStatusLine from "../../components/common/NetworkStatusLine";
import useScreen from "../../hooks/useScreen";
import { requestTrip } from "../../api/user/trips";
import PopupError from "../../components/popups/PopupError";
import PopupLoading from "../../components/popups/PopupLoading";
import useLocale from "../../hooks/useLocale";
import { getAllPricing } from "../../api/user/tripPricings";

export default function PassengerHomeScreen3({ navigation, route }) {
  const { from, to, distance } = route.params;
  const screen = useScreen();
  const [error, setError] = useState("");
  const [paymentType, setPaymentType] = useState("cash");
  const [carType, setCarType] = useState("luxury");
  const [cuted, setCuted] = useState(false);
  const [couponCode, setCouponCode] = useState(null);
  const [code, setCode] = useState({ valid: false, value: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [tripPrice, setTripPrice] = useState(tripPrice || 0);
  const [pricing, setPricing] = useState([]);

  const { i18n, lang } = useLocale();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    iconContainer: {
      justifyContent: "center",
      alignItems: "center",
      position: "absolute",
      top: screen.getVerticalPixelSize(55),
      right: screen.getHorizontalPixelSize(20),
      backgroundColor: "#fff",
      width: screen.getHorizontalPixelSize(45),
      maxWidth: 45,
      height: screen.getHorizontalPixelSize(45),
      maxHeight: 45,
      borderRadius: 50,
      zIndex: 1,
    },
  });

  useEffect(() => {
    const getPrices = async () => {
      try {
        const { data: pricing } = await getAllPricing();
        console.log("pricings ", pricing);
        console.log("distance", distance);
        const prices = pricing.filter((price) => {
          if (distance <= 45) {
            return (
              price.distanceInKm.from <= distance &&
              price.distanceInKm.to >= distance
            );
          } else {
            return (price.distanceInKm.to = 45);
          }
        });

        console.log("prices", prices);

        const amounts = prices.map(({ carType, pricePerKm }) => {
          return { carType: carType, pricePerKm: distance * pricePerKm };
        });
        setPricing(amounts);
      } catch (error) {
        console.log(error);
      }
    };

    getPrices();
  }, []);
  // use the coupon code
  useEffect(() => {
    const defaulPrice = pricing.filter(
      (price) => price?.carType === "luxury"
    )[0]?.pricePerKm;

    setTripPrice(defaulPrice);

    if (!code.valid || cuted) return;
    setPricing((prevprice) => {
      {
        return prevprice.map(({ carType, pricePerKm }) => {
          return {
            carType: carType,
            pricePerKm: pricePerKm - ((code.value * 10) / pricePerKm) * 100,
          };
        });
      }
    });
    setCuted(true);
  }, [code]);

  const handleRequestNow = async () => {
    try {
      setIsLoading(true);
      const fromLongitude = from.longitude;
      const fromLatitude = from.latitude;
      const fromTitle = from.title || "unknown locatio";
      const toLongitude = to[0].longitude;
      const toLatitude = to[0].latitude;
      const toTitle = to[0].title;
      const paymentMethod = paymentType;

      const { data: trip } = await requestTrip(
        carType,
        fromLongitude,
        fromLatitude,
        fromTitle,
        toLongitude,
        toLatitude,
        toTitle,
        tripPrice,
        paymentMethod
      );

      setIsLoading(false);

      navigation.navigate(screens.pendingTrip, trip);
    } catch (err) {
      setError(err?.response?.data?.message[lang] || i18n("networkError"));
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentTypeChange = (paymentType) => {
    try {
      setPaymentType(paymentType);
    } catch (err) {}
  };

  const handleCarTypeChange = (carType) => {
    try {
      setCarType(carType);
    } catch (err) {}
  };

  const handleCouponCodeChange = (couponCode) => {
    try {
      setCouponCode(couponCode);
    } catch (error) {}
  };
  const handleGoBack = () => {
    try {
      navigation.goBack();
    } catch (err) {}
  };

  const getPrice = (carType) => {
    try {
      return pricing.filter((price) => {
        return price.carType === carType;
      })[0].pricePerKm;
    } catch (error) {}
  };

  useEffect(() => {
    setTripPrice(getPrice("luxury"));
  }, [pricing]);

  return (
    <View style={styles.container}>
      <NetworkStatusLine />

      <PopupLoading visible={isLoading} />

      <PopupError
        visible={!!error}
        message={error}
        onClose={() => setError(false)}
      />

      <TouchableOpacity style={styles.iconContainer} onPress={handleGoBack}>
        <AntDesign
          name={lang == "ar" ? "arrowright" : "arrowleft"}
          size={24}
          color="black"
        />
      </TouchableOpacity>

      <GoogleMap />

      <HomeBottomSheet2
        pricing={pricing}
        getPrice={getPrice}
        couponCode={couponCode}
        setCode={setCode}
        setTripPrice={setTripPrice}
        onCouponCodeChange={handleCouponCodeChange}
        paymentType={paymentType}
        onPaymentTypeChange={handlePaymentTypeChange}
        carType={carType}
        onCarTypeChange={handleCarTypeChange}
        onRequestNow={handleRequestNow}
      />
    </View>
  );
}
