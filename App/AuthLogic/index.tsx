import EncryptedStorage from 'react-native-encrypted-storage';

import Auth0 from 'react-native-auth0'
const auth0 = new Auth0({ domain: 'letsusespeakup.us.auth0.com', clientId: 'SIaSdbWJmdIj0MnR5hHFSaGHKlVfgzCT' });

export const loginWithExistingCredentials = async ()=>{
    try{        
        const refreshToken = await getExistingRefreshToken();
        console.log("LoginWithExistingCredentials. RefreshToken: ", refreshToken); //TODO: Delete this when done testing!!!
        if(refreshToken.length === 0){
            return false;
        }
        return await refreshAuthToken();
    }
    catch(error){
        console.log("ERROR -- AuthLogic::loginWithExistingCredentials: ", error);
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

export const addNewRefreshToken = async(newRefreshToken: string)=>{
    console.log("LoginWithExistingCredentials::Add new refresh token: ", newRefreshToken); //TODO: Delete this when done testing!!!!
    await EncryptedStorage.setItem('refreshToken', newRefreshToken);
    let curRefreshToken = newRefreshToken;
    await refreshAuthToken();
}

export const deleteExistingRefreshToken = ()=>{
    return EncryptedStorage.removeItem('refreshToken');
}

/**
 * 
 * @returns false if the authentication token is invalid
 */
const refreshAuthToken = async()=>{
    try{
        const refreshResponse = await auth0.auth.refreshToken({refreshToken: curRefreshToken});
        console.log("AuthLogic::refreshAuthToken. Response: ", refreshResponse); //TODO: Delete this when done testing!!!
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