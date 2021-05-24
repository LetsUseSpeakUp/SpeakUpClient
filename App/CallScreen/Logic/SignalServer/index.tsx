import {EventEmitter} from 'events'
const SignalHub = require('./signalhub')

/**
 * Emits Signals and allows you to send Signals
 * to other Clients
 * 
 * use signalServerObject.on('signal', (signalJSON)=>{handleSignal(signalJson)})
 * to subscribe to signals
 * 
 */

type SignalServerData = {
    type: MessageType,
    sender: string,
    message: string
}

enum MessageType{
    Signal = "signal",
    Decline = "decline"
}

class SignalServer extends EventEmitter{
    signalHub: any

    
    constructor(){
        super();
        this.initialize();                
    }

    initialize(){
        const SERVERENDPOINT = 'https://browsercoin.herokuapp.com/';
        this.signalHub = SignalHub('speakup', [SERVERENDPOINT]);
    }

    sendSignal({agoraChannel="", myPhoneNumber="", receiverPhoneNumber=""}){ //TODO: Encrypt this data
        const data: SignalServerData = {
            type: MessageType.Signal,
            sender: myPhoneNumber,
            message: agoraChannel
        }

        
        console.log("SignalServer::sendSignal. Receiver: ", receiverPhoneNumber);
        this.signalHub.broadcast(receiverPhoneNumber, data);
    }

    sendDecline(myPhoneNumber: string, receiverPhoneNumber: string){
        const data: SignalServerData = {
            type: MessageType.Decline,
            sender: myPhoneNumber,
            message: ""
        }    
        
        console.log("SignalServer::sendDecline. Receiver: ", receiverPhoneNumber);
        this.signalHub.broadcast(receiverPhoneNumber, data);
    }

    listenForMyPhoneNumber(myPhoneNumber: string){
        console.log("SignalSever::listenForMyPhoneNumber. My phone number: ", myPhoneNumber);
        this.signalHub.subscribe(myPhoneNumber)
        .on('data', (data: SignalServerData)=>{
            console.log("SignalServer.tsx::My Phone Number Received a message. My Phone number: ", myPhoneNumber
            , "|Message: ", data);
            this.emit(data.type, data);
        })
    }    
}

export { SignalServer, MessageType };
export type { SignalServerData };
