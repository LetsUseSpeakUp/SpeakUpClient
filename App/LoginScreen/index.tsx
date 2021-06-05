import React, { useState } from 'react'
import { View, StyleSheet, Button, Text, TextInput } from 'react-native';
import Auth0 from 'react-native-auth0'
import EnterPhoneNumberScreen from './EnterPhoneNumberScreen'
const auth0 = new Auth0({ domain: 'letsusespeakup.us.auth0.com', clientId: 'SIaSdbWJmdIj0MnR5hHFSaGHKlVfgzCT' });

export default function LoginScreen(props: any){ //TODO: Take setToken callback from App
    //TODO: Make this a stack nav
    const onPhoneNumberSet = (newPhoneNumber: string)=>{
        console.log("LoginScreen::onPhoneNumberSet: ", newPhoneNumber)
    }

    return(
        <EnterPhoneNumberScreen onSetPhoneNumber={onPhoneNumberSet}/>        
    )
}

function OldLoginScreen(props: any) { //TODO: Delete this
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