import React, {useState, useEffect} from 'react'

import { View, StyleSheet, Button, Text, TextInput } from 'react-native';
import {CallManager} from './Logic/CallManager'
import RingingScreen from './RingingScreen'
import GetPhoneNumberScreen from './GetPhoneNumberScreen'
import DialPadScreen from './DialPadScreen'
import ConnectingScreen from './ConnectingScreen'
import OnCallScreen from './OnCallScreen/'


export default function CallScreen() {    

    enum CallState {GetPhoneNumber, Dialpad, Ringing_Sender, Ringing_Receiver, Connecting, OnCall};
    const [callState, setCallState] = useState(CallState.GetPhoneNumber);    

    const [callManager, setCallManager] = useState(null);
    const [userPhoneNumber, setUserPhoneNumber] = useState('');
    const [partnerPhoneNumber, setPartnerPhoneNumber] = useState(''); 

    useEffect(()=>{
        if(callManager != null) connectCallManagerListeners();
    }, [callManager])

    const connectCallManagerListeners = ()=>{
        if(callManager == null){
            console.log("ERROR -- DebuggingCallScreen.tsx -- callManager is null")
            return;
        }
//@ts-ignore
        callManager.on('callReceived', (callerPhoneNumber: string)=>{
            setPartnerPhoneNumber(callerPhoneNumber);
            setCallState(CallState.Ringing_Receiver);
        })
//@ts-ignore
        callManager.on('disconnected', ()=>{
            setCallState(CallState.Dialpad)
        })
//@ts-ignore
        callManager.on('connected', ()=>{
            setCallState(CallState.OnCall)
        })
//@ts-ignore
        callManager.on('callDeclined', ()=>{
            setCallState(CallState.Dialpad);
        })
    }

    const onMyPhoneNumberSet = (newPhoneNumber: string)=>{
        setUserPhoneNumber(newPhoneNumber);
//@ts-ignore
        setCallManager(new CallManager(newPhoneNumber));        
        setCallState(CallState.Dialpad);        
    }

    const onRingAnswered = (acceptCall: boolean)=>{
        if(acceptCall){
//@ts-ignore
            callManager.acceptCall();
            setCallState(CallState.Connecting);
        }
        else{
            if(callState == CallState.Ringing_Receiver){
                //@ts-ignore
                callManager.declineCall()  
            } 
            setCallState(CallState.Dialpad);
        }
    }

    const onCallPlaced = (tempPartnerPhoneNumber: string)=>{
        setPartnerPhoneNumber(tempPartnerPhoneNumber);
//@ts-ignore
        callManager.placeCall(tempPartnerPhoneNumber);
        setCallState(CallState.Ringing_Sender);
    }

    const onHangUp = ()=>{
        //@ts-ignore
        callManager.endCall();
    }

    switch(callState){
        case CallState.GetPhoneNumber: return (<GetPhoneNumberScreen onSetPhoneNumber={onMyPhoneNumberSet}/>);
        case CallState.Dialpad: return (<DialPadScreen userPhoneNumber={userPhoneNumber} onCallPlaced={onCallPlaced}/>)
        case CallState.Ringing_Sender: return(<RingingScreen callerPhoneNumber={partnerPhoneNumber} onRingAnswered={onRingAnswered} isCaller={true}/>)
        case CallState.Ringing_Receiver: return(<RingingScreen callerPhoneNumber={partnerPhoneNumber} onRingAnswered={onRingAnswered} isCaller={false}/>)
        case CallState.Connecting: return (<ConnectingScreen partnerPhoneNumber={partnerPhoneNumber} onHangUp={onHangUp}/>)
        case CallState.OnCall: return (<OnCallScreen partnerPhoneNumber={partnerPhoneNumber} onHangUp={onHangUp}/>);
        default: return(<View style={styles.container}><Text>Error - Unknown state</Text></View>)
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})