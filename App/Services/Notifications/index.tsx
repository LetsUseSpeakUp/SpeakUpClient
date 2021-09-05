
export const setupNotifications = async (userPhoneNumber: string)=>{
    console.log("Notifications::setupNotifications. Phone Number: ", userPhoneNumber);
    const token = await requestNotificationPermission();
    if(token.length){
        console.log("Notifications::setupNotifications. Permission completed. Token: ", token);
        //TODO: authLogic.sendTokenToServer
    }
}

const requestNotificationPermission = async (): Promise<string>=>{
    //TODO
    return "";
}

