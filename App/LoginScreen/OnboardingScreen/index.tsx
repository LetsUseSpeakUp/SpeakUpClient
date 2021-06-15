import ImageAndTextBlurbScreen from './ImageAndTextBlurbScreen'
import DoubleBlurbScreen from './DoubleBlurbScreen';
import React from 'react'
import {Text} from 'react-native'
import AppIntroSlider from 'react-native-app-intro-slider'
import {Colors, PrimaryButtonView} from '../../Graphics'



type ImageTextSlideItem = {
    key: number,
    topImage: string,  
    topText: undefined,  
    bottomText: string,
}

type DoubleTextSlideItem = {
    key: number,
    topImage: undefined,
    topText: string,
    bottomText: string
}

type SlideItem = ImageTextSlideItem | DoubleTextSlideItem;

export default function OnboardingScreen(props: {onOnboardingComplete: ()=>void}){
    
        
    const renderItem = ({item} : {item: SlideItem}) =>{
        if(item.topImage){
            return <ImageAndTextBlurbScreen imageSource={item.topImage} blurbText={item.bottomText}/>
        }
        else{
            const topText = item.topText as string;
            return <DoubleBlurbScreen topBlurbText={topText} bottomBlurbText={item.bottomText}/>
        }
    }
    
    const renderNextButton = ()=>{
        return <PrimaryButtonView text={'Next'}/>
    }

    const renderDoneButton = ()=>{
        return <PrimaryButtonView text={'Done'}/>
    }

    return(
        <AppIntroSlider renderItem={renderItem} data={slides} keyExtractor={item=>item.key.toString()}
        activeDotStyle={{backgroundColor: Colors.emphasizedTextColor}} renderNextButton={renderNextButton}
        renderDoneButton={renderDoneButton} onDone={()=>{props.onOnboardingComplete()}}/>
    )
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

const slides: SlideItem[] = [
    {
        key: 1,
        topImage: welcomeScreenImage,
        bottomText: welcomeScreenText,
        topText: undefined
    },
    {
        key: 2,
        topText: speakupIsAnAppTopText,
        bottomText: speakupIsAnAppBottomText,
        topImage: undefined
    },
    {
        key: 3,
        topImage: startAConvoImage,
        bottomText: startAConvoText,
        topText: undefined
    },
    {
        key: 4,
        topText: endOfConvoTopText,
        bottomText: endOfConvoBottomText,
        topImage: undefined
    },
    {
        key: 5,
        topImage: bothParticipantsImage,
        bottomText: bothParticipantsText,
        topText: undefined
    },
    {
        key: 6,
        topText: shareSnippetsTopText,
        bottomText: shareSnippetsBottomText,
        topImage: undefined
    },
    {
        key: 7,
        topImage: unplayableSnippetsImage,
        bottomText: unplayableSnippetsText,
        topText: undefined
    },
    {
        key: 8,
        topImage: inAlphaImage,
        bottomText: inAlphaText,
        topText: undefined
    }
]