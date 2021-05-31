import { EventEmitter } from 'events'
import RtcEngine, {
    ChannelProfile,
    ClientRole,
    RtcEngineConfig,
    AudioRecordingConfiguration,
    AudioRecordingPosition,
    ConnectionStateType
} from 'react-native-agora';

import FileSystem from 'react-native-fs'

/**
 * Emits
 * -leftChannel
 * -leftChannelWithoutRecording
 * -partnerJoined
 * -partnerDisconnected
 * -tokenWillExpire
 * -recordingComplete
 */

export enum ConnectionState{
    Ready = 0, Connecting = 1, DisconnectRequested = 2, Connected = 3
}

export default class AgoraManager extends EventEmitter {
    rtcEngine: RtcEngine | undefined

    options = {
        appid: 'cf3e232f50ad4d608ff97081a9ce8b72',
        uid: "",
    }
    
    connectionState = ConnectionState.Ready
    
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
        if(this.connectionState === ConnectionState.Connected){
            console.log("ERROR. AgoraManager::joinChannel. connection state == connected");
        }
        this.connectionState = ConnectionState.Connecting;

        const channelToken = await this.getChannelToken(channelName);
        await this.rtcEngine?.joinChannel(
            channelToken,
            channelName, null, 0
        );

        console.log("AgoraManager::joinChannel. Channel token: ", channelToken); //TODO: Delete this when in production        

        const intervalID = setInterval(()=>{
            if(!this.isConnectedToPartner()){
                console.log("AgoraManager::joinChannel -- not connected to partner after 30 seconds. Disconnecting");
                this.leaveChannel();
                clearInterval(intervalID);
            }
        }, 30000)
    }

    /**
     * You should only call this after you've gotten a 'connected' message
     */
    public startRecording(convoId: string){
        console.log("AgoraManager::startRecording.");
        if(this.connectionState !== ConnectionState.Connected){
            console.log("ERROR -- AgoraManager::startRecording. Not in appropriate state for recording: ", this.connectionState)
        }
        
        const filePath = this.getFilePathOfConvo(convoId);
        const config = new AudioRecordingConfiguration(filePath, {recordingPosition: AudioRecordingPosition.PositionMixedRecordingAndPlayback});
        this.rtcEngine?.startAudioRecordingWithConfig(config).then(()=>{
            console.log("AgoraManager::startRecording. Promise returned without error. FilePath: ", filePath);
        }).catch((error)=>{
            console.log("ERROR -- AgoraManager::startRecording: ", error);
        });
    }

    public getFilePathOfConvo(convoId: string): string{
        const filePath = FileSystem.DocumentDirectoryPath + '/' + convoId + '.aac';
        return filePath;
    }

    private finishRecording(){        
        console.log("AgoraManager::finishRecording.");

        this.rtcEngine?.stopAudioRecording().then(()=>{
            console.log("AgoraManager::finishRecording without errors.");  
            this.emit('shouldUploadConvo')      
        }).catch((error)=>{
            console.log("ERROR -- AgoraManager::finishRecording: ", error);
        })  
    }

    public async leaveChannel() { 
        console.log("AgoraManager::leaveChannel. State: ", this.connectionState);
        if(this.connectionState === ConnectionState.Connecting){
            this.connectionState = ConnectionState.DisconnectRequested;
        }        
            const rtcEngineState = await this.rtcEngine?.getConnectionState();
            if(rtcEngineState === ConnectionStateType.Disconnected){
                console.log("AgoraManager.tsx::leaveChannel. Not connected. Doing nothing.");
                return;
            }

            const leaveCode = await this.rtcEngine?.leaveChannel();
            console.log("AgoraManager.tsx::leaveChannel. Code: ", leaveCode);
    }

    public isConnectedToPartner(){
        return this.connectionState === ConnectionState.Connected;
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
        
        this.rtcEngine?.addListener('UserJoined', (remoteUserId) => {
            console.log("AgoraManager.tsx:: user-joined event. User: ", remoteUserId);
            this.connectionState = ConnectionState.Connected;
            this.emit('partnerJoined');
        })
        this.rtcEngine?.addListener('UserOffline', (remoteUserID, reason) => {
            console.log("AgoraManager.tsx:: user-left event. User: ", remoteUserID, " Reason: ", reason);
            this.emit('partnerDisconnected');
        })
        this.rtcEngine?.addListener('LeaveChannel', (rtcStats)=>{
            console.log("AgoraManager.tsx::left channel. State: ", this.connectionState, " Rtc Stats: ", rtcStats);            
            this.onLeftChannel();
        })
        this.rtcEngine?.addListener('ConnectionLost', () => {
            console.log("AgoraManager.tsx:: connectionLost event");
            this.onLeftChannel();
        })
        this.rtcEngine?.addListener('TokenPrivilegeWillExpire', () => {
            console.log("AgoraManager.tsx:: token will expire");
            this.emit('tokenWillExpire');
        })
        this.rtcEngine?.addListener('JoinChannelSuccess', ()=>{
            if(this.connectionState === ConnectionState.DisconnectRequested){
                this.leaveChannel();
            }
        })
    }

    private onLeftChannel(){
        if(this.connectionState === ConnectionState.Ready){
            return; //For some reason, AgoraManager spams us with a bunch of disconnect events if we leave very quickly after calling join. This is so we only emit one.
        }
        else if (this.connectionState === ConnectionState.Connected){
            this.connectionState = ConnectionState.Ready;            
            this.emit('leftChannel');
            this.finishRecording();
        }
        else{
            this.connectionState = ConnectionState.Ready;
            this.emit('leftChannelWithoutRecording');
        }
    }
}