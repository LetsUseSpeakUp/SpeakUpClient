import * as Notifications from 'expo-notifications';
import * as AuthLogic from '../../AuthLogic'


export const setupNotifications = async (userPhoneNumber: string)=>{
    console.log("Notifications::setupNotifications. Phone Number: ", userPhoneNumber);
    const token = await getNotificationToken();
    if(token.length){
        console.log("Notifications::setupNotifications. Permission completed. Token: ", token);
        await AuthLogic.setUserPushNotificationToken(token);
    }
}

const getNotificationToken = async (): Promise<string>=>{
    try {
        let { status: permissionStatus } = await Notifications.getPermissionsAsync();
        if(permissionStatus !== 'granted'){
            permissionStatus = (await Notifications.requestPermissionsAsync()).status;
        }
        if(permissionStatus !== 'granted'){
            throw 'permission not granted';
        }

        return (await Notifications.getExpoPushTokenAsync()).data;
        
     } catch (error) {
       console.log('ERROR -- Notifications::getNotificationToken - Error getting a token: ', error);
       return "";
     }
}