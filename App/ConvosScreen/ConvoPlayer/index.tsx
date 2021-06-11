import React, { useEffect } from 'react';
import { useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, TextInput, SafeAreaView, TouchableOpacity, Button } from "react-native";
import TrackPlayer from 'react-native-track-player';
import { useTrackPlayerProgress, usePlaybackState, useTrackPlayerEvents, TrackPlayerEvents } from 'react-native-track-player';
import Slider from '@react-native-community/slider';
import Clipboard from '@react-native-clipboard/clipboard';


export default function ConvoPlayer({route}: any) {
    
    const [seekingInProgress, setSeekingInProgress] = useState(false);
    const [sliderValue, setSliderValue] = useState(0);
    const [snippetStart, setSnippetStart] = useState(0);
    const [snippetEnd, setSnippetEnd] = useState(1);
    const [snippetDescription, setSnippetDescription] = useState('');
    const [snippetLink, setSnippetLink] = useState('Click generate');
    const [loadingSnippet, setLoadingSnippet] = useState(false);
    const playbackState = usePlaybackState();
    const trackPlayerProgress = useTrackPlayerProgress(100);

    const audioFilePath = route.params.audioFilePath;

    useEffect(()=>{
        if(audioFilePath.length > 0){
            TrackPlayer.reset().then(()=>{
                return addLocalTrackToPlayer(audioFilePath);                
            }).then(()=>{
                setSnippetStart(0);
                setSnippetEnd(trackPlayerProgress.duration);
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
            if (trackPlayerProgress.position >= trackPlayerProgress.duration * .99) {
                TrackPlayer.seekTo(0);
            }
            TrackPlayer.play();
        }
    }

    const setSlidingCompleteVal = (sliderCompleteVal: number) => {
        TrackPlayer.seekTo(sliderCompleteVal);
        setSeekingInProgress(false);
        setSliderValue(sliderCompleteVal);
    }

    const setSnippetStartToCurrent = ()=>{
        console.log("setSnippetStartToCurrent. Slider val: ", sliderValue);
        setSnippetStart(sliderValue);
        //TODO
    }

    const setSnippetEndToCurrent = ()=>{
        //TODO
    } 

    const generateSnippet = ()=>{ //TODO: use activityIndicator
        //TODO
    }

    return (
        <SafeAreaView style={{ flex: 1, alignItems: 'stretch', paddingHorizontal: 20, marginTop: 30 }}>
            <Slider
                onSlidingStart={() => { setSeekingInProgress(true) }}
                onSlidingComplete={(val) => { setSlidingCompleteVal(val) }}
                value={sliderValue}
                maximumValue={trackPlayerProgress.duration}
                onValueChange={(newValue)=>{                    
                    if(playbackState !== TrackPlayer.STATE_PLAYING) setSliderValue(newValue)}}
            />
            <Text>Track Position: {playbackState === TrackPlayer.STATE_PLAYING ? trackPlayerProgress.position : sliderValue}</Text>
            <Text>Track Duration: {trackPlayerProgress.duration}</Text>
            <Button title={playbackState === TrackPlayer.STATE_PLAYING ? "Pause" : "Play"} onPress={() => { onPlayPauseButtonPressed() }} />
            <View style={{flexDirection: 'row', paddingTop: 10, }}>
                <Text>Snippet Start: {snippetStart}</Text>
                <Button title={'Set'} onPress={setSnippetStartToCurrent}/>
            </View>
            <View style={{flexDirection: 'row', paddingTop: 10}}>
                <Text>Snippet End: {snippetEnd}</Text>
                <Button title={'Set'} onPress={setSnippetEndToCurrent}/>
            </View>
            <View style={{flexDirection: 'row', paddingTop: 10}}>
                <Text>Title:</Text>
                <TextInput placeholder="Describe this snippet" onChangeText={(text)=>{setSnippetDescription(text)}} style={{borderWidth: 1, height: 50, width: 250}}/>
            </View>
            <Button title={'Generate Snippet'} onPress={generateSnippet}/>
            <Text>Snippet Link: {snippetLink}</Text>
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