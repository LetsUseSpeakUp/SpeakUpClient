import React, { useEffect, useState, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ConvosScreen from './ConvosScreen'
import CallScreen from './CallScreen'
import LoginScreen from './LoginScreen'
import * as ConvosManager from './ConvosData/ConvosManager'
import { ConvoMetadata, ConvoStatus } from './ConvosData/ConvosManager'
import ConvosContext from './ConvosData/ConvosContext'

const Tab = createBottomTabNavigator();

export default function App() {
  const [userPhoneNumber, setUserPhoneNumber] = useState('')
  const [convosMetadata, setConvosMetadata] = useState([] as Array<ConvoMetadata>);
  const [convoToNavTo, setConvoToNavTo] = useState('');
  const clearConvoToNavTo = () => { setConvoToNavTo('') }
  const convoToNavToBuffer = useRef('');
  const isLogged = userPhoneNumber.length > 0;

  useEffect(() => {
    if (userPhoneNumber.length > 0) {
      if (convosMetadata.length > 0) {
        console.log("ERROR -- App. Phone number was changed after fetching convosMetadata. New number: ", userPhoneNumber);
      }
      ConvosManager.fetchLatestConvosMetadataForUser(userPhoneNumber).then((metadata: any) => {
        setConvosMetadata(metadata);
      })
    }
  }, [userPhoneNumber])

  useEffect(() => {
    if (convoToNavToBuffer.current.length > 0) {
      const bufferBuffer = convoToNavToBuffer.current;
      convoToNavToBuffer.current = '';
      setConvoToNavTo(bufferBuffer);
    }
  }, [convosMetadata])

  const onAddSingleConvoMetadata = (singleConvoMetadata: ConvoMetadata) => {
    console.log("App. onAddSingleConvoMetadata: ", singleConvoMetadata);
    convoToNavToBuffer.current = singleConvoMetadata.convoId;
    const newConvosMetadata = convosMetadata.concat(singleConvoMetadata);
    setConvosMetadata(newConvosMetadata);
  }

  const onUpdateSingleConvoStatusWithFetched = (convoId: string, updatedStatus: ConvoStatus) => { 
    const updatedMetadata = convosMetadata.slice();
    updatedMetadata[updatedMetadata.findIndex((convo)=>convo.convoId === convoId)].convoStatus = updatedStatus;
    setConvosMetadata(updatedMetadata);
  }

  const onApproveOrDenySingleConvo = (shouldApprove: boolean, convoId: string) => {
    console.log("App. onApproveOrDenySingleConvo. Id: ", convoId, " Approve: ", shouldApprove);
    if (shouldApprove)
      ConvosManager.approveConvo(convoId, userPhoneNumber);
    else
      ConvosManager.denyConvo(convoId, userPhoneNumber);

    const approvalStatusCode = shouldApprove ? 1 : -1;

    const i = convosMetadata.findIndex((convo) => convo.convoId === convoId);
    const currentConvoVal = convosMetadata[i];
    const amIInitiator = convosMetadata[i].initiatorFirstName === undefined;

    const newMetadata = convosMetadata.slice();
    if (amIInitiator) {
      if (currentConvoVal.convoStatus === undefined) {
        currentConvoVal.convoStatus = { initiatorResponse: ConvosManager.ConvoResponseType.Unanswered, receiverResponse: ConvosManager.ConvoResponseType.Unanswered }
      }
      const newConvoStatus: ConvoStatus = { initiatorResponse: approvalStatusCode, receiverResponse: currentConvoVal.convoStatus.receiverResponse };
      newMetadata[i].convoStatus = newConvoStatus;
    }
    else {
      if (currentConvoVal.convoStatus === undefined) {
        currentConvoVal.convoStatus = { initiatorResponse: ConvosManager.ConvoResponseType.Unanswered, receiverResponse: ConvosManager.ConvoResponseType.Unanswered }
      }
      const newConvoStatus: ConvoStatus = { initiatorResponse: currentConvoVal.convoStatus.initiatorResponse, receiverResponse: approvalStatusCode, };
      newMetadata[i].convoStatus = newConvoStatus;
    }

    setConvosMetadata(newMetadata);
  }

  if (!isLogged) {
    return <LoginScreen onSetPhoneNumber={(phoneNumber: string) => setUserPhoneNumber(phoneNumber)} />
  }


  return (
    <ConvosContext.Provider value={{
      allConvosMetadata: convosMetadata, addSingleConvoMetadata: onAddSingleConvoMetadata,
      updateSingleConvoStatusWithFetched: onUpdateSingleConvoStatusWithFetched, convoToNavTo: convoToNavTo,
      approveOrDenySingleConvo: onApproveOrDenySingleConvo, clearConvoToNavTo: clearConvoToNavTo
    }}>
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen name={"Call"} component={CallScreen} initialParams={{ userPhoneNumber: userPhoneNumber }} />
          <Tab.Screen name={"Convos"} component={ConvosScreen} initialParams={{ convosMetadata: convosMetadata, userPhoneNumber: userPhoneNumber }} />
        </Tab.Navigator>
      </NavigationContainer>
    </ConvosContext.Provider>
  );
}