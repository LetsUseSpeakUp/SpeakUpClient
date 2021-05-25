import {EventEmitter} from 'events'
import RtcEngine, {
    ChannelProfile,
    ClientRole,
    RtcEngineConfig,
  } from 'react-native-agora';

/**
 * Emits
 * joinedChannel
 * leftChannel
 * partnerJoined
 * partnerDisconnected
 */

export default class AgoraManager extends EventEmitter{
    rtcEngine: any//: RtcEngine | undefined

    tracks = {
        localAudio: null,
        remoteAudio: null
    }

    options = {
        appid: 'cf3e232f50ad4d608ff97081a9ce8b72',
        uid: "",
    }

    remotePartner: any

    constructor(){
        super();
        this.initEngine();
    }

    private async initEngine(){
        this.rtcEngine = await RtcEngine.createWithConfig(
            new RtcEngineConfig(this.options.appid)
        )
        this.setupListeners();

    }

    public async joinChannel(channelName: string){ //TODO
       /* // this.setupRemoteStreamListeners();
        const channelToken = await this.getChannelToken(channelName);
        console.log("AgoraManager::joinChannel. Channel token: ", channelToken);
        //@ts-ignore
        [this.options.uid, this.tracks.localAudio] = await Promise.all([
            //@ts-ignore
            this.client.join(this.options.appid, channelName, channelToken),
            AgoraRTC.createMicrophoneAudioTrack()
        ]);

        console.log("AgoraManager::joinChannel. My uid: ", this.options.uid);

        //@ts-ignore
        await this.client.publish(this.tracks.localAudio);
        this.emit('joinedChannel'); */
    }

    public async leaveChannel(){ //TODO
       /* if(this.tracks.localAudio){
            //@ts-ignore
            this.tracks.localAudio.stop();
            //@ts-ignore
            this.tracks.localAudio.close();
            this.tracks.localAudio = null;
        }

        await this.client.leave();
        this.emit('leftChannel'); */
    }

    private async getChannelToken(channelName: string){
        const fetchURL = 'https://basicspeakuptokenserver.herokuapp.com/access_token?channel=' + channelName;
        try{
            let response = await fetch(fetchURL);  
            let data = await response.json();
            return data.token;
        }
        catch(error){
            console.log("ERROR -- AgoraManager.tsx. Failed to fetch token");
            throw('failedToFetchToken: ' + error) 
        }
    }

    private setupListeners(){ //TODO
        /*
        this.client.on('user-published', async (user: IAgoraRTCRemoteUser, mediaType: any)=>{ //TODO: These listeners are wrong     
            this.remotePartner = user;
            console.log("AgoraManager.tsx::partner published a stream. Partner: ", user);
            await this.client.subscribe(user, mediaType);
            console.log("AgoraManager.tsx. Subscribed to partner. Playing audio stream");
            //@ts-ignore
            user.audioTrack.play();
            // this.emit('partnerJoined');
        })
        this.client.on('user-unpublished', (user: IAgoraRTCRemoteUser, mediaType: any)=>{
            if(user != this.remotePartner){
                console.log("ERROR - AgoraManager.tsx::user-unpublished who is not partner. *Partner: ", this.remotePartner, " *Unpublished User: ", user);
                return;
            }

            this.remotePartner = null;
            // this.emit('partnerDisconnected');
        })
        this.client.on('user-joined', (user: IAgoraRTCRemoteUser)=>{
            console.log("AgoraManager.tsx:: user-joined event. User: ", user);
            this.emit('partnerJoined');
        })
        this.client.on('user-left', (user: IAgoraRTCRemoteUser, reason: string)=>{
            console.log("AgoraManager.tsx:: user-left event. User: ", user, " Reason: ", reason);
            this.emit('partnerDisconnected');
        })*/
    }
}