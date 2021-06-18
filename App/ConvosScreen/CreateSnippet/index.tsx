import React from 'react';
import { Text, View, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator, Share } from 'react-native'
import { SpeakupTextInput, Colors, Constants, PrimaryButton } from '../../Graphics'
import Icon from 'react-native-vector-icons/MaterialIcons'
import {generateSnippetLink} from '../../ConvosData/ConvosManager'

export default function CreateSnippet({ route, navigation }: any) {
    const userFirstName = route.params.userFirstName;
    const [snippetTitle, setSnippetTitle] = React.useState('Snippet from ' + userFirstName);
    const [isLoading, setIsLoading] = React.useState(false); //TODO
    const [snippetURL, setSnippetURL] = React.useState('');

    const convoId = route.params.convoId;
    const snippetStart = route.params.snippetStart;
    const snippetEnd = route.params.snippetEnd;

    const onSharePressed = async () => {
        try{
            let messageToShare = snippetURL;
            if(snippetURL.length === 0){
                setIsLoading(true);
                const createdSnippetLink: string = await generateSnippetLink(convoId, snippetStart, snippetEnd, snippetTitle);
                setIsLoading(false);
                messageToShare = createdSnippetLink;
                setSnippetURL(createdSnippetLink);
            }
            const shareResult = await Share.share({message: messageToShare}); //TODO
            console.log("CreateSnippet::onSharePressed. ShareResult: ", shareResult);
        }
        catch(error){
            console.log("ERROR -- CreateSnippet::onSharePressed: ", error);
        }
    }

    const onClosePressed = () => {
        navigation.navigate('Convo Player', {audioFilePath: route.params.audioFilePath, convoId: route.params.convoId, 
            userFirstName: route.params.userFirstName});
    }

    return (
        <SafeAreaView style={styles.flexContainer}>
            <View style={styles.closeIconContainer}>
                <TouchableOpacity onPress={onClosePressed}>
                    <Icon name='close' size={Constants.closeIconSize} />
                </TouchableOpacity>
            </View>
            <View style={styles.contentContainer}>
                <Text style={{color: Colors.headingTextColor, fontSize: Constants.majorTitleFontSize, fontFamily: Constants.fontFamily}}>
                    Give your Snippet a name.
                </Text>
                <View style={styles.textInputContainer}>
                    <SpeakupTextInput defaultValue={'Snippet from ' + userFirstName} onChangeText={(newText) => setSnippetTitle(newText)} autoFocus={true} />
                </View>                
                <View style={styles.shareButtonContainer}>
                    <PrimaryButton text={'Share'} onPress={onSharePressed} disabled={snippetTitle.length === 0}/>
                </View>
                <ActivityIndicator animating={isLoading}/>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    flexContainer: {
        display: 'flex',
        flex: 1,
        backgroundColor: Colors.backgroundColor,
        paddingTop: Constants.paddingTop
    },
    closeIconContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingRight: Constants.paddingTop,
        flex: .1        
    },
    textInputContainer: {
        width: '80%'
    },
    shareButtonContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    contentContainer: {
        display: 'flex',        
        justifyContent: 'space-between',
        alignItems: 'center',        
        flex: .4,    
    }
})