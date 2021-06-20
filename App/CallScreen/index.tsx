import React, {useState, useEffect, useRef, useContext} from 'react'

import { View, StyleSheet, Text} from 'react-native';
import {CallManagerInstance} from './Logic/CallManager'
import GenericCallSCreen from './GenericCallScreen';
import ContactsScreen from './ContactsScreen'
import { ConvoMetadata, _testExistingFileUpload} from '../ConvosData/ConvosManager';
import ConvosContext from '../ConvosData/ConvosContext'
import {getMyUserInfo} from '../AuthLogic'
import TrackPlayer from 'react-native-track-player';

export default function CallScreen({route, navigation}: any) {    

    enum CallState {Contacts, Ringing_Sender, Ringing_Receiver, Connecting, Disconnecting, OnCall};
    const [callState, setCallState] = useState(CallState.Contacts);
    
    const callManager = useRef(CallManagerInstance);  
    const [partnerPhoneNumber, setPartnerPhoneNumber] = useState('');
    const [partnerFirstName, setPartnerFirstName] = useState('');
    const [partnerLastName, setPartnerLastName] = useState('');
    const convosContext = useContext(ConvosContext);
    const convosContextRef = useRef(convosContext); //When using callbacks, call this instead of convosContext directly or you'll have out of date state
    const _curDummyCount = useRef(0);    

    useEffect(()=>{
        console.log("CallScreen. ConvoToNavTo changed: ", convosContext.convoToNavTo);
        const convoToNavTo = convosContext.convoToNavTo;
        if(convoToNavTo.length > 0){            
            navigation.navigate('Convos')            
        }    
    }, [convosContext.convoToNavTo])   
    
    useEffect(()=>{
        if(callState !== CallState.Contacts){
            TrackPlayer.pause();
        }
    }, [callState])

    useEffect(()=>{
        getMyUserInfo().then((userInfo)=>{
            console.log("CallScreen::init. User info: ", userInfo);
            if(!userInfo.phoneNumber) throw 'user phone number is null';            
            callManager.current.initialize(userInfo.phoneNumber, userInfo.firstName ?? '', userInfo.lastName ?? '');
            connectCallManagerListeners();        
        }).catch((error)=>{
            console.log("ERROR -- CallScreen::Init. Unable to get user info: ", error);
        })
        
    }, [])    

    useEffect(()=>{
        convosContextRef.current = convosContext;
    }, [convosContext])

    const connectCallManagerListeners = ()=>{
        if(callManager.current === null){
            console.log("ERROR -- DebuggingCallScreen.tsx -- callManager is null")
            return;
        }
        callManager.current.on('callReceived', (callerPhoneNumber: string, callerFirstName: string, callerLastName: string)=>{
            setPartnerPhoneNumber(callerPhoneNumber);
            setPartnerFirstName(callerFirstName);
            setPartnerLastName(callerLastName);            
            setCallState(CallState.Ringing_Receiver);
            navigation.navigate('Call');
        })
        callManager.current.on('disconnected', ()=>{
            console.log("CallScreen::Callmanager emitted disconnected");
            setCallState(CallState.Contacts)
        })
        callManager.current.on('connected', ()=>{
            setCallState(CallState.OnCall)
        })
        callManager.current.on('callDeclined', ()=>{
            setCallState(CallState.Contacts);
        })        
        callManager.current.on('convoAdded', (convoMetadata: ConvoMetadata)=>{
            console.log("CallScreen. ConvoAdded.");
            convosContextRef.current.addSingleConvoMetadata(convoMetadata);
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
            setCallState(CallState.Contacts);
        }
    }

    /**
     * This is just for testing. Don't use it once you're done testing a function
     * @returns 
     */
    const _sendDummyConvoMetadata = ()=>{ 
        const dummyMetadata: ConvoMetadata = {
            convoId: 'dummy5-1_num_' + _curDummyCount.current++,
            initiatorId: '005',
            receiverId: '001', //Make sure you're 001 when using this
            timestampStarted: Date.now(),
            convoLength: 3451,
            initiatorFirstName: 'FirstName005',
            initiatorLastName: 'LastName005'
        };
        convosContext.addSingleConvoMetadata(dummyMetadata);
    }

    const onCallPlaced = (tempPartnerPhoneNumber: string, tempPartnerFirstName: string, tempPartnerLastName: string)=>{        
        setPartnerPhoneNumber(tempPartnerPhoneNumber);
        setPartnerFirstName(tempPartnerFirstName);
        setPartnerLastName(tempPartnerLastName);        
        callManager.current.placeCall(tempPartnerPhoneNumber, tempPartnerFirstName, tempPartnerLastName);
        setCallState(CallState.Ringing_Sender);
    }

    const onHangup = ()=>{
        callManager.current.endCall();
        setCallState(CallState.Disconnecting);
    }

    const onSpeakerToggled = (speakerIsToggled: boolean)=>{
        console.log("CallScreen::onSpeakerToggled: ", speakerIsToggled);
        callManager.current.setSpeaker(speakerIsToggled);
    }

    switch(callState){
        case CallState.Contacts: return (<ContactsScreen onCallPlaced={onCallPlaced}/>)
        case CallState.Ringing_Sender: return(<GenericCallSCreen partnerFirstName={partnerFirstName} partnerLastName={partnerLastName} 
            onHangup={()=>{onRingAnswered(false)}} statusText={'Ringing...'}/>)
        case CallState.Ringing_Receiver: return(<GenericCallSCreen partnerFirstName={partnerFirstName} partnerLastName={partnerLastName} 
            onHangup={()=>{onRingAnswered(false)}} onAcceptCall={()=>{onRingAnswered(true)}} statusText={'Ringing...'}/>)
        case CallState.Connecting: return (<GenericCallSCreen partnerFirstName={partnerFirstName} partnerLastName={partnerLastName} 
            onHangup={onHangup} statusText={'Connecting...'}/>)
        case CallState.OnCall: return (<GenericCallSCreen partnerFirstName={partnerFirstName} partnerLastName={partnerLastName} 
            onHangup={onHangup} onSpeakerToggled={onSpeakerToggled} statusText={'On Call'}/>)
        case CallState.Disconnecting: return (<GenericCallSCreen partnerFirstName={partnerFirstName} partnerLastName={partnerLastName} 
            onHangup={()=>{}} statusText={'Disconnecting...'}/>)
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