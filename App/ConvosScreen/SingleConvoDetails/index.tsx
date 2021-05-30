import React from 'react'
import { View, Text} from 'react-native'
import { ConvoMetadata } from '../../ConvosData/ConvosManager'

export default function SingleConvoDetails({route, navigation}: any){
    
    return(
        <View>
            <Text>Placeholder text. ConvoId: {route.params.convoId}</Text>
        </View>
    )
}