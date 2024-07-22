import { View ,StyleSheet } from "react-native"
import * as theme from "../../constants/theme";
import useScreen from "../../hooks/useScreen";
import useTimer from "../../hooks/useTimer";
import { useEffect, useState } from "react";

export default function TimerPar ({duration,onTimerDone}) {

    const screen = useScreen()
    const {remainingSeconds,isTimerDone} = useTimer(duration)
    
   
    const styles = StyleSheet.create( {
           ViewParent:{
                alignSelf: "center",
                position:"relative",
                backgroundColor:"#eee",
                width: screen.getHorizontalPixelSize(300),
           },
          indicatorStyle: {
            
            width: screen.getHorizontalPixelSize(remainingSeconds),
            height: screen.getVerticalPixelSize(6),
            borderRadius: 8,
            backgroundColor: theme.primaryColor,
    },})

    return(
        <View style={styles.ViewParent}>

            <View style={styles.indicatorStyle}></View>
        </View>
    )

}