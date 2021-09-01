import FileSystem, { UploadFileItem } from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob'
import {getAuthenticationToken, getMyUserInfo} from '../../AuthLogic'
import {SimplifiedContact} from '../../CallScreen/ContactsScreen/Logic'
import {getFilePathOfConvo} from '../FileUtilities'

// const SERVERENDPOINT = "http://192.168.86.39:1234/backend/needauth" //During local testing, need to make this your server computer's IP
const SERVERENDPOINT = "https://letsusespeakup.com/backend/needauth";

export type ConvoMetadata = {
    initiatorId: string,
    receiverId: string,
    convoId: string,
    timestampStarted: number,
    convoLength: number,
    convoStatus?: ConvoStatus,
    initiatorFirstName?: string,
    initiatorLastName?: string,
    receiverFirstName?: string,
    receiverLastName?: string
}

export type ConvoStatus = {
    initiatorResponse: ConvoResponseType,
    receiverResponse: ConvoResponseType
}

export enum ConvoResponseType {
    Unanswered = 0, Approved = 1, Disapproved = -1
}

export const uploadConvo = async function (filePath: string, metaData: ConvoMetadata) {  //TODO: Handle no connection and reupload when you have one
    console.log("ServerInterface::uploadConvo. filepath: ", filePath, " metaData: ", metaData);

    const response = await uploadConvoPromise(filePath, metaData);
    console.log("ServerInterface::uploadConvo. Response: ", response);
    return response;
}

/**
 * Returns token that lets user join agora channel
 * @param channelName 
 */
export const getChannelToken = async function(channelName: string, isInitiator: boolean){
    const formData = new FormData();
    formData.append('channel', channelName);
    formData.append('isInitiator', isInitiator.toString());
    const endpoint = SERVERENDPOINT + '/tokens/getchanneltoken';
    const response = await postFormDataToEndpoint(formData, endpoint);
    return response.token;        
}

export const getRtmToken = async function(){    
    const rtmEndpoint = SERVERENDPOINT + '/tokens/getrtmtoken'
    const serverResponse = await fetch(rtmEndpoint, {
        method: 'GET',
        headers: {
            Authorization: 'Bearer ' + await getAuthenticationToken()
        }
    });
    const responseJson = await serverResponse.json();
    return responseJson.token;  
}

/**
 * The reason we fetch from the server instead of from disk
 * is because partner may change the approval status. Then the 
 * only way to have the latest up-to-date status is by querying the server. 
 * At some point, we can put in an optimization that writes to disk and tells the server
 * "only give me the changes since I last queried". But that's way down the line.
 * @param userId 
 */
export const fetchLatestConvosMetadataForUser = async () => {
    try {
        const metadataJson = await fetchAllMetadataForUserFromServer();
        const metadataAsInitiator = convertFetchedMetadataToConvoMetadata(metadataJson.metadataAsInitiator);
        uploadMissingConvos(metadataAsInitiator);
        const metadataAsReceiver = convertFetchedMetadataToConvoMetadata(metadataJson.metadataAsReceiver);        
        const allMetadata = metadataAsInitiator.concat(metadataAsReceiver);
        return allMetadata.filter((metadata)=> (metadata?.timestampStarted && metadata.timestampStarted > 0));        
    }
    catch (error) {
        console.log("ERROR -- ServerInterface::fetchExisstingConvosMetadataForUser: ", error);
        return [];
    }
}

/**
 * 
 * @param convoMetadataAsInitiator 
 * To fix glitch where the convo didn't get uploaded at the end of the call
 */
const uploadMissingConvos = async (convoMetadataAsInitiator: any)=>{
    const metadata = convoMetadataAsInitiator as ConvoMetadata[];
    for(let i = 0; i < metadata.length; i++){
        const singleMetadata = metadata[i];
        if(singleMetadata.timestampStarted > 0) continue;
    
        const filePath = getFilePathOfConvo(singleMetadata.convoId);                
        const fileExists = await FileSystem.exists(filePath);
        if(fileExists){
            console.log("ServerInterface::uploadMissingConvos. Found convo for id |" , singleMetadata.convoId, "|. Uploading.");
            singleMetadata.convoLength = 600000; //Not accurate but fine for now
            singleMetadata.timestampStarted = parseInt(singleMetadata.convoId.substring(0, singleMetadata.convoId.indexOf('_')));
            await uploadConvo(filePath, singleMetadata);            
        }                
    }    
}

