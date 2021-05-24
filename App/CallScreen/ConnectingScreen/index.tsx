import React from 'react'
import { View, StyleSheet, Button, Text } from 'react-native';


export default function ConnectingScreen(props: any){
    return(
        <View style={styles.container}>                        
            <Text>Connecting to {props.partnerPhoneNumber}...</Text>                         
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