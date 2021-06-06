//TODO: SetInterval to renew the auth token

export const loginWithExistingCredentials = async ()=>{
    try{        
        const refreshToken = await getExistingRefreshToken();
        if(refreshToken.length === 0){
            return false;
        }
        return await setAuthenticationTokenFromRefreshToken();
    }
    catch(error){
        console.log("ERROR -- AuthLogic::loginWithExistingCredentials: ", error);
        return false;
    }
}

let curRefreshToken = '';
const getExistingRefreshToken = async ()=>{
    if(curRefreshToken.length === 0){
        //TODO: get from memory
    }
    return curRefreshToken;
    //TODO: Get from secure storage
    //If no refresh token, throw an error
}

export const addNewRefreshToken = async(newRefreshToken: string)=>{
    console.log("Add new refresh token: ", newRefreshToken);
    //TODO
}

/**
 * 
 * @returns false if the authentication token is invalid
 */
const setAuthenticationTokenFromRefreshToken = async()=>{
    //TODO
    return isAuthenticationTokenValid();
}

const isAuthenticationTokenValid = async()=>{
    return false;
    //TODO
}

/**
 * Refreshes and fetches new authentication token if current is invalid
 */
export const getAuthenticationToken = async()=>{

}