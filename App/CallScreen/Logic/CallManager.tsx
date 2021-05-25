import { EventEmitter } from 'events'
import { SignalServer, MessageType, SignalServerData } from './SignalServer'
import AgoraManager from './AgoraManager'


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
    agoraManager: AgoraManager //TODO

    constructor(myPhoneNumber: string) {
        super();

        this.myPhoneNumber = myPhoneNumber;
        this.partnerPhoneNumber = "PARTNERPHONENUMBERNOTSET";
        this.tempAgoraChannel = "TEMPAGORACHANNELNOTSET";
        this.signalServer = new SignalServer();
        this.setupSignalServer(myPhoneNumber);
        this.agoraManager = new AgoraManager();
        this.setupAgoraManagerListeners();

    }

    public placeCall(receiverPhoneNumber: string) {
        const agoraChannelName = this.agoraManager.generateChannelName(this.myPhoneNumber);
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
            this.emit("callDeclined");
            this.endCall();            
        })
    }

    private setupAgoraManagerListeners = ()=>{
        this.agoraManager.on('disconnected', ()=>{
            this.emit('disconnected');
            this.endCall();
        })
        this.agoraManager.on('partnerJoined', ()=>{
            this.emit('connected');
        })
        this.agoraManager.on('partnerDisconnected', ()=>{
            this.emit('disconnected');
            this.endCall();
        })
        this.agoraManager.on('tokenWillExpire', ()=>{
            //TODO
        })            
    }

    private joinAgoraChannel = (channelName: string)=>{
        this.agoraManager.joinChannel(channelName);                
    }

    private leaveAgoraChannel = ()=>{        
        this.agoraManager.leaveChannel();
    }

    private resetPartner = ()=>{
        this.tempAgoraChannel = "";
        this.partnerPhoneNumber = "";
    }
}

export { CallManager }