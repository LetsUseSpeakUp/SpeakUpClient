import React, {useState, useEffect, useRef, useContext} from 'react'
import { View, StyleSheet, Text, SafeAreaView, Image} from 'react-native';
import {Colors} from '../Graphics'


export default function SplashScreen(){
    return (
        <SafeAreaView style={styles.splashImageContainer}>     
            <Image source={require('../Graphics/streamline-icon-make-peace-with-someone@140x140.png')}/>
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
    }
})