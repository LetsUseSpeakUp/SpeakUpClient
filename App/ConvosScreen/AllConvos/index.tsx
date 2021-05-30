import React from 'react';
import { ConvoMetadata } from '../../ConvosData/ConvosManager'
import { FlatList, StyleSheet, View, Text, TouchableOpacity, ListRenderItem } from 'react-native';


const styles = StyleSheet.create({
    item: {
        paddingHorizontal: 8,
        paddingVertical: 16,
        marginHorizontal: 20,
        borderBottomColor: '#CCCCCC',
        borderBottomWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemText: {
        fontSize: 16,
    },
    message: {
        paddingHorizontal: 8,
        paddingVertical: 100,
        borderBottomColor: '#CCCCCC',
        borderBottomWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        paddingTop: 22,
    }
});

const ConvoListItem = ({ metadata, onPress }: { metadata: ConvoMetadata, onPress: any }) => { //TODO: figure out typescript of onpress
    const partnerFirstName = metadata.initiatorFirstName ? metadata.initiatorFirstName : metadata.receiverFirstName;
    const partnerLastName = metadata.initiatorLastName ? metadata.initiatorLastName : metadata.receiverLastName;

    return (        
        <TouchableOpacity onPress={onPress}>
            <View style={styles.item}>
                <Text style={styles.itemText}>
                    {metadata.convoId + " with: " + partnerFirstName + " " + partnerLastName}
                </Text>
            </View>
        </TouchableOpacity>
    );

}

export default function AllConvos({ convosMetadata }: { convosMetadata: ConvoMetadata[] }) {
    const onConvoPressed = (convoId: string) => {
        //TODO
        console.log("AllConvos. Convo pressed: ", convoId);
    }

    const RenderItem: ListRenderItem<ConvoMetadata> = ({ item }: { item: ConvoMetadata }) => {
        return (
            <ConvoListItem
                metadata={item}
                onPress={() => { onConvoPressed(item.convoId) }}
            />
        )
    }

    return (
        <View style={styles.container}>
            <FlatList<ConvoMetadata>
                data={convosMetadata}
                renderItem={RenderItem}
                keyExtractor={(metadata => metadata.convoId)}
                style={styles.container}
            />
        </View>
    );
}