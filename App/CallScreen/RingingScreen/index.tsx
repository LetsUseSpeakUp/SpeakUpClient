import React from 'react'
import { View, StyleSheet, Button, Text, SafeAreaView } from 'react-native';
import {Colors, Constants, CallScreenButton} from '../../Graphics'

export default function RingingScreen({partnerFirstName, partnerLastName, onHangup, onAcceptCall}: 
    {partnerFirstName: string, partnerLastName: string, onHangup: ()=>void, onAcceptCall?: ()=>void}){
    return(
        <SafeAreaView style={styles.flexContainer}>
            <View style={styles.titleContainer}>
                <Text style={styles.partnerNameText}>{partnerFirstName + ' ' + partnerLastName}</Text>    
                <Text style={styles.ringingText}>Ringing...</Text>
            </View>            
            <View style={styles.buttonContainer}>
                {onAcceptCall && <HangupAndAcceptButton onHangup={onHangup} onAccept={onAcceptCall}/>}
                {!onAcceptCall && <HangupButton onHangup={onHangup}/> }
            </View>            
        </SafeAreaView>
        
    )
}

function HangupButton({onHangup}: {onHangup: ()=>void}){
    return <CallScreenButton text='call-end' onPress={onHangup} color={Colors.callHangup}/>
}

function HangupAndAcceptButton({onHangup, onAccept}: {onHangup: ()=>void, onAccept: ()=>void}){
    return <Text>Hangup. Accept</Text>; //TODO
}

const styles = StyleSheet.create({
    flexContainer:{
        flex: 1, 
        // justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: Colors.backgroundColor
    },
    titleContainer: {
        flex: .5,
        alignItems: 'center',
        display: 'flex'
    },
    partnerNameText: {
        fontFamily: Constants.fontFamily,
        fontSize: Constants.majorTitleFontSize,
        color: Colors.headingTextColor,
        paddingTop: Constants.paddingTop
    },
    ringingText: {
        fontFamily: Constants.fontFamily,
        fontSize: Constants.minorTitleFontSize,
        color: Colors.emphasizedTextColor,
        paddingTop: Constants.propertySpacing
    },
    buttonContainer: {
        display: 'flex',
        flexDirection: 'row',
        // justifyContent: 'space-between',        
    }
})