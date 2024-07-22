import {SafeAreaView,StyleSheet,Text,Image, View, Linking} from 'react-native'
import CircularAvatar from '../../components/common/CircularAvatar'
import StaticBottomSheet from '../../components/bottomSheets/StaticBottomSheet'
import useScreen from '../../hooks/useScreen';
import useLocale from '../../hooks/useLocale';
import CircularButton from '../../components/buttons/CircularButton';
import { MaterialIcons,Ionicons } from "@expo/vector-icons";
import { useState } from 'react';
import PopupError from '../popups/PopupError';
import PopupConfirm from "../../components/popups/PopupConfirm"
import CustomButton from '../buttons/CustomButton';
import screens from "../../static/screens.json"







export default function UserDetailsBottomSheet ({user,car,navigation}){

     
    const screen = useScreen()
    const [showConfirm,setShowConfirm] = useState(false)
    const { i18n, lang } = useLocale();
    const [call,setCall] = useState(false)
    const [showMessage,setShowMesage] = useState(false)

    const callInApp = ()=>{
        setShowMesage(true)
    }

    const callOutApp = ()=>{
        Linking.openURL(`tel:${user.phone.full}`)
    }

    const styles = StyleSheet.create({
     ImageContainer:{     
            
            alignItems:'center',
        },
        Image:{  
          marginVertical:10,
        },
         callIcon: {
            color: "#fff",
            fontSize: screen.getResponsiveFontSize(30),
            },
        TextContainer:{
            
            gap:screen.getVerticalPixelSize(10),
            flexBasis:screen.getScreenWidth()/3,
            alignItems:"center",
        
        },
     MainText: { 
        fontFamily: "cairo-700",
        fontSize: screen.getResponsiveFontSize(16),
    },
     SecondryText: {
      fontFamily: "cairo-800",
      color:'#AEB0AE',
      fontSize: screen.getResponsiveFontSize(12),
    },
    Evalution:{
        flexDirection:'row',
        alignItems:'center',
    },
    Ditails1:{
        flexDirection:'row',
        marginHorizontal:40,
        justifyContent:'space-around'
    },
    Ditails2:{
        marginVertical:30,
        flexDirection:'row',
        marginHorizontal:10,
        justifyContent:'center',
        alignContent:'center'
    },
    endTripBtn:{
        backgroundColor:"red",
        fontWeight:"bold",

    }
    })



    const handleEndTrip = async ()=>{
        try {
            setShowConfirm(false)
            // const {data} = await endTrip()
            navigation?.navigate(screens.driverHome)
        } catch (error) {
            
        }
    }

    

  return (
     <StaticBottomSheet >

              <PopupConfirm 
                title={i18n("endTrip")}
                subtitle={i18n("confirmEndTrip")}
                onConfirm={handleEndTrip}
                onClose={()=>setShowConfirm(false)}
                visible={showConfirm}  />


            <PopupError visible={showMessage}  onClose={()=>setShowMesage(false)} message={i18n('Soon')}/>


                <View style={styles.ImageContainer}>
                    <CircularAvatar imageStyle={styles.Image} url={user?.avatarURL} />
                    <Text style={styles.MainText}>{
                     user?.firstName+" "+ user?.lastName
                        }</Text>
                </View>
                {user.role === "driver" &&
                
                <View style={styles.Ditails1}>
                    <View style={styles.Evalution}>
                        <Text style={{color:"#EFBF0D"}}>{user?.driverEvalution.rate}</Text>
                        <MaterialIcons name='star' size={18} color={'gold'}/>
                    </View>
                    <Text style={styles.SecondryText}>{car?.model}</Text>
                    <Text style={styles.SecondryText}>{car?.plateNumber}</Text>

                </View>
                }
                {!call?
                
               <View style={styles.Ditails2}>
                {user.role === "driver"&&
                    <View style={styles.TextContainer}>
                        <Text style={styles.MainText}>{
                            new Date().getMonth()+1-
                            new Date(user?.createdAt).getMonth()
                            +i18n("monthes")
                        }</Text>
                        <Text style={styles.SecondryText}>{i18n("StartWorking")}</Text>
                    </View>}
                    <CircularButton
                       onPress={()=>setCall(true)}
                        Icon={() => <Ionicons name="call-outline" style={styles.callIcon} />}
                        containerStyle={styles.endCallButton}
                        
                    />
                    {user.role === "driver"&&
                    <View style={styles.TextContainer}>
                        <Text style={styles.MainText}>{"+" + user?.trips?.asDriver}</Text>
                        <Text style={styles.SecondryText}>{i18n("SumTrips")}</Text>
                    </View>}
                </View>
                :
                <View style={styles.Ditails2}>
                    
                       <View style={styles.TextContainer} >
                                <CircularButton
                                onPress={callInApp}
                                Icon={() => <Ionicons name="call-outline" style={styles.callIcon} />}
                                                      
                                />
                                <Text style={styles.SecondryText}>{i18n("CallInsideApp")}</Text>
                       </View>
                       <View style={styles.TextContainer}>
                                <CircularButton
                                onPress={callOutApp}
                                Icon={() => <Ionicons name="call-outline" style={styles.callIcon} />}
                                                      
                                />
                                <Text style={styles.SecondryText}>{i18n("CallOutsideApp")}</Text>
                       </View>
                
                </View>
                      }

                      {user.role == 'driver' && 
                       <CustomButton
                        onPress={()=>setShowConfirm(true)}
                        text={"end trip"}
                        containerStyle={styles.endTripBtn} />
                            
                        
                      }

            </StaticBottomSheet>
           
  )
}

