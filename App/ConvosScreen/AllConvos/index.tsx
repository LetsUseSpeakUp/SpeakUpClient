import React from 'react';
import { ConvoMetadata } from '../../ConvosData/ConvosManager'
import * as ConvosManager from '../../ConvosData/ConvosManager'
import { FlatList, StyleSheet, View, Text, TouchableOpacity, ListRenderItem, Image, Animated } from 'react-native';
import ConvosContext from '../../ConvosData/ConvosContext'
import { Constants, Colors } from '../../Graphics';
import Icon from 'react-native-vector-icons/MaterialIcons'

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
    if(convosMetadata.length === 0){
        return <EmptyConvoList/>
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

function EmptyConvoList(){
    const blurbFadeInAnimation = React.useRef(new Animated.Value(0)).current
    React.useEffect(() => {
        Animated.timing(
            blurbFadeInAnimation, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true
        }).start();
    }, [blurbFadeInAnimation])
    return (
        <View style={{ ...styles.emptyConvosFlexContainer}}>
                <Animated.View style={{ ...styles.emptyConvosImageHolder, opacity: blurbFadeInAnimation }}>
                    <Image source={require('../../Graphics/streamline-icon-love-and-peace@1000x1000.png')}
                        resizeMode='contain' style={{ height: '70%', marginTop: '20%' }} />
                </Animated.View>
                <View style={{ borderBottomWidth: 2, width: '60%' }} />
                <Animated.View style={{
                    display: 'flex', flex: 1, width: '100%',
                    paddingHorizontal: Constants.paddingHorizontal, opacity: blurbFadeInAnimation
                }}>
                    <Text style={{ fontFamily: Constants.fontFamily, fontSize: Constants.blurbFontSize, fontWeight: 'bold', marginTop: 20 }}>
                        Use the Call tab to start your first Convo.
                    </Text>
                </Animated.View>
            </View>
    )
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
                    <View style={styles.contactNameContainer}>
                        <Text style={styles.convoNameText}>
                            {partnerFirstName + " "}
                        </Text>
                        <Text style={{...styles.convoNameText}}>
                            {partnerLastName}
                        </Text>
                    </View>                    
                    <Text style={styles.convoDateText}>
                        {ConvosManager.getFormattedDateFromTimestamp(metadata.timestampStarted)}
                    </Text>
                </View>
                <View style={styles.nextIconImageContainer}>
                    <Icon name="chevron-right" size={Constants.chevronFontSize} color={Colors.unemphasizedTextColor}/>
                </View>                
            </View>
        </TouchableOpacity>
    );

}

const styles = StyleSheet.create({
    convoNameText: {
        fontSize: Constants.minorTitleFontSize,
        fontFamily: Constants.listViewFontFamily,
        color: Colors.headingTextColor,
    },
    convoDateText: {
        fontSize: Constants.detailsFontSize,
        fontFamily: Constants.listViewFontFamily,
        color: Colors.unemphasizedTextColor
    },
    container: {
        flex: 1,
        backgroundColor: Colors.backgroundColor
    },
    singleConvoContainer: {
        borderBottomColor: Colors.mediumTint,
        borderBottomWidth: 1,
        paddingVertical: Constants.listViewPaddingVertical,
        marginHorizontal: Constants.paddingHorizontal,
        paddingHorizontal: Constants.paddingHorizontal / 2,
        display: 'flex',
        flexDirection: 'row',        
    },
    contactNameDateContainer: {
        display: 'flex',        
        flex: 0,
        justifyContent: 'center'
    },
    contactNameContainer: {
        display: 'flex',
        flexDirection: 'row'
    },
    nextIconImageContainer: {
        flex: 1,
        display: 'flex',  
        flexDirection: 'row'   ,   
        justifyContent: 'flex-end',
        alignItems: 'center'        
    },
    emptyConvosFlexContainer: {
        display: 'flex',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        backgroundColor: Colors.backgroundColor
    },
    emptyConvosImageHolder: {
        display: 'flex',
        flex: 1.5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    emptyConvosTextHolder: {
        display: 'flex',
        flex: 1,
        width: '100%',
        paddingHorizontal: Constants.paddingHorizontal
    },
});