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
    initialized = false;

    
    constructor(){
        super();
        console.log("SignalServer constructor");
        this.client = new RtmEngine();
    }    

    sendSignal({agoraChannel, myPhoneNumber, myFirstName, myLastName, receiverPhoneNumber}: {agoraChannel: string, myPhoneNumber: string, myFirstName: string, myLastName: string, receiverPhoneNumber: string}){ //TODO: Encrypt this data
        
        const data: SignalServerData = {
            type: MessageType.Signal,
            sender: myPhoneNumber,
            // message: agoraChannel
            message: JSON.stringify({channel: agoraChannel, firstName: myFirstName, lastName: myLastName})
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
        if(this.initialized){
            console.log("SignalServer::listenForMyPhoneNumber. Already initialized. Doing nothing");
            return;
        }
        this.initialized = true;
        this.setupRtm();
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
            console.log("ERROR -- SignalServer::listenForMyPhoneNumber -- getRTMToken: ", error);
        }
    }    

    private setupRtm(){
        this.client.on('connectionStateChanged', (event)=>{
            console.log("SignalServer -- Connection state changed: ", event);
        })
        this.client.on('messageReceived', (event)=>{
            const {text, peerId} = event;
            const parsedText = JSON.parse(text);
            const signalServerData: SignalServerData = {
                sender: peerId,
                type: parsedText.type,
                message: parsedText.message
            }
            
            console.log("SignalServer received Message: ", signalServerData); 
            this.emit(signalServerData.type, signalServerData);
        })

        const RTMRENEWALTIME = 1000*60*60;
        setInterval(async ()=>{            
            this.client.renewToken(await getRtmToken())
                .then(()=>{console.log("SignalServer. Renewed rtm token.")})
        }, RTMRENEWALTIME)
    }
}

export const SignalServerInstance = new SignalServer();

export {SignalServer, MessageType };
export type { SignalServerData };
