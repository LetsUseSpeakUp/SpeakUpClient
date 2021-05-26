import FileSystem, {UploadFileOptions, UploadFileItem} from 'react-native-fs';

export default class ConvosServer{
    serverEndpoint = "http://192.168.86.39:3999" //During local testing, need to make this your server computer's IP

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

    public _testFileCreationAndUpload(){        
        console.log("ConvosServer::_testFileCreationAndUpload");
        const dummyFilePath = FileSystem.DocumentDirectoryPath + '/speakupTestFile.txt'
        
        FileSystem.writeFile(dummyFilePath, 'Hey this is a test file of speakup', 'utf8')
        .then((success)=>{
            return FileSystem.stat(dummyFilePath);
        }).then((stats)=>{
            console.log("ConvosServer::_testFileCreationAndUpload. File stats: ", stats);
            const uploadFileItem: UploadFileItem = {
                name: 'customDummyFile',
                filename: 'speakupTestFile',
                filepath: dummyFilePath,
                filetype: 'txt'
            };

            const uploadParams = {
                files: [uploadFileItem],
                metaData: this._getDummyConvoMetaData()
            };

            return this.uploadFileToServer(uploadParams);
        }).then((response)=>{
            console.log("ConvosServer::_testFileCreationAndUpload. File uploaded with response ", response);
        })
        .catch((error)=>{
            console.log("ERROR -- ConvosServer::_testFileCreationAndUpload: ", error);
        })
    }

    private uploadFileToServer(uploadRequestParams: UploadRequestParams){
        const uploadEndpoint = this.serverEndpoint + "/uploadAudio"
        // const uploadEndpoint = "https://en1h0hm2ty59e.x.pipedream.net/"
        return FileSystem.uploadFiles({
            toUrl: uploadEndpoint,
            files: uploadRequestParams.files,
            fields: {
                'convoMetaData': JSON.stringify(uploadRequestParams.metaData)
            }
        }).promise;
    }

    private _getDummyConvoMetaData(): ConvoMetaData{
        const dummyData: ConvoMetaData = {
            initiatorUID: "DUMMYINITIATORUID",
            receiverUID: "DUMMYRECEIVERUID",
            convoUID: "DUMMYCONVOUID",
            timestampStarted: 123456,
            convoLength: 100
        };
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

type UploadRequestParams = {
    files: UploadFileItem[],
    metaData: ConvoMetaData;
}