import React, { useEffect } from 'react';
import { useState } from 'react';
import { StyleSheet, Text, View, Image, SafeAreaView, TouchableOpacity, Button } from "react-native";
import { Slider } from 'react-native-elements'
import TrackPlayer from 'react-native-track-player';

export default function ConvoPlayer() {
    const [playbackState, setPlaybackState] = useState(TrackPlayer.STATE_NONE);
    // const [sliderProgress, setSliderProgress] = useState(0)
    // const [slidingCompleteVal, setSlidingCompleteVal] = useState(0);

    useEffect(() => {
        initializeTrackPlayer();
    }, []);

    const onPlayPauseButtonPressed= ()=>{
        if(playbackState === TrackPlayer.STATE_PLAYING){
            TrackPlayer.pause();
            setPlaybackState(TrackPlayer.STATE_PLAYING);
        }
        else{
            TrackPlayer.play();
            setPlaybackState(TrackPlayer.STATE_PAUSED);
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
            <Button title={playbackState === TrackPlayer.STATE_PLAYING ? "Pause": "Play"} onPress={() => {onPlayPauseButtonPressed()}} />
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
        url: 'https://en.wikipedia.org/wiki/File:Komm%27_o_Hoffnung.ogg',
        type: 'default',
        title: 'songTitle1',
        album: 'album1',
        artist: 'artist1',
        artwork: 'https://picsum.photos/300'
    });
    console.log("ConvoPlayer::InitializeTrackPlayer. Initialized");
}