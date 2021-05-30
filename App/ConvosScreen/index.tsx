import React from 'react'
import AllConvos from './AllConvos'
import {createStackNavigator} from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native';
import SingleConvoDetails from './SingleConvoDetails';

export default function ConvosScreen({route, navigation}: any) {  
  const Stack = createStackNavigator();

  return(
      <Stack.Navigator initialRouteName="AllConvos">
        <Stack.Screen name="All Convos" component={AllConvos}/>
        <Stack.Screen name="Convo Details" component={SingleConvoDetails}/>
      </Stack.Navigator>    
  )
}