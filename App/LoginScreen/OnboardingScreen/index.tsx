import ImageAndTextBlurbScreen from './ImageAndTextBlurbScreen'
import React, {useState } from 'react'
import {Text} from 'react-native'


export default function OnboardingScreen(props: any){
    const [currentScreen, setCurrentScreen] = useState(); //TODO

    return(
        <ImageAndTextBlurbScreen imageSource={welcomeScreenImage} blurbText={welcomeScreenText}
            onNextPressed={()=>{console.log("next pressed")}} onBackPressed={()=>{console.log("back pressed")}}/>         //TODO
    )
}

const welcomeScreenImage = require('../../Graphics/streamline-being-a-vip-social-media-1000x1000.png')
const welcomeScreenText = 'Welcome to Speakup.'