import React from 'react'
import { View, StyleSheet, Button, Text } from 'react-native';

export default function RingingScreen(props: any){
    return(
        <View style={styles.container}>                        
            <Text>Ringing... Call Received from {props.callerPhoneNumber}</Text>            
            <Button title={"Accept"} onPress={()=>{props.onRingAnswered(true)}}></Button>               
            <Button title={"Decline"} onPress={()=>{props.onRingAnswered(false)}}></Button>               
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