import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';


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


function ContactsScreen() { //TODO
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Contacts!</Text>
    </View>
  );
}

function ConvosScreen() { //TODO
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Convos!</Text>
    </View>
  );
}