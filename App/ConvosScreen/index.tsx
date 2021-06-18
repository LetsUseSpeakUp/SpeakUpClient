import React, { useEffect } from 'react'
import AllConvos from './AllConvos'
import {createStackNavigator} from '@react-navigation/stack'
import SingleConvoDetails from './SingleConvoDetails';
import ConvosContext from '../ConvosData/ConvosContext'
import ConvoPlayer from './ConvoPlayer'
import CreateSnippet from './CreateSnippet'
import {Colors} from '../Graphics'

const MainStack = createStackNavigator();
const RootStack = createStackNavigator();
export default function ConvosScreen({route, navigation}: any) {  
  const convosContext = React.useContext(ConvosContext);


  useEffect(()=>{
    const convoToNavTo = convosContext.convoToNavTo;
    if(convoToNavTo.length > 0){
      convosContext.clearConvoToNavTo();      
      navigation.navigate('Convos', {screen: 'Convo Details', params:{convoId: convoToNavTo}}); 
    }
  }, [convosContext.convoToNavTo])

  return(
    <RootStack.Navigator mode='modal'>
        <RootStack.Screen name='Main' component={MainStackScreen} options={{headerShown: false}}/>
        <RootStack.Screen name='CreateSnippetModal' component={CreateSnippet} options={{headerShown: false}}/>
      </RootStack.Navigator>
  )
}

function MainStackScreen(){
  return(
    <MainStack.Navigator>
          <MainStack.Screen name="All Convos" component={AllConvos} options={{...stackScreenOptions}}/>
          <MainStack.Screen name="Convo Details" component={SingleConvoDetails} options={{...stackScreenOptions}}/>
          <MainStack.Screen name="Convo Player" component={ConvoPlayer} options={{...stackScreenOptions}}/>
        </MainStack.Navigator>    
  )
}

const stackScreenOptions = {headerStyle: {backgroundColor: Colors.tabBackgroundColor}};