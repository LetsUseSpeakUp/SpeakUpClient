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
                {onAcceptCall && <HangupAndAcceptButton onHangup={onHangup} onAccept={onAcceptCall}/>}
                {!onAcceptCall && <HangupButton onHangup={onHangup}/> }            
        </SafeAreaView>
        
    )
}

function HangupButton({onHangup}: {onHangup: ()=>void}){
    return(
        <View style={{paddingBottom: Constants.paddingBottom}}>
            <CallScreenButton text='call-end' onPress={onHangup} color={Colors.callHangup}/>
        </View>
    )    
}

function HangupAndAcceptButton({onHangup, onAccept}: {onHangup: ()=>void, onAccept: ()=>void}){
    return(
        <View style={styles.buttonContainer}>            
            <CallScreenButton text='call-end' onPress={onHangup} color={Colors.callHangup}/>
            <CallScreenButton text='call' onPress={onAccept} color={Colors.callAnswer}/>
        </View>
    )
}

const styles = StyleSheet.create({
    flexContainer:{
        flex: 1, 
        justifyContent: 'space-between',
        // justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: Colors.backgroundColor
    },
    titleContainer: {        
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
        justifyContent: 'space-around',        
        width: '100%',
        paddingBottom: Constants.paddingBottom
    }
})