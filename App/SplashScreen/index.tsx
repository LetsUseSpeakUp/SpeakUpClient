import React, {useState, useEffect, useRef, useContext} from 'react'
import { View, StyleSheet, Text, SafeAreaView, Button} from 'react-native';

export default function SplashScreen(){
    return (
        <SafeAreaView style={styles.splashImageContainer}>     
            <Text>box 1</Text>
        </SafeAreaView>
        
    );
}

const styles = StyleSheet.create({
    splashImageContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1  
    }
})