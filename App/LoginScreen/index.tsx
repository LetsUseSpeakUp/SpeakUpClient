import React, { useState } from 'react'
import { View, StyleSheet, Button, Text, TextInput } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import Auth0 from 'react-native-auth0'
import EnterPhoneNumberScreen from './EnterPhoneNumberScreen'
import EnterSMSCodeScreen from './EnterSMSCodeScreen'
import { NavigationContainer } from '@react-navigation/native';
const auth0 = new Auth0({ domain: 'letsusespeakup.us.auth0.com', clientId: 'SIaSdbWJmdIj0MnR5hHFSaGHKlVfgzCT' });

export default function LoginScreen(props: any) { //TODO: Take setToken callback from App
    const [phoneNumber, setPhoneNumber] = useState('');

    const Stack = createStackNavigator();
    //TODO: Enter first name
    //TODO: Enter last name

    const onPhoneNumberSet = (newPhoneNumber: string) => {
        console.log("LoginScreen::onPhoneNumberSet: ", newPhoneNumber)
        setPhoneNumber(newPhoneNumber);
        auth0.auth.passwordlessWithSMS({
            phoneNumber: newPhoneNumber
        }).then(() => {
            console.log("LoginScreen::onPhoneNumberSet. Sent SMS");
        }).catch((error) => {
            console.log("ERROR -- LoginScreen::onPhoneNumberSet: ", error);
        })
    }

    const onSMSCodeSet = (smsCode: string) => {
        console.log("LoginScreen::onSMSCodeSet: ", smsCode);
        auth0.auth.loginWithSMS({
            phoneNumber: phoneNumber,
            code: smsCode
        }).then((token) => {
            console.log("LoginScreen::onSMSCodeSet. Token received: ", token)
            //TODO: callback to parent from props with token
        }).catch((error) => {
            console.log("ERROR -- LoginScreen::onSMSCodeSet: ", error);
        })
    }

    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Enter Phone Number" component={EnterPhoneNumberScreen} initialParams={{ setPhoneNumber: onPhoneNumberSet }} />
                <Stack.Screen name="Enter Verification Code" component={EnterSMSCodeScreen} initialParams={{ setSMSCode: onSMSCodeSet }} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

function OldLoginScreen(props: any) { //TODO: Delete this
    const [accessToken, setAccessToken] = useState(null);

    const login = () => {
        auth0.webAuth.authorize({}).then((credentials: any) => {
            console.log("LoginScreen::login. Login successful");
            setAccessToken(credentials);
        }).catch((error) => {
            console.log("ERROR - LoginScreen::login: ", error);
        })
    }

    const logout = () => {
        auth0.webAuth.clearSession().then((success) => {
            console.log("LoginScreen::logout. logout successful");
            setAccessToken(null);
        }).catch((error) => {
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