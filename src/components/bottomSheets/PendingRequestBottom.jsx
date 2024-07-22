import { useEffect } from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import StaticBottomSheet from "./StaticBottomSheet";
import useLocale from "../../hooks/useLocale";
import * as theme from "../../constants/theme";
import useTimer from "../../hooks/useTimer";
import TimerPar from "../common/TimePar";
import useScreen from "../../hooks/useScreen";
import { MaterialIcons } from "@expo/vector-icons";



export default function PendingRequestBottom({onCancel,onTimerDone,carType}) {
  const screen = useScreen();
  const { i18n, lang } = useLocale();
  const { remainingSeconds, isTimerDone } = useTimer(300);

  const styles = StyleSheet.create({
    container: {
      display:'flex',
      flexWrap:"nowrap"
     
    },
    Title: {
      fontFamily: "cairo-700",
      fontSize: screen.getResponsiveFontSize(18),
      textAlign: "center",
    },
   
    arToText: {
      textAlign: "right",
      fontFamily: "cairo-500",
      fontSize: screen.getResponsiveFontSize(14),
      flex: 1,
    },
    enToText: {
      textAlign: "left",
      fontFamily: "cairo-500",
      fontSize: screen.getResponsiveFontSize(14),
      flex: 1,
    },
   
   
    arButtonsContainer: {
      flexDirection: "row-reverse",
      justifyContent: "space-around",
      alignItems: "center",
    },
    enButtonsContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
    },
   

    Icon:{
        fontSize:screen.getResponsiveFontSize(50),
        color:theme.primaryColor,
        backgroundColor:"transparent",
        borderRadius:50
    },
   
   image: {   
        width:screen.getScreenWidth()/2,
        height:screen.getScreenHeight()/4,
        resizeMode:'contain', 
    }
  });

  useEffect(() => {
    try {
      if (isTimerDone) {
        onTimerDone()
      }
    } catch (err) {}
  }, [isTimerDone]);





  return (
    <StaticBottomSheet contentStyle={styles.container}>
      <Text style={styles.Title}>
        {i18n(`Request${carType}`)}
      </Text>

      
        <TimerPar duration={remainingSeconds}/>
      
      <Text style={lang==="ar"?styles.arToText:styles.enToText}>
        {i18n("WaitingForTheApprovalOfTheNearestDriver")}
      </Text>

      
      <View
        style={
          lang === "ar" ? styles.arButtonsContainer : styles.enButtonsContainer
        }
      >
       

        <Image style={styles.image} source={require('../../assets/images/pending-request.png')}/>
     
       </View>

        <View 
        style={
          lang === "ar" ? styles.arButtonsContainer : styles.enButtonsContainer
        }>
          
           <MaterialIcons
             onPress={onCancel}
             style={styles.Icon} name="cancel"/>

        </View>

        <Text style={styles.Title}>
        {i18n("CancelRecuest")}
      </Text>
      
    </StaticBottomSheet>
  );
}
