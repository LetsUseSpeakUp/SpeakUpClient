import {EventEmitter} from 'events'
import RtmEngine from 'agora-react-native-rtm'
import {getRtmToken} from '../../../ConvosData/ConvosManager'
import { RTMEventCallback } from 'agora-react-native-rtm/lib/types';

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

const APPID = 'cf3e232f50ad4d608ff97081a9ce8b72';

class SignalServer extends EventEmitter{
    private readonly client: RtmEngine;

    
    constructor(){
        super();
        this.client = new RtmEngine();
    }    

    sendSignal({agoraChannel, myPhoneNumber, myFirstName, myLastName, receiverPhoneNumber}: {agoraChannel: string, myPhoneNumber: string, myFirstName: string, myLastName: string, receiverPhoneNumber: string}){ //TODO: Encrypt this data
        
        const data: SignalServerData = {
            type: MessageType.Signal,
            sender: myPhoneNumber,
            message: agoraChannel
            // message: JSON.stringify({channel: agoraChannel, firstName: myFirstName, lastName: myLastName})
        }        
        
        console.log("SignalServer::sendSignal. Receiver: ", receiverPhoneNumber, " data: ", data);
        this.client.sendMessageToPeer({peerId: receiverPhoneNumber, offline: false, text: JSON.stringify(data)});
    }

    sendDecline(myPhoneNumber: string, receiverPhoneNumber: string){
        const data: SignalServerData = {
            type: MessageType.Decline,
            sender: myPhoneNumber,
            message: ""
        }    
        
        console.log("SignalServer::sendDecline. Receiver: ", receiverPhoneNumber);
        this.client.sendMessageToPeer({peerId: receiverPhoneNumber, offline: false, text: JSON.stringify(data)});
    }

    async listenForMyPhoneNumber(myPhoneNumber: string){
        this.setupRtmListeners();
        await this.client.createClient(APPID);
        try{
            const rtmToken = await getRtmToken();
            console.log("SignalServer::listenForMyPhoneNumber. RtmToken: ", rtmToken, " phone number: ", myPhoneNumber);
            await this.client.login({
                uid: myPhoneNumber,
                token: rtmToken
            });
        }
        catch(error){
            console.log("SignalServer::listenForMyPhoneNumber: ", error);
        }
        
    }    

    private setupRtmListeners(){
        // this.client.on('messageReceived', (event)=>{
        //     const {text} = event;
        //     console.log("SignalServer received Message: ", text); 
        // })
        //TODO
        // console.log("SignalServer::listenForMyPhoneNumber. My phone number: ", myPhoneNumber);
        // this.signalHub.subscribe(myPhoneNumber)
        // .on('data', (data: SignalServerData)=>{
        //     console.log("SignalServer.tsx::My Phone Number Received a message. My Phone number: ", myPhoneNumber
        //     , "|Message: ", data);
        //     this.emit(data.type, data);
        // })
    }
}

export { SignalServer, MessageType };
export type { SignalServerData };
