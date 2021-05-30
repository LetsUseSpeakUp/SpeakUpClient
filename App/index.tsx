import React, { useEffect, useState, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ConvosScreen from './ConvosScreen'
import ContactsScreen from './ContactsScreen'
import CallScreen from './CallScreen'
import LoginScreen from './LoginScreen'
import { fetchLatestConvosMetadataForUser, ConvoMetadata } from './ConvosData/ConvosManager'
import ConvosContext from './ConvosData/ConvosContext'

const Tab = createBottomTabNavigator();

export default function App() {
  const [userPhoneNumber, setUserPhoneNumber] = useState('')
  const [convosMetadata, setConvosMetadata] = useState([] as Array<ConvoMetadata>);
  const [convoToNavTo, setConvoToNavTo] = useState('');
  const convoToNavToBuffer = useRef('');
  const isLogged = userPhoneNumber.length > 0;

  useEffect(() => {
    if (userPhoneNumber.length > 0) {
      if(convosMetadata.length > 0){
        console.log("ERROR -- App. Phone number was changed after fetching convosMetadata");
      }
      fetchLatestConvosMetadataForUser(userPhoneNumber).then((metadata: any) => {
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
    convoToNavToBuffer.current = singleConvoMetadata.convoId;
    const newConvosMetadata = convosMetadata.concat(singleConvoMetadata);
    setConvosMetadata(newConvosMetadata);
  }

  const onRequestFetchSingleConvoStatus = (convoId: string) => {
    //TODO
  }

  const onApproveSingleConvo = (myPhoneNumber: string, convoId: string) => {
    //TODO: call ConvosManager
    //TODO: Update convosMetadata
  }

  if (!isLogged) {
    return <LoginScreen onSetPhoneNumber={(phoneNumber: string) => setUserPhoneNumber(phoneNumber)} />
  }


  return (
    <ConvosContext.Provider value={{
      allConvosMetadata: convosMetadata, addSingleConvoMetadata: onAddSingleConvoMetadata,
      requestFetchSingleConvoStatus: onRequestFetchSingleConvoStatus, convoToNavTo: convoToNavTo, approveSingleConvo: onApproveSingleConvo
    }}>
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen name={"Call"} component={CallScreen} initialParams={{ userPhoneNumber: userPhoneNumber }} />
          <Tab.Screen name={"Contacts"} component={ContactsScreen} />
          <Tab.Screen name={"Convos"} component={ConvosScreen} initialParams={{ convosMetadata: convosMetadata, userPhoneNumber: userPhoneNumber }} />
        </Tab.Navigator>
      </NavigationContainer>
    </ConvosContext.Provider>
  );
}