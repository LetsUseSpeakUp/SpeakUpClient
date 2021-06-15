import React, { useEffect } from 'react'
import { View, TextInput, Text, Button, StyleSheet } from 'react-native'
import { _getAuthObject } from '../AuthLogic'

export default function EnterSMSCodeScreen({ route }: any) {

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