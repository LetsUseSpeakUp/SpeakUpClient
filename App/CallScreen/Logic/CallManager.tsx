import { EventEmitter } from 'events'
import { SignalServer, MessageType, SignalServerData } from './SignalServer'
import AgoraManager from './AgoraManager'
import {ConvoMetaData} from './ConvosManager'


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
    agoraChannelName: string
    agoraManager: AgoraManager
    isInitiator = false

    constructor(myPhoneNumber: string) {
        super();

        this.myPhoneNumber = myPhoneNumber;
        this.partnerPhoneNumber = "";
        this.agoraChannelName = "";
        this.signalServer = new SignalServer();
        this.setupSignalServer(myPhoneNumber);
        this.agoraManager = new AgoraManager();
        this.setupAgoraManagerListeners();

    }

    public placeCall(receiverPhoneNumber: string) {
        this.isInitiator = true;
        this.agoraChannelName = this.agoraManager.generateChannelName(this.myPhoneNumber);
        this.joinAgoraChannel(this.agoraChannelName);
        this.partnerPhoneNumber = receiverPhoneNumber;
        this.signalServer.sendSignal({agoraChannel: this.agoraChannelName, myPhoneNumber: this.myPhoneNumber,
            receiverPhoneNumber: this.partnerPhoneNumber});
    }

    public acceptCall() {
        if(this.agoraChannelName.length == 0){
            console.log("ERROR -- CallManager.tsx. Agora Channel name is length 0");
            return;
        }
        this.isInitiator = false;
        this.joinAgoraChannel(this.agoraChannelName);
    }

    public declineCall() {        
        this.signalServer.sendDecline(this.myPhoneNumber, this.partnerPhoneNumber);
        this.resetPartner();
    }

    public endCall() {
        console.log("CallManager::endCall");
        this.leaveAgoraChannel();
        this.resetPartner();
    }

    private setupSignalServer = (myNumber: string) => {
        this.signalServer.listenForMyPhoneNumber(myNumber);
        this.signalServer.on(MessageType.Signal, (data: SignalServerData) => {            
            if(this.partnerPhoneNumber.length > 0 && data.sender != this.partnerPhoneNumber){
                console.log("CallManager::signal message received. Already connected so declining. Partner: ",
                this.partnerPhoneNumber , " Requester: ", data.sender);
                this.signalServer.sendDecline(this.myPhoneNumber, data.sender);
            }
            else if(this.partnerPhoneNumber.length == 0){
                this.partnerPhoneNumber = data.sender;
                this.agoraChannelName = data.message
                this.isInitiator = false;
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
            if(this.isInitiator)
                this.startRecording();
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
        this.agoraChannelName = "";
        this.partnerPhoneNumber = "";
    }

    private startRecording = ()=>{
        if(!this.isInitiator){
            console.log("ERROR -- CallManager::startRecording. Not initiator"); //TODO: Only initiator records until we figure out split track syncing
            return;
        }

        const convoMetaData: ConvoMetaData = {
            initiatorUID: this.isInitiator ? this.myPhoneNumber : this.partnerPhoneNumber,
            receiverUID: this.isInitiator ? this.partnerPhoneNumber : this.myPhoneNumber,
            convoUID: this.agoraChannelName,
            timestampStarted: Date.now(),
            convoLength: 0    
        };
        this.agoraManager.startRecording(convoMetaData);
    }
}

export { CallManager }