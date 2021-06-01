import React, { useEffect } from 'react';
import { useState } from 'react';
import { StyleSheet, Text, View, Image, SafeAreaView, TouchableOpacity, Button } from "react-native";
import { Slider } from 'react-native-elements'
import TrackPlayer from 'react-native-track-player';
import {useTrackPlayerProgress} from 'react-native-track-player';

export default function ConvoPlayer() {
    const [isPlayerInitialized, setIsPlayerInitialized] = useState(false);
    const [playbackState, setPlaybackState] = useState(TrackPlayer.STATE_NONE);
    const trackPlayerProgress = useTrackPlayerProgress(100);
    const trackPosition = trackPlayerProgress.position;
    const trackDuration = trackPlayerProgress.duration;
    // const [sliderProgress, setSliderProgress] = useState(0)
    // const [slidingCompleteVal, setSlidingCompleteVal] = useState(0);

    useEffect(() => {
        initializeTrackPlayer().then(()=>{
            setIsPlayerInitialized(true);
        });
    }, []);

    const onPlayPauseButtonPressed= ()=>{
        if(playbackState === TrackPlayer.STATE_PLAYING){
            TrackPlayer.pause();
            setPlaybackState(TrackPlayer.STATE_PAUSED);
        }
        else{
            TrackPlayer.play();
            setPlaybackState(TrackPlayer.STATE_PLAYING);
        }
    }

    return (
        <SafeAreaView style={{ flex: 1, alignItems: 'stretch', justifyContent: 'center', paddingHorizontal: 20 }}>
            <Slider
                // value={sliderProgress}
                // onValueChange={(value) => setSliderProgress(value)}
                // onSlidingComplete={(value) => { setSlidingCompleteVal(value) }}
                thumbStyle={{ height: 30, width: 10 }}  
            />
            <Text>Track Position: {trackPosition}</Text>
            <Text>Track Duration: {trackDuration}</Text>
            <Button title={playbackState === TrackPlayer.STATE_PLAYING ? "Pause": "Play"} onPress={() => {onPlayPauseButtonPressed()}} disabled={!isPlayerInitialized}/>
        </SafeAreaView>

    )
}


async function initializeTrackPlayer() { //TODO: Take convo details as param
    await TrackPlayer.setupPlayer();
    TrackPlayer.updateOptions({
        capabilities: [
            TrackPlayer.CAPABILITY_PAUSE,
            TrackPlayer.CAPABILITY_PLAY,
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