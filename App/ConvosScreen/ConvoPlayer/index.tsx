import React, { useEffect } from 'react';
import { useState } from 'react';
import { StyleSheet, Text, View, Image, SafeAreaView, TouchableOpacity, Button } from "react-native";
import TrackPlayer from 'react-native-track-player';
import { useTrackPlayerProgress, usePlaybackState, useTrackPlayerEvents, TrackPlayerEvents } from 'react-native-track-player';
import Slider from '@react-native-community/slider';

export default function ConvoPlayer({route}: any) {
    const [isPlayerInitialized, setIsPlayerInitialized] = useState(false);
    const [seekingInProgress, setSeekingInProgress] = useState(false);
    const [sliderValue, setSliderValue] = useState(0);
    const playbackState = usePlaybackState();
    const trackPlayerProgress = useTrackPlayerProgress(100);

    const audioFilePath = route.params.audioFilePath;

    useEffect(() => {
        if(!isPlayerInitialized){
            initializeTrackPlayer().then(() => {
                setIsPlayerInitialized(true);
            });
        }        
    }, []);

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
        if (event.state === TrackPlayer.STATE_PLAYING) {
            if (trackPlayerProgress.position >= trackPlayerProgress.duration * .99) {
                TrackPlayer.seekTo(0);
            }
            TrackPlayer.play();
        } else {
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
            <Button title={playbackState === TrackPlayer.STATE_PLAYING ? "Pause" : "Play"} onPress={() => { onPlayPauseButtonPressed() }} disabled={!isPlayerInitialized} />
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
    console.log("initializeTrackPlayer complete. ");        
}

async function addLocalTrackToPlayer(filePath: string){
    await TrackPlayer.add({
        id: Date.now() + "",
        url: 'file:///' + filePath ,
        title: 'Convo',
        artist: 'SpeakUp'    
    });
}