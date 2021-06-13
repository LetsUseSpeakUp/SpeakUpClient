import React, { useState } from 'react'
import { ScrollView, View, StyleSheet, Button, Text, TextInput } from 'react-native';

export default function DialPadScreen(props: any) {
    const [receiverPhoneNumber, setReceiverPhoneNumber] = useState('')

    return (
        <ScrollView scrollEnabled={false}>
            <View style={styles.container}>
                {/* <Text>Your phone number: {props.userPhoneNumber}</Text> */}
                <Text>Enter number to call</Text>
                <TextInput placeholder="Number to call" onChangeText={text => setReceiverPhoneNumber('+1' + text)}
                    style={{ borderWidth: 1, height: 50, width: 200 }} keyboardType='phone-pad'></TextInput>
                <Button title={"Call"} onPress={() => { props.onCallPlaced(receiverPhoneNumber) }}></Button>
            </View>
        </ScrollView>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 300
    }
})