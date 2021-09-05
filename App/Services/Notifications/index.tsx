import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';


export const setupNotifications = async (userPhoneNumber: string)=>{
    console.log("Notifications::setupNotifications. Phone Number: ", userPhoneNumber);
    const token = await requestNotificationPermission();
    if(token.length){
        console.log("Notifications::setupNotifications. Permission completed. Token: ", token);
        //TODO: authLogic.sendTokenToServer
    }
}

const requestNotificationPermission = async (): Promise<string>=>{
    try {
        const permission = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        if (!permission.granted) return "";
        return await Notifications.getExpoPushTokenAsync();                
     } catch (error) {
       console.log('Error getting a token', error);
       return "";
     }
}