const convertFetchedMetadataToConvoMetadata = (fetchedMetadata: any[]) => {
    return fetchedMetadata.map((fetched) => {
        return convertSingleFetchedMetadataToConvoMetadata(fetched);
    })
}

const convertSingleFetchedMetadataToConvoMetadata = (singleFetchedMetadata: any)=>{
    if (!singleFetchedMetadata.initiator_first_name && !singleFetchedMetadata.receiver_first_name) {
        console.log("ERROR -- ServerInterface::convertSingleFetchedMetadataToConvoMetadata. Missing required field. Fetched data: ", singleFetchedMetadata);
        return;
    }

    const convoStatus: ConvoStatus = {
        initiatorResponse: singleFetchedMetadata.initiator_approval ?? 0,
        receiverResponse: singleFetchedMetadata.receiver_approval ?? 0
    };

    const metadata: ConvoMetadata = {
        initiatorId: singleFetchedMetadata.initiator_phone_number ?? singleFetchedMetadata.initiator_number,
        receiverId: singleFetchedMetadata.receiver_phone_number ?? singleFetchedMetadata.receiver_number,
        convoId: singleFetchedMetadata.convo_id ?? singleFetchedMetadata.id,
        timestampStarted: singleFetchedMetadata.timestamp_of_start,
        convoLength: singleFetchedMetadata.length,
        convoStatus: convoStatus,
        initiatorFirstName: singleFetchedMetadata.initiator_first_name,
        initiatorLastName: singleFetchedMetadata.initiator_last_name,
        receiverFirstName: singleFetchedMetadata.receiver_first_name,
        receiverLastName: singleFetchedMetadata.receiver_last_name
    };
    return metadata;
}

/**
 * Returns a promise of the response converted to json. Caller should handle errors
 * @param userId 
 */
const fetchAllMetadataForUserFromServer = async function () {
    const getMetadataEndpoint = SERVERENDPOINT + "/convos/getmetadata/allforuser";
    const formData = new FormData();    
    return postFormDataToEndpoint(formData, getMetadataEndpoint);
}

const getStreamingURLOfConvo = function (convoId: string): string {
    //TODO
    return "";
}

export const downloadConvo = async function (convoId: string){
    const downloadConvoEndpoint = SERVERENDPOINT + '/convos/retrieve?convoId=' + encodeURIComponent(convoId);
    const downloadPath = FileSystem.TemporaryDirectoryPath + Date.now() + '.aac';
    
    return RNFetchBlob.config({ //TODO: Refactor into its own method
        path: downloadPath
    }).fetch('GET', downloadConvoEndpoint, {Authorization: 'Bearer ' + await getAuthenticationToken()}).then((res)=>{
        const status = res.info().status;
        if(status !== 200) throw 'Status code: ' + status + ' Text: ' + res.text();
        else{
            console.log("ServerInterface::downloadConvo. File saved to ", res.path());
            return res.path();
        }
    }).catch((error)=>{
        console.log("ERROR -- ServerInterface::downloadConvo: ", error)
        return "";
    })        
}

/**
 * Actual user info is contained in the auth token so no form data is necessary
 */
export const addNewUser = async ()=>{
    const addUserEndpoint = SERVERENDPOINT + '/users/addUser';
    const formData = new FormData();
    return postFormDataToEndpoint(formData, addUserEndpoint);
}

