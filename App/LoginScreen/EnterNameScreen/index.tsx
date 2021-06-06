import React from 'react'
import {View, TextInput, Text, Button, StyleSheet} from 'react-native'

export default function EnterNameScreen({route, navigation}: any){
    const [tempFirstName, setTempFirstName] = React.useState('')
    const [tempLastName, setTempLastName] = React.useState('');

    const confirmPressed = ()=>{
        route.params.setName(tempFirstName, tempLastName);
        navigation.navigate('Phone Number');
    }

    return (
        <View style={styles.container}>
            <Text>Please enter your name</Text>
            <Text>First Name</Text>
            <TextInput placeholder="First name" onChangeText={text => setTempFirstName(text)}
                autoFocus={true} style={{ borderWidth: 1, height: 50, width: 200 }} maxLength={15}></TextInput>
            <Text>Last Name</Text>
            <TextInput placeholder="Last name" onChangeText={text => setTempLastName(text)}
                style={{ borderWidth: 1, height: 50, width: 200 }} maxLength={15}></TextInput>
            <Button title={"Confirm"} onPress={() => {confirmPressed()}}></Button>
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