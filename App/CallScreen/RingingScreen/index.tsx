import React from 'react'
import { View, StyleSheet, Button, Text, SafeAreaView } from 'react-native';

export default function RingingScreen({partnerFirstName, partnerLastName, onHangup, onAcceptCall}: 
    {partnerFirstName: string, partnerLastName: string, onHangup: ()=>void, onAcceptCall?: ()=>void}){
    return(
        <SafeAreaView>
            <Text>{partnerFirstName + ' ' + partnerLastName}</Text>    
            <Text>Ringing...</Text>
            <View>
                {onAcceptCall && <HangupAndAcceptButton onHangup={onHangup} onAccept={onAcceptCall}/>}
                {!onAcceptCall && <HangupButton onHangup={onHangup}/> }
            </View>            
        </SafeAreaView>
        
    )
}

function HangupButton({onHangup}: {onHangup: ()=>void}){
    return <Text>Hangup</Text>; //TODO
}

function HangupAndAcceptButton({onHangup, onAccept}: {onHangup: ()=>void, onAccept: ()=>void}){
    return <Text>Hangup. Accept</Text>; //TODO
}

const styles = StyleSheet.create({
    container:{
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center'
    }
})