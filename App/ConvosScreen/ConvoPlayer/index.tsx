import React, { useEffect } from 'react';
import { useState } from 'react';
import { StyleSheet, Text, View, Image, TextInput, SafeAreaView, TouchableOpacity, Button } from "react-native";
import TrackPlayer from 'react-native-track-player';
import { useTrackPlayerProgress, usePlaybackState, useTrackPlayerEvents, TrackPlayerEvents } from 'react-native-track-player';
import Slider from '@react-native-community/slider';
import Clipboard from '@react-native-clipboard/clipboard';


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
        <SafeAreaView style={{ flex: 1, alignItems: 'stretch', paddingHorizontal: 20, marginTop: 30 }}>
            <Slider
                onSlidingStart={() => { setSeekingInProgress(true) }}
                onSlidingComplete={(val) => { setSlidingCompleteVal(val) }}
                value={sliderValue}
                maximumValue={trackPlayerProgress.duration}
            />
            <Text>Track Position: {trackPlayerProgress.position}</Text>
            <Text>Track Duration: {trackPlayerProgress.duration}</Text>
            <Button title={playbackState === TrackPlayer.STATE_PLAYING ? "Pause" : "Play"} onPress={() => { onPlayPauseButtonPressed() }} />
            <View style={{flexDirection: 'row', paddingTop: 10, }}>
                <Text>Snippet Start: 0</Text>
                <Button title={'Set'}/>
            </View>
            <View style={{flexDirection: 'row', paddingTop: 10}}>
                <Text>Snippet End: 0</Text>
                <Button title={'Set'}/>
            </View>
            <View style={{flexDirection: 'row', paddingTop: 10}}>
                <Text>Description:</Text>
                <TextInput placeholder="Number to call" onChangeText={()=>{}} style={{borderWidth: 1, height: 50, width: 250}}/>
            </View>
            <Button title={'Generate Snippet'}/>
            <Text>Snippet Link:</Text>
            <Button title={'Copy'} onPress={()=>{Clipboard.setString('sample snippet link')}}/>                                    
            
        </SafeAreaView>

    )
}

async function addLocalTrackToPlayer(filePath: string){
    await TrackPlayer.add({
        id: Date.now() + "",
        url: 'file:///' + filePath ,
        title: 'Convo',
        artist: 'SpeakUp'    
    });
}