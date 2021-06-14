import FileSystem, { UploadFileItem } from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob'
import {getAuthenticationToken} from '../../AuthLogic'

// const SERVERENDPOINT = "http://192.168.86.39:3999" //During local testing, need to make this your server computer's IP
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
    console.log("ConvosManager::uploadConvo. filepath: ", filePath, " metaData: ", metaData);

    const response = await uploadConvoPromise(filePath, metaData);
    console.log("ConvosManager::uploadConvo. Response: ", response);
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
        const metadataAsReceiver = convertFetchedMetadataToConvoMetadata(metadataJson.metadataAsReceiver);
        return metadataAsInitiator.concat(metadataAsReceiver);
    }
    catch (error) {
        console.log("ERROR -- ConvosManager::fetchExisstingConvosMetadataForUser: ", error);
        return [];
    }
}

const convertFetchedMetadataToConvoMetadata = (fetchedMetadata: any[]) => {
    return fetchedMetadata.map((fetched) => {
        return convertSingleFetchedMetadataToConvoMetadata(fetched);
    })
}

const convertSingleFetchedMetadataToConvoMetadata = (singleFetchedMetadata: any)=>{
    if (!singleFetchedMetadata.initiator_first_name && !singleFetchedMetadata.receiver_first_name) {
        console.log("ERROR -- ConvosManager::convertSingleFetchedMetadataToConvoMetadata. Missing required field. Fetched data: ", singleFetchedMetadata);
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
            console.log("ConvosManager::downloadConvo. File saved to ", res.path());
            return res.path();
        }
    }).catch((error)=>{
        console.log("ERROR -- ConvosManager::downloadConvo: ", error)
        return "";
    })        
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
    console.log("ConvosManager::fetchSingleConvoMetadata. Raw: ", rawFetchedMetadata, "|Processed: ", processedFetchedMetadata);

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
        return await response.json();
    }
    else{
        throw 'HTTP Error: ' + response.status;
    }
    
}

export const _testFileCreationAndUpload = function () {
    console.log("ConvosManager::_testFileCreationAndUpload");
    const dummyFilePath = FileSystem.DocumentDirectoryPath + '/speakupTestFile.txt'

    FileSystem.writeFile(dummyFilePath, 'Hey this is a test file of speakup', 'utf8')
        .then((success) => {
            return FileSystem.stat(dummyFilePath);
        }).then((stats) => {
            console.log("ConvosManager::_testFileCreationAndUpload. File stats: ", stats);
            return uploadConvoPromise(dummyFilePath, _getDummyConvoMetadata());
        }).then((response) => {
            console.log("ConvosManager::_testFileCreationAndUpload. File uploaded with response ", response);
        })
        .catch((error) => {
            console.log("ERROR -- ConvosManager::_testFileCreationAndUpload: ", error);
        })
}

export const _testExistingFileUpload = function () {
    console.log("ConvosManager::_testExistingFileUpload")
    const existingFilePath = FileSystem.DocumentDirectoryPath + "/1623639798647_+14089167684_+1001.aac";

    FileSystem.readDir(FileSystem.DocumentDirectoryPath).then((result) => {
        const fileNames = result.map((singleFile) => singleFile.name).join();
        console.log("ConvosManager::_testExistingFileUpload. Document directory: ",
            FileSystem.DocumentDirectoryPath, " |contents: ", fileNames);
        return FileSystem.exists(existingFilePath)
    }).then((doesExist) => {
        if (!doesExist) throw ("File doesn't exist: " + existingFilePath)
        return FileSystem.stat(existingFilePath);
    }).then((statResult)=>{
        console.log("ConvosManager::_testExistingFileUpload. Stat result: ", statResult);
        return uploadConvoPromise(existingFilePath, _getDummyConvoMetadata());      
    }).then((response) => {
        console.log("ConvosManager::_testExistingFileUpload. Upload response: ", response);
    }).catch((error) => {
        console.log("ConvosManager::_testExistingFileUpload. ERROR ", error);
    })
}

export const getFormattedTimeFromTimestamp = (timestamp: number): string=>{
    const date = new Date(timestamp);
    let hours = date.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    const minutes = "0" + date.getMinutes();
    const seconds = "0" + date.getSeconds();    
    const month = date.getMonth() + 1; //0 indexed
    

    // const formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2) + ' ' + ampm;
    const formattedTime = hours + ':' + minutes.substr(-2) + ' ' + ampm;
    const formattedDate = month + "/" + date.getDate() + "/" + date.getFullYear();
    return formattedDate + " " + formattedTime;
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
    console.log("ConvosManager::uploadConvoPromise. Filestats: ", fileStats);
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