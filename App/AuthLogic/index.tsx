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
    await refreshAuthToken();
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
    await AsyncStorage.setItem('first_name', metadata.first_name);
    await AsyncStorage.setItem('last_name', metadata.last_name);
    const response = await auth0.auth.userInfo({token: await getAuthenticationToken()});
    const userId = response.sub;
    return await auth0.users(await getAuthenticationToken()).patchUser({id: userId, metadata: metadata});    
}

export const getPhoneNumber = async()=>{
    try{
        return await AsyncStorage.getItem('phoneNumber');
    }
    catch(error){
        console.log("ERROR -- AuthLogic::getPhoneNumber: ", error);
    }
}

/**
 * 
 * @returns false if the authentication token is invalid
 */
const refreshAuthToken = async()=>{
    try{
        const refreshResponse = await auth0.auth.refreshToken({refreshToken: curRefreshToken});
        curAuthToken = refreshResponse.accessToken;
        authTokenExpirationTime = Date.now() + refreshResponse.expiresIn*1000;        
        return isAuthenticationTokenValid();
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