import React, {useRef} from 'react'
import {SafeAreaView, View, StyleSheet, Text, Image, Animated} from 'react-native';
import {Constants} from '../../../Graphics/index'

export default function WelcomeScreen(){
    const fadeAnim = useRef(new Animated.Value(0)).current
    React.useEffect(() => {
        Animated.timing(
          fadeAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true
          }).start();
      }, [fadeAnim])

    return(
        <SafeAreaView style={styles.flexContainer}>
            <View style={styles.imageHolder}>
                <Image source={require('../../../Graphics/streamline-being-a-vip-social-media-1000x1000.png')}
                    resizeMode='contain' style={{height: '70%', marginTop: '20%'}}/>
            </View>
            <View style={{borderBottomWidth: 2, width: '60%'}}/>
            <Animated.View style={{display: 'flex', flex: 1, width: '100%', 
                paddingHorizontal: Constants.paddingHorizontal, opacity: fadeAnim}}>
                <Text style={{fontFamily: Constants.fontFamily, fontSize: Constants.blurbFontSize, fontWeight: 'bold', marginTop: 20}}>Welcome to Speakup.</Text>
            </Animated.View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    flexContainer: {
        display: 'flex',
        flex: 1,        
        alignItems: 'center',        
        justifyContent: 'center'
    },
    imageHolder: {
        display: 'flex',
        flex: 1.5,    
        alignItems: 'center',        
        justifyContent: 'center'
    },
    textHolder: {
        display: 'flex',
        flex: 1,    
        width: '100%',
        paddingHorizontal: Constants.paddingHorizontal       
    }
})