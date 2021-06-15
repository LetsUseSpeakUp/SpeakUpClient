import ImageAndTextBlurbScreen from './ImageAndTextBlurbScreen'
import DoubleBlurbScreen from './DoubleBlurbScreen';
import React, {useState } from 'react'
import {Text} from 'react-native'


enum Screens{Welcome = 1, SpeakupIsAnApp = 2, StartAConvo = 3, EndOfConvo = 4,
    BothParticipants = 5, ShareSnippets = 6, UnplayableSnippets = 7, InAlpha = 8};
export default function OnboardingScreen(props: {onOnboardingComplete: ()=>void}){
    const [currentScreen, setCurrentScreen] = useState(Screens.Welcome);

    const onNextPressed = ()=>{
        console.log("OnboardingScreen.onNextPressed. Screen: ", currentScreen);
        if(currentScreen === Screens.InAlpha){
            props.onOnboardingComplete();            
        }
        else{
            console.log("OnboardingScreen.onNextPressed. Screen: ", (currentScreen+1));
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
        case Screens.StartAConvo: {
            return <ImageAndTextBlurbScreen imageSource={startAConvoImage} blurbText={startAConvoText}
            onNextPressed={onNextPressed} onBackPressed={onBackPressed}/>   
        }        
        case Screens.EndOfConvo: {
            return <DoubleBlurbScreen topBlurbText={endOfConvoTopText} bottomBlurbText={endOfConvoBottomText}
                onNextPressed={onNextPressed} onBackPressed={onBackPressed}/>
        }
        case Screens.BothParticipants: {
            return <ImageAndTextBlurbScreen imageSource={bothParticipantsImage} blurbText={bothParticipantsText}
            onNextPressed={onNextPressed} onBackPressed={onBackPressed}/> 
        }
        case Screens.ShareSnippets : {
            return <DoubleBlurbScreen topBlurbText={shareSnippetsTopText} bottomBlurbText={shareSnippetsBottomText}
                onNextPressed={onNextPressed} onBackPressed={onBackPressed}/>
        }
        case Screens.UnplayableSnippets: {
            return <ImageAndTextBlurbScreen imageSource={unplayableSnippetsImage} blurbText={unplayableSnippetsText}
            onNextPressed={onNextPressed} onBackPressed={onBackPressed} dontFadeOut={true}/> 
        }        
        default: return <ImageAndTextBlurbScreen imageSource={inAlphaImage} blurbText={inAlphaText}
        onNextPressed={onNextPressed} onBackPressed={onBackPressed} dontFadeOut={true}/>
    }    
}

const welcomeScreenImage = require('../../Graphics/streamline-being-a-vip-social-media-1000x1000.png');
const welcomeScreenText = 'Welcome to Speakup.';

const speakupIsAnAppTopText = 'Speakup is an app that lets you save and share your best conversations.';
const speakupIsAnAppBottomText = `Here's how it works.`;

const startAConvoImage = require('../../Graphics/streamline-profile--social-media--1000x1000.png');
const startAConvoText = 'Start a Convo by calling a friend through Speakup.';

const endOfConvoTopText = `At the end of the call, Speakup will ask you if you'd like to approve the Convo for playback.`;
const endOfConvoBottomText = 'You can change your mind at any time.';

const bothParticipantsImage = require('../../Graphics/streamline-icon-make-peace-with-someone@1000x1000.png');
const bothParticipantsText = 'Playback will not be available unless both participants approve.';

const shareSnippetsTopText = 'Once a Convo is approved, you can share snippets with your friends by sending them a link.';
const shareSnippetsBottomText = `They can listen to the snippet even if they don't have Speakup installed.`;

const unplayableSnippetsImage = require('../../Graphics/streamline-protect-privacy--user-people--1000x1000.png');
const unplayableSnippetsText = 'If you or your partner deny a Convo for playback, all of its existing snippets will be unplayable.';

const inAlphaImage = require('../../Graphics/streamline-change-settings--interface--1000x1000.png');
const inAlphaText = 'Speakup is currently in alpha. If you encounter any bugs, please let us know.';