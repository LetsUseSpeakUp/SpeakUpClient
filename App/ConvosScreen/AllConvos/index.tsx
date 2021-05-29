import React from 'react';
import {ConvoMetadata} from '../../CallScreen/Logic/ConvosManager'
import { FlatList, StyleSheet, Text, Button, ListRenderItem} from 'react-native';

const styles = StyleSheet.create({
  container: {
   flex: 1,
   paddingTop: 22
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
});

const ConvoListItem = ({metadata, onPress} : {metadata: ConvoMetadata, onPress: any})=>{ //TODO: figure out typescript of onpress
    return(
        <Button onPress={onPress} title={metadata.convoId}></Button> //TODO
    );
}

export default function AllConvos({convosMetadata} : {convosMetadata: ConvoMetadata[]}){
    const onConvoPressed = (convoId: string)=>{
        //TODO
        console.log("AllConvos. Convo pressed: ", convoId);
    }
    
    const RenderItem: ListRenderItem<ConvoMetadata>  = ({item}: {item: ConvoMetadata})=>{
        return (
            <ConvoListItem
                metadata={item}
                onPress={()=>{onConvoPressed(item.convoId)}}
            />
        )
    }

    return (
        <FlatList<ConvoMetadata>
            data={convosMetadata}
            renderItem={RenderItem}
            keyExtractor={(metadata=>metadata.convoId)}
        />
    );
}