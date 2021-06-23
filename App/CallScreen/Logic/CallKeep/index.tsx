import EventEmitter from "events";
import RNCallKeep from 'react-native-callkeep';
import { v4 as uuidv4 } from 'uuid';



export class CallKeep extends EventEmitter{
    curCallUUID = ''

    constructor(){
        super();
        console.log("CallKeep::constructor");
        RNCallKeep.setup(setupOptions);
        this.setupListeners();
    }    
    
    public displayIncomingCall(callerName: string, callerNumber: string){
        console.log("CallKeep::displayIncomingCall");
        this.genNewCallUUID();
        RNCallKeep.displayIncomingCall(this.curCallUUID, callerNumber, callerName);
    }

    public answerIncomingCall(){
        RNCallKeep.answerIncomingCall(this.curCallUUID);
    }

    public placeOutgoingCall(receiverNumber: string, receiverName: string){
        this.genNewCallUUID();
        RNCallKeep.startCall(this.curCallUUID, receiverNumber, receiverName);
    }

    public setOutgoingCallToStarted(receiverNumber: string, receiverName: string){
        RNCallKeep.updateDisplay(this.curCallUUID, receiverName, receiverNumber);
    }

    public endCall(){
        RNCallKeep.endCall(this.curCallUUID);
    }

    private setupListeners(){ //TODO
        RNCallKeep.addEventListener('didReceiveStartCallAction', (callInfo)=>{
            console.log("CallKeep::didReceiveStartCallAction: ", callInfo);
        })
        RNCallKeep.addEventListener('answerCall', (callInfo)=>{
            console.log("CallKeep::answerCall: ", callInfo);
        })
        RNCallKeep.addEventListener('endCall', (callInfo)=>{
            console.log("CallKeep::endCall: ", callInfo);
        })
        RNCallKeep.addEventListener('didDisplayIncomingCall', (callInfo)=>{
            console.log("CallKeep::didDisplayIncomingCall: ", callInfo);
        })
        RNCallKeep.addEventListener('didPerformSetMutedCallAction', (muteInfo)=>{
            console.log("CallKeep::didPerformSetMutedCallAction: ", muteInfo);
        })
        RNCallKeep.addEventListener('didToggleHoldCallAction', (toggleInfo)=>{
            console.log("CallKeep::didToggleHoldCallAction: ", toggleInfo);
        })
        RNCallKeep.addEventListener('didActivateAudioSession', (audioSessionInfo)=>{
            console.log("CallKeep::didActivateAudioSession: ", audioSessionInfo);
        })
    }

    private genNewCallUUID(){
        this.curCallUUID = uuidv4();
    }
}

const setupOptions = {
    ios: {
      appName: 'Speakup',
    },
    android: {
      alertTitle: 'Permissions required',
      alertDescription: 'This application needs to access your phone accounts',
      cancelButton: 'Cancel',
      okButton: 'ok',
      imageName: 'phone_account_icon',
      additionalPermissions: [],
    //   additionalPermissions: [PermissionsAndroid.PERMISSIONS.example],
      // Required to get audio in background when using Android 11
      foregroundService: {
        channelId: 'com.company.my',
        channelName: 'Foreground service for my app',
        notificationTitle: 'My app is running on background',
        notificationIcon: 'Path to the resource icon of the notification',
      }, 
    }
  };

export const CallKeepInstance = new CallKeep();