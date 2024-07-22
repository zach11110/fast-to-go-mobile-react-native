import { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";
import useScreen from "../../hooks/useScreen";
import DefaultScreenTitle from "../../components/screenTitles/DefaultScreenTitle";
import useLocale from "../../hooks/useLocale";
import CircularAvatar from "../../components/common/CircularAvatar";
import {
  AntDesign,
  Entypo,
  Feather,
  FontAwesome5,
  Ionicons,
  SimpleLineIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import PopupError from "../../components/popups/PopupError";
import PopupConfirm from "../../components/popups/PopupConfirm";
import * as theme from "../../constants/theme";
import CustomButton from "../../components/buttons/CustomButton";
import screens from "../../static/screens.json";
import { acceptDriver, rejectDriver } from "../../api/user/users";
import { getCar } from "../../api/user/car";
import { blockUser, assignAsAdmin } from "../../api/user/users";
import useAuth from "../../auth/useAuth";

export default function DriverRequestScreen({ navigation, route }) {
  const { driver } = route.params;

  const optionsRef = useRef(null);
  const screen = useScreen();
  const [error, setError] = useState("");
  const [confirmMessage, setConfirmMessage] = useState(null);
  const [confirmTitle, setConfirmTitle] = useState(null);
  const [confirmFunction, setConfirmFunction] = useState(() => {
    return;
  });
  const [displayOptions, setDisplayOptions] = useState(false);
  const { socket } = useAuth();
  const { i18n, lang } = useLocale();
  const [car, setCar] = useState(null);

  useEffect(() => {
    // TODO: load driver's car
    const timeoutId = setTimeout(async () => {
      try {
        const { data } = await getCar(driver.carId);

        setCar(data);
      } catch (error) {}
    }, 2500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      gap: screen.getVerticalPixelSize(15),
      paddingHorizontal: screen.getHorizontalPixelSize(15),
      paddingVertical: screen.getVerticalPixelSize(15),
      paddingTop: screen.getVerticalPixelSize(50),
    },
    contentContainer: {
      gap: screen.getVerticalPixelSize(15),
    },
    avatarContainer: {
      alignSelf: "center",
    },
    avatar: {
      width: screen.getHorizontalPixelSize(100),
      height: screen.getVerticalPixelSize(100),
      borderWidth: screen.getHorizontalPixelSize(1),
      borderColor: "#ababab",
    },
    evaluationContainer: {
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
    textEvaluation: {
      margin: screen.getHorizontalPixelSize(6),
      backgroundColor: "#eee",
      width: screen.getScreenWidth(),
      textAlign: "center",
      paddingVertical: 8,
      fontFamily: "cairo-600",
    },
    boxContainer: {
      borderWidth: screen.getHorizontalPixelSize(1),
      borderColor: "#ababab",
      paddingHorizontal: screen.getHorizontalPixelSize(10),
      paddingVertical: screen.getVerticalPixelSize(10),
      borderRadius: screen.getHorizontalPixelSize(8),
      gap: screen.getVerticalPixelSize(10),
    },
    itemContainer: {
      flexDirection: lang === "ar" ? "row-reverse" : "row",

      alignItems: "center",
      gap: screen.getHorizontalPixelSize(7),
    },
    icon: {
      color: theme.primaryColor,
      fontSize: screen.getResponsiveFontSize(30),
    },
    imageIcon: {
      width: screen.getHorizontalPixelSize(30),
      height: screen.getHorizontalPixelSize(30),
    },
    boxTitle: {
      fontFamily: "cairo-700",
      fontSize: screen.getResponsiveFontSize(14),
    },
    itemText: {
      fontFamily: "cairo-600",
      fontSize: screen.getResponsiveFontSize(14),
    },
    buttonsContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: screen.getHorizontalPixelSize(10),
    },
    buttonContainer: {
      flex: 1,
    },
    rejectButtonContainer: {
      backgroundColor: "#f00",
    },
    buttonText: {
      fontFamily: "cairo-800",
      fontSize: screen.getResponsiveFontSize(18),
    },
    imagesContainer: {
      gap: screen.getVerticalPixelSize(10),
    },
    imagesTitle: {
      fontFamily: "cairo-700",
      fontSize: screen.getResponsiveFontSize(15),
    },
    imagesListContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      gap: screen.getHorizontalPixelSize(10),
    },
    imageContainer: {
      flex: 1,
      maxWidth: screen.getHorizontalPixelSize(120),
      height: screen.getHorizontalPixelSize(90),
      borderRadius: screen.getHorizontalPixelSize(3),
      borderColor: "#ababab",
      borderWidth: screen.getHorizontalPixelSize(0.5),
    },
    image: {
      width: "100%",
      height: "100%",
    },
    optionsIcon: {
      marginTop: -40,
      width: 30,
      padding: 5,
    },
    optionsContainer: {
      gap: 4,
      marginLeft: 20,
      padding: 10,
      backgroundColor: "#eee",
      width: screen.getScreenWidth() / 3,
      display: displayOptions ? "flex" : "none",
    },
  });

  const handleGoBack = () => {
    try {
      navigation.goBack();
    } catch (err) {}
  };

  const handleApproveDriver = async () => {
    const driverId = driver._id;
    try {
      await acceptDriver(driverId);
      navigation.goBack();
    } catch (error) {
      console.log(error);
    }
  };

  const handleRejectDriver = async () => {
    try {
      const driverId = driver._id;
      await rejectDriver(driverId);
      navigation.goBack();
    } catch (error) {
      setError(error?.response?.data?.message || i18n("NetworkError"));
    }
  };

  const getOpenPhotoHandler = (url) => () => {
    try {
      const source = { uri: url };
      navigation.navigate(screens.photoDisplay, { source });
    } catch (err) {}
  };

  const handleBlockUser = async () => {
    try {
      const { data } = await blockUser(driver._id);

      setConfirmMessage(null);
    } catch (err) {
      setConfirmMessage(null);
      setError(err?.response?.data?.message[lang] || i18n("networkError"));
    }
  };

  const handleAssignAsAdmin = async () => {
    try {
      await assignAsAdmin(driver._id);
      setConfirmMessage(null);
    } catch (err) {
      setConfirmMessage(null);
      setError(err?.response?.data?.message[lang] || i18n("networkError"));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <DefaultScreenTitle
        title={
          driver?.verified?.driver ? i18n("driverInfo") : i18n("driverRequest")
        }
        onPrev={handleGoBack}
      />
      {driver.verified.driver && (
        <View>
          <SimpleLineIcons
            onPress={() => {
              setDisplayOptions(!displayOptions);
            }}
            style={styles.optionsIcon}
            name="options-vertical"
            size={24}
            color="black"
          />
          <View style={styles.optionsContainer} ref={optionsRef}>
            <TouchableOpacity
              onPress={() => {
                setConfirmTitle(
                  driver?.blocked ? i18n("unBlockUser") : i18n("blockUser")
                );
                setConfirmMessage(i18n("popupBlockUserHint"));
                setConfirmFunction(() => handleBlockUser);
              }}
            >
              <Text style={styles.itemText}>{i18n("blockUser")}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setConfirmTitle(i18n("assignAsAdmin"));
                setConfirmMessage(i18n("assingAdminMessage"));
                setConfirmFunction(() => handleAssignAsAdmin);
              }}
            >
              <Text style={styles.itemText}>{i18n("assignAsAdmin")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      <PopupConfirm
        visible={!!confirmMessage}
        onConfirm={confirmFunction}
        title={confirmTitle}
        subtitle={confirmMessage}
        onClose={() => setConfirmMessage(false)}
      />
      <PopupError
        visible={!!error}
        message={error}
        onClose={() => setError(null)}
      />

      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          style={styles.avatarContainer}
          onPress={getOpenPhotoHandler(driver.avatarURL)}
        >
          <CircularAvatar url={driver?.avatarURL} imageStyle={styles.avatar} />
        </TouchableOpacity>

        <View style={styles.boxContainer}>
          <View style={styles.itemContainer}>
            <AntDesign name="idcard" style={styles.icon} />
            <Text style={styles.boxTitle}>{i18n("driverInfo")}</Text>
          </View>

          <View style={styles.itemContainer}>
            <Ionicons name="person" style={styles.icon} />
            <Text style={styles.itemText}>
              {driver.firstName} {driver.lastName}
            </Text>
          </View>

          <View style={styles.itemContainer}>
            <Entypo name="phone" style={styles.icon} />
            <Text style={styles.itemText}>{driver.phone.full}</Text>
          </View>

          <View style={styles.itemContainer}>
            <Feather name="mail" style={styles.icon} />
            <Text style={styles.itemText}>
              {driver.email || i18n("notSpecified")}
            </Text>
          </View>
        </View>

        <View style={styles.imagesContainer}>
          <Text style={styles.imagesTitle}>{i18n("requiredDocuments")}</Text>
          <View style={styles.imagesListContainer}>
            <TouchableOpacity
              style={styles.imageContainer}
              onPress={getOpenPhotoHandler(car?.documents?.brochure)}
            >
              <Image
                source={{ uri: car?.documents?.brochure }}
                style={styles.image}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.imageContainer}
              onPress={getOpenPhotoHandler(car?.documents?.driverLicense)}
            >
              <Image
                source={{ uri: car?.documents?.driverLicense }}
                style={styles.image}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.imageContainer}
              onPress={getOpenPhotoHandler(car?.documents?.insurance)}
            >
              <Image
                source={{ uri: car?.documents?.insurance }}
                style={styles.image}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.imageContainer}
              onPress={getOpenPhotoHandler(car?.documents?.passport)}
            >
              <Image
                source={{ uri: car?.documents?.passport }}
                style={styles.image}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.boxContainer}>
          <View style={styles.itemContainer}>
            <FontAwesome5 name="taxi" style={styles.icon} />
            <Text style={styles.boxTitle}>{i18n("carInfo")}</Text>
          </View>

          <View style={styles.itemContainer}>
            <Image
              source={require("../../assets/icons/car-number.png")}
              resizeMode="contain"
              style={styles.imageIcon}
            />
            <Text style={styles.itemText}>{car?.plateNumber}</Text>
          </View>

          <View style={styles.itemContainer}>
            <AntDesign name="calendar" style={styles.icon} />
            <Text style={styles.itemText}>{car?.createdAt}</Text>
          </View>

          <View style={styles.itemContainer}>
            <MaterialCommunityIcons name="taxi" style={styles.icon} />
            <Text style={styles.itemText}>{car?.model}</Text>
          </View>

          <View style={styles.itemContainer}>
            <Ionicons name="color-palette-sharp" style={styles.icon} />
            <Text style={styles.itemText}>{car?.color}</Text>
          </View>
        </View>

        <View style={styles.imagesContainer}>
          <Text style={styles.imagesTitle}>{i18n("requiredDocuments")}</Text>

          <View style={styles.imagesListContainer}>
            <TouchableOpacity
              style={styles.imageContainer}
              onPress={getOpenPhotoHandler(car?.photos[0])}
            >
              <Image source={{ uri: car?.photos[0] }} style={styles.image} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.imageContainer}
              onPress={getOpenPhotoHandler(car?.photos[1])}
            >
              <Image source={{ uri: car?.photos[1] }} style={styles.image} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.imageContainer}
              onPress={getOpenPhotoHandler(car?.photos[2])}
            >
              <Image source={{ uri: car?.photos[2] }} style={styles.image} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.imageContainer}
              onPress={getOpenPhotoHandler(car?.photos[3])}
            >
              <Image source={{ uri: car?.photos[3] }} style={styles.image} />
            </TouchableOpacity>
          </View>
        </View>

        {!!driver.verified.driver && (
          <View style={styles.evaluationContainer}>
            <Text style={styles.boxTitle}>{i18n("evaluations")}</Text>

            {!!driver?.driverEvalution?.text.length ? (
              driver.driverEvalution.text.map((text, index) => {
                return (
                  <Text style={styles.textEvaluation} key={index}>
                    {text}
                  </Text>
                );
              })
            ) : (
              <Text style={styles.textEvaluation}>{i18n("noEvaluation")}</Text>
            )}
          </View>
        )}
      </ScrollView>

      {!driver.verified.driver && (
        <View style={styles.buttonsContainer}>
          <CustomButton
            onPress={handleRejectDriver}
            text={i18n("reject")}
            textStyle={styles.buttonText}
            containerStyle={[
              styles.buttonContainer,
              styles.rejectButtonContainer,
            ]}
          />

          <CustomButton
            onPress={handleApproveDriver}
            text={i18n("approve")}
            containerStyle={[styles.buttonContainer, styles.approveButton]}
            textStyle={styles.buttonText}
          />
        </View>
      )}
    </SafeAreaView>
  );
}
