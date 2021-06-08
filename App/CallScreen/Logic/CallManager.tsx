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
 * -'connected': called only when the user has joined the channel and the partner has joined the channel as well
 * -'callDeclined'
 * -'convoAdded' returns (convoMetadata)
 */
class CallManager extends EventEmitter {

    signalServer: SignalServer
    myPhoneNumber: string
    myFirstName: string
    myLastName: string
    partnerPhoneNumber: string        
    agoraChannelName: string
    agoraManager: AgoraManager
    isInitiator = false
    convoMetadata: ConvoMetadata | undefined

    constructor(myPhoneNumber: string, myFirstName: string, myLastName: string) {
        super();

        this.myPhoneNumber = myPhoneNumber;
        this.myFirstName = myFirstName;
        this.myLastName = myLastName;
        this.partnerPhoneNumber = "";                
        this.agoraChannelName = "";
        this.signalServer = new SignalServer();
        this.setupSignalServer(myPhoneNumber);
        this.agoraManager = new AgoraManager();
        this.setupAgoraManagerListeners();

    }

    public async placeCall(receiverPhoneNumber: string) {
        try{                        
            this.isInitiator = true;
            this.agoraChannelName = this.agoraManager.generateChannelName(this.myPhoneNumber, receiverPhoneNumber);
            this.agoraManager.joinChannel(this.agoraChannelName, this.isInitiator);
            this.partnerPhoneNumber = receiverPhoneNumber;
            this.signalServer.sendSignal({agoraChannel: this.agoraChannelName, myPhoneNumber: this.myPhoneNumber,
                myFirstName: this.myFirstName, myLastName: this.myLastName, receiverPhoneNumber: this.partnerPhoneNumber});
        }
        catch(error){
            console.log("ERROR -- CallManager::placeCall. Unable to get user info for receiver: ", 
            receiverPhoneNumber , " Error message: ", error);
        }
    }

    public acceptCall() {
        if(this.agoraChannelName.length == 0){
            console.log("ERROR -- CallManager.tsx. Agora Channel name is length 0");
            return;
        }
        this.isInitiator = false;        
        this.agoraManager.joinChannel(this.agoraChannelName, this.isInitiator);
    }

    public declineCall() {        
        this.signalServer.sendDecline(this.myPhoneNumber, this.partnerPhoneNumber);
        this.resetCallState();
    }

    public endCall() {
        console.log("CallManager::endCall");
        this.leaveAgoraChannel();            
    }

    private setupSignalServer = (myNumber: string) => {
        this.signalServer.listenForMyPhoneNumber(myNumber);
        this.signalServer.on(MessageType.Signal, async (data: SignalServerData) => {            
            if(this.partnerPhoneNumber.length > 0 && data.sender != this.partnerPhoneNumber){
                console.log("CallManager::signal message received. Already connected so declining. Partner: ",
                this.partnerPhoneNumber , " Requester: ", data.sender);
                this.signalServer.sendDecline(this.myPhoneNumber, data.sender);
            }
            else if(this.partnerPhoneNumber.length == 0){
                try{
                    const parsedUserInfo = JSON.parse(data.message);                
                    const callerFirstName = parsedUserInfo.firstName;
                    const callerLastName = parsedUserInfo.lastName;
                    this.partnerPhoneNumber = data.sender;
                    this.agoraChannelName = parsedUserInfo.channel;
                    this.isInitiator = false;
                    this.emit("callReceived", data.sender, callerFirstName, callerLastName);
                }
                catch(error){
                    console.log("ERROR -- CallManager.onSignalReceived. Could not find user info for signaller: ", 
                    data.sender, " . Declining call. Error message: ", error);
                    this.signalServer.sendDecline(this.myPhoneNumber, data.sender);
                }
            }
        })
        this.signalServer.on(MessageType.Decline, (data: SignalServerData) => {
            this.emit("callDeclined");
            this.endCall();            
        })
    }

    private setupAgoraManagerListeners = ()=>{
        this.agoraManager.on('leftChannelWithoutConnecting', ()=>{
            console.log("CallManager. onAgoraManager leftChannelWithoutRecording");
            this.finalizeConvoMetadata();
            this.resetCallState();
            this.emit('disconnected');
        })
        this.agoraManager.on('leftChannel', ()=>{            
            console.log("CallManager. onAgoraManager leftChannel");
            const finalizedMetadata = this.finalizeConvoMetadata();
            this.resetCallState();
            this.emit('disconnected');
            this.emit('convoAdded', finalizedMetadata);
            if(finalizedMetadata !== undefined)
                this.agoraManager.stopRecording(finalizedMetadata);
            else{
                console.log("ERROR -- CallManager onAgoraManager left channel. Convo metadata is null");
            }
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
        this.agoraManager.on('recordingComplete', (convoMetadata: ConvoMetadata)=>{
            this.uploadConvo(convoMetadata);            
        })
        this.agoraManager.on('tokenWillExpire', ()=>{
            //TODO
        })                
    }    

    private leaveAgoraChannel = ()=>{        
        this.agoraManager.leaveChannel();
    }

    private resetCallState = ()=>{
        this.agoraChannelName = "";
        this.partnerPhoneNumber = "";     
        this.partnerFirstName = "";
        this.partnerLastName = "";
        this.convoMetadata = undefined;        
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
            receiverFirstName: this.isInitiator ? this.partnerFirstName : undefined,
            receiverLastName: this.isInitiator ? this.partnerLastName: undefined,
            initiatorFirstName: this.isInitiator ? undefined : this.partnerFirstName,
            initiatorLastName: this.isInitiator ? undefined: this.partnerLastName,
            convoId: this.agoraChannelName,
            timestampStarted: Date.now(),
            convoLength: 0    
        };
    }

    private finalizeConvoMetadata = (): ConvoMetadata | undefined=>{
        if(this.convoMetadata === undefined){
            console.log("CallManager::finalizeConvoMetadata. ConvoMetadata is null");
            return undefined;
        }
        
        const convoLength = Date.now() - this.convoMetadata.timestampStarted;
        this.convoMetadata.convoLength = convoLength;
        const finalizedMetadata = this.convoMetadata;
        this.convoMetadata = undefined;
        return finalizedMetadata;
    }

    private uploadConvo = async (associatedMetadata: ConvoMetadata)=>{
        try{            
            const filePath =  this.agoraManager.getFilePathOfConvo(associatedMetadata.convoId)
            return await uploadConvo(filePath, associatedMetadata);
        }
        catch(error){
            console.log("ERROR -- CallManager::uploadConvo: ", error, " metadata: ", associatedMetadata);
        }
    }
}

export { CallManager }