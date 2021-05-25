import { EventEmitter } from 'events'
import { SignalServer, MessageType, SignalServerData } from './SignalServer'


/**
 * Listen to these events:
 * -'callReceived' also returns (callerPhoneNumber)
 * -'disconnected'
 * -'connected'
 * -'callDeclined'
 * 
 */
class CallManager extends EventEmitter {

    signalServer: SignalServer
    myPhoneNumber: string
    partnerPhoneNumber: string
    tempAgoraChannel: string
    agoraManager: any //TODO

    constructor(myPhoneNumber: string) {
        super();

        this.myPhoneNumber = myPhoneNumber;
        this.partnerPhoneNumber = "PARTNERPHONENUMBERNOTSET";
        this.tempAgoraChannel = "TEMPAGORACHANNELNOTSET";
        this.signalServer = new SignalServer();
        this.setupSignalServer(myPhoneNumber);
        //TODO: init agoraManager
        this.setupAgoraManager();

    }

    public placeCall(receiverPhoneNumber: string) {
        const agoraChannelName = this.generateAgoraChannelName(this.myPhoneNumber);
        this.joinAgoraChannel(agoraChannelName);
        this.partnerPhoneNumber = receiverPhoneNumber;
        this.signalServer.sendSignal({agoraChannel: agoraChannelName, myPhoneNumber: this.myPhoneNumber,
            receiverPhoneNumber: this.partnerPhoneNumber});
    }

    public acceptCall() {
        if(this.tempAgoraChannel.length == 0){
            console.log("ERROR -- CallManager.tsx. Temp Agora Channel name is length 0");
            return;
        }
        
        this.joinAgoraChannel(this.tempAgoraChannel);
    }

    public declineCall() {        
        this.signalServer.sendDecline(this.myPhoneNumber, this.partnerPhoneNumber);
        this.resetPartner();
    }

    public endCall() {
        this.leaveAgoraChannel();
        this.resetPartner();
    }

    private setupSignalServer = (myNumber: string) => {
        this.signalServer.listenForMyPhoneNumber(myNumber);
        this.signalServer.on(MessageType.Signal, (data: SignalServerData) => {            
            if(this.partnerPhoneNumber.length > 0){
                this.signalServer.sendDecline(this.myPhoneNumber, data.sender);
            }
            else{
                this.partnerPhoneNumber = data.sender;
                this.tempAgoraChannel = data.message
                this.emit("callReceived", data.sender);
            }
        })
        this.signalServer.on(MessageType.Decline, (data: SignalServerData) => {
            this.leaveAgoraChannel();            
            this.emit("callDeclined");
            this.resetPartner();
        })
    }

    private setupAgoraManager = ()=>{
        //TODO
            //TODO: emit connect when partner streams
            //TODO: emit disconnect when partner loses stream
    }

    private joinAgoraChannel = (channelName: string)=>{
        //TODO
        //TODO: Put a timeout - if you don't connect to partner within 30 seconds, disconnect        
    }

    private leaveAgoraChannel = ()=>{
        //TODO
    }

    private generateAgoraChannelName = (myNumber: string):string=>{
        return "TODOSETAGORACHANNEL"; //TODO: Put this in agoraManager
    }

    private resetPartner = ()=>{
        this.tempAgoraChannel = "";
        this.partnerPhoneNumber = "";
    }
}

export { CallManager }