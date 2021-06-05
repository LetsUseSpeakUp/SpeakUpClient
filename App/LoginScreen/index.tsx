import React, { useState } from 'react'
import { View, StyleSheet, Button, Text, TextInput } from 'react-native';
import Auth0 from 'react-native-auth0'
const auth0 = new Auth0({ domain: 'letsusespeakup.us.auth0.com', clientId: 'SIaSdbWJmdIj0MnR5hHFSaGHKlVfgzCT' });

export default function LoginScreen(props: any) {
    const [accessToken, setAccessToken] = useState(null);

    const login = () => {
        auth0.webAuth.authorize({}).then((credentials: any)=>{
            console.log("LoginScreen::login. Login successful");
            setAccessToken(credentials);
        }).catch((error)=>{
            console.log("ERROR - LoginScreen::login: ", error);
        })
    }

    const logout = () => {        
        auth0.webAuth.clearSession().then((success)=>{
            console.log("LoginScreen::logout. logout successful");
            setAccessToken(null);
        }).catch((error)=>{
            console.log("ERROR - LoginScreen::logout: ", error);
        })
    }

    return (
        <View style={styles.container}>
            <Text>Logged In: {accessToken != null ? "True" : "False"}</Text>
            <Button title={'Login'} onPress={login}> </Button>
            <Button title={'Logout'} onPress={logout}></Button>
        </View>
    )
}

function OldLoginScreen(props: any) {
    const [tempPhoneNumber, setTempPhoneNumber] = useState('')

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