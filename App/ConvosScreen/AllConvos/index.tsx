import React from 'react';
import { ConvoMetadata } from '../../ConvosData/ConvosManager'
import * as ConvosManager from '../../ConvosData/ConvosManager'
import { FlatList, StyleSheet, View, Text, TouchableOpacity, ListRenderItem, Image } from 'react-native';
import ConvosContext from '../../ConvosData/ConvosContext'
import { Constants, Colors } from '../../Graphics';

export default function AllConvos({ route, navigation }: any) {
    const convosContext = React.useContext(ConvosContext);
    const convosMetadata = convosContext.allConvosMetadata;
    convosMetadata.sort((a, b) => b.timestampStarted - a.timestampStarted);

    const onConvoPressed = (convoId: string) => {
        navigation.navigate('Convo Details', { convoId: convoId })
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

const ConvoListItem = ({ metadata, onPress }: { metadata: ConvoMetadata, onPress: () => void }) => {
    const amIInitiator = (metadata.initiatorId != null && metadata.receiverId != null) ? (React.useContext(ConvosContext).myPhoneNumber === metadata.initiatorId) :
        metadata.initiatorFirstName === undefined;
    const partnerFirstName = amIInitiator ? metadata.receiverFirstName : metadata.initiatorFirstName;
    const partnerLastName = amIInitiator ? metadata.receiverLastName : metadata.initiatorLastName;

    return (
        <TouchableOpacity onPress={onPress}>
            <View style={styles.singleConvoContainer}>
                <View style={styles.contactNameDateContainer}>
                    <Text style={styles.convoNameText}>
                        {partnerFirstName + " " + partnerLastName}
                    </Text>
                    <Text style={styles.convoDateText}>
                        {ConvosManager.getFormattedDateFromTimestamp(metadata.timestampStarted)}
                    </Text>
                </View>
                <View style={styles.nextIconImageContainer}>
                    {/* <Image source={require('../../Graphics/streamline-icon-interface-arrows-button-left_blue@1000x1000.png')} resizeMode='contain' style={{height: '50%', width: '50%'}}/> */}
                </View>                
            </View>
        </TouchableOpacity>
    );

}

const styles = StyleSheet.create({
    convoNameText: {
        fontSize: Constants.minorTitleFontSize,
        fontFamily: Constants.fontFamily,
        color: Colors.headingTextColor
    },
    convoDateText: {
        fontSize: Constants.detailsFontSize,
        fontFamily: Constants.fontFamily,
        color: Colors.unemphasizedTextColor
    },
    container: {
        flex: 1,
    },
    singleConvoContainer: {
        borderBottomColor: Colors.mediumTint,
        borderBottomWidth: 1,
        paddingVertical: Constants.listViewPaddingVertical,
        marginHorizontal: Constants.paddingHorizontal,
        paddingHorizontal: Constants.paddingHorizontal / 2,
        display: 'flex',
        flexDirection: 'row',
        // height: 100,
        // borderWidth: 1
        // alignContent: 'space-between'
    },
    contactNameDateContainer: {
        display: 'flex',
        // borderWidth: 1,
        flex: 0,
        justifyContent: 'center'

    },
    nextIconImageContainer: {
        // borderWidth: 1,        
        flex: 1,
        display: 'flex',  
        flexDirection: 'row'   ,   
        justifyContent: 'flex-end',
        alignItems: 'center'
        // alignItems: 'flex-end',
        // height: '100%'
    }
});