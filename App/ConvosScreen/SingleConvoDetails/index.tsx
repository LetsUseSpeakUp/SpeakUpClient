import React, { useEffect, useState } from 'react'
import { View, Text, Button} from 'react-native'
import {ConvoResponseType, ConvoStatus} from '../../ConvosData/ConvosManager'
import * as ConvosManager from '../../ConvosData/ConvosManager'
import ConvosContext from '../../ConvosData/ConvosContext'
import {RefreshControl, ScrollView} from 'react-native'

export default function SingleConvoDetails({route}: any){
    const convosContext = React.useContext(ConvosContext);
    const convoId = route.params.convoId;
    const metadata = convosContext.allConvosMetadata.find((curMetadata)=>curMetadata.convoId === convoId);
    const [refreshing, setRefreshing] = useState(false);

    const fetchUpdatedConvoStatus = ()=>{
        setRefreshing(true);
        ConvosManager.fetchSingleConvoStatus(convoId).then((fetchedConvoStatus)=>{
            console.log("SingleConvoDetails. Fetched updated status: ", fetchedConvoStatus);
            if(areConvoStatusDifferent(fetchedConvoStatus, metadata?.convoStatus)){
                console.log("SingleConvoDetails. Convo statuses are different");
                //TODO: pass it up to app
            }
        }).catch((error)=>{
            console.log("ERROR -- SingleConvoDetails::fetchUpdatedConvoStatus. Convo Id: ", convoId , " Error: ", error);
        }).finally(()=>{
            setRefreshing(false);
        })      
    }

    useEffect(()=>{
        fetchUpdatedConvoStatus();
    }, [])

    if(metadata === undefined){
        console.log("ERROR -- SingleConvoDetails. Metadata is undefined. convoId: ", convoId);
        return(
            <View><Text>ERROR: Could not find convo with convoId {convoId}. Please contact support.</Text></View>
        );
    }
    const amIInitiator = metadata.initiatorFirstName === undefined;
    const partnerName = amIInitiator ? metadata.receiverFirstName + " " + metadata.receiverLastName :
        metadata.initiatorFirstName + " " + metadata.initiatorLastName;
    const partnerPhoneNumber = amIInitiator ? metadata.receiverId : metadata.initiatorId;
    const dateTime = getFormattedTimeFromTimestamp(metadata.timestampStarted);
    const convoLength = metadata.convoLength + " milliseconds"; //TODO: Get formatted time
    const partnerApproval = amIInitiator ? metadata.convoStatus?.receiverResponse : metadata.convoStatus?.initiatorResponse;
    const myApproval = amIInitiator ? metadata.convoStatus?.initiatorResponse : metadata.convoStatus?.receiverResponse;
    
    return(
        <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={()=>{fetchUpdatedConvoStatus()}}/>}>
            <Text>Partner Name: {partnerName}</Text>
            <Text>Partner Phone number: {partnerPhoneNumber}</Text>
            <Text>Time of Call: {dateTime}</Text>
            <Text>Length: {convoLength}</Text>
            <Text>Partner Approval: {convertApprovalStatusToText(partnerApproval)}</Text>
            <Text>Your Approval: {convertApprovalStatusToText(myApproval)}</Text>
            <Button title="Approve" onPress={()=>{convosContext.approveOrDenySingleConvo(true, convoId)}}></Button>
            <Button title="Deny" onPress={()=>{convosContext.approveOrDenySingleConvo(false, convoId)}}>Deny</Button>
            <Button title="Refresh" onPress={()=>{fetchUpdatedConvoStatus()}}></Button>
        </ScrollView>
    )
}


function convertApprovalStatusToText(approvalStatus: ConvoResponseType | undefined): string{
    if(approvalStatus === ConvoResponseType.Approved) return "Approved";
    if(approvalStatus === ConvoResponseType.Disapproved) return "Disapproved";
    if(approvalStatus === ConvoResponseType.Unanswered) return "Unanswered";
    if(approvalStatus === undefined) return "Unanswered";

    console.log("ERROR -- SingleConvoDetails::convertApprovalStatusToText. Uknown approval status: ", approvalStatus);
    return "ERROR";
}

function areConvoStatusDifferent(convoStatus1: ConvoStatus | undefined, convoStatus2: ConvoStatus | undefined){
    if(convoStatus1 == undefined){
        convoStatus1 = {initiatorResponse: ConvoResponseType.Unanswered, receiverResponse: ConvoResponseType.Unanswered};
    }
    if(convoStatus2 == undefined){
        convoStatus2 = {initiatorResponse: ConvoResponseType.Unanswered, receiverResponse: ConvoResponseType.Unanswered};
    }
    console.log("SingleConvoDetails. Convo1: ", convoStatus1, " Convo2: ", convoStatus2);

    if(convoStatus1.initiatorResponse !== convoStatus2.initiatorResponse) return true;
    if(convoStatus2.receiverResponse !== convoStatus2.receiverResponse) return true;
    return false;
}

function getFormattedTimeFromTimestamp(timestamp: number): string{
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = "0" + date.getMinutes();
    const seconds = "0" + date.getSeconds();    
    const month = date.getMonth() + 1; //0 indexed

    const formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    const formattedDate = month + "/" + date.getDate() + "/" + date.getFullYear();
    return formattedTime + " " + formattedDate;
}

function getFormattedTimeFromMs(timeInMs: number): string{
    return ''; //TODO
}