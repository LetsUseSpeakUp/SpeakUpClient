import FileSystem, {UploadFileOptions, UploadFileItem} from 'react-native-fs';

export default class ConvosServer{
    serverEndpoint = "http://192.168.86.39:3999" //During local testing, need to make this your server computer's IP

    public uploadConvo(filePath: string, metaData: ConvoMetaData){ //TODO: Handle no connection so reupload when you have one
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

    public _testFileCreationAndUpload(){        
        console.log("ConvosServer::_testFileCreationAndUpload");
        const dummyFilePath = FileSystem.DocumentDirectoryPath + '/speakupTestFile.txt'
        
        FileSystem.writeFile(dummyFilePath, 'Hey this is a test file of speakup', 'utf8')
        .then((success)=>{
            return FileSystem.stat(dummyFilePath);
        }).then((stats)=>{
            console.log("ConvosServer::_testFileCreationAndUpload. File stats: ", stats);
            return this.uploadFileToServer(dummyFilePath, this._getDummyConvoMetaData());
        }).then((response)=>{
            console.log("ConvosServer::_testFileCreationAndUpload. File uploaded with response ", response);
        })
        .catch((error)=>{
            console.log("ERROR -- ConvosServer::_testFileCreationAndUpload: ", error);
        })
    }

    private uploadFileToServer(filePath: string, metaData: ConvoMetaData){
        const uploadEndpoint = this.serverEndpoint + "/uploadAudio"        
        return FileSystem.uploadFiles({
            toUrl: uploadEndpoint,
            files: [this.getUploadFileItem(filePath, metaData.convoUID)],
            fields: {
                'convoMetaData': JSON.stringify(metaData)
            }
        }).promise;
    }

    private getUploadFileItem(filePath: string, fileName: string){
        const uploadFileItem: UploadFileItem = {
            name: 'convoFile',
            filename: fileName,
            filepath: filePath,
            filetype: 'aac' //TODO: get it from the file
        }
        return uploadFileItem;
    }


    private _getDummyConvoMetaData(): ConvoMetaData{
        const dummyData: ConvoMetaData = {
            initiatorUID: "DUMMYINITIATORUID",
            receiverUID: "DUMMYRECEIVERUID",
            convoUID: "DUMMYCONVOUID",
            timestampStarted: 123456,
            convoLength: 100
        };

        return dummyData;
    }

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