import React from 'react'
import { View, StyleSheet, Button, Text } from 'react-native';
import ManualAudioRecorder from './ManualAudioRecorder'


export default function OnCallScreen(props: any){
    const _testingManualAudio = true;
    
    return(
        <View style={styles.container}>      
            {_testingManualAudio && <ManualAudioRecorder/>} 
            <Text>On Call with {props.partnerPhoneNumber}</Text>                         
            <Button title={"Hang Up"} onPress={props.onHangUp}/>            
        </View>
        )
}

const styles = StyleSheet.create({
    container:{
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center'
    }
})