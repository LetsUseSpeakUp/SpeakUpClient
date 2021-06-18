import React from 'react';
import { Text, View, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native'
import { SpeakupTextInput, Colors, Constants, PrimaryButton } from '../../Graphics'
import Icon from 'react-native-vector-icons/MaterialIcons'

export default function CreateSnippet({ route, navigation }: any) {
    const [snippetTitle, setSnippetTitle] = React.useState('Snippet from TODO');

    const onCreatePressed = () => {
        //TODO
    }

    const onClosePressed = () => {
        //TODO
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
                    <SpeakupTextInput defaultValue={'Snippet from TODO'} onChangeText={(newText) => setSnippetTitle(newText)} autoFocus={true} />
                </View>                
                <View style={styles.createButtonContainer}>
                    <PrimaryButton text={'Create'} onPress={onCreatePressed} disabled={snippetTitle.length === 0}/>
                </View>
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
    createButtonContainer: {
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