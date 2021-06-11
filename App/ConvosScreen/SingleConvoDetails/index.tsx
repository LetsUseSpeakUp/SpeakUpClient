import React, { useEffect, useState } from 'react'
import { View, Text, Button} from 'react-native'
import {ConvoResponseType, ConvoStatus} from '../../ConvosData/ConvosManager'
import * as ConvosManager from '../../ConvosData/ConvosManager'
import ConvosContext from '../../ConvosData/ConvosContext'
import {RefreshControl, ScrollView} from 'react-native'

export default function SingleConvoDetails({route, navigation}: any){
    const convosContext = React.useContext(ConvosContext);
    const convoId = route.params.convoId;
    const metadata = convosContext.allConvosMetadata.find((curMetadata)=>curMetadata.convoId === convoId);    
    const [refreshing, setRefreshing] = useState(false);

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
        ConvosManager.downloadConvo(convoId).then((filePath)=>{
            console.log("SingleConvoDetail::downloadAudioFile. File downloaded: ", filePath);
            const firstName = amIInitiator ? metadata?.initiatorFirstName : metadata?.receiverFirstName;
            navigation.navigate('Convo Player', {audioFilePath: filePath, convoId: convoId, firstName: firstName});
        }).catch((error)=>{
            console.log("ERROR -- SingleConvoDetail::downloadAudioFile: ", error);
        })
    }

    if(metadata === undefined){
        console.log("ERROR -- SingleConvoDetails. Metadata is undefined. convoId: ", convoId);
        return(
            <View><Text>ERROR: Could not find convo with convoId {convoId}. Please contact support.</Text></View>
        );
    }
    const amIInitiator = (metadata.initiatorId != null && metadata.receiverId != null) ? (convosContext.myPhoneNumber === metadata.initiatorId) : 
        metadata.initiatorFirstName === undefined;
    const partnerName = amIInitiator ? metadata.receiverFirstName + " " + metadata.receiverLastName :
        metadata.initiatorFirstName + " " + metadata.initiatorLastName;
    const partnerPhoneNumber = amIInitiator ? metadata.receiverId : metadata.initiatorId;
    const dateTime = metadata.timestampStarted ? ConvosManager.getFormattedTimeFromTimestamp(metadata.timestampStarted) : 'Loading';
    const convoLength = metadata.convoLength ? metadata.convoLength + " milliseconds" : 'Loading'; //TODO: Get formatted time
    const partnerApproval = amIInitiator ? metadata.convoStatus?.receiverResponse : metadata.convoStatus?.initiatorResponse;
    const myApproval = amIInitiator ? metadata.convoStatus?.initiatorResponse : metadata.convoStatus?.receiverResponse;

    const doubleApproved = (myApproval === ConvoResponseType.Approved) && (partnerApproval === ConvoResponseType.Approved);
    
    return(
        <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={()=>{fetchUpdatedConvoMetadata()}}/>}>
            <Text>Partner Name: {partnerName}</Text>
            <Text>Partner Phone number: {partnerPhoneNumber}</Text>
            <Text>Time of Call: {dateTime}</Text>
            <Text>Length: {convoLength}</Text>
            <Text>Partner Approval: {convertApprovalStatusToText(partnerApproval)}</Text>
            <Text>Your Approval: {convertApprovalStatusToText(myApproval)}</Text>
            <Button title="Approve" onPress={()=>{convosContext.approveOrDenySingleConvo(true, convoId)}}></Button>
            <Button title="Deny" onPress={()=>{convosContext.approveOrDenySingleConvo(false, convoId)}}>Deny</Button>
            <Button title="Refresh" onPress={()=>{fetchUpdatedConvoMetadata()}}></Button>
            <Button title="Play" onPress={()=>{downloadAudioFile()}} disabled={!doubleApproved}/>
            {!doubleApproved && <Text>Need approval from both you and your partner to play</Text>}
            
        </ScrollView>
    )
}

function convertApprovalStatusToText(approvalStatus: ConvoResponseType | undefined): string{
    if(approvalStatus === ConvoResponseType.Approved) return "Approved";
    if(approvalStatus === ConvoResponseType.Disapproved) return "Disapproved";
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
    return ''; //TODO
}