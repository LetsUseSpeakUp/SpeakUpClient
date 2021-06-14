import React, {useState, useEffect, useRef, useContext} from 'react'
import { View, StyleSheet, Text, SafeAreaView, Button} from 'react-native';

export default function SplashScreen(){
    return (
        <SafeAreaView style={styles.flexContainer}>
            <View style={styles.buttonRow}>
                <Text style={{marginRight: 30, marginVertical: 'auto'}}>Splash Screen</Text>
                <Button title='hi'></Button>
            </View>
            
        </SafeAreaView>
        
    );
}

const styles = StyleSheet.create({
    flexContainer: {
        display: 'flex',
        flexDirection: 'column'
    },
    buttonRow: {
        display: 'flex',
        flexDirection: 'row',
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingRight: 40
    }
})