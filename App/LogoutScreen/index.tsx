import React, { useEffect } from 'react'
import { View, TextInput, Text, Button, StyleSheet } from 'react-native'
import {Colors, PrimaryButton} from '../Graphics'

export default function EnterSMSCodeScreen({ route }: any) {

    return (
        <View style={styles.container}>
            <PrimaryButton text={'Logout'} onPress={() => { route.params.logout() }}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.backgroundColor
    }
})