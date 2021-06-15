import ImageAndTextBlurbScreen from './ImageAndTextBlurbScreen'
import DoubleBlurbScreen from './DoubleBlurbScreen';
import React, {useState } from 'react'
import {Text} from 'react-native'


enum Screens{Welcome = 1, SpeakupIsAnApp = 2, InAlpha = 10}; //TODO
export default function OnboardingScreen(props: {onOnboardingComplete: ()=>void}){
    const [currentScreen, setCurrentScreen] = useState(Screens.Welcome);

    const onNextPressed = ()=>{
        if(currentScreen === Screens.InAlpha){
            props.onOnboardingComplete();            
        }
        else{
            setCurrentScreen(currentScreen + 1);
        }        
    }
    const onBackPressed = ()=>{
        setCurrentScreen(currentScreen -1);
    }

    switch(currentScreen){
        case Screens.Welcome: {
            return <ImageAndTextBlurbScreen imageSource={welcomeScreenImage} blurbText={welcomeScreenText}
                onNextPressed={onNextPressed}/>         
        }
        case Screens.SpeakupIsAnApp: {
            return <DoubleBlurbScreen topBlurbText={speakupIsAnAppTopText} bottomBlurbText={speakupIsAnAppBottomText}
                onNextPressed={onNextPressed} onBackPressed={onBackPressed}/>
        }
        default: return <ImageAndTextBlurbScreen imageSource={welcomeScreenImage} blurbText={welcomeScreenText} //TODO
        onNextPressed={onNextPressed}/>
    }    
}

const welcomeScreenImage = require('../../Graphics/streamline-being-a-vip-social-media-1000x1000.png')
const welcomeScreenText = 'Welcome to Speakup.'

const speakupIsAnAppTopText = 'Speakup is an app that lets you save and share your best conversations.'
const speakupIsAnAppBottomText = `Here's how it works.`