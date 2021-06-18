import React, {useState, useEffect, useRef, useContext} from 'react'

import { View, StyleSheet, Text} from 'react-native';
import {CallManagerInstance} from './Logic/CallManager'
import RingingScreen from './RingingScreen'
import ContactsScreen from './ContactsScreen'
import ConnectingScreen from './ConnectingScreen'
import OnCallScreen from './OnCallScreen/'
import { ConvoMetadata, _testExistingFileUpload} from '../ConvosData/ConvosManager';
import ConvosContext from '../ConvosData/ConvosContext'

export default function CallScreen({route, navigation}: any) {    

    enum CallState {Contacts, Ringing_Sender, Ringing_Receiver, Connecting, Disconnecting, OnCall};
    const [callState, setCallState] = useState(CallState.Ringing_Sender);    //useState(CallState.Contacts);    

    const userPhoneNumber = route.params.userPhoneNumber;
    const userFirstName = route.params.userFirstName;
    const userLastName = route.params.userLastName;
    const callManager = useRef(CallManagerInstance);     
    const [partnerPhoneNumber, setPartnerPhoneNumber] = useState('');   
    const [partnerFirstName, setPartnerFirstName] = useState('TestFirstName'); //TODO: Change
    const [partnerLastName, setPartnerLastName] = useState('TestLastName'); //TODO: Change
    const convosContext = useContext(ConvosContext);
    const convosContextRef = useRef(convosContext); //When using callbacks, call this instead of convosContext directly or you'll have out of date state
    const _curDummyCount = useRef(0);    

    useEffect(()=>{
        const convoToNavTo = convosContext.convoToNavTo;
        if(convoToNavTo.length > 0){            
            navigation.navigate('Convos')            
        }    
    }, [convosContext.convoToNavTo])    

    useEffect(()=>{
        callManager.current.initialize(userPhoneNumber, userFirstName, userLastName);
        connectCallManagerListeners();        
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
            setPartnerName(callerFirstName + ' ' + callerLastName);
            setCallState(CallState.Ringing_Receiver);
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
        callManager.current.placeCall(tempPartnerPhoneNumber);
        setCallState(CallState.Ringing_Sender);
    }

    const onHangUp = ()=>{
        callManager.current.endCall();
        setCallState(CallState.Disconnecting);
    }

    switch(callState){
        case CallState.Contacts: return (<ContactsScreen onCallPlaced={onCallPlaced}/>)
        case CallState.Ringing_Sender: return(<RingingScreen partnerFirstName={partnerFirstName} partnerLastName={partnerLastName} 
            onHangup={()=>{onRingAnswered(false)}}/>)
        case CallState.Ringing_Receiver: return(<RingingScreen partnerFirstName={partnerFirstName} partnerLastName={partnerLastName} 
            onHangup={()=>{onRingAnswered(false)}} onAcceptCall={()=>{onRingAnswered(true)}}/>)
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