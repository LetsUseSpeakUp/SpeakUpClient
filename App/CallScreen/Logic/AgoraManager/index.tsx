import { EventEmitter } from 'events'
import RtcEngine, {
    ChannelProfile,
    ClientRole,
    RtcEngineConfig,
} from 'react-native-agora';

import ConvosServer, {ConvoMetaData} from '../ConvosServer'

/**
 * Emits
 * disconnected
 * partnerJoined
 * partnerDisconnected
 * tokenWillExpire
 * recordingComplete (filePath: string) //TODO
 */

export default class AgoraManager extends EventEmitter {
    rtcEngine: RtcEngine | undefined

    options = {
        appid: 'cf3e232f50ad4d608ff97081a9ce8b72',
        uid: "",
    }

    connectedToParter = false;

    constructor() {
        super();
        this.initEngine();
    }

    private async initEngine() {
        this.rtcEngine = await RtcEngine.createWithConfig(
            new RtcEngineConfig(this.options.appid)
        )
        this.setupListeners();

        await this.rtcEngine.setChannelProfile(ChannelProfile.Communication);
        this.rtcEngine.disableVideo();
        this.rtcEngine.enableAudio();
    }

    public async joinChannel(channelName: string) {
        const channelToken = await this.getChannelToken(channelName);
        await this.rtcEngine?.joinChannel(
            channelToken,
            channelName, null, 0
        );

        console.log("AgoraManager::joinChannel. Channel token: ", channelToken);

        const intervalID = setInterval(()=>{
            if(!this.isConnectedToPartner()){
                console.log("AgoraManager::joinChannel -- not connected to partner after 30 seconds. Disconnecting");
                this.leaveChannel();
                clearInterval(intervalID);
            }
        }, 30000)
    }

    public startRecording(convoMetaData: ConvoMetaData){
        //TODO
        console.log("AgoraManager::startRecording. Convo meta data: ", convoMetaData);
    }

    public async leaveChannel() { 
        const leaveCode = await this.rtcEngine?.leaveChannel(); //TODO: Check if client is connected before client.leave so we don't get annoying error message
        console.log("AgoraManager.tsx::leaveChannel. Code: ", leaveCode);
    }

    public isConnectedToPartner(){
        return this.connectedToParter;
    }

    public generateChannelName(myPhoneNumber: string){
        return (Date.now() + myPhoneNumber);
    }

    private async getChannelToken(channelName: string) {
        const fetchURL = 'https://basicspeakuptokenserver.herokuapp.com/access_token?channel=' + channelName;
        try {
            let response = await fetch(fetchURL);
            let data = await response.json();
            return data.token;
        }
        catch (error) {
            console.log("ERROR -- AgoraManager.tsx. Failed to fetch token");
            throw ('failedToFetchToken: ' + error)
        }
    }

    private setupListeners() {
        this.rtcEngine?.addListener('Warning', (warn) => {
            console.log('Warning', warn);
        });

        this.rtcEngine?.addListener('Error', (err) => {
            console.log('Error', err);
        });

        //TODO: if you get call declined message before joining channel, leave ASAP
            //Timeout will handle this, but it will be slower
        this.rtcEngine?.addListener('UserJoined', (remoteUserId) => {
            console.log("AgoraManager.tsx:: user-joined event. User: ", remoteUserId); //TODO: Does this get called when partner joins before you?
            this.connectedToParter = true;
            this.emit('partnerJoined');
        })
        this.rtcEngine?.addListener('UserOffline', (remoteUserID, reason) => {
            console.log("AgoraManager.tsx:: user-left event. User: ", remoteUserID, " Reason: ", reason);
            this.connectedToParter = false;
            this.emit('partnerDisconnected');
        })
        this.rtcEngine?.addListener('LeaveChannel', (rtcStates)=>{
            console.log("AgoraManager.tsx::left channel. Rtc stats: ", rtcStates);
            this.connectedToParter = false;
            this.emit('disconnected');
        })
        this.rtcEngine?.addListener('ConnectionLost', () => {
            console.log("AgoraManager.tsx:: connectionLost event");
            this.connectedToParter = false;
            this.emit('disconnected')
        })
        this.rtcEngine?.addListener('TokenPrivilegeWillExpire', () => {
            console.log("AgoraManager.tsx:: token will expire");
            this.emit('tokenWillExpire');
        })
    }
}