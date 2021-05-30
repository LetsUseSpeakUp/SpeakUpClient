import React from 'react'
import {Text, View} from 'react-native';
import AllConvos from './AllConvos'
import {ConvoMetadata} from '../ConvosData/ConvosManager'
import ConvosContext from '../ConvosData/ConvosContext' 

export default function ConvosScreen({route, navigation}: any) {  
  const convosContext = React.useContext(ConvosContext);
  return (<AllConvos convosMetadata={convosContext.allConvosMetadata}/>);
  
  return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Convos!</Text>
      </View>
    );
  }