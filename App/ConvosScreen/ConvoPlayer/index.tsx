import React, { useEffect } from 'react';
import { useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, TextInput, SafeAreaView, TouchableOpacity, Image, Button, Animated, useWindowDimensions } from "react-native";
import TrackPlayer from 'react-native-track-player';
import { useTrackPlayerProgress, usePlaybackState, useTrackPlayerEvents, TrackPlayerEvents } from 'react-native-track-player';
import Slider from '@react-native-community/slider';
import Clipboard from '@react-native-clipboard/clipboard';
import * as ConvosManager from '../../ConvosData/ConvosManager'
import ConvosContext from '../../ConvosData/ConvosContext'
import { Constants, Colors, PrimaryButton, SecondaryButton } from '../../Graphics'
import Icon from 'react-native-vector-icons/MaterialIcons'


export default function ConvoPlayer({ route }: any) {
    const windowDimensions = useWindowDimensions();
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
    const convosContext = React.useContext(ConvosContext);
    const convoId = route.params.convoId;
    const metadata = convosContext.allConvosMetadata.find((curMetadata) => curMetadata.convoId === convoId);
    const userFirstName = route.params.userFirstName;

    const blurbFadeInAnimation = React.useRef(new Animated.Value(0)).current
    React.useEffect(() => {
        Animated.timing(
            blurbFadeInAnimation, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true
        }).start();
    }, [blurbFadeInAnimation])

    useEffect(() => {
        if (audioFilePath.length > 0) {
            TrackPlayer.reset().then(() => {
                return addLocalTrackToPlayer(audioFilePath);
            }).then(() => {
                setSnippetStart(0);
                setSnippetEnd(trackPlayerProgress.duration);
            })
        }
    }, [audioFilePath])

    useEffect(() => {
        if (trackPlayerProgress.duration > 0 && snippetEnd === 0) {
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

    const setSnippetStartToCurrent = () => {
        const newStart = sliderValue;
        setSnippetStart(newStart);
        if (newStart > snippetEnd)
            setSnippetEnd(trackPlayerProgress.duration);
    }

    const setSnippetEndToCurrent = () => {
        const newEnd = sliderValue;
        setSnippetEnd(newEnd);
        if (newEnd < snippetStart)
            setSnippetStart(0);
    }

    const onCreateSnippetPressed = ()=>{
        console.log("ConvoPlayer::onCreateSnippetPressed");
        //TODO: Nav to gen snippet class and pass start time and end time
    }

    const generateSnippet = () => { //TODO: Move to the snippet creation file
        setLoadingSnippet(true);
        ConvosManager.generateSnippetLink(convoId, snippetStart, snippetEnd, snippetDescription)
            .then((snippetUrl) => {
                setSnippetLink(snippetUrl);
            })
            .catch((error) => {
                console.log("")
                setSnippetLink('Error - unable to generate snippet');
            })
            .finally(() => {
                setLoadingSnippet(false);
            });
    }

    const amIInitiator = (metadata?.initiatorId != null && metadata?.receiverId != null) ? (convosContext.myPhoneNumber === metadata?.initiatorId) :
        metadata?.initiatorFirstName === undefined;
    const partnerFirstName = amIInitiator ? metadata?.receiverFirstName : metadata?.initiatorFirstName;
    const partnerLastName = amIInitiator ? metadata?.receiverLastName : metadata?.initiatorLastName;
    const partnerName = (partnerFirstName ?? '') + ' ' + (partnerLastName ?? '');
    const dateTime = metadata?.timestampStarted ? ConvosManager.getFormattedDateAndTimeFromTimestamp(metadata?.timestampStarted) : 'Loading';
    const convoLength = metadata?.convoLength;

    return (
        <SafeAreaView style={styles.flexContainer}>
            <View style={styles.headingContainer}>
                <Text style={{ fontFamily: Constants.fontFamily, fontSize: Constants.minorTitleFontSize, color: Colors.headingTextColor, fontWeight: 'bold' }}>
                    Convo with {partnerName}
                </Text>
                <Text style={{ fontFamily: Constants.fontFamily, fontSize: Constants.propertyFontSize, color: Colors.unemphasizedTextColor }}>
                    {dateTime}
                </Text>
                <Text style={{ fontFamily: Constants.fontFamily, fontSize: Constants.propertyFontSize, color: Colors.emphasizedTextColor }}>
                    {getTitleFormattedTimeFromMs(convoLength)}
                </Text>
            </View>
            <Animated.View style={{ ...styles.imageHolder, opacity: blurbFadeInAnimation, paddingVertical: Constants.paddingTop, height: windowDimensions.height * .3 }}>
                <Image source={require('../../Graphics/streamline-entertain--content-media--1000x1000.png')}
                    resizeMode='contain' style={{ width: '100%', height: '100%' }} />
            </Animated.View>
            <Slider
                onSlidingStart={() => { setSeekingInProgress(true) }}
                onSlidingComplete={(val) => { setSlidingCompleteVal(val) }}
                value={sliderValue}
                maximumValue={trackPlayerProgress.duration}
                minimumTrackTintColor={Colors.emphasizedTextColor}
                maximumTrackTintColor={Colors.lightTint}
                onValueChange={(newValue) => {
                    if (playbackState !== TrackPlayer.STATE_PLAYING) setSliderValue(newValue)
                }}
            />
            <View style={styles.durationAndCurrentTimeContainer}>
                <Text style={styles.trackTimeText}>
                    {playbackState === TrackPlayer.STATE_PLAYING ? getTrackFormattedTimeFromSeconds(trackPlayerProgress.position) : getTrackFormattedTimeFromSeconds(sliderValue)}
                </Text>
                <Text style={styles.trackTimeText}>
                    {getTrackFormattedTimeFromSeconds(trackPlayerProgress.duration)}
                </Text>
            </View>
            <PlayPauseButton isPlaying={playbackState === TrackPlayer.STATE_PLAYING} onPress={onPlayPauseButtonPressed} />            
            <View style={{...styles.dividerLineHolder, marginTop: Constants.paddingTop}}>
                <View style={styles.dividerLine}/>
            </View>      
            <View style={styles.snippetMakerContainer}>
                <Text style={{...styles.propertyText, color: Colors.headingTextColor, paddingTop: Constants.propertySpacing}}>
                    Snippet Maker
                </Text>                
            </View>  
            <View style={{...styles.snippetTimeRow}}>
                <View style={{display: 'flex', flexDirection: 'row'}}>
                    <Text style={{...styles.propertyText, color: Colors.unemphasizedTextColor}}>Start Time: </Text>
                    <Text style={{...styles.propertyText, color: Colors.emphasizedTextColor}}>{getTrackFormattedTimeFromSeconds(snippetStart)}</Text>
                </View>
                <SecondaryButton title={'Set to Current'} onPress={setSnippetStartToCurrent}/>
            </View>
            <View style={{...styles.snippetTimeRow}}>
                <View style={{display: 'flex', flexDirection: 'row'}}>
                    <Text style={{...styles.propertyText, color: Colors.unemphasizedTextColor}}>End Time: </Text>
                    <Text style={{...styles.propertyText, color: Colors.emphasizedTextColor}}>{getTrackFormattedTimeFromSeconds(snippetEnd)}</Text>
                </View>
                <SecondaryButton title={'Set to Current'} onPress={setSnippetEndToCurrent}/>
            </View>
            <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingTop: Constants.paddingTop}}>
                <PrimaryButton text={'Create Snippet'} onPress={onCreateSnippetPressed}/>
            </View>
            
        </SafeAreaView>

    )
}

