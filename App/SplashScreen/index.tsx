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
        flex: 1,
        backgroundColor: Colors.backgroundColor
    },
    splashImage: {        
        resizeMode:'center'                
    }
})