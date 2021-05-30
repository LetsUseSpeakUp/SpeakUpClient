import React from 'react'
import {Text, View} from 'react-native';
import AllConvos from './AllConvos'
import {ConvoMetadata} from '../ConvosData/ConvosManager'
import ConvosContext from '../ConvosData/ConvosContext' 

export default function ConvosScreen({route, navigation}: any) {  
  const convosContext = React.useContext(ConvosContext);
  //TODO: Make this a stack
  return (<AllConvos convosMetadata={convosContext.allConvosMetadata}/>);
  
}