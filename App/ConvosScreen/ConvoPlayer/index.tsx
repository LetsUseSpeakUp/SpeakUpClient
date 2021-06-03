import React, { useEffect } from 'react';
import { useState } from 'react';
import { StyleSheet, Text, View, Image, SafeAreaView, TouchableOpacity, Button } from "react-native";
import TrackPlayer from 'react-native-track-player';
import { useTrackPlayerProgress, usePlaybackState, useTrackPlayerEvents, TrackPlayerEvents } from 'react-native-track-player';
import Slider from '@react-native-community/slider';

export default function ConvoPlayer({route}: any) {
    
    const [seekingInProgress, setSeekingInProgress] = useState(false);
    const [sliderValue, setSliderValue] = useState(0);
    const playbackState = usePlaybackState();
    const trackPlayerProgress = useTrackPlayerProgress(100);

    const audioFilePath = route.params.audioFilePath;

    useEffect(()=>{
        if(audioFilePath.length > 0){
            TrackPlayer.reset().then(()=>{
                addLocalTrackToPlayer(audioFilePath);
            })            
        }        
    }, [audioFilePath])

    useEffect(() => {
        if (!seekingInProgress)
            setSliderValue(trackPlayerProgress.position)
    }, [trackPlayerProgress.position]);

    useTrackPlayerEvents([TrackPlayerEvents.PLAYBACK_STATE], (event) => {
        console.log("ConvoPlayer::useTrackPlayerEvents 1. Event: ", event, " Audio file: ", audioFilePath);
        if (event.state === TrackPlayer.STATE_PLAYING) {
            if (trackPlayerProgress.position >= trackPlayerProgress.duration * .99) {
                console.log("ConvoPlayer::useTrackPlayerEvents. Seek to 0");
                TrackPlayer.seekTo(0);
            }
            console.log("ConvoPlayer::useTrackPlayerEvents. Play.");
            TrackPlayer.play();
        } else {
            console.log("ConvoPlayer::useTrackPlayerEvents. Pause");
            TrackPlayer.pause();
        }
    });

    const onPlayPauseButtonPressed = () => {
        if (playbackState === TrackPlayer.STATE_PLAYING) {
            TrackPlayer.pause();
        }
        else {
            console.log("Play/pause. Position: ", trackPlayerProgress.position, " duration: ", trackPlayerProgress.duration * .99);
            if (trackPlayerProgress.position >= trackPlayerProgress.duration * .99) {
                TrackPlayer.seekTo(0);
            }
            TrackPlayer.play();
        }
    }

    const setSlidingCompleteVal = (sliderVal: number) => {
        TrackPlayer.seekTo(sliderVal);
        setSeekingInProgress(false);
    }

    return (
        <SafeAreaView style={{ flex: 1, alignItems: 'stretch', justifyContent: 'center', paddingHorizontal: 20 }}>
            <Slider
                onSlidingStart={() => { setSeekingInProgress(true) }}
                onSlidingComplete={(val) => { setSlidingCompleteVal(val) }}
                value={sliderValue}
                maximumValue={trackPlayerProgress.duration}
            />
            <Text>Track Position: {trackPlayerProgress.position}</Text>
            <Text>Track Duration: {trackPlayerProgress.duration}</Text>
            <Button title={playbackState === TrackPlayer.STATE_PLAYING ? "Pause" : "Play"} onPress={() => { onPlayPauseButtonPressed() }} />
        </SafeAreaView>

    )
}

async function addLocalTrackToPlayer(filePath: string){
    await TrackPlayer.add({
        id: Date.now() + "",
        url: 'file:///' + filePath ,
        // url: 'http://localhost:8080/snippet?start=0&end=10',
        // url: 'https://file-examples-com.github.io/uploads/2017/11/file_example_WAV_1MG.wav',
        // url: 'http://localhost:3999/convos/retrieve?convoId=16225102520581',
        // url: 'http://localhost:3999/convos/retrieve?convoId=16225102520581',
        title: 'Convo',
        artist: 'SpeakUp'    
    });
}