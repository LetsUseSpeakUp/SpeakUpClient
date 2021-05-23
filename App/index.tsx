import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import ConvosScreen from './ConvosScreen'
import ContactsScreen from './ContactsScreen'


const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name={"Contacts"} component={ContactsScreen}/>
        <Tab.Screen name={"Convos"} component={ConvosScreen}/>
      </Tab.Navigator>
    </NavigationContainer>
  );
}