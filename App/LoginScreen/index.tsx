import React, { useEffect, useState } from 'react'
import { View, StyleSheet, Button, Text, TextInput } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import Auth0 from 'react-native-auth0'
import EnterNameScreen from './EnterNameScreen'
import EnterPhoneNumberScreen from './EnterPhoneNumberScreen'
import EnterSMSCodeScreen from './EnterSMSCodeScreen'
import { NavigationContainer } from '@react-navigation/native';
import {addNewRefreshToken} from '../AuthLogic'
const auth0 = new Auth0({ domain: 'letsusespeakup.us.auth0.com', clientId: 'SIaSdbWJmdIj0MnR5hHFSaGHKlVfgzCT' });

//TODO: Handle login without account creation
//TODO: Delete print statements so we don't leak secrets
export default function LoginScreen(props: any) { //TODO: Take setToken callback from App. Also set phone Number
    const phoneNumberRef = React.useRef('');
    const nameRef = React.useRef({first_name: '', last_name: ''});

    const Stack = createStackNavigator();        

    const onNameSet = (firstName: string, lastName: string) =>{
        console.log("LoginScreen::onNameSet. First name: ", firstName, " last name: ", lastName);        
        nameRef.current = {first_name: firstName, last_name: lastName};
    }

    const onPhoneNumberSet = (newPhoneNumber: string) => {
        console.log("LoginScreen::onPhoneNumberSet: ", newPhoneNumber)        
        phoneNumberRef.current = newPhoneNumber;
        auth0.auth.passwordlessWithSMS({
            phoneNumber: newPhoneNumber
        }).then(() => {
            console.log("LoginScreen::onPhoneNumberSet. Sent SMS");
        }).catch((error) => {
            console.log("ERROR -- LoginScreen::onPhoneNumberSet: ", error);
        })
    }

    const onSMSCodeSet = async (smsCode: string) => { 
        console.log("LoginScreen::onSMSCodeSet: ", smsCode, " Phone Number: ", phoneNumberRef.current);
        if(phoneNumberRef.current.length <= 0) throw 'phone number null';

        try{
            const credentials = await auth0.auth.loginWithSMS({
                phoneNumber: phoneNumberRef.current,
                code: smsCode,
                audience: 'https://letsusespeakup.us.auth0.com/api/v2/',
                scope: 'read:current_user update:current_user_metadata openid profile offline_access'
            });

            await addNameToUserWithToken(credentials.accessToken);
            await addNewRefreshToken(credentials.refreshToken);
        }
        catch(error){
            console.log("ERROR -- LoginScreen::onSMSCodeSet: ", error);
        }
    }

    const addNameToUserWithToken = async (authToken: string) =>{
        try {
            const response = await auth0.auth.userInfo({ token: authToken });
            console.log("LoginScreen::addNameToUserWithToken. Response: ", response);
            const userId = response.sub;
            console.log("LoginScreen::addNameToUserWithToken. UserId: ", userId, " Name ref: ", nameRef.current);
            return await auth0.users(authToken).patchUser({ id: userId, metadata: nameRef.current });
        } catch (error) {
            console.log("LoginScreen::addNameToUserWithToken. Error: ", error);
        }        
    }

    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Name" component={EnterNameScreen} initialParams={{ setName: onNameSet }} />
                <Stack.Screen name="Phone Number" component={EnterPhoneNumberScreen} initialParams={{ setPhoneNumber: onPhoneNumberSet }} />
                <Stack.Screen name="Verification Code" component={EnterSMSCodeScreen} initialParams={{ setSMSCode: onSMSCodeSet }} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}