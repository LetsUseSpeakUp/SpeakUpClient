

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