function PlayPauseButton({ isPlaying, onPress }: { isPlaying: boolean, onPress: () => void }) {
    const iconName = isPlaying ? 'pause-circle-filled' : 'play-circle-filled';
    return (
        <View style={{ display: 'flex', alignItems: 'center', marginTop: -Constants.paddingTop }}>
            <TouchableOpacity onPress={onPress} style={{ width: Constants.playPauseIconSize }}>
                <View style={{ display: 'flex', alignItems: 'center' }}>
                    <Icon name={iconName} size={Constants.playPauseIconSize} color={Colors.emphasizedTextColor} style={{}} />
                </View>
            </TouchableOpacity>
        </View>

    )
}

const styles = StyleSheet.create({
    flexContainer: {
        backgroundColor: Colors.backgroundColor,
        display: 'flex',
        paddingHorizontal: Constants.paddingHorizontal,
        flex: 1,

    },
    headingContainer: {
        paddingTop: Constants.paddingTop / 2,
        display: 'flex',
        alignItems: 'center',
    },
    imageHolder: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    durationAndCurrentTimeContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    trackTimeText: {
        color: Colors.unemphasizedTextColor,
        fontSize: Constants.detailsFontSize
    },
    propertyText: {
        fontSize: Constants.propertyFontSize,
        fontFamily: Constants.fontFamily
    },    
    dividerLineHolder: {
        display: 'flex',
        alignItems: 'center',
    },
    dividerLine: {
        borderColor: Colors.dividerLineColor,
        borderWidth: 1,
        width: '80%',
        height: 2,
    },
    snippetMakerContainer: {
        display: 'flex',
        alignItems: 'center',
        paddingBottom: Constants.paddingTop / 2
    },
    playButtonContainer: {
        paddingTop: Constants.paddingTop,
        display: 'flex',
        alignItems: 'center'
    },
    snippetTimeRow: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'        
    }

})

async function addLocalTrackToPlayer(filePath: string) {
    await TrackPlayer.add({
        id: Date.now() + "",
        url: 'file:///' + filePath,
        title: 'Convo',
        artist: 'SpeakUp'
    });
}

function getTitleFormattedTimeFromMs(timeInMs: number | undefined): string {
    if (timeInMs == null) return '';

    const minutes = Math.floor(timeInMs / 60000);
    const seconds = ((timeInMs % 60000) / 1000).toFixed(0);

    if (minutes > 1) return minutes + ' minutes';
    else if (minutes === 1) return '1 minute';
    else return seconds + ' seconds';
}

function getTrackFormattedTimeFromSeconds(timeInSeconds: number): string {
    const minutes = Math.floor(timeInSeconds / 60);
    let seconds = ((timeInSeconds % 60)).toFixed(0);
    if (seconds.length === 1) seconds = '0' + seconds;

    return minutes + ":" + seconds;
}