export const getContactsOnSpeakup = async (userContacts: SimplifiedContact []): Promise<SimplifiedContact[]>=>{
    const getContactsEndpoint = SERVERENDPOINT + '/users/getcontacts';
    const phoneNumbersOnly = userContacts.map((userContact)=>userContact.phoneNumber);
    const formData = new FormData();
    formData.append('contacts', JSON.stringify(phoneNumbersOnly));
    try{
        const serverResponse = await postFormDataToEndpoint(formData, getContactsEndpoint);
        console.log("ServerInterface::getContactsOnSpeakup. Server response: ", serverResponse);
        let contactsInSpeakupObject =  serverResponse.contactsInDb;
        if(typeof(contactsInSpeakupObject === 'string')) contactsInSpeakupObject = JSON.parse(contactsInSpeakupObject);
        let contactsInSpeakup = Object.keys(contactsInSpeakupObject).map((key)=>contactsInSpeakupObject[key]);
        
        const userInfo = await getMyUserInfo();        
        return userContacts.filter((userContact)=>{
            return (contactsInSpeakup.includes(userContact.phoneNumber) && userContact.phoneNumber !== userInfo.phoneNumber);
        });
    }
    catch(error){
        console.log("ERROR -- ServerInterface::getContactsOnSpeakup: ", error);
        return [];
    }
    
}

/**
 * Returns a URL
 * @param convoId 
 * @param startTimestamp 
 * @param endTimestamp 
 * @param description 
 * @returns 
 */
export const generateSnippetLink = async function (convoId: string, startTimestamp: number, endTimestamp: number, description: string): Promise<string> {
    startTimestamp = parseFloat(startTimestamp.toFixed(1));
    endTimestamp = parseFloat(endTimestamp.toFixed(1));    
    
    const generateSnippetEndpoint = SERVERENDPOINT + '/convos/addsnippet';
    const formData = new FormData();
    formData.append('convoId', convoId);
    formData.append('snippetStart', startTimestamp.toString());
    formData.append('snippetEnd', endTimestamp.toString());
    formData.append('snippetDescription', description);

    const response = await postFormDataToEndpoint(formData, generateSnippetEndpoint);
    if(!response.snippetLink){
        throw 'bad response'
    }
    else{
        return  response.snippetLink;
    }
}

export const approveConvo = function (convoId: string, userId: string) {
    const approveConvoEndpoint = SERVERENDPOINT + "/convos/setapproval";
    const formData = new FormData();
    formData.append('convoId', convoId);
    formData.append('phoneNumber', userId);
    formData.append('approval', '1');

    postFormDataToEndpoint(formData, approveConvoEndpoint);
}

export const denyConvo = function (convoId: string, userId: string) {
    const approveConvoEndpoint = SERVERENDPOINT + "/convos/setapproval";
    const formData = new FormData();
    formData.append('convoId', convoId);
    formData.append('phoneNumber', userId);
    formData.append('approval', '-1');

    postFormDataToEndpoint(formData, approveConvoEndpoint);
}

export const fetchSingleConvoMetadata = async function(convoId: string){
    const fetchStatusEndpoint = SERVERENDPOINT + "/convos/getmetadata/singleconvo";
    const formData = new FormData();
    formData.append('convoId', convoId);    
    const rawFetchedMetadata = await postFormDataToEndpoint(formData, fetchStatusEndpoint);
    const processedFetchedMetadata = convertSingleFetchedMetadataToConvoMetadata(rawFetchedMetadata);
    console.log("ServerInterface::fetchSingleConvoMetadata. Raw: ", rawFetchedMetadata, "|Processed: ", processedFetchedMetadata);

    return processedFetchedMetadata;
}

const postFormDataToEndpoint = async function (formData: FormData, serverEndpoint: string) {
    const response = await fetch(serverEndpoint, {
        method: 'POST',        
        headers: {
            Authorization: 'Bearer ' + await getAuthenticationToken()
        },
        body: formData
    });

    if (response.status === 404){
        throw ('404 error: ' + response.statusText);
    } 
    else if (response.status === 400 || response.status === 500){
        const json = await response.json();
        throw (response.status + " error: " + json.message.message);
    }
    else if(response.status === 200){        
        try{
            return await response.json();
        }
        catch(error){
            throw error + ': ' + response;
        }
        
    }
    else{
        throw 'HTTP Error: ' + response.status;
    }
    
}

