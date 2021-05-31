import React, { useEffect, useState } from 'react'
import { View, Text, Button} from 'react-native'
import {ConvoResponseType} from '../../ConvosData/ConvosManager'
import ConvosContext from '../../ConvosData/ConvosContext'
import {RefreshControl, ScrollView} from 'react-native'

export default function SingleConvoDetails({route, navigation}: any){
    const convosContext = React.useContext(ConvosContext);
    const convoId = route.params.convoId;
    const metadata = convosContext.allConvosMetadata.find((curMetadata)=>curMetadata.convoId === convoId);
    const [refreshing, setRefreshing] = useState(false); //TODO: Actually use this

    useEffect(()=>{
        convosContext.requestFetchSingleConvoStatus(convoId); //TODO: Fetch from ConvosManager here and send it up through the context
    })

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
        <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={()=>{convosContext.requestFetchSingleConvoStatus(convoId);}}/>}>
            <Text>Partner Name: {partnerName}</Text>
            <Text>Partner Phone number: {partnerPhoneNumber}</Text>
            <Text>Time of Call: {dateTime}</Text>
            <Text>Length: {convoLength}</Text>
            <Text>Partner Approval: {convertApprovalStatusToText(partnerApproval)}</Text>
            <Text>Your Approval: {convertApprovalStatusToText(myApproval)}</Text>
            <Button title="Approve" onPress={()=>{convosContext.approveOrDenySingleConvo(true, convoId)}}></Button>
            <Button title="Deny" onPress={()=>{convosContext.approveOrDenySingleConvo(false, convoId)}}>Deny</Button>
            <Button title="Refresh" onPress={()=>{convosContext.requestFetchSingleConvoStatus(convoId)}}></Button>
        </ScrollView>
    )
}

function convertApprovalStatusToText(approvalStatus: ConvoResponseType | undefined): string{
    if(approvalStatus === ConvoResponseType.Approved) return "Approved";
    if(approvalStatus === ConvoResponseType.Disapproved) return "Disapproved";
    if(approvalStatus === ConvoResponseType.Unanswered) return "Unanswered";

    console.log("ERROR -- SingleConvoDetails::convertApprovalStatusToText. Uknown approval status: ", approvalStatus);
    return "ERROR";
}

function getFormattedTimeFromTimestamp(timestamp: number): string{
    const date = new Date(timestamp * 1000);
    const hours = date.getHours();
    const minutes = "0" + date.getMinutes();
    const seconds = "0" + date.getSeconds();    

    const formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    const formattedDate = date.getMonth() + "/" + date.getDay() + "/" + date.getFullYear();
    return formattedTime + " " + formattedDate;
}

function getFormattedTimeFromMs(timeInMs: number): string{
    return ''; //TODO
}