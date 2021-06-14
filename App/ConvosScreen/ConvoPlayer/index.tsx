import React, { useEffect } from 'react';
import { useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, TextInput, SafeAreaView, TouchableOpacity, Button } from "react-native";
import TrackPlayer from 'react-native-track-player';
import { useTrackPlayerProgress, usePlaybackState, useTrackPlayerEvents, TrackPlayerEvents } from 'react-native-track-player';
import {getMyUserInfo} from '../../AuthLogic'
import Slider from '@react-native-community/slider';
import Clipboard from '@react-native-clipboard/clipboard';
import * as ConvosManager from '../../ConvosData/ConvosManager'


export default function ConvoPlayer({route}: any) {
    
    const [seekingInProgress, setSeekingInProgress] = useState(false);
    const [sliderValue, setSliderValue] = useState(0);
    const [snippetStart, setSnippetStart] = useState(0);
    const [snippetEnd, setSnippetEnd] = useState(1);
    const [snippetDescription, setSnippetDescription] = useState('Snippet from ' + route.params.firstName);
    const [snippetLink, setSnippetLink] = useState('Generate your snippet');
    const [loadingSnippet, setLoadingSnippet] = useState(false);
    const playbackState = usePlaybackState();
    const trackPlayerProgress = useTrackPlayerProgress(100);

    const audioFilePath = route.params.audioFilePath;
    const convoId = route.params.convoId;
    const firstName = route.params.firstName;    

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
    
    useEffect(()=>{
        if(trackPlayerProgress.duration > 0 && snippetEnd === 0){
            setSnippetEnd(trackPlayerProgress.duration);
        }
    }, [trackPlayerProgress.duration])

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
        const newStart = sliderValue;
        setSnippetStart(newStart);        
        if(newStart > snippetEnd)
            setSnippetEnd(trackPlayerProgress.duration);
    }

    const setSnippetEndToCurrent = ()=>{
        const newEnd = sliderValue;
        setSnippetEnd(newEnd);
        if(newEnd < snippetStart)
            setSnippetStart(0);
    } 

    const generateSnippet = ()=>{
        setLoadingSnippet(true); 
        ConvosManager.generateSnippetLink(convoId, snippetStart, snippetEnd, snippetDescription)
            .then((snippetUrl)=>{
                setSnippetLink(snippetUrl);
            })
            .catch((error)=>{
                console.log("")
                setSnippetLink('Error - unable to generate snippet');
            })
            .finally(()=>{
                setLoadingSnippet(false);
            });        
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
                <TextInput placeholder="Describe this snippet" onChangeText={(text)=>{setSnippetDescription(text)}} 
                    style={{borderWidth: 1, height: 50, width: 250}} defaultValue={'Snippet from ' + firstName}/>
            </View>
            <Button title={'Generate Snippet'} onPress={generateSnippet}/>
            <Text>Snippet Link: {loadingSnippet ? 'Generating...' : snippetLink}</Text>
            {loadingSnippet && <ActivityIndicator/>}
            <Button title={'Copy'} onPress={()=>{Clipboard.setString(snippetLink)}}/>                                    
            
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