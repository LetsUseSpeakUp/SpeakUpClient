import React from 'react'
import {View, TextInput, Text, Button, StyleSheet, SafeAreaView} from 'react-native'
import { Constants, Colors } from '../../Graphics';

export default function EnterNameScreen({route, navigation}: any){
    const [tempFirstName, setTempFirstName] = React.useState('')
    const [tempLastName, setTempLastName] = React.useState('');

    const confirmPressed = ()=>{
        route.params.setName(tempFirstName, tempLastName);
        navigation.navigate('Phone Number');
    }

    return (
        <SafeAreaView style={styles.flexContainer}>
            <View style={styles.titleTextContainer}>
                <Text style={{fontFamily: Constants.fontFamily, fontSize: Constants.majorTitleFontSize,
                    color: Colors.headingTextColor}}>What is your name?</Text>
            </View>            
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    flexContainer: {
        display: 'flex',
        backgroundColor: Colors.backgroundColor,
        flex: 1
    },
    titleTextContainer: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        paddingTop: Constants.paddingTop
    }
})