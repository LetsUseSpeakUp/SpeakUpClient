import EncryptedStorage from 'react-native-encrypted-storage';
import AsyncStorage from '@react-native-async-storage/async-storage'

import Auth0 from 'react-native-auth0'
const auth0 = new Auth0({ domain: 'letsusespeakup.us.auth0.com', clientId: 'SIaSdbWJmdIj0MnR5hHFSaGHKlVfgzCT' });

export const loginWithExistingCredentials = async ()=>{
    try{        
        const refreshToken = await getExistingRefreshToken();
        if(refreshToken.length === 0){
            return false;
        }
        return await refreshAuthToken();
    }
    catch(error){
        return false;
    }
}



let curRefreshToken = '';
let curAuthToken = '';
let authTokenExpirationTime = 0;
const getExistingRefreshToken = async ()=>{
    if(curRefreshToken.length === 0){
        try{
            curRefreshToken = await EncryptedStorage.getItem('refreshToken') ?? '';
        }
        catch(error){
            curRefreshToken = '';
        }
    }
    return curRefreshToken;    
}

const addNewRefreshToken = async(newRefreshToken: string)=>{
    await EncryptedStorage.setItem('refreshToken', newRefreshToken);
    let curRefreshToken = newRefreshToken;
    await refreshAuthToken(newRefreshToken);
}

export const deleteExistingRefreshToken = async ()=>{
    try{
        return await EncryptedStorage.removeItem('refreshToken');
    }
    catch(error){
        console.log("ERROR -- AuthLogic::deleteExistingRefreshToken: ", error);
    }
}

export const loginWithPhoneNumber = async(phoneNumber: string)=>{
    await AsyncStorage.setItem('phoneNumber', phoneNumber);
    return auth0.auth.passwordlessWithSMS({
        phoneNumber: phoneNumber
    });
}

export const loginThroughWeb = async()=>{
    const credentials = await auth0.webAuth.authorize({
                    audience: 'https://letsusespeakup.us.auth0.com/api/v2/',
                    scope: 'read:current_user update:current_user_metadata openid profile offline_access'
                });

        if(!credentials.refreshToken){
            console.log("ERROR -- AuthLogic::loginThroughWeb. Refresh token is null");
            throw 'no refresh token';
        }
        else{
            const response = await auth0.auth.userInfo({token: await getAuthenticationToken()});
            //TODO: Return email
            console.log("AuthLogic::loginThroughWeb. Response: ", response); 
            await addNewRefreshToken(credentials.refreshToken);
            return 'faraztest@gmail.com';
        }        
}

export const enterPhoneNumberVerification = async(phoneNumber: string, verificationCode: string)=>{
    const credentials = await auth0.auth.loginWithSMS({
        phoneNumber: phoneNumber,
        code: verificationCode,
        audience: 'https://letsusespeakup.us.auth0.com/api/v2/',
        scope: 'read:current_user update:current_user_metadata openid profile offline_access'
    })    
    await addNewRefreshToken(credentials.refreshToken);
}

export const setUserMetadata = async(metadata: {first_name: string, last_name: string})=>{    
    await AsyncStorage.setItem('firstName', metadata.first_name);
    await AsyncStorage.setItem('lastName', metadata.last_name);
    const response = await auth0.auth.userInfo({token: await getAuthenticationToken()});
    const userId = response.sub;
    return await auth0.users(await getAuthenticationToken()).patchUser({id: userId, metadata: metadata});    
}

export const getMyUserInfo = async()=>{
    try{
        const [phoneNumber, firstName, lastName] = await Promise.all([AsyncStorage.getItem('phoneNumber'), AsyncStorage.getItem('firstName'), AsyncStorage.getItem('lastName')]);
        return {phoneNumber: phoneNumber, firstName: firstName, lastName: lastName};
    }
    catch(error){
        console.log("ERROR -- AuthLogic::getPhoneNumber: ", error);
        return {firstName: 'Speakup User', lastName: '', phoneNumber: ''};
    }
}

const refreshAuthToken = async(refreshToken='')=>{
    if(refreshToken.length === 0) refreshToken = curRefreshToken;
    try{
        const refreshResponse = await auth0.auth.refreshToken({refreshToken: refreshToken});
        curAuthToken = refreshResponse.accessToken;
        authTokenExpirationTime = Date.now() + refreshResponse.expiresIn*1000;     
        return true;                 
    }
    catch(error){
        console.log("ERROR -- AuthLogic::refreshAuthToken: ", error);
        return false;
    }    
}

/**
 * 
 * @returns false if the auth token is expired
 */
const isAuthenticationTokenValid = async()=>{
    return (authTokenExpirationTime > Date.now());
}

/**
 * Refreshes and fetches new authentication token if current is invalid
 */
export const getAuthenticationToken = async()=>{
    if(await isAuthenticationTokenValid()) return curAuthToken;
    
    if(await refreshAuthToken()) return curAuthToken;
    else{
        throw 'unable to refresh auth token. Need to login again';
    }
}