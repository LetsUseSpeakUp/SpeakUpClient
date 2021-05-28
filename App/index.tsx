import React, { useState } from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import ConvosScreen from './ConvosScreen'
import ContactsScreen from './ContactsScreen'
import CallScreen from './CallScreen'
import LoginScreen from './LoginScreen'


const Tab = createBottomTabNavigator();


export default function App() {
  const [userPhoneNumber, setUserPhoneNumber] = useState('')
  const isLogged = userPhoneNumber.length > 0;

  if(!isLogged){
    return <LoginScreen onSetPhoneNumber={(phoneNumber: string)=>setUserPhoneNumber(phoneNumber)}/>
  }

  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name={"Call"} component={CallScreen} initialParams={{userPhoneNumber: userPhoneNumber}}/>
        <Tab.Screen name={"Contacts"} component={ContactsScreen}/>
        <Tab.Screen name={"Convos"} component={ConvosScreen}/>
      </Tab.Navigator>
    </NavigationContainer>
  );
}