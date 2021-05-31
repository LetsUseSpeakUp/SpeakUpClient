import { EventEmitter } from 'events'
import { SignalServer, MessageType, SignalServerData } from './SignalServer'
import AgoraManager from './AgoraManager'
import {ConvoMetadata, uploadConvo} from '../../ConvosData/ConvosManager'


/**
 * Listen to these events:
 * -'callReceived' returns (callerPhoneNumber)
 * -'disconnected' 
 * This event is important, because the calling system won't be ready to call again
 * until it's sent out the disconnected message.
 * -'connected'
 * -'callDeclined'
 * -'convoAdded' returns (convoMetadata)
 */
class CallManager extends EventEmitter {

    signalServer: SignalServer
    myPhoneNumber: string
    partnerPhoneNumber: string
    agoraChannelName: string
    agoraManager: AgoraManager
    isInitiator = false
    convoMetadata: ConvoMetadata | undefined

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
        
        if(this.agoraManager.isConnectedToPartner()){
            this.leaveAgoraChannel();
            this.resetPartner();
            this.finalizeConvoMetadata();
        }
        else{
            this.leaveAgoraChannel();
            this.resetPartner();            
        }        
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
        this.agoraManager.on('leftChannelWithoutRecording', ()=>{  
            console.log("CallManager. onAgoraManager leftChannelWithoutRecording");
            this.emit('disconnected');
        })
        this.agoraManager.on('leftChannel', ()=>{            
            console.log("CallManager. onAgoraManager leftChannel");
        })
        this.agoraManager.on('partnerJoined', ()=>{
            this.emit('connected');
            this.initializeConvoMetadata();
            if(this.isInitiator)
                this.startRecording();
        })
        this.agoraManager.on('partnerDisconnected', ()=>{
            this.endCall();
        })
        this.agoraManager.on('recordingComplete', ()=>{
            this.uploadConvo();
            this.emit('disconnected');
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
        if(this.convoMetadata === undefined){
            console.log("ERROR -- CallManager::startRecording. convoMetadata is null");
            return;
        }
                 
        this.agoraManager.startRecording(this.convoMetadata.convoId);
    }

    private initializeConvoMetadata = ()=>{
        this.convoMetadata = {
            initiatorId: this.isInitiator ? this.myPhoneNumber : this.partnerPhoneNumber,
            receiverId: this.isInitiator ? this.partnerPhoneNumber : this.myPhoneNumber,
            convoId: this.agoraChannelName,
            timestampStarted: Date.now(),
            convoLength: 0    
        };
    }

    private finalizeConvoMetadata = ()=>{
        if(this.convoMetadata === undefined){
            console.log("ERROR -- CallManager::finalizeConvoMetadata. ConvoMetadata is null");
            return;
        }
        
        const convoLength = Date.now() - this.convoMetadata.timestampStarted;
        this.convoMetadata.convoLength = convoLength;
        this.emit('convoAdded', this.convoMetadata);
    }

    private uploadConvo = async ()=>{
        try{
            if(this.convoMetadata === undefined){            
                throw 'Convometadata is null';
            }
            if(this.convoMetadata.convoLength === 0){
                console.log("ERROR -- CallManager::uploadConvo. Convometadata was not finalized. Finalizing and uploading.");
                this.finalizeConvoMetadata();
            }
            const filePath =  this.agoraManager.getFilePathOfConvo(this.convoMetadata.convoId)
            return await uploadConvo(filePath, this.convoMetadata);
        }
        catch(error){
            console.log("ERROR -- CallManager::uploadConvo: ", error, " metadata: ", this.convoMetadata);
        }
    }
}

export { CallManager }