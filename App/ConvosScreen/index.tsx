import React from 'react'
import {Text, View} from 'react-native';
import AllConvos from './AllConvos'
import {ConvoMetadata} from '../CallScreen/Logic/ConvosManager'

export default function ConvosScreen({convosMetadata}: {convosMetadata: ConvoMetadata[]}) {
  
  return <AllConvos convosMetadata={convosMetadata}/>  
  
  return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Convos!</Text>
      </View>
    );
  }