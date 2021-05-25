import { EventEmitter } from 'events'
import RtcEngine, {
    ChannelProfile,
    ClientRole,
    RtcEngineConfig,
} from 'react-native-agora';

/**
 * Emits
 * disconnected
 * partnerJoined
 * partnerDisconnected
 * tokenWillExpire
 */

export default class AgoraManager extends EventEmitter {
    rtcEngine: RtcEngine | undefined

    tracks = {
        localAudio: null,
        remoteAudio: null
    }

    options = {
        appid: 'cf3e232f50ad4d608ff97081a9ce8b72',
        uid: "",
    }

    remotePartner: any

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

    public async joinChannel(channelName: string) { //TODO
        const channelToken = await this.getChannelToken(channelName);
        await this.rtcEngine?.joinChannel(
            channelToken,
            channelName, null, 0
        );

        console.log("AgoraManager::joinChannel. Channel token: ", channelToken);
    }

    public async leaveChannel() {
        const leaveCode = await this.rtcEngine?.leaveChannel();
        console.log("AgoraManager.tsx::leaveChannel. Code: ", leaveCode);
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

        this.rtcEngine?.addListener('UserJoined', (remoteUserId) => {
            console.log("AgoraManager.tsx:: user-joined event. User: ", remoteUserId);
            this.emit('partnerJoined');
        })
        this.rtcEngine?.addListener('UserOffline', (remoteUserID, reason) => {
            console.log("AgoraManager.tsx:: user-left event. User: ", remoteUserID, " Reason: ", reason);
            this.emit('partnerDisconnected');
        })
        this.rtcEngine?.addListener('LeaveChannel', (rtcStates)=>{
            console.log("AgoraManager.tsx::left channel. Rtc stats: ", rtcStates);
            this.emit('disconnected');
        })
        this.rtcEngine?.addListener('ConnectionLost', () => {
            console.log("AgoraManager.tsx:: connectionLost event");
            this.emit('disconnected')
        })
        this.rtcEngine?.addListener('TokenPrivilegeWillExpire', () => {
            console.log("AgoraManager.tsx:: token will expire");
            this.emit('tokenWillExpire');
        })
    }
}