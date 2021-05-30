import FileSystem, { UploadFileItem } from 'react-native-fs';

const SERVERENDPOINT = "http://192.168.86.39:3999" //During local testing, need to make this your server computer's IP

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
    Unanswered, Approved, Disapproved
}

export const uploadConvo = async function (filePath: string, metaData: ConvoMetadata) {  //TODO: Handle no connection and reupload when you have one
    console.log("ConvosManager::uploadConvo. filepath: ", filePath, " metaData: ", metaData);
   
    const response = await uploadConvoPromise(filePath, metaData);
    console.log("ConvosManager::uploadConvo. Response: ", response);
    return response;
}

/**
 * The reason we fetch from the server instead of from disk
 * is because partner may change the approval status. Then the 
 * only way to have the latest up-to-date status is by querying the server. 
 * At some point, we can put in an optimization that writes to disk and tells the server
 * "only give me the changes since I last queried". But that's way down the line.
 * @param userId 
 */
export const fetchLatestConvosMetadataForUser = async (userId: string)=>{
    try{
        const metadataJson = await fetchAllMetadataForUser(userId);    
        const metadataAsInitiator = convertFetchedMetadataToConvoMetadata(metadataJson.metadataAsInitiator);
        const metadataAsReceiver = convertFetchedMetadataToConvoMetadata(metadataJson.metadataAsReceiver);
        return metadataAsInitiator.concat(metadataAsReceiver);
    }
    catch(error){
        console.log("ERROR -- ConvosManager::fetchExisstingConvosMetadataForUser: ", error);
        return [];
    }
}

const convertFetchedMetadataToConvoMetadata = (fetchedMetadata: any[])=>{
    return fetchedMetadata.map((fetched)=>{
        if(!fetched.initiator_first_name && !fetched.receiver_first_name){
            console.log("ERROR -- ConvosManager::convertFetchedMetadataToConvoMetadata. Missing required field. Fetched data: ", fetched);
            return;
        }
        
        const convoStatus: ConvoStatus = {
            initiatorResponse: fetched.initiator_approval,
            receiverResponse: fetched.receiver_approval
        };

        const metadata: ConvoMetadata = {
            initiatorId: fetched.initiator_phone_number,
            receiverId: fetched.receiver_phone_number,
            convoId: fetched.convo_id,
            timestampStarted: fetched.timestamp_of_start,
            convoLength: fetched.length,
            convoStatus: convoStatus,
            initiatorFirstName: fetched.initiator_first_name,
            initiatorLastName: fetched.initiator_last_name,
            receiverFirstName: fetched.receiver_first_name,
            receiverLastName: fetched.receiver_last_name
        };
        return metadata;
    })
}

/**
 * Returns a promise of the response converted to json. Caller should handle errors
 * @param userId 
 */
const fetchAllMetadataForUser = async function(userId: string){
    const getMetadataEndpoint = SERVERENDPOINT + "/convos/getmetadata/allforuser";
    const formData = new FormData();
    formData.append('phoneNumber', userId);
    const response = await fetch(getMetadataEndpoint, {
        method: 'POST',
        body: formData
    })
    if (response.status === 404) throw ('404 error: ' + response.statusText);

    const json = await response.json();
    if (response.status === 400 || response.status === 500)
        throw (response.status + " error: " + json.message);
    
    return json
}

const getStreamingURLOfConvo = function (convoId: string): string {
    //TODO
    return "";
}

const getSnippetURLOfConvo = function (convoId: string, startTimestamp: number, endTimestamp: number): string {
    //TODO
    return "";
}

const approveConvo = function (convoId: string, userId: string) {
    //TODO
}

const denyConvo = function (convoId: string, userId: string) {
    //TODO
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
    const existingFilePath = "/var/mobile/Containers/Data/Application/419EF074-75EE-4CCF-84E7-7723E6B40E9D/Documents1622056666479Phone.aac";

    FileSystem.readDir(FileSystem.DocumentDirectoryPath).then((result) => {
        const fileNames = result.map((singleFile) => singleFile.name).join();
        console.log("ConvosManager::_testExistingFileUpload. Document directory: ",
            FileSystem.DocumentDirectoryPath, " |contents: ", fileNames);
        return FileSystem.exists(existingFilePath)
    })
        .then((doesExist) => {
            if (!doesExist) throw ("File doesn't exist")
            return uploadConvoPromise(existingFilePath, _getDummyConvoMetadata());
        })
        .then((response) => {
            console.log("ConvosManager::_testExistingFileUpload. Upload response: ", response);
        })
        .catch((error) => {
            console.log("ConvosManager::_testExistingFileUpload. ERROR ", error);
        })
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

const uploadConvoPromise = function (filePath: string, metaData: ConvoMetadata) {
    const uploadEndpoint = SERVERENDPOINT + "/uploadAudio"
    return FileSystem.uploadFiles({
        toUrl: uploadEndpoint,
        files: [getUploadFileItem(filePath, metaData.convoId + '.aac')], //TODO: Instead of .aac, get it from the file
        fields: {
            'convoMetaData': JSON.stringify(metaData)
        }
    }).promise;
}

const _getDummyConvoMetadata = function (): ConvoMetadata {
    const dummyData: ConvoMetadata = {
        initiatorId: "DUMMYINITIATORUID",
        receiverId: "DUMMYRECEIVERUID",
        convoId: "DUMMYCONVOUID",
        timestampStarted: 123456,
        convoLength: 100
    };

    return dummyData;
}