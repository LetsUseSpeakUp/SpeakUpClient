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

export const logoutOfWeb = async()=>{
    try{
        if(!await isAppleTestAccount()) return;
        await auth0.webAuth.clearSession();
    }
    catch(error){
        console.log("ERROR -- AuthLogic::logoutOfWeb: ", error);
    }
}

export const loginWithPhoneNumber = async(phoneNumber: string)=>{
    await AsyncStorage.setItem('phoneNumber', phoneNumber);
    await AsyncStorage.setItem('appleTestAccount', 'false');
    return auth0.auth.passwordlessWithSMS({
        phoneNumber: phoneNumber
    });
}

export const loginThroughWeb = async()=>{
    const credentials = await auth0.webAuth.authorize({
                    audience: 'https://letsusespeakup.us.auth0.com/api/v2/',
                    scope: 'read:current_user update:current_user_metadata openid profile offline_access'
                });

                curAuthToken = credentials.accessToken;
                authTokenExpirationTime = Date.now() + credentials.expiresIn*1000;     
        
            const response = await auth0.auth.userInfo({token: await getAuthenticationToken()});
            if(response.name==='faraz.abidi+apple00001@gmail.com'){
                await setUserMetadata({first_name: 'Apple', last_name: '00001'});
                await AsyncStorage.setItem('phoneNumber', '+100001');
                await AsyncStorage.setItem('appleTestAccount', 'true');
            }
            else{
                await setUserMetadata({first_name: 'Apple', last_name: '00002'});
                await AsyncStorage.setItem('phoneNumber', '+100002');
                await AsyncStorage.setItem('appleTestAccount', 'true');
            }
                        
            console.log("AuthLogic::loginThroughWeb. Response: ", response);                     
            return response.name;            
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

export const isAppleTestAccount = async()=>{
    const isTestAccount = await AsyncStorage.getItem('appleTestAccount');
    return (isTestAccount === 'true');    
}

const refreshAuthToken = async(refreshToken='')=>{
    if(refreshToken.length === 0) refreshToken = curRefreshToken;
    try{
        const refreshResponse = await auth0.auth.refreshToken({refreshToken: refreshToken});
        curAuthToken = refreshResponse.accessToken;       
        console.log("TESTING: Delete before production!!!. Auth token: ", curAuthToken);
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