import React from 'react'
import {SafeAreaView, View, StyleSheet, Text, Image} from 'react-native';

export default function WelcomeScreen(){
    return(
        <SafeAreaView style={styles.flexContainer}>
            <View style={styles.imageHolder}>
                <Image source={require('../../../Graphics/streamline-being-a-vip-social-media-1000x1000.png')}
                    resizeMode='contain' style={{height: '100%'}}/>
            </View>
            <View style={styles.textHolder}>
                <Text>Welcome to Speakup.</Text>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    flexContainer: {
        display: 'flex',
        flex: 1,
        borderWidth: 1,
        alignItems: 'center',        
        justifyContent: 'center'
    },
    imageHolder: {
        display: 'flex',
        flex: 1.5,
        borderWidth: 1        
    },
    textHolder: {
        display: 'flex',
        flex: 1,
        borderWidth: 1
    }
})