export const _testFileCreationAndUpload = function () {
    console.log("ServerInterface::_testFileCreationAndUpload");
    const dummyFilePath = FileSystem.DocumentDirectoryPath + '/speakupTestFile.txt'

    FileSystem.writeFile(dummyFilePath, 'Hey this is a test file of speakup', 'utf8')
        .then((success) => {
            return FileSystem.stat(dummyFilePath);
        }).then((stats) => {
            console.log("ServerInterface::_testFileCreationAndUpload. File stats: ", stats);
            return uploadConvoPromise(dummyFilePath, _getDummyConvoMetadata());
        }).then((response) => {
            console.log("ServerInterface::_testFileCreationAndUpload. File uploaded with response ", response);
        })
        .catch((error) => {
            console.log("ERROR -- ServerInterface::_testFileCreationAndUpload: ", error);
        })
}

export const _testExistingFileUpload = function () {
    console.log("ServerInterface::_testExistingFileUpload")
    const existingFilePath = FileSystem.DocumentDirectoryPath + "/1623639798647_+14089167684_+1001.aac";

    FileSystem.readDir(FileSystem.DocumentDirectoryPath).then((result) => {
        const fileNames = result.map((singleFile) => singleFile.name).join();
        console.log("ServerInterface::_testExistingFileUpload. Document directory: ",
            FileSystem.DocumentDirectoryPath, " |contents: ", fileNames);
        return FileSystem.exists(existingFilePath)
    }).then((doesExist) => {
        if (!doesExist) throw ("File doesn't exist: " + existingFilePath)
        return FileSystem.stat(existingFilePath);
    }).then((statResult)=>{
        console.log("ServerInterface::_testExistingFileUpload. Stat result: ", statResult);
        return uploadConvoPromise(existingFilePath, _getDummyConvoMetadata());      
    }).then((response) => {
        console.log("ServerInterface::_testExistingFileUpload. Upload response: ", response);
    }).catch((error) => {
        console.log("ServerInterface::_testExistingFileUpload. ERROR ", error);
    })
}

//TODO: Refactor to a more appropriate file
export const getFormattedDateAndTimeFromTimestamp = (timestamp: number): string=>{
    const date = new Date(timestamp);
    let hours = date.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    if(hours !== 12) hours = hours % 12;            
    const minutes = "0" + date.getMinutes();
    const seconds = "0" + date.getSeconds();        
    
    const formattedTime = hours + ':' + minutes.substr(-2) + ' ' + ampm;
    const formattedDate = getFormattedDateFromTimestamp(timestamp);
    return formattedDate + " " + formattedTime;
}

//TODO: Refactor to a more appropriate file
export const getFormattedDateFromTimestamp = (timestamp: number): string=>{
    const date = new Date(timestamp);
    const month = date.getMonth() + 1; //0 indexed
    const formattedDate = month + "/" + date.getDate() + "/" + date.getFullYear().toString().substring(2, 4);

    return formattedDate;
}

const getUploadFileItem = function (filePath: string, fileName: string) {
    const uploadFileItem: UploadFileItem = {
        name: 'convoFile',
        filename: fileName,
        filepath: filePath,
        filetype: 'aac' //TODO: get it from the file
    }
    return uploadFileItem;
}

const uploadConvoPromise = async function (filePath: string, metaData: ConvoMetadata) {
    const uploadEndpoint = SERVERENDPOINT + "/convos/upload"
    const fileStats = await FileSystem.stat(filePath);
    console.log("ServerInterface::uploadConvoPromise. Filestats: ", fileStats);
    return FileSystem.uploadFiles({
        toUrl: uploadEndpoint,
        files: [getUploadFileItem(filePath, metaData.convoId + '.aac')], //TODO: Instead of .aac, get it from the file
        fields: {
            'convoMetadata': JSON.stringify(metaData)
        },
        headers: {
            Authorization: 'Bearer ' + await getAuthenticationToken()
        }
    }).promise;
}

const _getDummyConvoMetadata = function (): ConvoMetadata {
    const dummyData: ConvoMetadata = {
        initiatorId: "+14089167684",
        receiverId: "+1001",
        convoId: "DUMMYCONVOUID" + Date.now(),
        // convoId: '1623639798647_+14089167684_+1001',
        timestampStarted: 123456,
        convoLength: 100
    };

    return dummyData;
}