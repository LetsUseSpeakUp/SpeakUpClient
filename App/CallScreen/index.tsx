import React, {useState, useEffect, useRef, useContext} from 'react'

import { View, StyleSheet, Text} from 'react-native';
import {CallManager} from './Logic/CallManager'
import RingingScreen from './RingingScreen'
import DialPadScreen from './DialPadScreen'
import ConnectingScreen from './ConnectingScreen'
import OnCallScreen from './OnCallScreen/'
import { ConvoMetadata } from '../ConvosData/ConvosManager';
import ConvosContext from '../ConvosData/ConvosContext'


export default function CallScreen({route, navigation}: any) {    

    enum CallState {Dialpad, Ringing_Sender, Ringing_Receiver, Connecting, Disconnecting, OnCall};
    const [callState, setCallState] = useState(CallState.Dialpad);    

    const userPhoneNumber = route.params.userPhoneNumber;
    const callManager = useRef(new CallManager(userPhoneNumber));
    const [partnerPhoneNumber, setPartnerPhoneNumber] = useState('');   
    const convosContext = useContext(ConvosContext);

    const convoToNavTo = convosContext.convoToNavTo;
    if(convoToNavTo.length > 0){
        convosContext.clearConvoToNavTo();
        navigation.navigate('Convos', {screen: convoToNavTo})
    }

    useEffect(()=>{
        connectCallManagerListeners();
    }, [])    

    const connectCallManagerListeners = ()=>{
        if(callManager.current === null){
            console.log("ERROR -- DebuggingCallScreen.tsx -- callManager is null")
            return;
        }
        callManager.current.on('callReceived', (callerPhoneNumber: string)=>{
            setPartnerPhoneNumber(callerPhoneNumber);
            setCallState(CallState.Ringing_Receiver);
        })
        callManager.current.on('disconnected', ()=>{
            console.log("CallScreen::Callmanager emitted disconnected");
            setCallState(CallState.Dialpad)
        })
        callManager.current.on('connected', ()=>{
            setCallState(CallState.OnCall)
        })
        callManager.current.on('callDeclined', ()=>{
            setCallState(CallState.Dialpad);
        })        
        callManager.current.on('convoAdded', (convoMetadata: ConvoMetadata)=>{
            console.log("CallScreen. ConvoAdded: ", convoMetadata);
            convosContext.addSingleConvoMetadata(convoMetadata);
        })
    }

    const onRingAnswered = (acceptCall: boolean)=>{
        if(acceptCall){            
            callManager.current.acceptCall();
            setCallState(CallState.Connecting);
        }
        else{
            if(callState == CallState.Ringing_Receiver){
                callManager.current.declineCall()  
            }
            else if(callState == CallState.Ringing_Sender){
                callManager.current.endCall();
            }
            setCallState(CallState.Dialpad);
        }
    }

    const onCallPlaced = (tempPartnerPhoneNumber: string)=>{
        setPartnerPhoneNumber(tempPartnerPhoneNumber);
        callManager.current.placeCall(tempPartnerPhoneNumber);
        setCallState(CallState.Ringing_Sender);
    }

    const onHangUp = ()=>{
        callManager.current.endCall();
        setCallState(CallState.Disconnecting);
    }

    switch(callState){
        case CallState.Dialpad: return (<DialPadScreen userPhoneNumber={userPhoneNumber} onCallPlaced={onCallPlaced}/>)
        case CallState.Ringing_Sender: return(<RingingScreen callerPhoneNumber={partnerPhoneNumber} onRingAnswered={onRingAnswered} isCaller={true}/>)
        case CallState.Ringing_Receiver: return(<RingingScreen callerPhoneNumber={partnerPhoneNumber} onRingAnswered={onRingAnswered} isCaller={false}/>)
        case CallState.Connecting: return (<ConnectingScreen partnerPhoneNumber={partnerPhoneNumber} onHangUp={onHangUp}/>)
        case CallState.OnCall: return (<OnCallScreen partnerPhoneNumber={partnerPhoneNumber} onHangUp={onHangUp}/>);
        case CallState.Disconnecting: return(<View style={styles.container}><Text>Disconnecting</Text></View>)
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