import React, { useEffect, useState, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ConvosScreen from './ConvosScreen'
import ContactsScreen from './ContactsScreen'
import CallScreen from './CallScreen'
import LoginScreen from './LoginScreen'
import { getAllConvosMetadataForUser, ConvoMetaData } from './CallScreen/Logic/ConvosManager'


const Tab = createBottomTabNavigator();

export default function App() {
  const [userPhoneNumber, setUserPhoneNumber] = useState('')
  const [convosMetadata, setConvosMetadata] = useState([] as Array<ConvoMetaData>);
  const convoToNavTo = useRef('');
  const isLogged = userPhoneNumber.length > 0;


  useEffect(() => {
    if (userPhoneNumber.length > 0) {
      getAllConvosMetadataForUser(userPhoneNumber).then((metadata) => {
        setConvosMetadata(metadata);
      })
    }
  }, [userPhoneNumber])

  useEffect(() => {
    console.log("App. Convos metadata updated: ", convosMetadata);

    if (convoToNavTo.current.length > 0) {
      console.log("App:: Nav to latest convo. Id: ", convoToNavTo.current);
      convoToNavTo.current = '';
      //TODO: nav to it
    }
  }, [convosMetadata])

  const onNavToLatestConvo = (idToNavTo: string) => {
    convoToNavTo.current = idToNavTo;
    getAllConvosMetadataForUser(userPhoneNumber).then((metadata) => {
      setConvosMetadata(metadata);
    })
  }

  if (!isLogged) {
    return <LoginScreen onSetPhoneNumber={(phoneNumber: string) => setUserPhoneNumber(phoneNumber)} />
  }


  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name={"Call"} component={CallScreen} initialParams={{ userPhoneNumber: userPhoneNumber, onNavToLatestConvo: onNavToLatestConvo }} />
        <Tab.Screen name={"Contacts"} component={ContactsScreen} />
        <Tab.Screen name={"Convos"} component={ConvosScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}