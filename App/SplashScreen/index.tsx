import React, {useState, useEffect, useRef, useContext} from 'react'
import { View, StyleSheet, Text, SafeAreaView, Image} from 'react-native';
import {Colors} from '../Graphics'


export default function SplashScreen(){
    return (
        <SafeAreaView style={styles.splashImageContainer}>     
            <Image source={require('../Graphics/streamline-boombox-content-media-1000x1000.png')} style={styles.splashImage}/>
        </SafeAreaView>
        
    );
}

const styles = StyleSheet.create({
    splashImageContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',                
        backgroundColor: Colors.backgroundColor
    },
    splashImage: {        
        height: '80%',
        resizeMode:'contain'                
    }
})