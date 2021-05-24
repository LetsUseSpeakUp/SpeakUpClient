import { EventEmitter } from 'events'
import { SignalServer, MessageType, SignalServerData } from './SignalServer'


/**
 * Listen to these events:
 * -'callReceived' (callerPhoneNumber)
 * -'disconnected'
 * -'connected'
 * -'callDeclined'
 * 
 * TODO - Make it attempt to reconnect after disconnect if you didn't get a hangup message
 * from partner.
 */
class CallManager extends EventEmitter {

    signalServer: SignalServer
    //@ts-ignore
    myPhoneNumber: string
    partnerPhoneNumber: string
    tempAgoraChannel: string

    constructor(myPhoneNumber: string) {
        super();

        this.myPhoneNumber = myPhoneNumber;
        this.partnerPhoneNumber = "PARTNERPHONENUMBERNOTSET";
        this.tempAgoraChannel = "TEMPAGORACHANNELNOTSET";
        this.signalServer = new SignalServer();
        this.setupSignalServer(myPhoneNumber);
    }

    public placeCall(receiverPhoneNumber: string, agoraChannel: string) {
        //TODO: Join Agora Channel
        this.partnerPhoneNumber = receiverPhoneNumber;
        this.signalServer.sendSignal({agoraChannel: agoraChannel, myPhoneNumber: this.myPhoneNumber,
            receiverPhoneNumber: this.partnerPhoneNumber});
    }

    public acceptCall() {
        //TODO
            //Join agora Channel
    }

    public declineCall() {        
        this.signalServer.sendDecline(this.myPhoneNumber, this.partnerPhoneNumber);
    }

    public endCall() {
        //TODO
    }

    private setupSignalServer = (myNumber: string) => {
        this.signalServer.listenForMyPhoneNumber(myNumber);
        this.signalServer.on(MessageType.Signal, (data: SignalServerData) => {            
            //TODO
            //If already on call
            //decline
            //Else            
            this.partnerPhoneNumber = data.sender;
            this.tempAgoraChannel = data.message
            this.emit("callReceived", data.sender);
            
        })
        this.signalServer.on(MessageType.Decline, (data: SignalServerData) => {
            //TODO
            //Leave Agora channel
            this.emit("callDeclined");
        })
    }
}

export { CallManager }