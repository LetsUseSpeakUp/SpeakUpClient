import react from 'react';
import {ConvoMetadata} from '../../CallScreen/Logic/ConvosManager'
import { FlatList, StyleSheet, Text, View, ListRenderItem} from 'react-native';

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

const ConvoListItem: ListRenderItem<ConvoMetadata> = ({item} : {item: ConvoMetadata})=>{
    return(
        //TODO
    );
}

export default function AllConvos({convosMetadata} : {convosMetadata: ConvoMetadata[]}){
    const onConvoPressed = (convoId: string)=>{
        //TODO
        console.log("AllConvos. Convo pressed: ", convoId);
    }
    
    const RenderItem = ({metadata}:any)=>{
        return (
            //TODO
        )
    }

    return (
        <FlatList<ConvoMetadata>
            data={convosMetadata}
            renderItem={ConvoListItem}
            keyExtractor={(metadata=>metadata.convoId)}
        />
    );
}