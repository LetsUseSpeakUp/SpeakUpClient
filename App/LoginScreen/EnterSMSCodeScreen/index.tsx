import React from 'react'
import {View, TextInput, Text, Button, StyleSheet} from 'react-native'

export default function EnterSMSCodeScreen({route}: any){
    const [tempSMSCode, setTempSMSCode] = React.useState('')

    return (
        <View style={styles.container}>
            <Text>Please enter your verification code</Text>
            <TextInput placeholder="Verification Code" onChangeText={text => setTempSMSCode(text)}
                autoFocus={true} style={{ borderWidth: 1, height: 50, width: 200 }} maxLength={15}></TextInput>
            <Button title={"Confirm"} onPress={() => {route.params.setSMSCode(tempSMSCode)}}></Button>
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