import React, { useEffect, useState } from 'react'
import { View, Text, Button} from 'react-native'
import {ConvoResponseType, ConvoStatus} from '../../ConvosData/ConvosManager'
import * as ConvosManager from '../../ConvosData/ConvosManager'
import ConvosContext from '../../ConvosData/ConvosContext'
import {RefreshControl, ScrollView, StyleSheet, Image, Animated, ActivityIndicator} from 'react-native'
import {Colors, Constants, PrimaryButton, SecondaryButton} from '../../Graphics'
import { useWindowDimensions } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import ReactNativeHapticFeedback from "react-native-haptic-feedback";


export default function SingleConvoDetails({route, navigation}: any){
    const windowDimensions = useWindowDimensions();
    const convosContext = React.useContext(ConvosContext);
    const convoId = route.params.convoId;
    const metadata = convosContext.allConvosMetadata.find((curMetadata)=>curMetadata.convoId === convoId);    
    const [refreshing, setRefreshing] = useState(false);
    const [loadingConvoToPlay, setLoadingConvoToPlay] = useState(false);
    const shouldFireConfetti = React.useRef(false);
    let confettiRef: any;

    const blurbFadeInAnimation = React.useRef(new Animated.Value(0)).current
    React.useEffect(() => {
        Animated.timing(
            blurbFadeInAnimation, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true
        }).start();
    }, [blurbFadeInAnimation])

    const fetchUpdatedConvoMetadata = ()=>{
        setRefreshing(true);
        ConvosManager.fetchSingleConvoMetadata(convoId).then((fetchedConvoMetadata)=>{            
            if(fetchedConvoMetadata == null) return;
            console.log("SingleConvoDetails. Successfully fetched latest convo");
            if(metadata == null || areSingleConvoMetadatasDifferent(metadata, fetchedConvoMetadata)){                
                convosContext.updateSingleConvoMetadataWithFetched(fetchedConvoMetadata);
                if(fetchedConvoMetadata.convoLength == null) setTimeout(()=>{fetchUpdatedConvoMetadata()}, 1000);
            }
        }).catch((error)=>{
            console.log("ERROR -- SingleConvoDetails::fetchUpdatedConvoStatus. Convo Id: ", convoId , " Error: ", error);
        }).finally(()=>{
            setRefreshing(false);
        })      
    }

    useEffect(()=>{
        fetchUpdatedConvoMetadata();
    }, [])

    const downloadAudioFile = ()=>{
        setLoadingConvoToPlay(true);
        ConvosManager.downloadConvo(convoId).then((filePath)=>{
            console.log("SingleConvoDetail::downloadAudioFile. File downloaded: ", filePath);
            const firstName = amIInitiator ? metadata?.initiatorFirstName : metadata?.receiverFirstName;
            navigation.navigate('Convo Player', {audioFilePath: filePath, convoId: convoId, userFirstName: firstName});
        }).catch((error)=>{
            console.log("ERROR -- SingleConvoDetail::downloadAudioFile: ", error);
        }).finally(()=>setLoadingConvoToPlay(false));
    }

    const approvePressed = ()=>{
        convosContext.approveOrDenySingleConvo(true, convoId);  
        if(partnerApproval){            
            ReactNativeHapticFeedback.trigger('notificationSuccess', {enableVibrateFallback: true, ignoreAndroidSystemSettings: false});
        }
    }    

    if(metadata === undefined){
        console.log("ERROR -- SingleConvoDetails. Metadata is undefined. convoId: ", convoId);
        return(
            <View><Text>ERROR: Could not find convo with convoId {convoId}. Please contact support.</Text></View>
        );
    }
    const amIInitiator = (metadata.initiatorId != null && metadata.receiverId != null) ? (convosContext.myPhoneNumber === metadata.initiatorId) : 
        metadata.initiatorFirstName === undefined;
    const partnerFirstName = amIInitiator ? metadata.receiverFirstName: metadata.initiatorFirstName;
    const partnerLastName = amIInitiator ? metadata.receiverLastName: metadata.initiatorLastName;
    const partnerName = (partnerFirstName ?? '') + ' ' + (partnerLastName ?? '');
    const partnerPhoneNumber = amIInitiator ? metadata.receiverId : metadata.initiatorId;
    const dateTime = metadata.timestampStarted ? ConvosManager.getFormattedDateAndTimeFromTimestamp(metadata.timestampStarted) : 'Loading';
    const convoLength = metadata.convoLength;
    const partnerApproval = amIInitiator ? metadata.convoStatus?.receiverResponse : metadata.convoStatus?.initiatorResponse;
    const myApproval = amIInitiator ? metadata.convoStatus?.initiatorResponse : metadata.convoStatus?.receiverResponse;

    const doubleApproved = (myApproval === ConvoResponseType.Approved) && (partnerApproval === ConvoResponseType.Approved);

    useEffect(()=>{
        if(doubleApproved && shouldFireConfetti.current){
            if(confettiRef) confettiRef.start();
        }
    }, [doubleApproved])

    useEffect(()=>{
        shouldFireConfetti.current = true;
    }, [])
    
    return(
        <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={()=>{fetchUpdatedConvoMetadata()}}/>} style={styles.flexContainer}>
            <View style={styles.headingContainer}>
                <Text style={{fontFamily: Constants.fontFamily, fontSize: Constants.minorTitleFontSize, color: Colors.headingTextColor, fontWeight: 'bold'}}>
                    Convo with {partnerName}
                </Text>
                <Text style={{fontFamily: Constants.fontFamily, fontSize: Constants.propertyFontSize, color: Colors.unemphasizedTextColor}}>
                    {dateTime}
                </Text>
                <Text style={{fontFamily: Constants.fontFamily, fontSize: Constants.propertyFontSize, color: Colors.emphasizedTextColor}}>
                    {getFormattedTimeFromMs(convoLength)}
                </Text>
            </View>
            <Animated.View style={{ ...styles.imageHolder, opacity: blurbFadeInAnimation, paddingVertical: Constants.paddingTop, height: windowDimensions.height*.3}}>
                    <Image source={doubleApproved ? require('../../Graphics/streamline-success--interface--1000x1000.png'): 
                        require('../../Graphics/streamline-protect-privacy--user-people--1000x1000.png')}
                        resizeMode='contain' style={{ width: '100%', height: '100%'}} />
            </Animated.View>
            <Text style={{...styles.propertyText, fontWeight: 'bold'}}>{doubleApproved ? 'Approved': 'Unapproved'}</Text>
            <View style={{...styles.approvalStatusHolder, paddingTop: 1}}>
                <Text style={{...styles.propertyText, color: Colors.unemphasizedTextColor}}>
                    {partnerFirstName + ': '}
                </Text>
                <Text style={{...styles.propertyText, color: Colors.emphasizedTextColor}}>
                    {convertApprovalStatusToText(partnerApproval)}
                </Text>
            </View>
            <View style={styles.approvalStatusHolder}>
                <Text style={{...styles.propertyText, color: Colors.unemphasizedTextColor}}>
                    {'You: '}
                </Text>
                <Text style={{...styles.propertyText, color: Colors.emphasizedTextColor}}>
                    {convertApprovalStatusToText(myApproval)}
                </Text>
            </View>        
            <View style={{...styles.dividerLineHolder, marginTop: Constants.paddingTop}}>
                <View style={styles.dividerLine}/>
            </View>      
            <View style={styles.setApprovalContainer}>
                <Text style={{...styles.propertyText, color: Colors.headingTextColor, fontWeight: 'bold', paddingTop: Constants.propertySpacing}}>
                    Set Approval
                </Text>
                <SecondaryButton title={'Approve'} onPress={()=>{approvePressed()}}/>
                <SecondaryButton title="Deny" onPress={()=>{convosContext.approveOrDenySingleConvo(false, convoId)}}/>
            </View>   
            <View style={styles.dividerLineHolder}>
                <View style={styles.dividerLine}/>
            </View>   
            {!doubleApproved &&                
            <Text style={{...styles.propertyText, color: Colors.unemphasizedTextColor, paddingTop: Constants.paddingTop}}>
                Convo must be approved by both participants for playback to be enabled.
            </Text>}
            {doubleApproved &&
            <View style={styles.playButtonContainer}>
                <PrimaryButton text={'Play'} onPress={()=>{downloadAudioFile()}}/>
                <ActivityIndicator animating={loadingConvoToPlay} style={{paddingTop: Constants.paddingTop}}/>
            </View>
            }
            <ConfettiCannon
                count={200}
                origin={{x: -50, y: 0}}
                autoStart={false}
                fadeOut={true}
                explosionSpeed={500}
                fallSpeed={5000}
                ref={ref => (confettiRef = ref)}
            />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    flexContainer: {
        backgroundColor: Colors.backgroundColor,
        display: 'flex',        
        paddingHorizontal: Constants.paddingHorizontal,        
        flex: 1
    },
    headingContainer: {
        paddingTop: Constants.paddingTop/2,
        display: 'flex',        
        alignItems: 'center',        
    },
    imageHolder: {
        display: 'flex',        
        alignItems: 'center',
        justifyContent: 'center',        
    },
    propertyText: {
        fontSize: Constants.propertyFontSize,
        fontFamily: Constants.fontFamily
    },
    approvalStatusHolder: {
        display: 'flex',
        flexDirection: 'row'
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
    setApprovalContainer: {
        display: 'flex',
        alignItems: 'center',  
        paddingBottom: Constants.paddingTop/2         
    },
    playButtonContainer: {
        paddingTop: Constants.paddingTop,
        display: 'flex',
        alignItems: 'center'
    }
})

