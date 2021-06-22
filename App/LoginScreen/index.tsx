import React, { useEffect, useState } from 'react'
import { View, StyleSheet, Button, Text, TextInput } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import EnterNameScreen from './EnterNameScreen'
import EnterPhoneNumberScreen from './EnterPhoneNumberScreen'
import EnterVerificationCodeScreen from './EnterVerificationCodeScreen'
import { NavigationContainer } from '@react-navigation/native';
import {enterPhoneNumberVerification, loginWithPhoneNumber, setUserMetadata} from '../AuthLogic'
import OnboardingScreen from './OnboardingScreen'
import {loginThroughWeb} from '../AuthLogic'
import {addNewUser} from '../Services/ServerInterface'

enum Screens {Onboarding, EnterName, PhoneNumber, Verification}
//TODO: Handle login without account creation
export default function LoginScreen(props: {onLoginComplete: ()=>void, onLoggedInToAppleTestAccount: (emailUsed: string)=>void}) {
    const phoneNumberRef = React.useRef('');
    const nameRef = React.useRef({first_name: '', last_name: ''});
    const [currentScreen, setCurrentScreen] = useState(Screens.Onboarding)

    const Stack = createStackNavigator();         

    const onNameSet = (firstName: string, lastName: string) =>{        
        nameRef.current = {first_name: firstName, last_name: lastName};
        if(firstName === 'Apple' && lastName === 'Apple'){
            loginThroughWeb().then((emailUsed)=>{
                props.onLoggedInToAppleTestAccount(emailUsed);
            })
        }
        else{
            setCurrentScreen(Screens.PhoneNumber);
        }        
    }

    const onPhoneNumberSet = (newPhoneNumber: string) => {
        phoneNumberRef.current = newPhoneNumber;
        loginWithPhoneNumber(newPhoneNumber).then(() => {
            console.log("LoginScreen::onPhoneNumberSet. Sent SMS");
            setCurrentScreen(Screens.Verification);
        }).catch((error) => {
            //TODO: Go to an error page
            console.log("ERROR -- LoginScreen::onPhoneNumberSet: ", error);            
        })
    }

    const onVerificationCodeSet = async (verificationCode: string) => { 
        console.log("LoginScreen::onVerificationCodeSet.");
        if(phoneNumberRef.current.length <= 0) throw 'phone number null';

        try{
            await enterPhoneNumberVerification(phoneNumberRef.current, verificationCode);
            await setUserMetadata(nameRef.current);            
            addNewUser();
            console.log("LoginScreen::onVerificationCodeSet. Calling login complete");       
            props.onLoginComplete();
        }
        catch(error){
            //TODO: Go to an error page
            console.log("ERROR -- LoginScreen::onSMonVerificationCodeSetSCodeSet: ", error);
        }
    }
    
    switch(currentScreen){
        case Screens.Onboarding: return <OnboardingScreen onOnboardingComplete={()=>{setCurrentScreen(Screens.EnterName)}}/>;
        case Screens.EnterName: return <EnterNameScreen onNameSet={onNameSet}/>;
        case Screens.PhoneNumber: return <EnterPhoneNumberScreen onPhoneNumberSet={onPhoneNumberSet} onBackPressed={()=>{setCurrentScreen(Screens.EnterName)}}/>;
        case Screens.Verification: return <EnterVerificationCodeScreen onVerificationCodeSet={onVerificationCodeSet} onBackPressed={()=>{setCurrentScreen(Screens.PhoneNumber)}}/>;
        default: return <OnboardingScreen onOnboardingComplete={()=>{setCurrentScreen(Screens.EnterName)}}/>;
    }
}