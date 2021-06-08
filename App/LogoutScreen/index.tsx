import React, { useEffect } from 'react'
import { View, TextInput, Text, Button, StyleSheet } from 'react-native'
import { _getAuthObject } from '../AuthLogic'

export default function EnterSMSCodeScreen({ route }: any) {
    const _DEBUGWEBLOGINENABLED = true;

    useEffect(() => {
        if (_DEBUGWEBLOGINENABLED) {
            _getAuthObject().webAuth
                .authorize({
                    audience: 'https://letsusespeakup.us.auth0.com/api/v2/',
                    scope: 'read:current_user update:current_user_metadata openid profile offline_access'
                }).then((credentials) => {
                    console.log("WARNING: TESTING ONLY. LogoutScreen. Credentials: ", credentials);
                })
        }
    }, [])

    return (
        <View style={styles.container}>
            <Button title={"Logout"} onPress={() => { route.params.logout() }}></Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})