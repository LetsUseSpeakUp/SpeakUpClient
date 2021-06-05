import React from 'react'
import {View, TextInput, Text, Button, StyleSheet} from 'react-native'

export default function EnterPhoneNumberScreen(props: any){
    const [tempPhoneNumber, setTempPhoneNumber] = React.useState('')

    return (
        <View style={styles.container}>
            <Text>Please enter your phone number</Text>
            <TextInput placeholder="My Phone Number" onChangeText={text => setTempPhoneNumber(text)}
                autoFocus={true} style={{ borderWidth: 1, height: 50, width: 200 }} maxLength={15}></TextInput>
            <Button title={"Confirm"} onPress={() => { props.onSetPhoneNumber(tempPhoneNumber) }}></Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})