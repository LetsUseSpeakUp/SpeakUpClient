import React, { useEffect } from 'react';
import { useState } from 'react';
import { StyleSheet, Text, View, Image, SafeAreaView, TouchableOpacity, Button } from "react-native";
import TrackPlayer from 'react-native-track-player';
import {useTrackPlayerProgress, usePlaybackState} from 'react-native-track-player';
import Slider from '@react-native-community/slider';

export default function ConvoPlayer() {
    const [isPlayerInitialized, setIsPlayerInitialized] = useState(false);
    const playbackState = usePlaybackState();
    const trackPlayerProgress = useTrackPlayerProgress(100);    
    const [sliderProgress, setSliderProgress] = useState(0)
    // const [slidingCompleteVal, setSlidingCompleteVal] = useState(0);

    useEffect(() => {
        initializeTrackPlayer().then(()=>{
            setIsPlayerInitialized(true);
        });
    }, []);

    useEffect(()=>{
        console.log("Playback state updated: ", playbackState);
    }, [playbackState]);

    useEffect(()=>{
        console.log("trackProgress updated: ", trackPlayerProgress);
    }, [trackPlayerProgress]);

    const onPlayPauseButtonPressed= ()=>{
        console.log("On play pause button pressed. State: ", playbackState,  " progress: ", trackPlayerProgress);
        if(playbackState === TrackPlayer.STATE_PLAYING){
            TrackPlayer.pause();
        }
        else{
            TrackPlayer.play();
        }
    }

    const setSlidingCompleteVal = (sliderVal: number)=>{
        console.log("ConvoPlayer. Set sliding complete. Slider val: ", sliderVal , " playback state: ", playbackState, " Track player: ", trackPlayerProgress);

        TrackPlayer.seekTo(sliderVal*trackPlayerProgress.duration);
    }

    return (
        <SafeAreaView style={{ flex: 1, alignItems: 'stretch', justifyContent: 'center', paddingHorizontal: 20 }}>
            <Slider
                // value={sliderProgress}
                // onValueChange={(value) => setSliderProgress(value)}                
                // onSlidingComplete={setSlidingCompleteVal}
                // style={{ height: 30, width: 10 }}  
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