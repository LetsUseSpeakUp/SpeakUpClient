import React, { useEffect } from 'react'
import AllConvos from './AllConvos'
import {createStackNavigator} from '@react-navigation/stack'
import SingleConvoDetails from './SingleConvoDetails';
import ConvosContext from '../ConvosData/ConvosContext'
import ConvoPlayer from './ConvoPlayer'


export default function ConvosScreen({route, navigation}: any) {  
  const Stack = createStackNavigator();
  const convosContext = React.useContext(ConvosContext);


  useEffect(()=>{
    const convoToNavTo = convosContext.convoToNavTo;
    if(convoToNavTo.length > 0){
      console.log("ConvosScreen: convoToNavTo. Metadata: ", convosContext.allConvosMetadata);
      convosContext.clearConvoToNavTo();      
      navigation.navigate('Convos', {screen: 'Convo Details', params:{convoId: convoToNavTo}}); 
    }
  }, [convosContext.convoToNavTo])

  return(
      <Stack.Navigator>
        <Stack.Screen name="All Convos" component={AllConvos}/>
        <Stack.Screen name="Convo Details" component={SingleConvoDetails}/>
        <Stack.Screen name="Convo Player" component={ConvoPlayer}/>
      </Stack.Navigator>    
  )
}