function convertApprovalStatusToText(approvalStatus: ConvoResponseType | undefined): string{
    if(approvalStatus === ConvoResponseType.Approved) return "Approved";
    if(approvalStatus === ConvoResponseType.Disapproved) return "Denied";
    if(approvalStatus === ConvoResponseType.Unanswered) return "Unanswered";
    if(approvalStatus === undefined) return "Unanswered";

    console.log("ERROR -- SingleConvoDetails::convertApprovalStatusToText. Unknown approval status: ", approvalStatus);
    return "ERROR";
}

function areSingleConvoMetadatasDifferent(metadata1: ConvosManager.ConvoMetadata, metadata2: ConvosManager.ConvoMetadata){
    if(areConvoStatusesDifferent(metadata1.convoStatus, metadata2.convoStatus)) return true;
    if(metadata1.convoLength !== metadata2.convoLength) return true;
    if(metadata1.initiatorId !== metadata2.initiatorId) return true;
    if(metadata1.initiatorFirstName !== metadata2.initiatorFirstName) return true;    
    if(metadata1.initiatorLastName !== metadata2.initiatorLastName) return true;
    if(metadata1.receiverId !== metadata2.receiverId) return true;
    if(metadata1.receiverFirstName !== metadata2.receiverFirstName) return true;    
    if(metadata1.receiverLastName !== metadata2.receiverLastName) return true;
    if(metadata1.timestampStarted !== metadata2.timestampStarted) return true;

    return false;
}

function areConvoStatusesDifferent(convoStatus1: ConvoStatus | undefined, convoStatus2: ConvoStatus | undefined){
    if(convoStatus1 == undefined){
        convoStatus1 = {initiatorResponse: ConvoResponseType.Unanswered, receiverResponse: ConvoResponseType.Unanswered};
    }
    if(convoStatus2 == undefined){
        convoStatus2 = {initiatorResponse: ConvoResponseType.Unanswered, receiverResponse: ConvoResponseType.Unanswered};
    }

    if(convoStatus1.initiatorResponse !== convoStatus2.initiatorResponse) return true;
    if(convoStatus1.receiverResponse !== convoStatus2.receiverResponse) return true;
    return false;
}

function getFormattedTimeFromMs(timeInMs: number): string{
    const minutes = Math.floor(timeInMs/60000);
    const seconds = ((timeInMs % 60000)/1000).toFixed(0);

    if(minutes > 1) return minutes + ' minutes';
    else if (minutes === 1) return '1 minute';
    else return seconds + ' seconds';
}