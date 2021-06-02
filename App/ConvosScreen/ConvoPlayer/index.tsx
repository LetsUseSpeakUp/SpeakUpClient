import React, { useEffect } from 'react';
import { useState } from 'react';
import { StyleSheet, Text, View, Image, SafeAreaView, TouchableOpacity, Button } from "react-native";
import TrackPlayer from 'react-native-track-player';
import {useTrackPlayerProgress, usePlaybackState, useTrackPlayerEvents, TrackPlayerEvents} from 'react-native-track-player';
import Slider from '@react-native-community/slider';

export default function ConvoPlayer() {
    const [isPlayerInitialized, setIsPlayerInitialized] = useState(false);
    const [seekingInProgress, setSeekingInProgress] = useState(false);
    const [sliderValue, setSliderValue] = useState(0);
    const playbackState = usePlaybackState();
    const trackPlayerProgress = useTrackPlayerProgress(100);           

    useEffect(() => {
        initializeTrackPlayer().then(()=>{
            setIsPlayerInitialized(true);
        });
    }, []);    

    useEffect(()=>{
        if(!seekingInProgress)
            setSliderValue(trackPlayerProgress.position)
    }, [trackPlayerProgress.position]);

    useTrackPlayerEvents([TrackPlayerEvents.PLAYBACK_STATE], (event) => {
        if (event.state === TrackPlayer.STATE_PLAYING) {
          TrackPlayer.play();
        } else {
          TrackPlayer.pause();
        }
      });

    const onPlayPauseButtonPressed= ()=>{
        if(playbackState === TrackPlayer.STATE_PLAYING){
            TrackPlayer.pause();
        }
        else{
            if(trackPlayerProgress.position === trackPlayerProgress.duration){
                TrackPlayer.seekTo(0);
            }            
            TrackPlayer.play();
        }
    }

    const setSlidingCompleteVal = (sliderVal: number)=>{
        TrackPlayer.seekTo(sliderVal);
        setSeekingInProgress(false);
    }

    return (
        <SafeAreaView style={{ flex: 1, alignItems: 'stretch', justifyContent: 'center', paddingHorizontal: 20 }}>
            <Slider   
                onSlidingStart={()=>{setSeekingInProgress(true)}}             
                onSlidingComplete={(val)=>{setSlidingCompleteVal(val)}}                
                value={sliderValue}
                maximumValue={trackPlayerProgress.duration}
            />
            <Text>Track Position: {trackPlayerProgress.position}</Text>
            <Text>Track Duration: {trackPlayerProgress.duration}</Text>
            <Button title={playbackState === TrackPlayer.STATE_PLAYING ? "Pause": "Play"} onPress={() => {onPlayPauseButtonPressed()}} disabled={!isPlayerInitialized}/>
        </SafeAreaView>

    )
}


async function initializeTrackPlayer() { //TODO: Take convo details as param
    await TrackPlayer.setupPlayer();
    await TrackPlayer.updateOptions({
        stopWithApp: true,
        capabilities: [
            TrackPlayer.CAPABILITY_PAUSE,
            TrackPlayer.CAPABILITY_PLAY,
        ],
        compactCapabilities: [
            TrackPlayer.CAPABILITY_PLAY,
            TrackPlayer.CAPABILITY_PAUSE
          ]
    })
    await TrackPlayer.add({ //TODO: Update this
        id: 'songID1',
        url: 'https://file-examples-com.github.io/uploads/2017/11/file_example_MP3_700KB.mp3',
        type: 'default',
        title: 'songTitle1',
        album: 'album1',
        artist: 'artist1',
        artwork: 'https://picsum.photos/300'
    });
    console.log("ConvoPlayer::InitializeTrackPlayer. Initialized");    
}