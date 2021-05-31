import React from 'react'
import AllConvos from './AllConvos'
import {createStackNavigator, HeaderBackButton} from '@react-navigation/stack'
import SingleConvoDetails from './SingleConvoDetails';

export default function ConvosScreen({route, navigation}: any) {  
  const Stack = createStackNavigator();

  return(
      <Stack.Navigator>
        <Stack.Screen name="All Convos" component={AllConvos}/>
        <Stack.Screen name="Convo Details" component={SingleConvoDetails}/>
      </Stack.Navigator>    
  )
}