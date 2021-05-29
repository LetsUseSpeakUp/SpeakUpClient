import FileSystem, { UploadFileItem } from 'react-native-fs';

const serverEndpoint = "http://192.168.86.39:3999" //During local testing, need to make this your server computer's IP

export type ConvoMetaData = {
    initiatorId: string,
    receiverId: string,
    convoId: string,
    timestampStarted: number,
    convoLength: number,
    convoStatus?: ConvoStatus
}

export type ConvoStatus = {
    initiatorResponse: ConvoResponseType,
    receiverResponse: ConvoResponseType
}

export enum ConvoResponseType {
    Unanswered, Approved, Disapproved
}

type CurrentConvosMetadata = {fetchedFromServer: boolean, metadata: ConvoMetaData[]}
const currentConvosMetadata: CurrentConvosMetadata = {fetchedFromServer: false, metadata: []};

export const uploadConvo = function (filePath: string, metaData: ConvoMetaData) {  //TODO: Handle no connection and reupload when you have one
    console.log("ConvosManager::uploadConvo. filepath: ", filePath, " metaData: ", metaData);
   
    return uploadConvoPromise(filePath, metaData).then((response) => {
        console.log("ConvosManager::uploadConvo. Response: ", response);
        if(!currentConvosMetadata.fetchedFromServer){
            console.log("ERROR -- ConvosManager::uploadConvo. Uploading convo without having fetched from server");
            currentConvosMetadata.metadata.push(metaData);
        }
    })
}

export const getAllConvosMetadataForUser = async function (userId: string) {
    try{
        if(!currentConvosMetadata.fetchedFromServer){
            //TODO: Fetch from server
            currentConvosMetadata.fetchedFromServer = true;
        }

        return currentConvosMetadata.metadata;
    }
    catch(error){
        console.log("ERROR -- ConvosManager::getAllConvosMetadataForUser");
    }
    
    const allConvos = Array<ConvoMetaData>();
    return allConvos;
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
            return uploadConvoPromise(dummyFilePath, _getDummyConvoMetaData());
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
            return uploadConvoPromise(existingFilePath, _getDummyConvoMetaData());
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

const uploadConvoPromise = function (filePath: string, metaData: ConvoMetaData) {
    const uploadEndpoint = serverEndpoint + "/uploadAudio"
    return FileSystem.uploadFiles({
        toUrl: uploadEndpoint,
        files: [getUploadFileItem(filePath, metaData.convoId + '.aac')], //TODO: Instead of .aac, get it from the file
        fields: {
            'convoMetaData': JSON.stringify(metaData)
        }
    }).promise;
}

const _getDummyConvoMetaData = function (): ConvoMetaData {
    const dummyData: ConvoMetaData = {
        initiatorId: "DUMMYINITIATORUID",
        receiverId: "DUMMYRECEIVERUID",
        convoId: "DUMMYCONVOUID",
        timestampStarted: 123456,
        convoLength: 100
    };

    return dummyData;
}