import React, { useRef } from 'react'
import { SafeAreaView, View, StyleSheet, Text, Image, Animated, Button } from 'react-native';
import { Constants, PrimaryButton, Colors} from '../../../Graphics/index'

export default function ImageAndTextBlurbScreen(props: {onRetryPressed: ()=>void}) {

    return (
        <SafeAreaView style= {styles.flexContainer}>
                <Animated.View style={{ ...styles.imageHolder}}>
                    <Image source={require('../../../Graphics/streamline-icon-coming-soon@1000x1000.png')}
                        resizeMode='contain' style={{ height: '70%', marginTop: '20%' }} />
                </Animated.View>
                <View style={{ borderBottomWidth: 2, width: '60%' }} />
                <Animated.View style={{
                    display: 'flex', flex: 1, width: '100%',
                    paddingHorizontal: Constants.paddingHorizontal
                }}>
                    <Text style={{ fontFamily: Constants.fontFamily, fontSize: Constants.blurbFontSize, fontWeight: 'bold', marginTop: 20 }}>
                        No contacts found.
                    </Text>
                    <View style={styles.buttonContainer}>
                        <PrimaryButton text={'Retry'} onPress={props.onRetryPressed}/>
                </View>
                </Animated.View>
                
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    flexContainer: {
        display: 'flex',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%'
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
    },
    buttonContainer: {
        display: 'flex',
        alignItems: 'center',
        paddingTop: Constants.paddingTop*2,
        width: '100%'
    }
})