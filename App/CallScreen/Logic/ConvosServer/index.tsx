const FileSystem = require('react-native-fs')

export default class ConvosServer{
    public uploadConvo(filePath: string, metaData: ConvoMetaData){
        //TODO: Upload to server
    }

    public getAllConvosMetaDataForUser(userUID: string): ConvoMetaData[]{
        //TODO: Fetch from server
        const allConvos = Array<ConvoMetaData>();
        return allConvos;
    }

    public getStreamingURLOfConvo(convoUID: string): string{
        //TODO
        return "";
    }

    public getSnippetURLOfConvo(convoUID: string, startTimestamp: number, endTimestamp: number): string{
        //TODO
        return "";
    }

    public approveConvo(convoUID: string, userUID: string){
        //TODO
    }

    public disapproveConvo(convoUID: string, userUID: string){
        //TODO
    }

    public _testFileUpload(filePath: string){
        //TODO
    }

    public _testFileCreationAndUpload(){        
        console.log("ConvosServer::_testFileCreationAndUpload");
        const dummyFilePath = FileSystem.DocumentDirectoryPath + '/speakupTestFile.txt'
        // FileSystem.
        
        FileSystem.writeFile(dummyFilePath, 'Hey this is a test file of speakup', 'utf8')
        .then((success)=>{
            return FileSystem.stat(dummyFilePath);
        }).then((stats)=>{
            console.log("ConvosServer::_testFileCreationAndUpload. File stats: ", stats);
        })
        .catch((error)=>{
            console.log("ERROR -- ConvosServer::_testFileCreationAndUpload: ", error);
        })
    }

    // private uploadFileToServer

}

export type ConvoMetaData = {    
    initiatorUID: string,
    receiverUID: string,
    convoUID: string,
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

type uploadRequestParams = {

}