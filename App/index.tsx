import React, { useEffect, useState, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ConvosScreen from './ConvosScreen'
import CallScreen from './CallScreen'
import LoginScreen from './LoginScreen'
import * as ConvosManager from './ConvosData/ConvosManager'
import { ConvoMetadata, ConvoStatus } from './ConvosData/ConvosManager'
import ConvosContext from './ConvosData/ConvosContext'
import {loginWithExistingCredentials, getMyUserInfo, deleteExistingRefreshToken} from './AuthLogic'
import LogoutScreen from './LogoutScreen'
import { LogBox } from 'react-native';

LogBox.ignoreLogs([ //This is to mute a fake error from react-navigation. If you encounter issues with react navigation, remove this line to see the warning
  'Non-serializable values were found in the navigation state',
  'Sending \`onAnimatedValueUpdate\` with no listeners registered.'
]);

const Tab = createBottomTabNavigator();

export default function App() {
  const [userPhoneNumber, setUserPhoneNumber] = useState('');
  const [userFirstName, setUserFirstName] = useState('');
  const [userLastName, setUserLastName] = useState('');
  const [convosMetadata, setConvosMetadata] = useState([] as Array<ConvoMetadata>);
  const [convoToNavTo, setConvoToNavTo] = useState('');
  const clearConvoToNavTo = () => { setConvoToNavTo('') }
  const convoToNavToBuffer = useRef('');
  const isLoggedIn = userPhoneNumber.length > 0; 

  useEffect(()=>{
    onLoggedIn();
  }, [])

  useEffect(() => {
    if (userPhoneNumber.length > 0) {
      if (convosMetadata.length > 0) {
        console.log("ERROR -- App. Phone number was changed after fetching convosMetadata. New number: ", userPhoneNumber);
      }
      ConvosManager.fetchLatestConvosMetadataForUser().then((metadata: any) => {
        setConvosMetadata(metadata);
      })
    }
  }, [userPhoneNumber])

  const onLoggedIn = ()=>{
    loginWithExistingCredentials().then((success)=>{
      if(success){
        getMyUserInfo().then((userInfo)=>{
          if(userInfo == null) return;
          if(userInfo.phoneNumber != null) setUserPhoneNumber(userInfo.phoneNumber);
          if(userInfo.firstName != null) setUserFirstName(userInfo.firstName);
          if(userInfo.lastName != null) setUserLastName(userInfo.lastName);
        })
      } 
      console.log("App::loginWithExistingCredentials. Success: ", success);
    });
  }

  useEffect(() => {
    if (convoToNavToBuffer.current.length > 0) {
      const bufferBuffer = convoToNavToBuffer.current;
      convoToNavToBuffer.current = '';
      setConvoToNavTo(bufferBuffer);
    }
  }, [convosMetadata])

  const onAddSingleConvoMetadata = (singleConvoMetadata: ConvoMetadata) => {
    convoToNavToBuffer.current = singleConvoMetadata.convoId;
    const newConvosMetadata = convosMetadata.concat(singleConvoMetadata);
    setConvosMetadata(newConvosMetadata);
  }

  const onUpdateSingleConvoMetadataWithFetched = (singleConvoMetadata: ConvoMetadata) => { 
    const updatedMetadata = convosMetadata.slice();
    updatedMetadata[updatedMetadata.findIndex((convo)=>convo.convoId === singleConvoMetadata.convoId)] = singleConvoMetadata;
    setConvosMetadata(updatedMetadata);
  }

  const onApproveOrDenySingleConvo = (shouldApprove: boolean, convoId: string) => { //TODO: Refactor this horrible code
    console.log("App. onApproveOrDenySingleConvo. Id: ", convoId, " Approve: ", shouldApprove);
    if (shouldApprove)
      ConvosManager.approveConvo(convoId, userPhoneNumber);
    else
      ConvosManager.denyConvo(convoId, userPhoneNumber);

    const approvalStatusCode = shouldApprove ? 1 : -1;

    const i = convosMetadata.findIndex((convo) => convo.convoId === convoId);
    const currentConvoVal = convosMetadata[i];

    const amIInitiator = (convosMetadata[i].initiatorId != null && convosMetadata[i].receiverId != null) ? (userPhoneNumber === convosMetadata[i].initiatorId) : 
    convosMetadata[i].initiatorFirstName === undefined;    

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

  const onLoggedOut = ()=>{
    deleteExistingRefreshToken().then(()=>{
      setUserPhoneNumber('');
    }).catch(error=>{
      console.log("ERROR -- App::onLoggedOut: ", error);
    })
  }

  if (!isLoggedIn) {
    return <LoginScreen  onLoginComplete={()=>{onLoggedIn()}}/>
  }


  return (
    <ConvosContext.Provider value={{
      allConvosMetadata: convosMetadata, addSingleConvoMetadata: onAddSingleConvoMetadata,
      updateSingleConvoMetadataWithFetched: onUpdateSingleConvoMetadataWithFetched, convoToNavTo: convoToNavTo,
      approveOrDenySingleConvo: onApproveOrDenySingleConvo, clearConvoToNavTo: clearConvoToNavTo, myPhoneNumber: userPhoneNumber
    }}>
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen name={"Call"} component={CallScreen} initialParams={{ userPhoneNumber: userPhoneNumber, userFirstName: userFirstName, userLastName: userLastName}} />
          <Tab.Screen name={"Convos"} component={ConvosScreen} initialParams={{ convosMetadata: convosMetadata, userPhoneNumber: userPhoneNumber }} />
          <Tab.Screen name={"Logout"} component={LogoutScreen} initialParams={{logout: onLoggedOut}} />
        </Tab.Navigator>
      </NavigationContainer>
    </ConvosContext.Provider>
  );
}