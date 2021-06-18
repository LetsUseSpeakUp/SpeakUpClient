import React from 'react';
import {Text, View, StyleSheet, SafeAreaView} from 'react-native'
import {SpeakupTextInput, Colors, Constants, PrimaryButton} from '../../Graphics'
import Icon from 'react-native-vector-icons/MaterialIcons'

export default function CreateSnippet({route, navigation}: any){
    const [snippetTitle, setSnippetTitle] = React.useState('Snippet from TODO');

    const onCreatePressed = ()=>{
        //TODO
    }

    return(
    <SafeAreaView style={styles.flexContainer}>
        <View style={styles.closeIconContainer}>
            <Icon name='phone' size={Constants.playPauseIconSize}/>
        </View>        
        <Text>Give your Snippet a name.</Text>
        <SpeakupTextInput defaultValue={'Snippet from TODO'} onChangeText={(newText)=>setSnippetTitle(newText)} autoFocus={true}/>
        <View style={styles.createButtonContainer}>
            <PrimaryButton text={'Create'} onPress={onCreatePressed}/>
        </View>        
    </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    flexContainer: {
        display: 'flex',
        flex: 1,
        backgroundColor: Colors.backgroundColor,
        paddingTop: Constants.paddingTop,
        paddingHorizontal: Constants.paddingHorizontal
    },
    closeIconContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    createButtonContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
})