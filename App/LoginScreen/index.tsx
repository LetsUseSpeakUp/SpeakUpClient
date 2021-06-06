import React, { useEffect, useState } from 'react'
import { View, StyleSheet, Button, Text, TextInput } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import EnterNameScreen from './EnterNameScreen'
import EnterPhoneNumberScreen from './EnterPhoneNumberScreen'
import EnterSMSCodeScreen from './EnterSMSCodeScreen'
import { NavigationContainer } from '@react-navigation/native';
import {enterPhoneNumberVerification, loginWithPhoneNumber, setUserMetadata} from '../AuthLogic'

//TODO: Handle login without account creation
export default function LoginScreen(props: any) { //TODO: Take setToken callback from App. Also set phone Number
    const phoneNumberRef = React.useRef('');
    const nameRef = React.useRef({first_name: '', last_name: ''});

    const Stack = createStackNavigator();        

    const onNameSet = (firstName: string, lastName: string) =>{        
        nameRef.current = {first_name: firstName, last_name: lastName};
    }

    const onPhoneNumberSet = (newPhoneNumber: string) => {
        phoneNumberRef.current = newPhoneNumber;
        loginWithPhoneNumber(newPhoneNumber).then(() => {
            console.log("LoginScreen::onPhoneNumberSet. Sent SMS");
        }).catch((error) => {
            console.log("ERROR -- LoginScreen::onPhoneNumberSet: ", error);
        })
    }

    const onSMSCodeSet = async (smsCode: string) => { 
        console.log("LoginScreen::onSMSCodeSet.");
        if(phoneNumberRef.current.length <= 0) throw 'phone number null';

        try{
            await enterPhoneNumberVerification(phoneNumberRef.current, smsCode);
            await setUserMetadata(nameRef.current);            
        }
        catch(error){
            console.log("ERROR -- LoginScreen::onSMSCodeSet: ", error);
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